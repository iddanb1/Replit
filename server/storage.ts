import { db } from "./db";
import {
  events, announcements, servicePrograms, programItems,
  type Event, type InsertEvent, type UpdateEventRequest,
  type Announcement, type InsertAnnouncement, type UpdateAnnouncementRequest,
  type ServiceProgram, type InsertServiceProgram, type UpdateProgramRequest,
  type ProgramItem, type InsertProgramItem, type UpdateProgramItemRequest, type ProgramWithItems
} from "@shared/schema";
import { eq, desc, asc } from "drizzle-orm";

export interface IStorage {
  // Events
  getEvents(): Promise<Event[]>;
  getEvent(id: number): Promise<Event | undefined>;
  createEvent(event: InsertEvent): Promise<Event>;
  updateEvent(id: number, updates: UpdateEventRequest): Promise<Event>;
  deleteEvent(id: number): Promise<void>;

  // Announcements
  getAnnouncements(): Promise<Announcement[]>;
  createAnnouncement(announcement: InsertAnnouncement): Promise<Announcement>;
  updateAnnouncement(id: number, updates: UpdateAnnouncementRequest): Promise<Announcement>;
  deleteAnnouncement(id: number): Promise<void>;

  // Programs
  getPrograms(): Promise<ServiceProgram[]>;
  getProgram(id: number): Promise<ProgramWithItems | undefined>;
  createProgram(program: InsertServiceProgram): Promise<ServiceProgram>;
  updateProgram(id: number, updates: UpdateProgramRequest): Promise<ServiceProgram>;
  deleteProgram(id: number): Promise<void>;

  // Program Items
  createProgramItem(item: InsertProgramItem): Promise<ProgramItem>;
  updateProgramItem(id: number, updates: UpdateProgramItemRequest): Promise<ProgramItem>;
  deleteProgramItem(id: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // Events
  async getEvents(): Promise<Event[]> {
    return await db.select().from(events).orderBy(asc(events.date));
  }
  async getEvent(id: number): Promise<Event | undefined> {
    const [event] = await db.select().from(events).where(eq(events.id, id));
    return event;
  }
  async createEvent(event: InsertEvent): Promise<Event> {
    const [newEvent] = await db.insert(events).values(event).returning();
    return newEvent;
  }
  async updateEvent(id: number, updates: UpdateEventRequest): Promise<Event> {
    const [updated] = await db.update(events).set(updates).where(eq(events.id, id)).returning();
    return updated;
  }
  async deleteEvent(id: number): Promise<void> {
    await db.delete(events).where(eq(events.id, id));
  }

  // Announcements
  async getAnnouncements(): Promise<Announcement[]> {
    return await db.select().from(announcements).orderBy(desc(announcements.date));
  }
  async createAnnouncement(announcement: InsertAnnouncement): Promise<Announcement> {
    const [newAnnouncement] = await db.insert(announcements).values(announcement).returning();
    return newAnnouncement;
  }
  async updateAnnouncement(id: number, updates: UpdateAnnouncementRequest): Promise<Announcement> {
    const [updated] = await db.update(announcements).set(updates).where(eq(announcements.id, id)).returning();
    return updated;
  }
  async deleteAnnouncement(id: number): Promise<void> {
    await db.delete(announcements).where(eq(announcements.id, id));
  }

  // Programs
  async getPrograms(): Promise<ServiceProgram[]> {
    return await db.select().from(servicePrograms).orderBy(desc(servicePrograms.date));
  }
  async getProgram(id: number): Promise<ProgramWithItems | undefined> {
    const [program] = await db.select().from(servicePrograms).where(eq(servicePrograms.id, id));
    if (!program) return undefined;

    const items = await db.select().from(programItems)
      .where(eq(programItems.programId, id))
      .orderBy(asc(programItems.order));

    return { ...program, items };
  }
  async createProgram(program: InsertServiceProgram): Promise<ServiceProgram> {
    const [newProgram] = await db.insert(servicePrograms).values(program).returning();
    return newProgram;
  }
  async updateProgram(id: number, updates: UpdateProgramRequest): Promise<ServiceProgram> {
    const [updated] = await db.update(servicePrograms).set(updates).where(eq(servicePrograms.id, id)).returning();
    return updated;
  }
  async deleteProgram(id: number): Promise<void> {
    await db.delete(programItems).where(eq(programItems.programId, id));
    await db.delete(servicePrograms).where(eq(servicePrograms.id, id));
  }

  // Program Items
  async createProgramItem(item: InsertProgramItem): Promise<ProgramItem> {
    const [newItem] = await db.insert(programItems).values(item).returning();
    return newItem;
  }
  async updateProgramItem(id: number, updates: UpdateProgramItemRequest): Promise<ProgramItem> {
    const [updated] = await db.update(programItems).set(updates).where(eq(programItems.id, id)).returning();
    return updated;
  }
  async deleteProgramItem(id: number): Promise<void> {
    await db.delete(programItems).where(eq(programItems.id, id));
  }
}

export const storage = new DatabaseStorage();
