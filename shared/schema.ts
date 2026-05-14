import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, jsonb, boolean, serial } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";


export const conversations = pgTable("conversations", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  conversationId: integer("conversation_id").notNull().references(() => conversations.id),
  role: text("role").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  password: text("password").notNull(),
  emailVerified: boolean("email_verified").notNull().default(false),
  verificationToken: text("verification_token"),
  resetToken: text("reset_token"),
  resetTokenExpiry: timestamp("reset_token_expiry"),
  stripeCustomerId: text("stripe_customer_id"),
  subscriptionId: text("subscription_id"),
  subscriptionStatus: text("subscription_status"),
  subscriptionTier: text("subscription_tier"),
  subscriptionPeriodEnd: timestamp("subscription_period_end"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  email: true,
  name: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const drafts = pgTable("drafts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  title: text("title").notNull().default("Untitled Story"),
  recipient: text("recipient"),
  recipientRelationship: text("recipient_relationship"),
  subject: text("subject"),
  theme: text("theme"),
  bookType: text("book_type"),
  bookLength: text("book_length"),
  recipientName: text("recipient_name"),
  recipientAge: text("recipient_age"),
  selectedStyle: text("selected_style"),
  messages: jsonb("messages").$type<any[]>().default([]),
  photos: text("photos").array().default([]),
  step: text("step").notNull().default("chat"),
  progress: integer("progress").notNull().default(0),
  interviewAnswers: jsonb("interview_answers").$type<Record<string, string>>().default({}),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertDraftSchema = createInsertSchema(drafts).omit({
  id: true,
  updatedAt: true,
});

export type InsertDraft = z.infer<typeof insertDraftSchema>;
export type Draft = typeof drafts.$inferSelect;

export const books = pgTable("books", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  recipientName: text("recipient_name"),
  theme: text("theme"),
  style: text("style"),
  pages: jsonb("pages").$type<Array<{ text: string; image: string }>>().default([]),
  format: text("format").notNull().default("digital"),
  status: text("status").notNull().default("generated"),
  draftId: varchar("draft_id"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertBookSchema = createInsertSchema(books).omit({
  id: true,
  createdAt: true,
});

export type InsertBook = z.infer<typeof insertBookSchema>;
export type Book = typeof books.$inferSelect;

export const orders = pgTable("orders", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  bookId: varchar("book_id").notNull().references(() => books.id),
  format: text("format").notNull(),
  status: text("status").notNull().default("pending"),
  amount: integer("amount").notNull(),
  stripeSessionId: text("stripe_session_id"),
  stripePaymentId: text("stripe_payment_id"),
  shippingAddress: jsonb("shipping_address").$type<{
    name: string;
    line1: string;
    line2?: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  }>(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertOrderSchema = createInsertSchema(orders).omit({
  id: true,
  createdAt: true,
});

export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Order = typeof orders.$inferSelect;

export const favorites = pgTable("favorites", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  bookId: varchar("book_id").references(() => books.id),
  theme: text("theme"),
  style: text("style"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertFavoriteSchema = createInsertSchema(favorites).omit({
  id: true,
  createdAt: true,
});

export type InsertFavorite = z.infer<typeof insertFavoriteSchema>;
export type Favorite = typeof favorites.$inferSelect;

export const uploads = pgTable("uploads", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  filename: text("filename").notNull(),
  path: text("path").notNull(),
  mimeType: text("mime_type").notNull(),
  size: integer("size").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUploadSchema = createInsertSchema(uploads).omit({
  id: true,
  createdAt: true,
});

export type InsertUpload = z.infer<typeof insertUploadSchema>;
export type Upload = typeof uploads.$inferSelect;

export const storyProfiles = pgTable("story_profiles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  name: text("name").notNull(),
  relationship: text("relationship").notNull(),
  age: text("age"),
  personality: text("personality"),
  appearance: text("appearance"),
  interests: text("interests"),
  catchphrases: text("catchphrases"),
  favoriteThemes: text("favorite_themes").array().default([]),
  storyHistory: jsonb("story_history").$type<Array<{
    bookId: string;
    bookTitle: string;
    summary: string;
    themes: string[];
    createdAt: string;
  }>>().default([]),
  aiNotes: text("ai_notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertStoryProfileSchema = createInsertSchema(storyProfiles).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertStoryProfile = z.infer<typeof insertStoryProfileSchema>;
export type StoryProfile = typeof storyProfiles.$inferSelect;

export const customerInsights = pgTable("customer_insights", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id).unique(),
  totalSpent: integer("total_spent").notNull().default(0),
  totalBooks: integer("total_books").notNull().default(0),
  totalOrders: integer("total_orders").notNull().default(0),
  preferredThemes: text("preferred_themes").array().default([]),
  preferredStyles: text("preferred_styles").array().default([]),
  preferredFormats: text("preferred_formats").array().default([]),
  averageBookLength: integer("average_book_length").default(0),
  recipientAges: text("recipient_ages").array().default([]),
  lastPurchaseDate: timestamp("last_purchase_date"),
  purchaseFrequency: text("purchase_frequency"),
  aiSummary: text("ai_summary"),
  behaviorLog: jsonb("behavior_log").$type<Array<{
    action: string;
    details: Record<string, any>;
    timestamp: string;
  }>>().default([]),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertCustomerInsightsSchema = createInsertSchema(customerInsights).omit({
  id: true,
  updatedAt: true,
});

export type InsertCustomerInsights = z.infer<typeof insertCustomerInsightsSchema>;
export type CustomerInsights = typeof customerInsights.$inferSelect;
