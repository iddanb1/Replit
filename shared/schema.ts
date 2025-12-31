import { pgTable, text, serial, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// === TABLE DEFINITIONS ===

export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  date: timestamp("date").notNull(),
  location: text("location").notNull(),
  imageUrl: text("image_url"),
});

export const announcements = pgTable("announcements", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  date: timestamp("date").defaultNow(),
});

export const servicePrograms = pgTable("service_programs", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(), // e.g., "Sunday Service - Dec 24"
  date: timestamp("date").notNull(),
  theme: text("theme"),
  imageUrl: text("image_url"),
});

export const programItems = pgTable("program_items", {
  id: serial("id").primaryKey(),
  programId: integer("program_id").notNull(),
  title: text("title").notNull(), // e.g., "Opening Prayer"
  description: text("description"),
  presenter: text("presenter"), // e.g., "Pastor John"
  time: text("time"), // e.g., "10:00 AM" or duration
  order: integer("order").notNull(),
});

// === RELATIONS ===

export const programRelations = relations(servicePrograms, ({ many }) => ({
  items: many(programItems),
}));

export const programItemRelations = relations(programItems, ({ one }) => ({
  program: one(servicePrograms, {
    fields: [programItems.programId],
    references: [servicePrograms.id],
  }),
}));

// === BASE SCHEMAS ===

export const insertEventSchema = createInsertSchema(events).omit({ id: true });
export const insertAnnouncementSchema = createInsertSchema(announcements).omit({ id: true });
export const insertProgramSchema = createInsertSchema(servicePrograms).omit({ id: true });
export const insertProgramItemSchema = createInsertSchema(programItems).omit({ id: true });

// === EXPLICIT API CONTRACT TYPES ===

export type Event = typeof events.$inferSelect;
export type InsertEvent = z.infer<typeof insertEventSchema>;

export type Announcement = typeof announcements.$inferSelect;
export type InsertAnnouncement = z.infer<typeof insertAnnouncementSchema>;

export type ServiceProgram = typeof servicePrograms.$inferSelect;
export type InsertServiceProgram = z.infer<typeof insertProgramSchema>;

export type ProgramItem = typeof programItems.$inferSelect;
export type InsertProgramItem = z.infer<typeof insertProgramItemSchema>;

// Requests
export type CreateEventRequest = InsertEvent;
export type UpdateEventRequest = Partial<InsertEvent>;

export type CreateAnnouncementRequest = InsertAnnouncement;
export type UpdateAnnouncementRequest = Partial<InsertAnnouncement>;

export type CreateProgramRequest = InsertServiceProgram;
export type UpdateProgramRequest = Partial<InsertServiceProgram>;

export type CreateProgramItemRequest = InsertProgramItem;
export type UpdateProgramItemRequest = Partial<InsertProgramItem>;

// Composite Types
export type ProgramWithItems = ServiceProgram & { items: ProgramItem[] };
