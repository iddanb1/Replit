import { useEvents, usePrograms } from "@/hooks/use-church-data";
import { format } from "date-fns";
import { MapPin, Calendar as CalendarIcon, Clock, Loader2, Grid, Calendar, BookOpen } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { EventsCalendar } from "@/components/EventsCalendar";
import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";

type GridItem = {
  id: number;
  type: "event" | "program";
  title: string;
  date: Date;
  description?: string | null;
  location?: string;
  imageUrl?: string | null;
  theme?: string | null;
};

export default function Events() {
  const { data: events, isLoading: eventsLoading } = useEvents();
  const { data: programs, isLoading: programsLoading } = usePrograms();
  const [view, setView] = useState<"grid" | "calendar">("grid");
  
  const isLoading = eventsLoading || programsLoading;

  const gridItems: GridItem[] = [
    ...(events?.map(e => ({
      id: e.id,
      type: "event" as const,
      title: e.title,
      date: new Date(e.date),
      description: e.description,
      location: e.location,
      imageUrl: e.imageUrl,
    })) || []),
    ...(programs?.map(p => ({
      id: p.id,
      type: "program" as const,
      title: p.title,
      date: new Date(p.date),
      theme: p.theme,
      imageUrl: p.imageUrl,
    })) || []),
  ].sort((a, b) => a.date.getTime() - b.date.getTime());

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-display font-bold text-primary mb-4">Events & News</h1>
          <p className="text-xl text-muted-foreground max-w-2xl">
            Stay connected with what's happening in our community. From weekly gatherings to special events.
          </p>
        </div>
        
        <div className="flex bg-muted p-1 rounded-lg self-start">
          <Button 
            variant={view === "grid" ? "default" : "ghost"} 
            size="sm" 
            onClick={() => setView("grid")}
            className="gap-2"
            data-testid="button-view-grid"
          >
            <Grid className="w-4 h-4" />
            Grid
          </Button>
          <Button 
            variant={view === "calendar" ? "default" : "ghost"} 
            size="sm" 
            onClick={() => setView("calendar")}
            className="gap-2"
            data-testid="button-view-calendar"
          >
            <Calendar className="w-4 h-4" />
            Calendar
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : view === "calendar" ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <EventsCalendar events={events || []} programs={programs || []} />
        </motion.div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {gridItems.map((item, i) => {
            const content = (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="group bg-white rounded-2xl overflow-hidden border border-border shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full"
              >
                <div className="h-48 bg-muted relative overflow-hidden">
                  {item.imageUrl ? (
                    <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full bg-primary/5 flex items-center justify-center">
                      {item.type === "program" ? (
                        <BookOpen className="w-12 h-12 text-primary/20" />
                      ) : (
                        <CalendarIcon className="w-12 h-12 text-primary/20" />
                      )}
                    </div>
                  )}
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur text-primary font-bold px-3 py-1 rounded-lg shadow-sm text-sm">
                    {format(item.date, "MMM d")}
                  </div>
                  <div className="absolute top-4 left-4">
                    <Badge variant={item.type === "program" ? "default" : "secondary"}>
                      {item.type === "program" ? "Service" : "Event"}
                    </Badge>
                  </div>
                </div>

                <div className="p-6 flex-grow flex flex-col">
                  <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">{item.title}</h3>
                  
                  <div className="space-y-2 mb-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-accent" />
                      <span>{format(item.date, "EEEE • h:mm a")}</span>
                    </div>
                    {item.type === "event" && item.location && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-accent" />
                        <span>{item.location}</span>
                      </div>
                    )}
                    {item.type === "program" && item.theme && (
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-accent" />
                        <span className="italic">"{item.theme}"</span>
                      </div>
                    )}
                  </div>

                  {item.type === "event" && item.description && (
                    <p className="text-muted-foreground text-sm line-clamp-3 mb-4 flex-grow">
                      {item.description}
                    </p>
                  )}
                </div>
              </motion.div>
            );

            return item.type === "program" ? (
              <Link key={`program-${item.id}`} href={`/programs/${item.id}`} className="block">
                {content}
              </Link>
            ) : (
              <div key={`event-${item.id}`}>{content}</div>
            );
          })}

          {gridItems.length === 0 && (
            <div className="col-span-full text-center py-16 bg-muted/30 rounded-2xl">
              <p className="text-muted-foreground text-lg">No upcoming events or programs at this time.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
