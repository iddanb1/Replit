import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertAnnouncementSchema, type Announcement, type InsertAnnouncement } from "@shared/schema";
import { useUpdateAnnouncement } from "@/hooks/use-church-data";
import { Edit2 } from "lucide-react";

interface EditAnnouncementDialogProps {
  announcement: Announcement;
}

export function EditAnnouncementDialog({ announcement }: EditAnnouncementDialogProps) {
  const [open, setOpen] = useState(false);
  const updateAnnouncement = useUpdateAnnouncement();

  const { register, handleSubmit, formState: { errors } } = useForm<InsertAnnouncement>({
    resolver: zodResolver(insertAnnouncementSchema),
    defaultValues: {
      title: announcement.title,
      content: announcement.content,
      date: announcement.date ? new Date(announcement.date) : new Date(),
    },
  });

  const onSubmit = (data: InsertAnnouncement) => {
    updateAnnouncement.mutate(
      { id: announcement.id, data },
      { onSuccess: () => setOpen(false) }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" data-testid={`button-edit-announcement-${announcement.id}`}>
          <Edit2 className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Announcement</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input 
              id="title" 
              {...register("title")} 
              placeholder="e.g. Community Picnic" 
              data-testid="input-edit-announcement-title"
            />
            {errors.title && <span className="text-destructive text-xs">{errors.title.message}</span>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Textarea 
              id="content" 
              {...register("content")} 
              placeholder="Announcement details..." 
              rows={4}
              data-testid="input-edit-announcement-content"
            />
            {errors.content && <span className="text-destructive text-xs">{errors.content.message}</span>}
          </div>

          <Button type="submit" className="w-full" disabled={updateAnnouncement.isPending} data-testid="button-save-announcement">
            {updateAnnouncement.isPending ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
