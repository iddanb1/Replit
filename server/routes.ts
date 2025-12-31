import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import session from "express-session";
import multer from "multer";
import path from "path";
import fs from "fs";
import express from "express";

const sessionSecret = process.env.SESSION_SECRET || "default-secret-change-me";

const uploadsDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const upload = multer({
  storage: multer.diskStorage({
    destination: uploadsDir,
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const ext = path.extname(file.originalname);
      cb(null, `program-${uniqueSuffix}${ext}`);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed."));
    }
  },
});

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Trust proxy for secure cookies behind Replit's reverse proxy
  if (process.env.NODE_ENV === "production") {
    app.set("trust proxy", 1);
  }

  // Setup session middleware
  app.use(
    session({
      secret: sessionSecret,
      resave: false,
      saveUninitialized: false,
      cookie: { 
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
      },
    })
  );

  // Admin authentication routes
  app.post("/api/admin/login", (req, res) => {
    const { password } = req.body;
    const adminPassword = process.env.ADMIN_PASSWORD || "admin";

    if (password === adminPassword) {
      (req.session as any).adminAuthenticated = true;
      res.json({ success: true });
    } else {
      res.status(401).json({ message: "Invalid password" });
    }
  });

  app.get("/api/admin/check", (req, res) => {
    if ((req.session as any).adminAuthenticated) {
      res.json({ authenticated: true });
    } else {
      res.status(401).json({ authenticated: false });
    }
  });

  app.post("/api/admin/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Logout failed" });
      }
      res.json({ success: true });
    });
  });

  // Serve uploaded files
  app.use("/uploads", express.static(uploadsDir));

  // Image upload endpoint
  app.post("/api/upload/image", upload.single("image"), (req, res) => {
    if (!(req.session as any).adminAuthenticated) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    const imageUrl = `/uploads/${req.file.filename}`;
    res.json({ imageUrl });
  });

  // Events
  app.get(api.events.list.path, async (req, res) => {
    const events = await storage.getEvents();
    res.json(events);
  });

  app.get(api.events.get.path, async (req, res) => {
    const event = await storage.getEvent(Number(req.params.id));
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.json(event);
  });

  app.post(api.events.create.path, async (req, res) => {
    try {
      const input = api.events.create.input.parse({
        ...req.body,
        date: new Date(req.body.date)
      });
      const event = await storage.createEvent(input);
      res.status(201).json(event);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      throw err;
    }
  });

  app.put(api.events.update.path, async (req, res) => {
    try {
      const input = api.events.update.input.parse({
        ...req.body,
        date: req.body.date ? new Date(req.body.date) : undefined
      });
      const event = await storage.updateEvent(Number(req.params.id), input);
      res.json(event);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      res.status(404).json({ message: 'Event not found' });
    }
  });

  app.delete(api.events.delete.path, async (req, res) => {
    await storage.deleteEvent(Number(req.params.id));
    res.status(204).send();
  });

  // Announcements
  app.get(api.announcements.list.path, async (req, res) => {
    const items = await storage.getAnnouncements();
    res.json(items);
  });

  app.post(api.announcements.create.path, async (req, res) => {
    const input = api.announcements.create.input.parse(req.body);
    const item = await storage.createAnnouncement(input);
    res.status(201).json(item);
  });

  app.put(api.announcements.update.path, async (req, res) => {
    const input = api.announcements.update.input.parse(req.body);
    const item = await storage.updateAnnouncement(Number(req.params.id), input);
    res.json(item);
  });

  app.delete(api.announcements.delete.path, async (req, res) => {
    await storage.deleteAnnouncement(Number(req.params.id));
    res.status(204).send();
  });

  // Programs
  app.get(api.programs.list.path, async (req, res) => {
    const programs = await storage.getPrograms();
    res.json(programs);
  });

  app.get(api.programs.get.path, async (req, res) => {
    const program = await storage.getProgram(Number(req.params.id));
    if (!program) return res.status(404).json({ message: 'Program not found' });
    res.json(program);
  });

  app.post(api.programs.create.path, async (req, res) => {
    const input = api.programs.create.input.parse({
      ...req.body,
      date: new Date(req.body.date)
    });
    const program = await storage.createProgram(input);
    res.status(201).json(program);
  });

  app.put(api.programs.update.path, async (req, res) => {
    const input = api.programs.update.input.parse({
      ...req.body,
      date: req.body.date ? new Date(req.body.date) : undefined
    });
    const program = await storage.updateProgram(Number(req.params.id), input);
    res.json(program);
  });

  app.delete(api.programs.delete.path, async (req, res) => {
    await storage.deleteProgram(Number(req.params.id));
    res.status(204).send();
  });

  // Program Items
  app.post(api.programItems.create.path, async (req, res) => {
    const input = api.programItems.create.input.parse({
      ...req.body,
      programId: Number(req.params.programId)
    });
    const item = await storage.createProgramItem(input);
    res.status(201).json(item);
  });

  app.put(api.programItems.update.path, async (req, res) => {
    const input = api.programItems.update.input.parse(req.body);
    const item = await storage.updateProgramItem(Number(req.params.id), input);
    res.json(item);
  });

  app.delete(api.programItems.delete.path, async (req, res) => {
    await storage.deleteProgramItem(Number(req.params.id));
    res.status(204).send();
  });

  // Seed Data
  await seedDatabase();

  return httpServer;
}

async function seedDatabase() {
  const existingPrograms = await storage.getPrograms();
  if (existingPrograms.length === 0) {
    const today = new Date();
    
    // Seed Program
    const program = await storage.createProgram({
      title: "Sunday Morning Service",
      date: today,
      theme: "Living in Faith",
    });

    await storage.createProgramItem({
      programId: program.id,
      title: "Opening Prayer",
      order: 1,
      time: "10:00 AM",
      presenter: "Deacon Smith",
      description: "Invocation and welcome"
    });
    
    await storage.createProgramItem({
      programId: program.id,
      title: "Praise & Worship",
      order: 2,
      time: "10:15 AM",
      presenter: "Worship Team",
      description: "Songs of praise"
    });

    await storage.createProgramItem({
      programId: program.id,
      title: "Sermon",
      order: 3,
      time: "11:00 AM",
      presenter: "Pastor Johnson",
      description: "Scripture: Hebrews 11:1"
    });

    // Seed Announcements
    await storage.createAnnouncement({
      title: "Community Picnic",
      content: "Join us this Saturday for a community picnic at the park. Bring a dish to share!",
      date: new Date()
    });

    await storage.createAnnouncement({
      title: "Youth Group Meeting",
      content: "Youth group meets every Wednesday at 6 PM in the fellowship hall.",
      date: new Date()
    });

    // Seed Events
    await storage.createEvent({
      title: "Christmas Eve Service",
      description: "Join us for a candlelight service celebrating the birth of Christ.",
      date: new Date("2025-12-24T18:00:00"),
      location: "Main Sanctuary",
      imageUrl: "https://images.unsplash.com/photo-1512389142860-9c449e58a543"
    });

    await storage.createEvent({
      title: "New Year's Prayer Vigil",
      description: "Ring in the new year with prayer and reflection.",
      date: new Date("2025-12-31T22:00:00"),
      location: "Prayer Chapel",
    });
  }
}
