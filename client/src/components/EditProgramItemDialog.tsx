import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertProgramItemSchema, type ProgramItem, type InsertProgramItem } from "@shared/schema";
import { useUpdateProgramItem } from "@/hooks/use-church-data";
import { Edit2 } from "lucide-react";
import { TimeSelect } from "@/components/TimeSelect";

interface EditProgramItemDialogProps {
  item: ProgramItem;
  programId: number;
}

export function EditProgramItemDialog({ item, programId }: EditProgramItemDialogProps) {
  const [open, setOpen] = useState(false);
  const updateItem = useUpdateProgramItem();

  const { register, handleSubmit, control, formState: { errors } } = useForm<InsertProgramItem>({
    resolver: zodResolver(insertProgramItemSchema),
    defaultValues: {
      programId: item.programId,
      title: item.title,
      presenter: item.presenter || "",
      time: item.time || "",
      description: item.description || "",
      order: item.order,
    },
  });

  const onSubmit = (data: InsertProgramItem) => {
    updateItem.mutate(
      { itemId: item.id, programId, data },
      { onSuccess: () => setOpen(false) }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" data-testid={`button-edit-item-${item.id}`}>
          <Edit2 className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Program Item</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input 
              id="title" 
              {...register("title")} 
              placeholder="e.g. Opening Prayer" 
              data-testid="input-edit-item-title"
            />
            {errors.title && <span className="text-destructive text-xs">{errors.title.message}</span>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="presenter">Presenter (Optional)</Label>
            <Input 
              id="presenter" 
              {...register("presenter")} 
              placeholder="e.g. Pastor John" 
              data-testid="input-edit-item-presenter"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="time">Time (Optional)</Label>
            <Controller
              name="time"
              control={control}
              render={({ field }) => (
                <TimeSelect
                  value={field.value || ""}
                  onChange={field.onChange}
                  data-testid="select-edit-item-time"
                />
              )}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Input 
              id="description" 
              {...register("description")} 
              placeholder="Notes..." 
              data-testid="input-edit-item-description"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="order">Order</Label>
            <Input 
              id="order" 
              type="number"
              {...register("order", { valueAsNumber: true })} 
              data-testid="input-edit-item-order"
            />
            {errors.order && <span className="text-destructive text-xs">{errors.order.message}</span>}
          </div>

          <Button type="submit" className="w-full" disabled={updateItem.isPending} data-testid="button-save-item">
            {updateItem.isPending ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
