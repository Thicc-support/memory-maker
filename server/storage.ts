import { type User, type InsertUser, type Draft, type InsertDraft, type Book, type InsertBook, users, drafts, books } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  getDraftsByUser(userId: string): Promise<Draft[]>;
  getDraft(id: string): Promise<Draft | undefined>;
  createDraft(draft: InsertDraft): Promise<Draft>;
  updateDraft(id: string, data: Partial<InsertDraft>): Promise<Draft | undefined>;
  deleteDraft(id: string): Promise<void>;

  getBooksByUser(userId: string): Promise<Book[]>;
  getBook(id: string): Promise<Book | undefined>;
  createBook(book: InsertBook): Promise<Book>;
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
}

export const storage = new DatabaseStorage();
