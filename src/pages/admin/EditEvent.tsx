import { useEffect, useState } from "react";
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react";
import { useNavigate, useParams } from "react-router-dom";
import { Calendar, MapPin, ClipboardList, Save, Loader } from 'lucide-react';
import axios from "axios";

interface Event {
  event_id: string;
  admin_id: string;
  event_name: string;
  date: string;
  location: string;
  description: string;
}

export default function EditEvent() {
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const { id: eventId } = useParams<{ id: string }>();

  useEffect(() => {
    if (!eventId) {
      setError("Missing event ID.");
      setLoading(false);
      return;
    }

    const fetchEvent = async () => {
      try {
        const response = await axios.get(`${API_URL}/events/${eventId}`, {
          headers: {
            "Content-Type": "application/json",
          },
        });

        console.log("Fetched event:", response.data);
        setEvent(response.data);
      } catch (err: any) {
        console.error("Error fetching event:", err);
        const message = err.response?.data?.detail || "Failed to fetch event data";
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [API_URL, eventId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!event) return;
    const { name, value } = e.target;
    setEvent({ ...event, [name]: value });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!event || !eventId) return;

    setSaving(true);
    setError("");
    setSuccessMessage("");

    try {
      const updatePayload = {
        event_name: event.event_name,
        description: event.description,
        location: event.location,
        date: event.date
      };

      console.log("Sending updated event:", updatePayload);

      const response = await axios.put(`${API_URL}/events/${eventId}`, updatePayload, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("Update response:", response.data);

      setSuccessMessage("Event updated successfully!");

      setTimeout(() => {
        navigate("/admin/events");
      }, 2000);
    } catch (err: any) {
      console.error("Error updating event:", err);
      const message = err.response?.data?.detail || "Failed to update event";
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className="min-h-screen max-w-full bg-white text-black flex flex-col">
        <div className="max-w-[350px] h-auto items-center px-4 sm:px-10 pt-[100px] pb-[100px]">
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <Loader className="animate-spin w-6 h-6 text-[maroon]" />
              <span className="ml-2 text-gray-600">Loading event data...</span>
            </div>
          ) : error ? (
            <div className="w-full mx-auto p-4 bg-red-50 border border-red-200 rounded-md text-center mt-4">
              <p className="text-[maroon] font-medium">{error}</p>
              <button
                onClick={() => navigate("/admin/events")}
                className="mt-4 px-4 py-2 bg-[maroon] text-white rounded-md hover:bg-[maroon]/90"
              >
                Return to Events
              </button>
            </div>
          ) : event ? (
            <form onSubmit={handleSave} className="w-[full] h-auto mx-auto ">
              <div className="flex flex-col h-auto text-sm text-black overflow-hidden font-semibold bg-white border border-black rounded-lg text-left shadow-md">
                <div className="w-full flex items-center gap-2 h-auto px-4 py-3 text-white font-bold bg-[maroon] border-b border-black rounded-t-lg">
                  <Calendar className="w-5 h-5" />
                  <span className="text-sm">Edit An Event</span>
                </div>

                <div className="flex flex-col p-4 space-y-4">
                  <div className="space-y-1">
                    <label htmlFor="event_name" className="block text-sm font-bold">
                      Event Name
                    </label>
                    <input
                      type="text"
                      id="event_name"
                      name="event_name"
                      value={event.event_name}
                      onChange={handleChange}
                      required
                      className="w-full p-2 border border-gray-400 rounded-md"
                    />
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="date" className="block text-sm font-bold">
                      Date
                    </label>
                    <div className="flex items-center">
                      <Calendar className="w-5 h-5 mr-2" />
                      <input
                        type="date"
                        id="date"
                        name="date"
                        value={event.date.split('T')[0]}
                        onChange={handleChange}
                        required
                        className="w-full p-2 border border-gray-400 rounded-md"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="location" className="block text-sm font-bold">
                      Location
                    </label>
                    <div className="flex items-center">
                      <MapPin className="w-5 h-5 mr-2" />
                      <input
                        type="text"
                        id="location"
                        name="location"
                        value={event.location}
                        onChange={handleChange}
                        required
                        className="w-full p-2 border border-gray-400 rounded-md"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="description" className="block text-sm font-bold">
                      Event Description
                    </label>
                    <div className="flex items-start">
                      <ClipboardList className="w-5 h-5 mr-2 mt-2" />
                      <textarea
                        id="description"
                        name="description"
                        value={event.description}
                        onChange={handleChange}
                        rows={3}
                        className="w-full p-2 border border-gray-400 rounded-md"
                      />
                    </div>
                  </div>

                  {successMessage && (
                    <div className="bg-green-50 border border-green-200 text-green-700 p-2 rounded-md text-center">
                      {successMessage}
                    </div>
                  )}

                  {error && (
                    <div className="bg-red-50 border border-red-200 text-[maroon] p-2 rounded-md text-center">
                      {error}
                    </div>
                  )}

                  <div className="flex justify-between pt-2">
                    <button
                      type="button"
                      onClick={() => navigate("/admin/events")}
                      className="px-4 py-2 border border-[maroon] text-[maroon] rounded-full hover:bg-[maroon]/10 transition cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={saving}
                      className="flex items-center gap-2 bg-[maroon] text-white px-4 py-2 rounded-full hover:bg-[maroon]/90 transition disabled:opacity-70 cursor-pointer"
                    >
                      {saving ? (
                        <>
                          <Loader className="animate-spin w-4 h-4" />
                          <span>Saving...</span>
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          <span>Submit</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          ) : (
            <div className="w-[350px] mx-auto p-4 bg-red-50 border border-red-200 rounded-lg text-center mt-4">
              <p className="text-[maroon] font-medium">Event not found</p>
              <button
                onClick={() => navigate("/admin/events")}
                className="mt-4 px-4 py-2 bg-[maroon] text-white rounded-md hover:bg-[maroon]/90"
              >
                Return to Events
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
