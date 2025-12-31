import { usePrograms } from "@/hooks/use-church-data";
import { ProgramCard } from "@/components/ProgramCard";
import { Loader2 } from "lucide-react";

export default function Programs() {
  const { data: programs, isLoading } = usePrograms();

  const sortedPrograms = programs?.sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-display font-bold text-primary mb-2">Service Programs</h1>
        <p className="text-muted-foreground mb-12 text-lg">
          Browse orders of service for upcoming and past gatherings.
        </p>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="space-y-6">
            {sortedPrograms?.map((program) => (
              <ProgramCard key={program.id} program={program} />
            ))}
            {sortedPrograms?.length === 0 && (
              <div className="text-center py-12 bg-muted/30 rounded-2xl">
                <p className="text-muted-foreground">No programs found.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
