import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";

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

  // Drafts
  app.get("/api/drafts", requireAuth, async (req, res, next) => {
    try {
      const drafts = await storage.getDraftsByUser(req.user!.id);
      res.json(drafts);
    } catch (err) { next(err); }
  });

  app.post("/api/drafts", requireAuth, async (req, res, next) => {
    try {
      const draft = await storage.createDraft({ ...req.body, userId: req.user!.id });
      res.status(201).json(draft);
    } catch (err) { next(err); }
  });

  app.patch("/api/drafts/:id", requireAuth, async (req, res, next) => {
    try {
      const draft = await storage.getDraft(req.params.id);
      if (!draft || draft.userId !== req.user!.id) {
        return res.status(404).json({ message: "Draft not found" });
      }
      const updated = await storage.updateDraft(req.params.id, req.body);
      res.json(updated);
    } catch (err) { next(err); }
  });

  app.delete("/api/drafts/:id", requireAuth, async (req, res, next) => {
    try {
      const draft = await storage.getDraft(req.params.id);
      if (!draft || draft.userId !== req.user!.id) {
        return res.status(404).json({ message: "Draft not found" });
      }
      await storage.deleteDraft(req.params.id);
      res.json({ message: "Deleted" });
    } catch (err) { next(err); }
  });

  // Books
  app.get("/api/books", requireAuth, async (req, res, next) => {
    try {
      const books = await storage.getBooksByUser(req.user!.id);
      res.json(books);
    } catch (err) { next(err); }
  });

  app.get("/api/books/:id", requireAuth, async (req, res, next) => {
    try {
      const book = await storage.getBook(req.params.id);
      if (!book || book.userId !== req.user!.id) {
        return res.status(404).json({ message: "Book not found" });
      }
      res.json(book);
    } catch (err) { next(err); }
  });

  app.post("/api/books", requireAuth, async (req, res, next) => {
    try {
      const book = await storage.createBook({ ...req.body, userId: req.user!.id });
      res.status(201).json(book);
    } catch (err) { next(err); }
  });

  return httpServer;
}
