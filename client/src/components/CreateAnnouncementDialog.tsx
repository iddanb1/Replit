import { useState } from "react";
import { useCreateAnnouncement } from "@/hooks/use-church-data";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertAnnouncementSchema, InsertAnnouncement } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export function CreateAnnouncementDialog() {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const createAnnouncement = useCreateAnnouncement();

  const { register, handleSubmit, reset, formState: { errors } } = useForm<InsertAnnouncement>({
    resolver: zodResolver(insertAnnouncementSchema),
  });

  const onSubmit = (data: InsertAnnouncement) => {
    createAnnouncement.mutate(data, {
      onSuccess: () => {
        setOpen(false);
        reset();
        toast({ title: "Announcement posted" });
      },
      onError: () => toast({ title: "Error posting announcement", variant: "destructive" }),
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2"><Plus className="w-4 h-4" /> New Announcement</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Post Announcement</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="title">Headline</Label>
            <Input id="title" {...register("title")} placeholder="Important Update" />
            {errors.title && <span className="text-destructive text-xs">{errors.title.message}</span>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Textarea id="content" {...register("content")} placeholder="Details here..." className="min-h-[100px]" />
            {errors.content && <span className="text-destructive text-xs">{errors.content.message}</span>}
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={createAnnouncement.isPending}>
              {createAnnouncement.isPending ? "Posting..." : "Post Announcement"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
