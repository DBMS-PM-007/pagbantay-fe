import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { CalendarClock, ChevronRight } from "lucide-react";

interface Event {
  event_id: string;
  admin_id: string;
  event_name: string;
  date: string;
  location: string;
  description: string;
}

export default function Dashboard() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const API_URL = import.meta.env.VITE_API_URL;

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

  const navigate = useNavigate();

  return (
    <>
      <div className="min-h-screen w-full bg-white text-black flex flex-col">
        <div className="w-full mx-auto px-4 sm:px-10 pb-[100px] pt-[100px]">
          {loading ? (
            <p className="text-gray-500 text-sm text-center">Loading...</p>
          ) : error ? (
            <p className="text-[maroon] text-sm text-center">Error: {error}</p>
          ) : events.length === 0 ? (
            <div className="w-full max-w-2xl mx-auto">
              <div className="w-[350px] flex flex-col text-md text-black overflow-hidden font-semibold bg-[lightgray] border border-black rounded-lg text-left mx-auto shadow-md">
                <div className="w-full flex items-center gap-2 h-[40px] px-4 text-white font-bold bg-[maroon] border-b border-black rounded-t-lg">
                  <span className="text-md">Upcoming Events</span>
                </div>

                <div className="flex flex-col last:border-none px-[10px] pt-[10px] pb-[20px]">
                  <p className="flex items-start gap-3">
                    <CalendarClock className="w-5 h-5 flex-shrink-0" />
                    <span className="text-sm whitespace-pre-line">
                      {`No events scheduled.\nCome back soon!`}
                    </span>
                  </p>
                </div>
              </div>
            </div>

          ) : (
            <div className="w-full max-w-2xl mx-auto">
              <div className="w-[350px] flex flex-col text-md text-black overflow-hidden font-semibold bg-white border border-black rounded-lg text-left mx-auto shadow-md">
                <div className="w-full flex items-center gap-2 h-[40px] px-4 text-white font-bold bg-[maroon] border-b border-black rounded-t-lg">
                  <span className="text-md">Upcoming Events</span>
                </div>

                <div className="flex flex-col justify-center px-[10px] pt-[10px] pb-[20px] gap-4">
                  {events.map((event) => (
                    <div key={event.event_id} className="flex flex-col last:border-none pb-2">
                      <p className="flex items-start gap-3">
                        <CalendarClock className="w-5 h-5 flex-shrink-0" />
                        <span className="text-sm break-words">{event.event_name}</span>
                      </p>
                      <p className="flex items-start gap-2 ml-8">
                        <span className="text-xs break-words font-normal">{event.date}</span>
                      </p>
                      <div className="flex items-center justify-between ml-8">
                        <span className="text-xs break-words font-normal">{event.location}</span>
                        <button
                          onClick={() => navigate('/volunteer/events')}
                          className="text-black hover:cursor-pointer"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}


