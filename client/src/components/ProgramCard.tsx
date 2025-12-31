import { ServiceProgram, ProgramItem } from "@shared/schema";
import { format } from "date-fns";
import { Calendar, Clock, User, ChevronRight } from "lucide-react";
import { Link } from "wouter";
import { motion } from "framer-motion";

interface ProgramCardProps {
  program: ServiceProgram & { items?: ProgramItem[] };
  featured?: boolean;
}

export function ProgramCard({ program, featured = false }: ProgramCardProps) {
  return (
    <Link href={`/programs/${program.id}`}>
      <motion.div 
        whileHover={{ y: -4 }}
        className={`group cursor-pointer relative overflow-hidden rounded-2xl border transition-all duration-300
          ${featured 
            ? "bg-gradient-to-br from-primary to-primary/90 text-primary-foreground border-transparent shadow-xl" 
            : "bg-card hover:border-primary/30 hover:shadow-lg border-border"
          }
        `}
      >
        <div className="p-6 md:p-8">
          <div className="flex flex-col h-full justify-between gap-6">
            <div>
              <div className={`flex items-center gap-2 text-sm font-medium mb-3
                ${featured ? "text-primary-foreground/80" : "text-muted-foreground"}
              `}>
                <Calendar className="w-4 h-4" />
                <span>{format(new Date(program.date), "EEEE, MMMM do, yyyy")}</span>
                <span className="mx-1">•</span>
                <Clock className="w-4 h-4" />
                <span>{format(new Date(program.date), "h:mm a")}</span>
              </div>
              
              <h3 className={`font-display font-bold text-2xl mb-2 
                ${featured ? "text-white" : "text-foreground group-hover:text-primary transition-colors"}
              `}>
                {program.title}
              </h3>
              
              {program.theme && (
                <p className={`text-lg italic 
                  ${featured ? "text-primary-foreground/90" : "text-muted-foreground"}
                `}>
                  "{program.theme}"
                </p>
              )}
            </div>

            <div className="flex items-center justify-between mt-2">
              <span className={`text-sm font-semibold flex items-center gap-1
                 ${featured ? "text-white" : "text-primary"}
              `}>
                View Order of Service <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </div>
          </div>
        </div>
        
        {/* Decorational circle for visual interest */}
        <div className={`absolute -bottom-12 -right-12 w-48 h-48 rounded-full opacity-10 blur-3xl 
          ${featured ? "bg-white" : "bg-primary"}
        `} />
      </motion.div>
    </Link>
  );
}
