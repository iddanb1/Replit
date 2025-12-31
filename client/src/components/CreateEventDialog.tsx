import { useState } from "react";
import { useCreateEvent } from "@/hooks/use-church-data";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertEventSchema, InsertEvent } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

// Extend schema to accept string for date then coerce
const formSchema = insertEventSchema.extend({
  date: z.string().transform((str) => new Date(str)),
});

type FormData = z.input<typeof formSchema>;

export function CreateEventDialog() {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const createEvent = useCreateEvent();

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = (data: FormData) => {
    createEvent.mutate(data as unknown as InsertEvent, {
      onSuccess: () => {
        setOpen(false);
        reset();
        toast({ title: "Event created successfully" });
      },
      onError: () => {
        toast({ title: "Failed to create event", variant: "destructive" });
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 bg-primary hover:bg-primary/90">
          <Plus className="w-4 h-4" /> Add Event
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Event</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="title">Event Title</Label>
            <Input id="title" {...register("title")} placeholder="e.g. Youth Night" />
            {errors.title && <span className="text-destructive text-xs">{errors.title.message}</span>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="date">Date & Time</Label>
            <Input id="date" type="datetime-local" {...register("date")} />
            {errors.date && <span className="text-destructive text-xs">{errors.date.message}</span>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input id="location" {...register("location")} placeholder="e.g. Main Hall" />
            {errors.location && <span className="text-destructive text-xs">{errors.location.message}</span>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" {...register("description")} placeholder="Event details..." />
            {errors.description && <span className="text-destructive text-xs">{errors.description.message}</span>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="imageUrl">Image URL (Optional)</Label>
            <Input id="imageUrl" {...register("imageUrl")} placeholder="https://..." />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={createEvent.isPending}>
              {createEvent.isPending ? "Creating..." : "Create Event"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
