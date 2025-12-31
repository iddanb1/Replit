import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useEvents, useAnnouncements, usePrograms, useDeleteEvent, useDeleteAnnouncement, useDeleteProgram } from "@/hooks/use-church-data";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { format } from "date-fns";
import { Trash2, Edit2, Plus, Calendar, Megaphone, ScrollText, LogOut } from "lucide-react";
import { CreateEventDialog } from "@/components/CreateEventDialog";
import { CreateProgramDialog } from "@/components/CreateProgramDialog";
import { CreateAnnouncementDialog } from "@/components/CreateAnnouncementDialog";
import { EditProgramDialog } from "@/components/EditProgramDialog";
import { EditEventDialog } from "@/components/EditEventDialog";
import { EditAnnouncementDialog } from "@/components/EditAnnouncementDialog";
import { Link } from "wouter";

export default function Admin() {
  const [, navigate] = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Always call all hooks at the top
  const { data: events } = useEvents();
  const { data: announcements } = useAnnouncements();
  const { data: programs } = usePrograms();
  
  const deleteEvent = useDeleteEvent();
  const deleteAnnouncement = useDeleteAnnouncement();
  const deleteProgram = useDeleteProgram();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const res = await fetch("/api/admin/check", { credentials: "include" });
      setIsAuthenticated(res.ok);
      if (!res.ok) {
        navigate("/admin-login");
      }
    } catch {
      setIsAuthenticated(false);
      navigate("/admin-login");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST", credentials: "include" });
      navigate("/admin-login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  if (isLoading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-primary">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage service content, events, and announcements.</p>
        </div>
        <Button 
          variant="ghost" 
          onClick={handleLogout}
          data-testid="button-admin-logout"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </div>

      <Tabs defaultValue="programs" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="programs" className="gap-2"><ScrollText className="w-4 h-4"/> Programs</TabsTrigger>
          <TabsTrigger value="events" className="gap-2"><Calendar className="w-4 h-4"/> Events</TabsTrigger>
          <TabsTrigger value="announcements" className="gap-2"><Megaphone className="w-4 h-4"/> Announcements</TabsTrigger>
        </TabsList>

        {/* PROGRAMS TAB */}
        <TabsContent value="programs">
          <div className="flex justify-end mb-4">
            <CreateProgramDialog />
          </div>
          <div className="space-y-4">
            {programs?.map((program) => (
              <div key={program.id} className="flex items-center justify-between p-4 bg-white rounded-xl border shadow-sm">
                <div>
                  <h3 className="font-bold">{program.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(program.date), "PPP p")} • {program.theme || "No Theme"}
                  </p>
                </div>
                <div className="flex gap-2">
                  <EditProgramDialog program={program} />
                  <Link href={`/admin/programs/${program.id}`}>
                    <Button variant="outline" size="sm" data-testid={`button-edit-items-${program.id}`}>Edit Items</Button>
                  </Link>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="text-destructive hover:bg-destructive/10"
                    onClick={() => {
                      if(confirm("Delete this program?")) deleteProgram.mutate(program.id);
                    }}
                    data-testid={`button-delete-program-${program.id}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        {/* EVENTS TAB */}
        <TabsContent value="events">
          <div className="flex justify-end mb-4">
            <CreateEventDialog />
          </div>
          <div className="space-y-4">
            {events?.map((event) => (
              <div key={event.id} className="flex items-center justify-between p-4 bg-white rounded-xl border shadow-sm">
                <div>
                  <h3 className="font-bold">{event.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(event.date), "PPP p")} • {event.location}
                  </p>
                </div>
                <div className="flex gap-2">
                  <EditEventDialog event={event} />
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="text-destructive hover:bg-destructive/10"
                    onClick={() => {
                      if(confirm("Delete this event?")) deleteEvent.mutate(event.id);
                    }}
                    data-testid={`button-delete-event-${event.id}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        {/* ANNOUNCEMENTS TAB */}
        <TabsContent value="announcements">
           <div className="flex justify-end mb-4">
            <CreateAnnouncementDialog />
          </div>
          <div className="space-y-4">
            {announcements?.map((ann) => (
              <div key={ann.id} className="flex items-center justify-between p-4 bg-white rounded-xl border shadow-sm">
                <div className="max-w-2xl">
                  <h3 className="font-bold">{ann.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-1">{ann.content}</p>
                </div>
                <div className="flex gap-2">
                  <EditAnnouncementDialog announcement={ann} />
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="text-destructive hover:bg-destructive/10"
                    onClick={() => {
                      if(confirm("Delete this announcement?")) deleteAnnouncement.mutate(ann.id);
                    }}
                    data-testid={`button-delete-announcement-${ann.id}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
