import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { 
  type InsertEvent, 
  type InsertAnnouncement, 
  type InsertServiceProgram,
  type InsertProgramItem
} from "@shared/schema";

// === EVENTS ===
export function useEvents() {
  return useQuery({
    queryKey: [api.events.list.path],
    queryFn: async () => {
      const res = await fetch(api.events.list.path);
      if (!res.ok) throw new Error("Failed to fetch events");
      return api.events.list.responses[200].parse(await res.json());
    },
  });
}

export function useCreateEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: InsertEvent) => {
      const validated = api.events.create.input.parse(data);
      const res = await fetch(api.events.create.path, {
        method: api.events.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
      });
      if (!res.ok) throw new Error("Failed to create event");
      return api.events.create.responses[201].parse(await res.json());
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.events.list.path] }),
  });
}

export function useUpdateEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<InsertEvent> }) => {
      const url = buildUrl(api.events.update.path, { id });
      const res = await fetch(url, {
        method: api.events.update.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to update event");
      return api.events.update.responses[200].parse(await res.json());
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.events.list.path] }),
  });
}

export function useDeleteEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.events.delete.path, { id });
      const res = await fetch(url, { method: api.events.delete.method });
      if (!res.ok) throw new Error("Failed to delete event");
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.events.list.path] }),
  });
}

// === ANNOUNCEMENTS ===
export function useAnnouncements() {
  return useQuery({
    queryKey: [api.announcements.list.path],
    queryFn: async () => {
      const res = await fetch(api.announcements.list.path);
      if (!res.ok) throw new Error("Failed to fetch announcements");
      return api.announcements.list.responses[200].parse(await res.json());
    },
  });
}

export function useCreateAnnouncement() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: InsertAnnouncement) => {
      const validated = api.announcements.create.input.parse(data);
      const res = await fetch(api.announcements.create.path, {
        method: api.announcements.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
      });
      if (!res.ok) throw new Error("Failed to create announcement");
      return api.announcements.create.responses[201].parse(await res.json());
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.announcements.list.path] }),
  });
}

export function useUpdateAnnouncement() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<InsertAnnouncement> }) => {
      const url = buildUrl(api.announcements.update.path, { id });
      const res = await fetch(url, {
        method: api.announcements.update.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to update announcement");
      return api.announcements.update.responses[200].parse(await res.json());
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.announcements.list.path] }),
  });
}

export function useDeleteAnnouncement() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.announcements.delete.path, { id });
      const res = await fetch(url, { method: api.announcements.delete.method });
      if (!res.ok) throw new Error("Failed to delete announcement");
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.announcements.list.path] }),
  });
}

// === PROGRAMS ===
export function usePrograms() {
  return useQuery({
    queryKey: [api.programs.list.path],
    queryFn: async () => {
      const res = await fetch(api.programs.list.path);
      if (!res.ok) throw new Error("Failed to fetch programs");
      return api.programs.list.responses[200].parse(await res.json());
    },
  });
}

export function useProgram(id: number) {
  return useQuery({
    queryKey: [api.programs.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.programs.get.path, { id });
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch program");
      return api.programs.get.responses[200].parse(await res.json());
    },
  });
}

export function useCreateProgram() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: InsertServiceProgram) => {
      const validated = api.programs.create.input.parse(data);
      const res = await fetch(api.programs.create.path, {
        method: api.programs.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
      });
      if (!res.ok) throw new Error("Failed to create program");
      return api.programs.create.responses[201].parse(await res.json());
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.programs.list.path] }),
  });
}

export function useUpdateProgram() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<InsertServiceProgram> }) => {
      const url = buildUrl(api.programs.update.path, { id });
      const res = await fetch(url, {
        method: api.programs.update.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to update program");
      return api.programs.update.responses[200].parse(await res.json());
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.programs.list.path] }),
  });
}

export function useDeleteProgram() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.programs.delete.path, { id });
      const res = await fetch(url, { method: api.programs.delete.method });
      if (!res.ok) throw new Error("Failed to delete program");
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.programs.list.path] }),
  });
}

// === PROGRAM ITEMS ===
export function useCreateProgramItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ programId, data }: { programId: number, data: InsertProgramItem }) => {
      const validated = api.programItems.create.input.parse(data);
      const url = buildUrl(api.programItems.create.path, { programId });
      const res = await fetch(url, {
        method: api.programItems.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
      });
      if (!res.ok) throw new Error("Failed to add program item");
      return api.programItems.create.responses[201].parse(await res.json());
    },
    onSuccess: (_, variables) => queryClient.invalidateQueries({ queryKey: [api.programs.get.path, variables.programId] }),
  });
}

export function useUpdateProgramItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ itemId, programId, data }: { itemId: number; programId: number; data: Partial<InsertProgramItem> }) => {
      const url = buildUrl(api.programItems.update.path, { id: itemId });
      const res = await fetch(url, {
        method: api.programItems.update.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to update program item");
      return api.programItems.update.responses[200].parse(await res.json());
    },
    onSuccess: (_, variables) => queryClient.invalidateQueries({ queryKey: [api.programs.get.path, variables.programId] }),
  });
}

export function useDeleteProgramItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ itemId, programId }: { itemId: number, programId: number }) => {
      const url = buildUrl(api.programItems.delete.path, { id: itemId });
      const res = await fetch(url, { method: api.programItems.delete.method });
      if (!res.ok) throw new Error("Failed to delete program item");
    },
    onSuccess: (_, variables) => queryClient.invalidateQueries({ queryKey: [api.programs.get.path, variables.programId] }),
  });
}
