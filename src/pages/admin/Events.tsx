import { useEffect, useState } from "react";
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import {
  Calendar,
  Clock,
  MapPin,
  Tent,
  Pencil,
  Search,
  ArrowLeft, 
  LayoutGrid,
  ClipboardList,
  AlertTriangle,
  Plus,
} from "lucide-react";
import axios from "axios";

interface Event {
  event_id: string;
  admin_id: string;
  event_name: string;
  date: string;
  location: string;
  description: string;
}

export default function Events() {
  const [events, setEvents] = useState<Event[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const API_URL = import.meta.env.VITE_API_URL || "https://vozfgc1nwa.execute-api.ap-southeast-1.amazonaws.com";

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(`${API_URL}/events`, {
          headers: {
            "Content-Type": "application/json",
          },
        });

        console.log("Fetched events:", response.data);
        if (!Array.isArray(response.data)) {
          throw new Error("Expected array response from /events API");
        }

        setEvents(response.data);
      } catch (err: any) {
        console.error("Error fetching events:", err);
        const message = err.response?.data?.detail || "Failed to fetch events";
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [API_URL]);

  const filteredEvents = events.filter((event) =>
    event.event_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const navigate = useNavigate();

  return (
    <>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
  
      <SignedIn>
        <div className="min-h-screen w-full bg-white text-black flex flex-col">
  
          <div className="w-full flex items-center justify-between px-4 sm:px-10 pt-6">
            <button
              onClick={() => navigate(-1)}
              className="absolute left-5 hover:text-[maroon]/80 text-2xl font-bold mt-3"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-2xl md:text-3xl font-bold text-center flex-1 mt-1 -ml-3">Manage Events</h1>
          </div>
  
          <hr className="w-full border-t border-black-500 mt-4 mb-8" />
  
          <div className="w-full max-w-5xl mx-auto px-4 sm:px-10 pb-32">
            
            <div className="relative w-full max-w-md mb-10 mx-auto">
              <input
                type="text"
                placeholder="Search event name..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSuggestions(true);
                  setSelectedEvent(null);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    setShowSuggestions(false);
                    setSelectedEvent(null);
                  }
                }}
                className="w-full p-3 rounded-full border shadow-md border-black-500 bg-white text-sm focus:outline-none pl-10 pr-8"
              />
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <Search className="w-4 h-4" />
              </span>
  
              {searchQuery.length > 0 && filteredEvents.length > 0 && showSuggestions && (
                <ul className="absolute left-1/2 transform -translate-x-1/2 w-[90%] pointed-lg border border-black-500 bg-white text-sm shadow-md divide-y divide-black-500 z-10">
                  {filteredEvents.slice(0, 5).map((event) => (
                    <li
                      key={event.event_id}
                      className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                      onClick={() => {
                        setSearchQuery(event.event_name);
                        setSelectedEvent(event);
                        setShowSuggestions(false);
                      }}
                    >
                      {event.event_name}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            
            {loading ? (
              <p className="text-gray-500 text-sm text-center">Loading...</p>
            ) : error ? (
              <p className="text-[maroon] text-sm text-center">Error: {error}</p>
            ) : events.length === 0 ? (
              <div className="w-[350px] flex flex-col h-auto text-md text-black overflow-hidden font-semibold bg-white border border-black rounded-lg text-left mx-auto shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-[1.01]">
                
                <div className="w-full flex items-center gap-2 h-[40px] px-4 text-white font-bold bg-[maroon] border-b border-black rounded-t-lg">
                  <span className="text-md truncate">Scheduled Events</span>
                </div>

                <div className="flex flex-col justify-center pl-[50px] pr-[50px] pt-[20px] pb-[10px] text-sm gap-[20px]">
                  <p className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>No Scheduled Events Yet.</span>
                  </p>
                </div>
              </div>

            ) : selectedEvent ? (
              <div className="w-[350px] relative flex flex-col h-auto text-md text-black overflow-hidden font-semibold bg-white border border-black rounded-lg text-left mx-auto shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-[1.01]">
  
                <div className="w-full flex items-center gap-2 h-[40px] px-4 text-white font-bold bg-[maroon] border-b border-black rounded-t-lg">
                  <Calendar className="w-5 h-5" />
                  <span className="text-md truncate">{selectedEvent.event_name}</span>
                </div>

                <div className="flex flex-col justify-center pl-[50px] pr-[50px] pt-[20px] pb-[60px] text-sm gap-[20px]">
                  <p className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{selectedEvent.date}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>{selectedEvent.location}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <Tent className="w-4 h-4" />
                    <span>{selectedEvent.description}</span>
                  </p>
                </div>
                <button 
                  onClick={() => navigate('/admin/events/edit')}
                  className="absolute bottom-4 right-4 flex items-center gap-2 bg-[maroon] text-white px-4 py-2 rounded-md shadow hover:bg-[maroon]/90 transition"
                >
                  <Pencil className="w-4 h-4" />
                  <span>Edit</span>
                </button>
              </div>

            ) : filteredEvents.length === 0 ? (
              <div className="w-[350px] flex flex-col h-auto text-md text-black overflow-hidden font-semibold bg-white border border-black rounded-lg text-left mx-auto shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-[1.01]">
                
                <div className="w-full flex items-center gap-2 h-[40px] px-4 text-white font-bold bg-[maroon] border-b border-black rounded-t-lg">
                  <span className="text-md truncate">Scheduled Events</span>
                </div>

                <div className="flex flex-col justify-center pl-[50px] pr-[50px] pt-[20px] pb-[10px] text-sm gap-[20px]">
                  <p className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>Event Not Found.</span>
                  </p>
                </div>
              </div>

            ) : (
              <div className="w-full max-w-2xl space-y-6 mx-auto">
                {filteredEvents.map((event) => (
                  <div key={event.event_id} className="w-[350px] relative flex flex-col h-auto text-md text-black overflow-hidden font-semibold bg-white border border-black rounded-lg text-left mx-auto shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-[1.01]">
                    
                    <div className="w-full flex items-center gap-2 h-[40px] px-4 text-white font-bold bg-[maroon] border-b border-black rounded-t-lg">
                      <Calendar className="w-5 h-5" />
                      <span className="text-md truncate">{event.event_name}</span>
                    </div>

                    <div className="flex flex-col justify-center pl-[50px] pr-[50px] pt-[20px] pb-[60px] text-sm gap-[20px]">
                      <p className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>{event.date}</span>
                      </p>
                      <p className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>{event.location}</span>
                      </p>
                      <p className="flex items-center gap-2">
                        <Tent className="w-4 h-4" />
                        <span>{event.description}</span>
                      </p>
                    </div>
                    <button 
                      onClick={() => navigate('/admin/events/edit')}
                      className="absolute bottom-4 right-4 flex items-center gap-2 bg-[maroon] text-white px-4 py-2 rounded-md shadow hover:bg-[maroon]/90 transition"
                    >
                      <Pencil className="w-4 h-4" />
                      <span>Edit</span>
                    </button>
                  </div>
                ))}
              </div>
            )}            
          </div>  

          <nav className="fixed bottom-0 left-0 w-full bg-white border-t border-black-500 text-black py-1 z-50">
            <div className="flex justify-around items-center">
              
              <button
                onClick={() => navigate('/admin')}
                className="flex flex-col items-center text-sm hover:text-[maroon]"
              >
                <LayoutGrid className="w-5 h-5" />
                <span className="font-bold text-xs">DASHBOARD</span>
              </button>

              <button
                onClick={() => navigate('/admin/events')}
                className="flex flex-col items-center text-sm text-[maroon]"
              >
                <Calendar className="w-5 h-5" />
                <span className="font-bold text-xs">EVENTS</span>
              </button>

              <button
                onClick={() => navigate('/admin/assign-volunteers')}
                className="flex flex-col items-center text-sm hover:text-[maroon]"
              >
                <ClipboardList className="w-5 h-5" />
                <span className="font-bold text-xs">ASSIGN</span>
              </button>

              <button
                onClick={() => navigate('/admin')}
                className="flex flex-col items-center text-sm hover:text-[maroon]"
              >
                <AlertTriangle className="w-5 h-5" />
                <span className="font-bold text-xs">EMERGENCY</span>
              </button>
            </div>
            
            <div className="fixed bottom-[56px] right-4 z-50 flex flex-col items-center">
              <button
                onClick={() => navigate('/admin/events/create')}
                className="bg-[maroon] text-white w-8 h-8 rounded-full flex items-center justify-center shadow-md hover:bg-[maroon]/90"
              >
                <Plus className="w-4 h-4" />
              </button>
                <span 
                  onClick={() => navigate('/admin/events/create')}
                  className="mt-1 text-[maroon] text-sm font-semibold"
                >
                  Add an Event
                </span>
            </div>
          </nav>
        </div>
      </SignedIn>
    </>
  );
}


