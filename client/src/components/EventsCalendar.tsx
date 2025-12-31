import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { events, servicePrograms } from "@shared/schema";
import { isSameDay } from "date-fns";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { MapPin, Clock, BookOpen } from "lucide-react";
import { Link } from "wouter";

interface EventsCalendarProps {
  events: (typeof events.$inferSelect)[];
  programs: (typeof servicePrograms.$inferSelect)[];
}

export function EventsCalendar({ events, programs }: EventsCalendarProps) {
  const [date, setDate] = useState<Date | undefined>(new Date());

  const selectedDayEvents = events.filter((event) => 
    date && isSameDay(new Date(event.date), date)
  );

  const selectedDayPrograms = programs.filter((program) =>
    date && isSameDay(new Date(program.date), date)
  );

  const eventDates = events.map(e => new Date(e.date));
  const programDates = programs.map(p => new Date(p.date));
  const allDates = [...eventDates, ...programDates];

  const hasItems = selectedDayEvents.length > 0 || selectedDayPrograms.length > 0;

  return (
    <div className="grid md:grid-cols-2 gap-8 items-start">
      <Card className="p-4">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="rounded-md border shadow-none w-full"
          classNames={{
            day_selected: "border-2 border-primary bg-transparent text-primary hover:bg-primary/10 focus:bg-primary/10"
          }}
          modifiers={{
            hasEvent: allDates
          }}
          modifiersStyles={{
            hasEvent: { 
              fontWeight: 'bold',
              textDecoration: 'underline',
              color: 'hsl(var(--primary))'
            }
          }}
        />
      </Card>

      <div className="space-y-4">
        <h3 className="font-display text-xl font-bold">
          {date ? format(date, "MMMM d, yyyy") : "Select a date"}
        </h3>
        {!hasItems ? (
          <p className="text-muted-foreground">No events or programs scheduled for this day.</p>
        ) : (
          <>
            {selectedDayPrograms.map((program) => (
              <Link key={`program-${program.id}`} href={`/programs/${program.id}`}>
                <Card className="hover-elevate cursor-pointer">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start gap-4">
                      <CardTitle className="text-lg">{program.title}</CardTitle>
                      <Badge variant="default">Service</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>{format(new Date(program.date), "p")}</span>
                      </div>
                      {program.theme && (
                        <div className="flex items-center gap-2">
                          <BookOpen className="w-4 h-4" />
                          <span>{program.theme}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
            {selectedDayEvents.map((event) => (
              <Card key={`event-${event.id}`} className="hover-elevate">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start gap-4">
                    <CardTitle className="text-lg">{event.title}</CardTitle>
                    <Badge variant="secondary">Event</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>{format(new Date(event.date), "p")}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>{event.location}</span>
                    </div>
                    <p className="mt-2 text-foreground">{event.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
