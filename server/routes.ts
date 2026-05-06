import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { generateStory, generateIllustration } from "./ai";
import { registerStripeRoutes } from "./stripe";
import multer from "multer";
import path from "path";
import fs from "fs";
import { randomBytes } from "crypto";

const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const upload = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, uploadDir),
    filename: (_req, file, cb) => {
      const ext = path.extname(file.originalname);
      cb(null, `${randomBytes(16).toString("hex")}${ext}`);
    },
  }),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    cb(null, allowed.includes(file.mimetype));
  },
});

function requireAuth(req: any, res: any, next: any) {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Not authenticated" });
  }
  next();
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  setupAuth(app);
  registerStripeRoutes(app);

  app.use("/uploads", (req: Request, res: Response, next: NextFunction) => {
    const filePath = path.join(uploadDir, path.basename(req.path));
    if (fs.existsSync(filePath)) {
      res.sendFile(filePath);
    } else {
      res.status(404).json({ message: "File not found" });
    }
  });

  // ========== DRAFTS ==========
  app.get("/api/drafts", requireAuth, async (req: Request, res: Response, next: NextFunction) => {
    try {
      const drafts = await storage.getDraftsByUser(req.user!.id);
      res.json(drafts);
    } catch (err) { next(err); }
  });

  app.get("/api/drafts/:id", requireAuth, async (req: Request, res: Response, next: NextFunction) => {
    try {
      const draft = await storage.getDraft(req.params.id);
      if (!draft || draft.userId !== req.user!.id) {
        return res.status(404).json({ message: "Draft not found" });
      }
      res.json(draft);
    } catch (err) { next(err); }
  });

  app.post("/api/drafts", requireAuth, async (req: Request, res: Response, next: NextFunction) => {
    try {
      const draft = await storage.createDraft({ ...req.body, userId: req.user!.id });
      res.status(201).json(draft);
    } catch (err) { next(err); }
  });

  app.patch("/api/drafts/:id", requireAuth, async (req: Request, res: Response, next: NextFunction) => {
    try {
      const draft = await storage.getDraft(req.params.id);
      if (!draft || draft.userId !== req.user!.id) {
        return res.status(404).json({ message: "Draft not found" });
      }
      const updated = await storage.updateDraft(req.params.id, req.body);
      res.json(updated);
    } catch (err) { next(err); }
  });

  app.delete("/api/drafts/:id", requireAuth, async (req: Request, res: Response, next: NextFunction) => {
    try {
      const draft = await storage.getDraft(req.params.id);
      if (!draft || draft.userId !== req.user!.id) {
        return res.status(404).json({ message: "Draft not found" });
      }
      await storage.deleteDraft(req.params.id);
      res.json({ message: "Deleted" });
    } catch (err) { next(err); }
  });

  // ========== BOOKS ==========
  app.get("/api/books", requireAuth, async (req: Request, res: Response, next: NextFunction) => {
    try {
      const books = await storage.getBooksByUser(req.user!.id);
      res.json(books);
    } catch (err) { next(err); }
  });

  app.get("/api/books/:id", requireAuth, async (req: Request, res: Response, next: NextFunction) => {
    try {
      const book = await storage.getBook(req.params.id);
      if (!book || book.userId !== req.user!.id) {
        return res.status(404).json({ message: "Book not found" });
      }
      res.json(book);
    } catch (err) { next(err); }
  });

  app.post("/api/books", requireAuth, async (req: Request, res: Response, next: NextFunction) => {
    try {
      const book = await storage.createBook({ ...req.body, userId: req.user!.id });

      storage.trackBehavior(req.user!.id, "book_created", {
        bookId: book.id, title: book.title, theme: book.theme, style: book.style,
      }).catch(() => {});

      const insights = await storage.getCustomerInsights(req.user!.id);
      const themes = [...new Set([...(insights?.preferredThemes || []), book.theme].filter(Boolean))];
      const styles = [...new Set([...(insights?.preferredStyles || []), book.style].filter(Boolean))];
      storage.upsertCustomerInsights(req.user!.id, {
        totalBooks: (insights?.totalBooks || 0) + 1,
        preferredThemes: themes as string[],
        preferredStyles: styles as string[],
      }).catch(() => {});

      if (req.body.profileId) {
        const profile = await storage.getStoryProfile(req.body.profileId);
        if (profile && profile.userId === req.user!.id) {
          const history = [...(profile.storyHistory || []), {
            bookId: book.id,
            bookTitle: book.title,
            summary: (book.pages || []).map((p: any) => p.text).join(" ").slice(0, 500),
            themes: [book.theme].filter(Boolean) as string[],
            createdAt: new Date().toISOString(),
          }];
          storage.updateStoryProfile(profile.id, { storyHistory: history }).catch(() => {});
        }
      }

      res.status(201).json(book);
    } catch (err) { next(err); }
  });

  app.patch("/api/books/:id", requireAuth, async (req: Request, res: Response, next: NextFunction) => {
    try {
      const book = await storage.getBook(req.params.id);
      if (!book || book.userId !== req.user!.id) {
        return res.status(404).json({ message: "Book not found" });
      }
      const updated = await storage.updateBook(req.params.id, req.body);
      res.json(updated);
    } catch (err) { next(err); }
  });

  // ========== FILE UPLOAD ==========
  app.post("/api/uploads", requireAuth, upload.array("photos", 5), async (req: Request, res: Response, next: NextFunction) => {
    try {
      const files = req.files as Express.Multer.File[];
      if (!files || files.length === 0) {
        return res.status(400).json({ message: "No files uploaded" });
      }

      const results = [];
      for (const file of files) {
        const uploadRecord = await storage.createUpload({
          userId: req.user!.id,
          filename: file.originalname,
          path: `/uploads/${file.filename}`,
          mimeType: file.mimetype,
          size: file.size,
        });
        results.push(uploadRecord);
      }

      res.status(201).json(results);
    } catch (err) { next(err); }
  });

  // ========== AI STORY GENERATION ==========
  app.post("/api/generate/story", requireAuth, async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { draftId } = req.body;
      let draftData = req.body;

      if (draftId) {
        const draft = await storage.getDraft(draftId);
        if (!draft || draft.userId !== req.user!.id) {
          return res.status(404).json({ message: "Draft not found" });
        }
        draftData = { ...draft, ...req.body };
      }

      const pages = await generateStory({
        recipientName: draftData.recipientName || "the reader",
        recipientAge: draftData.recipientAge || "5",
        theme: draftData.theme || "Adventure",
        subject: draftData.subject || draftData.recipientName || "a brave child",
        bookType: draftData.bookType || "Story Book",
        style: draftData.selectedStyle || "whimsical",
        interviewAnswers: draftData.interviewAnswers || {},
        messages: draftData.messages || [],
      });

      res.json({ pages });
    } catch (err) { next(err); }
  });

  // ========== AI ILLUSTRATION GENERATION ==========
  app.post("/api/generate/illustration", requireAuth, async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { pageText, style, recipientName, theme, pageNumber, totalPages } = req.body;

      const imageUrl = await generateIllustration(
        pageText,
        style || "whimsical",
        recipientName || "the character",
        theme || "Adventure",
        pageNumber || 1,
        totalPages || 8
      );

      res.json({ imageUrl });
    } catch (err) { next(err); }
  });

  app.post("/api/generate/book", requireAuth, async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { draftId, selectedStyle, profileId } = req.body;
      let draftData = req.body;

      if (draftId) {
        const draft = await storage.getDraft(draftId);
        if (!draft || draft.userId !== req.user!.id) {
          return res.status(404).json({ message: "Draft not found" });
        }
        draftData = { ...draft, ...req.body };
      }

      let profileContext;
      if (profileId) {
        const profile = await storage.getStoryProfile(profileId);
        if (profile && profile.userId === req.user!.id) {
          profileContext = {
            name: profile.name,
            relationship: profile.relationship,
            age: profile.age || undefined,
            personality: profile.personality || undefined,
            appearance: profile.appearance || undefined,
            interests: profile.interests || undefined,
            catchphrases: profile.catchphrases || undefined,
            storyHistory: (profile.storyHistory || []).map((h: any) => ({
              bookTitle: h.bookTitle,
              summary: h.summary,
              themes: h.themes,
            })),
            aiNotes: profile.aiNotes || undefined,
          };
        }
      }

      const customerInsightsData = await storage.getCustomerInsights(req.user!.id);
      const customerPreferences = customerInsightsData ? {
        preferredThemes: customerInsightsData.preferredThemes as string[],
        preferredStyles: customerInsightsData.preferredStyles as string[],
        totalBooks: customerInsightsData.totalBooks,
      } : undefined;

      const storyPages = await generateStory({
        recipientName: draftData.recipientName || "the reader",
        recipientAge: draftData.recipientAge || "5",
        theme: draftData.theme || "Adventure",
        subject: draftData.subject || draftData.recipientName || "a brave child",
        bookType: draftData.bookType || "Story Book",
        style: selectedStyle || draftData.selectedStyle || "whimsical",
        interviewAnswers: draftData.interviewAnswers || {},
        messages: draftData.messages || [],
        profileContext,
        customerPreferences,
      });

      const style = selectedStyle || draftData.selectedStyle || "whimsical";
      const theme = draftData.theme || "Adventure";
      const recipientName = draftData.recipientName || "the reader";

      const pagesWithImages = [];
      for (const page of storyPages) {
        try {
          const imageUrl = await generateIllustration(
            page.text,
            style,
            recipientName,
            theme,
            page.pageNumber,
            storyPages.length
          );
          pagesWithImages.push({ text: page.text, image: imageUrl });
        } catch (imgErr) {
          console.error(`Failed to generate illustration for page ${page.pageNumber}:`, imgErr);
          pagesWithImages.push({ text: page.text, image: "" });
        }
      }

      const book = await storage.createBook({
        userId: req.user!.id,
        title: draftData.title || `Book for ${recipientName}`,
        recipientName,
        theme,
        style,
        pages: pagesWithImages,
        format: "digital",
        status: "generated",
        draftId: draftId || null,
      });

      if (draftId) {
        await storage.updateDraft(draftId, { step: "preview", progress: 100 });
      }

      if (profileId) {
        const profile = await storage.getStoryProfile(profileId);
        if (profile && profile.userId === req.user!.id) {
          const history = [...(profile.storyHistory || []), {
            bookId: book.id,
            bookTitle: book.title,
            summary: pagesWithImages.map((p: any) => p.text).join(" ").slice(0, 500),
            themes: [theme].filter(Boolean) as string[],
            createdAt: new Date().toISOString(),
          }];
          storage.updateStoryProfile(profile.id, { storyHistory: history }).catch(() => {});
        }
      }

      storage.trackBehavior(req.user!.id, "book_generated", {
        bookId: book.id, theme, style, profileId: profileId || null, pageCount: pagesWithImages.length,
      }).catch(() => {});

      res.status(201).json(book);
    } catch (err) { next(err); }
  });

  // ========== REGENERATE A SINGLE PAGE ==========
  app.post("/api/books/:id/regenerate-page", requireAuth, async (req: Request, res: Response, next: NextFunction) => {
    try {
      const book = await storage.getBook(req.params.id);
      if (!book || book.userId !== req.user!.id) {
        return res.status(404).json({ message: "Book not found" });
      }

      const { pageIndex, newText } = req.body;
      const pages = [...(book.pages || [])];

      if (pageIndex < 0 || pageIndex >= pages.length) {
        return res.status(400).json({ message: "Invalid page index" });
      }

      const text = newText || pages[pageIndex].text;
      const imageUrl = await generateIllustration(
        text,
        book.style || "whimsical",
        book.recipientName || "the character",
        book.theme || "Adventure",
        pageIndex + 1,
        pages.length
      );

      pages[pageIndex] = { text, image: imageUrl };

      const updated = await storage.updateBook(req.params.id, { pages });
      res.json(updated);
    } catch (err) { next(err); }
  });

  // ========== UPDATE PAGE TEXT ==========
  app.patch("/api/books/:id/page/:pageIndex", requireAuth, async (req: Request, res: Response, next: NextFunction) => {
    try {
      const book = await storage.getBook(req.params.id);
      if (!book || book.userId !== req.user!.id) {
        return res.status(404).json({ message: "Book not found" });
      }

      const pageIndex = parseInt(req.params.pageIndex);
      const { text } = req.body;
      const pages = [...(book.pages || [])];

      if (pageIndex < 0 || pageIndex >= pages.length) {
        return res.status(400).json({ message: "Invalid page index" });
      }

      pages[pageIndex] = { ...pages[pageIndex], text };
      const updated = await storage.updateBook(req.params.id, { pages });
      res.json(updated);
    } catch (err) { next(err); }
  });

  // ========== FAVORITES ==========
  app.get("/api/favorites", requireAuth, async (req: Request, res: Response, next: NextFunction) => {
    try {
      const favs = await storage.getFavoritesByUser(req.user!.id);
      res.json(favs);
    } catch (err) { next(err); }
  });

  app.post("/api/favorites", requireAuth, async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { bookId } = req.body;
      const existing = await storage.getFavorite(req.user!.id, bookId);
      if (existing) {
        return res.status(409).json({ message: "Already favorited" });
      }
      const fav = await storage.createFavorite({ userId: req.user!.id, bookId });
      res.status(201).json(fav);
    } catch (err) { next(err); }
  });

  app.delete("/api/favorites/:id", requireAuth, async (req: Request, res: Response, next: NextFunction) => {
    try {
      await storage.deleteFavorite(req.params.id);
      res.json({ message: "Removed" });
    } catch (err) { next(err); }
  });

  // ========== ORDERS ==========
  app.get("/api/orders", requireAuth, async (req: Request, res: Response, next: NextFunction) => {
    try {
      const orders = await storage.getOrdersByUser(req.user!.id);
      res.json(orders);
    } catch (err) { next(err); }
  });

  app.post("/api/orders", requireAuth, async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { bookId, format, shippingAddress } = req.body;
      const prices: Record<string, number> = {
        digital: 1499,
        softcover: 2999,
        hardcover: 3999,
      };

      const amount = prices[format] || 1499;
      const order = await storage.createOrder({
        userId: req.user!.id,
        bookId,
        format,
        status: "pending",
        amount,
        shippingAddress: shippingAddress || null,
        stripeSessionId: null,
        stripePaymentId: null,
      });

      storage.trackBehavior(req.user!.id, "order_placed", {
        orderId: order.id, bookId, format, amount,
      }).catch(() => {});

      const insights = await storage.getCustomerInsights(req.user!.id);
      const formats = [...new Set([...(insights?.preferredFormats || []), format].filter(Boolean))];
      storage.upsertCustomerInsights(req.user!.id, {
        totalOrders: (insights?.totalOrders || 0) + 1,
        totalSpent: (insights?.totalSpent || 0) + amount,
        preferredFormats: formats as string[],
        lastPurchaseDate: new Date(),
      }).catch(() => {});

      res.status(201).json(order);
    } catch (err) { next(err); }
  });

  // ========== STORY PROFILES ==========
  app.get("/api/story-profiles", requireAuth, async (req: Request, res: Response, next: NextFunction) => {
    try {
      const profiles = await storage.getStoryProfilesByUser(req.user!.id);
      res.json(profiles);
    } catch (err) { next(err); }
  });

  app.get("/api/story-profiles/:id", requireAuth, async (req: Request, res: Response, next: NextFunction) => {
    try {
      const profile = await storage.getStoryProfile(req.params.id);
      if (!profile || profile.userId !== req.user!.id) {
        return res.status(404).json({ message: "Profile not found" });
      }
      res.json(profile);
    } catch (err) { next(err); }
  });

  app.post("/api/story-profiles", requireAuth, async (req: Request, res: Response, next: NextFunction) => {
    try {
      const profile = await storage.createStoryProfile({ ...req.body, userId: req.user!.id });
      await storage.trackBehavior(req.user!.id, "profile_created", { profileId: profile.id, name: profile.name, relationship: profile.relationship });
      res.status(201).json(profile);
    } catch (err) { next(err); }
  });

  app.patch("/api/story-profiles/:id", requireAuth, async (req: Request, res: Response, next: NextFunction) => {
    try {
      const profile = await storage.getStoryProfile(req.params.id);
      if (!profile || profile.userId !== req.user!.id) {
        return res.status(404).json({ message: "Profile not found" });
      }
      const updated = await storage.updateStoryProfile(req.params.id, req.body);
      res.json(updated);
    } catch (err) { next(err); }
  });

  app.delete("/api/story-profiles/:id", requireAuth, async (req: Request, res: Response, next: NextFunction) => {
    try {
      const profile = await storage.getStoryProfile(req.params.id);
      if (!profile || profile.userId !== req.user!.id) {
        return res.status(404).json({ message: "Profile not found" });
      }
      await storage.deleteStoryProfile(req.params.id);
      res.json({ message: "Deleted" });
    } catch (err) { next(err); }
  });

  // ========== CUSTOMER INSIGHTS ==========
  app.get("/api/insights", requireAuth, async (req: Request, res: Response, next: NextFunction) => {
    try {
      const insights = await storage.getCustomerInsights(req.user!.id);
      res.json(insights || { totalSpent: 0, totalBooks: 0, totalOrders: 0, preferredThemes: [], preferredStyles: [], preferredFormats: [] });
    } catch (err) { next(err); }
  });

  // ========== PASSWORD CHANGE ==========
  app.post("/api/auth/change-password", requireAuth, async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { currentPassword, newPassword } = req.body;
      if (!currentPassword || !newPassword) {
        return res.status(400).json({ message: "Current and new password are required" });
      }

      const user = await storage.getUser(req.user!.id);
      if (!user) return res.status(404).json({ message: "User not found" });

      const { scrypt, timingSafeEqual } = await import("crypto");
      const { promisify } = await import("util");
      const scryptAsync = promisify(scrypt);

      const [hashed, salt] = user.password.split(".");
      const buf = (await scryptAsync(currentPassword, salt, 64)) as Buffer;
      const isValid = timingSafeEqual(buf, Buffer.from(hashed, "hex"));

      if (!isValid) {
        return res.status(400).json({ message: "Current password is incorrect" });
      }

      const { randomBytes } = await import("crypto");
      const newSalt = randomBytes(16).toString("hex");
      const newBuf = (await scryptAsync(newPassword, newSalt, 64)) as Buffer;
      const newHash = `${newBuf.toString("hex")}.${newSalt}`;

      await storage.updateUser(req.user!.id, { password: newHash });
      res.json({ message: "Password updated successfully" });
    } catch (err) { next(err); }
  });

  return httpServer;
}
