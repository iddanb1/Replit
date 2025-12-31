import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertEventSchema, type Event, type InsertEvent } from "@shared/schema";
import { useUpdateEvent } from "@/hooks/use-church-data";
import { Edit2, Upload, Link, X } from "lucide-react";
import { format } from "date-fns";

interface EditEventDialogProps {
  event: Event;
}

export function EditEventDialog({ event }: EditEventDialogProps) {
  const [open, setOpen] = useState(false);
  const [imageMode, setImageMode] = useState<"url" | "upload">("url");
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const updateEvent = useUpdateEvent();

  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<InsertEvent>({
    resolver: zodResolver(insertEventSchema),
    defaultValues: {
      title: event.title,
      description: event.description,
      date: new Date(event.date),
      location: event.location,
      imageUrl: event.imageUrl || "",
    },
  });

  const currentImageUrl = watch("imageUrl");

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch("/api/upload/image", {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      
      if (res.ok) {
        const data = await res.json();
        setUploadedUrl(data.imageUrl);
        setValue("imageUrl", data.imageUrl);
      }
    } catch (err) {
      console.error("Upload failed:", err);
    } finally {
      setUploading(false);
    }
  };

  const clearImage = () => {
    setValue("imageUrl", "");
    setUploadedUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const onSubmit = (data: InsertEvent) => {
    updateEvent.mutate(
      { id: event.id, data },
      { onSuccess: () => setOpen(false) }
    );
  };

  const displayImage = uploadedUrl || currentImageUrl;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" data-testid={`button-edit-event-${event.id}`}>
          <Edit2 className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Event</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input 
              id="title" 
              {...register("title")} 
              placeholder="e.g. Christmas Eve Service" 
              data-testid="input-edit-event-title"
            />
            {errors.title && <span className="text-destructive text-xs">{errors.title.message}</span>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea 
              id="description" 
              {...register("description")} 
              placeholder="Describe the event..." 
              data-testid="input-edit-event-description"
            />
            {errors.description && <span className="text-destructive text-xs">{errors.description.message}</span>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Date & Time</Label>
            <Input 
              id="date" 
              type="datetime-local" 
              {...register("date", { 
                setValueAs: (v) => v ? new Date(v) : undefined 
              })} 
              defaultValue={format(new Date(event.date), "yyyy-MM-dd'T'HH:mm")}
              data-testid="input-edit-event-date"
            />
            {errors.date && <span className="text-destructive text-xs">{errors.date.message}</span>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input 
              id="location" 
              {...register("location")} 
              placeholder="e.g. Main Sanctuary" 
              data-testid="input-edit-event-location"
            />
            {errors.location && <span className="text-destructive text-xs">{errors.location.message}</span>}
          </div>

          <div className="space-y-2">
            <Label>Image (Optional)</Label>
            <div className="flex gap-2 mb-2">
              <Button
                type="button"
                variant={imageMode === "url" ? "default" : "outline"}
                size="sm"
                onClick={() => setImageMode("url")}
                className="gap-1"
                data-testid="button-event-image-url"
              >
                <Link className="w-3 h-3" /> URL
              </Button>
              <Button
                type="button"
                variant={imageMode === "upload" ? "default" : "outline"}
                size="sm"
                onClick={() => setImageMode("upload")}
                className="gap-1"
                data-testid="button-event-image-upload"
              >
                <Upload className="w-3 h-3" /> Upload
              </Button>
            </div>
            
            {imageMode === "url" ? (
              <Input 
                {...register("imageUrl")} 
                placeholder="https://example.com/image.jpg" 
                data-testid="input-edit-event-image"
              />
            ) : (
              <Input 
                ref={fileInputRef}
                type="file" 
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={handleFileUpload}
                disabled={uploading}
                data-testid="input-edit-event-file"
              />
            )}
            
            {uploading && <p className="text-sm text-muted-foreground">Uploading...</p>}
            
            {displayImage && (
              <div className="relative mt-2">
                <img 
                  src={displayImage} 
                  alt="Preview" 
                  className="w-full h-32 object-cover rounded-md"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-1 right-1 h-6 w-6"
                  onClick={clearImage}
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={updateEvent.isPending || uploading} data-testid="button-save-event">
            {updateEvent.isPending ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
