import { useEffect, useState } from "react";
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react";
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

  return (
    <>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>

      <SignedIn>
        <div className="p-4 text-black bg-white min-h-screen">
          <h1 className="text-2xl font-bold mb-4">Manage Events</h1>

          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p className="text-red-500">Error: {error}</p>
          ) : events.length === 0 ? (
            <p>No Scheduled Events Yet.</p>
          ) : (
            <div className="space-y-4">
              {events.map((event) => (
                <div
                  key={event.event_id}
                  className="p-4 border border-gray-300 rounded-lg shadow-md"
                >
                  <h2 className="text-lg font-semibold">{event.event_name}</h2>
                  <p>Date: {event.date}</p>
                  <p>Location: {event.location}</p>
                  <p>{event.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </SignedIn>
    </>
  );
}


