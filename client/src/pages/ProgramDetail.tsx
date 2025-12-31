import { useProgram } from "@/hooks/use-church-data";
import { useRoute } from "wouter";
import { format } from "date-fns";
import { Loader2, Calendar, Clock, ArrowLeft, User, Music, Mic } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function ProgramDetail() {
  const [match, params] = useRoute("/programs/:id");
  const id = parseInt(params?.id || "0");
  const { data: program, isLoading } = useProgram(id);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!program) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Program Not Found</h1>
        <Link href="/programs"><Button>Return to Programs</Button></Link>
      </div>
    );
  }

  const sortedItems = [...(program.items || [])].sort((a, b) => {
    const timeA = a.time || "";
    const timeB = b.time || "";
    return timeA.localeCompare(timeB);
  });

  return (
    <div className="bg-muted/30 min-h-screen pb-16">
      {/* Header */}
      <div className="bg-white border-b border-border shadow-sm">
        <div className="container mx-auto px-4 py-8 md:py-12">
          <Link href="/programs" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to Programs
          </Link>
          
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-primary/5 text-primary px-3 py-1 rounded-full text-sm font-semibold mb-4">
              <Calendar className="w-4 h-4" />
              {format(new Date(program.date), "MMMM do, yyyy")}
            </div>
            
            <h1 className="text-4xl md:text-5xl font-display font-bold text-primary mb-4">{program.title}</h1>
            
            {program.theme && (
              <p className="text-xl md:text-2xl text-muted-foreground italic font-light">"{program.theme}"</p>
            )}
            
            <div className="mt-6 flex justify-center text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" /> Starts at {format(new Date(program.date), "h:mm a")}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Program Items List */}
      <div className="container mx-auto px-4 -mt-6">
        <div className="max-w-2xl mx-auto space-y-4">
          {sortedItems.map((item, index) => (
            <div 
              key={item.id} 
              className="bg-white rounded-xl p-6 shadow-sm border border-border/50 hover:shadow-md transition-shadow relative overflow-hidden group"
            >
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary/20 group-hover:bg-primary transition-colors" />
              
              <div className="flex gap-4">
                <div className="flex-none w-16 pt-1 text-right">
                  <span className="text-sm font-mono text-muted-foreground block">{item.time || "—"}</span>
                </div>
                
                <div className="flex-grow">
                  <h3 className="text-lg font-bold text-foreground mb-1">{item.title}</h3>
                  {item.description && (
                    <p className="text-muted-foreground text-sm mb-2">{item.description}</p>
                  )}
                  {item.presenter && (
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-accent uppercase tracking-wide">
                      <User className="w-3 h-3" /> {item.presenter}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {sortedItems.length === 0 && (
            <div className="text-center py-12 bg-white rounded-xl border border-dashed">
              <p className="text-muted-foreground">The order of service hasn't been added yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
