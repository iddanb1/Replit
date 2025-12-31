import { useState } from "react";
import { useCreateProgram } from "@/hooks/use-church-data";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertProgramSchema, InsertServiceProgram } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

const formSchema = insertProgramSchema.extend({
  date: z.string().transform((str) => new Date(str)),
});

type FormData = z.input<typeof formSchema>;

export function CreateProgramDialog() {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const createProgram = useCreateProgram();

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = (data: FormData) => {
    createProgram.mutate(data as unknown as InsertServiceProgram, {
      onSuccess: () => {
        setOpen(false);
        reset();
        toast({ title: "Program created" });
      },
      onError: () => toast({ title: "Error creating program", variant: "destructive" }),
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2"><Plus className="w-4 h-4" /> New Program</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Service Program</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" {...register("title")} placeholder="Sunday Service" />
            {errors.title && <span className="text-destructive text-xs">{errors.title.message}</span>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Service Date</Label>
            <Input id="date" type="datetime-local" {...register("date")} />
            {errors.date && <span className="text-destructive text-xs">{errors.date.message}</span>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="theme">Theme (Optional)</Label>
            <Input id="theme" {...register("theme")} placeholder="e.g. The Season of Giving" />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={createProgram.isPending}>
              {createProgram.isPending ? "Creating..." : "Create Program"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
