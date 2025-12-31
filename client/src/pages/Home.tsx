import { useEvents, useAnnouncements, usePrograms } from "@/hooks/use-church-data";
import { ProgramCard } from "@/components/ProgramCard";
import { format } from "date-fns";
import { ArrowRight, Bell, Calendar } from "lucide-react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function Home() {
  const { data: programs, isLoading: programsLoading } = usePrograms();
  const { data: events, isLoading: eventsLoading } = useEvents();
  const { data: announcements, isLoading: announcementsLoading } = useAnnouncements();

  // Sort to find next upcoming program
  const upcomingProgram = programs
    ?.filter(p => new Date(p.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0] 
    // Fallback to most recent if no upcoming
    || programs?.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];

  const recentAnnouncements = announcements?.sort((a, b) => 
    new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime()
  ).slice(0, 3);

  const upcomingEvents = events
    ?.filter(e => new Date(e.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3);

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative bg-primary text-primary-foreground py-20 lg:py-32 overflow-hidden">
        {/* Abstract shapes background */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-white/5 rounded-l-full blur-3xl transform translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-1/3 h-2/3 bg-accent/20 rounded-r-full blur-3xl transform -translate-x-1/4" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-display text-5xl md:text-7xl font-bold mb-6 leading-tight"
            >
              Welcome to<br/>
              <span className="text-secondary">Maranatha SDA.</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-lg md:text-xl text-primary-foreground/80 mb-8 max-w-xl font-light"
            >
              Join us for worship, fellowship, and growth. We are a community dedicated to loving God and loving people.
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-wrap gap-4"
            >
              <Link href="/programs">
                <button className="px-8 py-4 bg-white text-primary font-bold rounded-full hover:bg-secondary transition-colors shadow-lg shadow-black/10">
                  View Service Times
                </button>
              </Link>
              <Link href="/events">
                <button className="px-8 py-4 bg-transparent border-2 border-white/20 text-white font-semibold rounded-full hover:bg-white/10 transition-colors">
                  Upcoming Events
                </button>
              </Link>
              <a href="https://maranathasdabrooklyn.org/" target="_blank" rel="noopener noreferrer">
                <button className="px-8 py-4 bg-transparent border-2 border-white/20 text-white font-semibold rounded-full hover:bg-white/10 transition-colors" data-testid="button-church-website">
                  Church Website
                </button>
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 space-y-16">
        {/* Next Service Section */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-display font-bold text-primary">Next Service</h2>
            <Link href="/programs" className="text-primary hover:text-accent transition-colors flex items-center gap-2 font-medium">
              All Programs <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          {programsLoading ? (
            <div className="h-64 bg-muted rounded-2xl animate-pulse" />
          ) : upcomingProgram ? (
            <ProgramCard program={upcomingProgram} featured={true} />
          ) : (
            <div className="p-8 border border-dashed rounded-xl text-center text-muted-foreground">
              No upcoming services scheduled.
            </div>
          )}
        </section>

        {/* Announcements Grid */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <Bell className="w-6 h-6 text-accent" />
            <h2 className="text-3xl font-display font-bold text-primary">Announcements</h2>
          </div>
          
          {announcementsLoading ? (
            <div className="grid md:grid-cols-3 gap-6">
              {[1,2,3].map(i => <div key={i} className="h-48 bg-muted rounded-xl animate-pulse" />)}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentAnnouncements?.map((announcement) => (
                <div key={announcement.id} className="bg-white p-6 rounded-xl border border-border shadow-sm hover:shadow-md transition-shadow">
                  <span className="text-xs font-bold text-accent uppercase tracking-wider">
                    {format(new Date(announcement.date || new Date()), "MMM d, yyyy")}
                  </span>
                  <h3 className="text-xl font-bold mt-2 mb-3 text-foreground">{announcement.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed line-clamp-4">
                    {announcement.content}
                  </p>
                </div>
              ))}
              {(!recentAnnouncements || recentAnnouncements.length === 0) && (
                <p className="col-span-3 text-muted-foreground">No recent announcements.</p>
              )}
            </div>
          )}
        </section>

        {/* Upcoming Events */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <Calendar className="w-6 h-6 text-accent" />
            <h2 className="text-3xl font-display font-bold text-primary">Upcoming Events</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {eventsLoading ? (
               <div className="col-span-2 h-48 bg-muted rounded-xl animate-pulse" />
            ) : upcomingEvents?.map((event) => (
              <div key={event.id} className="flex gap-6 group">
                <div className="hidden sm:flex flex-col items-center justify-center w-20 h-20 bg-primary/5 rounded-2xl text-primary shrink-0">
                  <span className="text-xs font-bold uppercase">{format(new Date(event.date), "MMM")}</span>
                  <span className="text-2xl font-display font-bold">{format(new Date(event.date), "d")}</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold group-hover:text-primary transition-colors">{event.title}</h3>
                  <p className="text-sm text-accent font-medium mt-1 mb-2">
                    {format(new Date(event.date), "EEEE, h:mm a")} • {event.location}
                  </p>
                  <p className="text-muted-foreground text-sm line-clamp-2">{event.description}</p>
                </div>
              </div>
            ))}
             {(!upcomingEvents || upcomingEvents.length === 0) && (
                <p className="col-span-2 text-muted-foreground">No upcoming events found.</p>
              )}
          </div>
          
          <div className="mt-8 text-center">
            <Link href="/events">
               <Button variant="outline" className="rounded-full px-8">View All Events</Button>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
