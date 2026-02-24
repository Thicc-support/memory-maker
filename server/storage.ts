import { type User, type InsertUser, type Draft, type InsertDraft, type Book, type InsertBook, type Order, type InsertOrder, type Favorite, type InsertFavorite, type Upload, type InsertUpload, users, drafts, books, orders, favorites, uploads } from "@shared/schema";
import { db } from "./db";
import { eq, and } from "drizzle-orm";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, data: Partial<User>): Promise<User | undefined>;

  getDraftsByUser(userId: string): Promise<Draft[]>;
  getDraft(id: string): Promise<Draft | undefined>;
  createDraft(draft: InsertDraft): Promise<Draft>;
  updateDraft(id: string, data: Partial<InsertDraft>): Promise<Draft | undefined>;
  deleteDraft(id: string): Promise<void>;

  getBooksByUser(userId: string): Promise<Book[]>;
  getBook(id: string): Promise<Book | undefined>;
  createBook(book: InsertBook): Promise<Book>;
  updateBook(id: string, data: Partial<InsertBook>): Promise<Book | undefined>;

  getOrdersByUser(userId: string): Promise<Order[]>;
  getOrder(id: string): Promise<Order | undefined>;
  getOrderByStripeSession(sessionId: string): Promise<Order | undefined>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrder(id: string, data: Partial<InsertOrder>): Promise<Order | undefined>;

  getFavoritesByUser(userId: string): Promise<Favorite[]>;
  createFavorite(favorite: InsertFavorite): Promise<Favorite>;
  deleteFavorite(id: string): Promise<void>;
  getFavorite(userId: string, bookId: string): Promise<Favorite | undefined>;

  createUpload(upload: InsertUpload): Promise<Upload>;
  getUploadsByUser(userId: string): Promise<Upload[]>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async updateUser(id: string, data: Partial<User>): Promise<User | undefined> {
    const [updated] = await db.update(users).set(data).where(eq(users.id, id)).returning();
    return updated;
  }

  async getDraftsByUser(userId: string): Promise<Draft[]> {
    return db.select().from(drafts).where(eq(drafts.userId, userId));
  }

  async getDraft(id: string): Promise<Draft | undefined> {
    const [draft] = await db.select().from(drafts).where(eq(drafts.id, id));
    return draft;
  }

  async createDraft(draft: InsertDraft): Promise<Draft> {
    const [created] = await db.insert(drafts).values(draft).returning();
    return created;
  }

  async updateDraft(id: string, data: Partial<InsertDraft>): Promise<Draft | undefined> {
    const [updated] = await db
      .update(drafts)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(drafts.id, id))
      .returning();
    return updated;
  }

  async deleteDraft(id: string): Promise<void> {
    await db.delete(drafts).where(eq(drafts.id, id));
  }

  async getBooksByUser(userId: string): Promise<Book[]> {
    return db.select().from(books).where(eq(books.userId, userId));
  }

  async getBook(id: string): Promise<Book | undefined> {
    const [book] = await db.select().from(books).where(eq(books.id, id));
    return book;
  }

  async createBook(book: InsertBook): Promise<Book> {
    const [created] = await db.insert(books).values(book).returning();
    return created;
  }

  async updateBook(id: string, data: Partial<InsertBook>): Promise<Book | undefined> {
    const [updated] = await db.update(books).set(data).where(eq(books.id, id)).returning();
    return updated;
  }

  async getOrdersByUser(userId: string): Promise<Order[]> {
    return db.select().from(orders).where(eq(orders.userId, userId));
  }

  async getOrder(id: string): Promise<Order | undefined> {
    const [order] = await db.select().from(orders).where(eq(orders.id, id));
    return order;
  }

  async getOrderByStripeSession(sessionId: string): Promise<Order | undefined> {
    const [order] = await db.select().from(orders).where(eq(orders.stripeSessionId, sessionId));
    return order;
  }

  async createOrder(order: InsertOrder): Promise<Order> {
    const [created] = await db.insert(orders).values(order).returning();
    return created;
  }

  async updateOrder(id: string, data: Partial<InsertOrder>): Promise<Order | undefined> {
    const [updated] = await db.update(orders).set(data).where(eq(orders.id, id)).returning();
    return updated;
  }

  async getFavoritesByUser(userId: string): Promise<Favorite[]> {
    return db.select().from(favorites).where(eq(favorites.userId, userId));
  }

  async createFavorite(favorite: InsertFavorite): Promise<Favorite> {
    const [created] = await db.insert(favorites).values(favorite).returning();
    return created;
  }

  async deleteFavorite(id: string): Promise<void> {
    await db.delete(favorites).where(eq(favorites.id, id));
  }

  async getFavorite(userId: string, bookId: string): Promise<Favorite | undefined> {
    const [fav] = await db.select().from(favorites).where(and(eq(favorites.userId, userId), eq(favorites.bookId, bookId)));
    return fav;
  }

  async createUpload(upload: InsertUpload): Promise<Upload> {
    const [created] = await db.insert(uploads).values(upload).returning();
    return created;
  }

  async getUploadsByUser(userId: string): Promise<Upload[]> {
    return db.select().from(uploads).where(eq(uploads.userId, userId));
  }
}

export const storage = new DatabaseStorage();
