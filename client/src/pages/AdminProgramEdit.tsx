import { useProgram, useCreateProgramItem, useDeleteProgramItem } from "@/hooks/use-church-data";
import { useRoute, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ArrowLeft, Trash2, GripVertical, Loader2 } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertProgramItemSchema, InsertProgramItem } from "@shared/schema";
import { EditProgramItemDialog } from "@/components/EditProgramItemDialog";
import { TimeSelect } from "@/components/TimeSelect";
import { formatTime } from "@/lib/time-utils";

export default function AdminProgramEdit() {
  const [match, params] = useRoute("/admin/programs/:id");
  const id = parseInt(params?.id || "0");
  const { data: program, isLoading } = useProgram(id);
  const createItem = useCreateProgramItem();
  const deleteItem = useDeleteProgramItem();

  const { register, handleSubmit, reset, control, formState: { errors } } = useForm<InsertProgramItem>({
    resolver: zodResolver(insertProgramItemSchema),
    defaultValues: {
      programId: id,
      order: 0,
      time: "",
    }
  });

  if (isLoading) return <div className="p-8 flex justify-center"><Loader2 className="animate-spin" /></div>;
  if (!program) return <div className="p-8">Program not found</div>;

  const nextOrder = (program.items?.length || 0) + 1;

  const onSubmit = (data: InsertProgramItem) => {
    createItem.mutate({
      programId: id,
      data: { ...data, programId: id, order: nextOrder }
    }, {
      onSuccess: () => reset()
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/admin">
        <Button variant="ghost" className="mb-6 gap-2"><ArrowLeft className="w-4 h-4" /> Back to Admin</Button>
      </Link>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left: Program Info & Add Item */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Program Details</CardTitle>
            </CardHeader>
            <CardContent>
              <h2 className="text-xl font-bold">{program.title}</h2>
              <p className="text-muted-foreground">{program.theme}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Add Item</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input {...register("title")} placeholder="e.g. Opening Prayer" />
                  {errors.title && <span className="text-destructive text-xs">{errors.title.message}</span>}
                </div>
                <div className="space-y-2">
                  <Label>Presenter (Optional)</Label>
                  <Input {...register("presenter")} placeholder="e.g. Pastor John" />
                </div>
                <div className="space-y-2">
                  <Label>Time (Optional)</Label>
                  <Controller
                    name="time"
                    control={control}
                    render={({ field }) => (
                      <TimeSelect
                        value={field.value || ""}
                        onChange={field.onChange}
                        data-testid="select-item-time"
                      />
                    )}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Description (Optional)</Label>
                  <Input {...register("description")} placeholder="Notes..." />
                </div>
                <Button type="submit" className="w-full" disabled={createItem.isPending}>
                  {createItem.isPending ? "Adding..." : "Add Item"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Right: Items List */}
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-bold mb-4">Order of Service</h2>
          <div className="space-y-3">
            {program.items?.sort((a, b) => (a.time || "").localeCompare(b.time || "")).map((item) => (
              <div key={item.id} className="bg-white p-4 rounded-xl border flex items-center gap-4 group hover:shadow-md transition-all">
                <div className="text-muted-foreground"><GripVertical className="w-5 h-5" /></div>
                <div className="flex-grow">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold">{item.title}</h3>
                    <span className="text-xs font-mono bg-muted px-2 py-1 rounded">{formatTime(item.time)}</span>
                  </div>
                  {item.presenter && <p className="text-sm text-accent font-medium">{item.presenter}</p>}
                  {item.description && <p className="text-sm text-muted-foreground">{item.description}</p>}
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100">
                  <EditProgramItemDialog item={item} programId={id} />
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-destructive hover:bg-destructive/10"
                    onClick={() => deleteItem.mutate({ itemId: item.id, programId: id })}
                    data-testid={`button-delete-item-${item.id}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
            {(!program.items || program.items.length === 0) && (
              <div className="text-center py-12 border border-dashed rounded-xl text-muted-foreground">
                No items added yet. Use the form to add items.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
