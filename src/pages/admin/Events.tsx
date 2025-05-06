import { useEffect, useState } from "react";
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react";

// Define a type for the event (adjust based on your actual API shape)
type Event = {
  id: string;
  name: string;
  date?: string;
};

export default function Events() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch events on component load
    const fetchEvents = async () => {
      try {
        const response = await fetch("http://localhost:8000/events"); // or your actual backend URL
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setEvents(data); // Assumes the API returns an array of events
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return (
    <>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>

      <SignedIn>
        <div>
          <h1>Admin Events</h1>

          {isLoading && <p>Loading events...</p>}
          {error && <p>Error: {error}</p>}
          {!isLoading && events.length === 0 && <p>No events found.</p>}

          <ul>
            {events.map((event) => (
              <li key={event.id}>
                {event.name} {event.date && `- ${event.date}`}
              </li>
            ))}
          </ul>
        </div>
      </SignedIn>
    </>
  );
}


