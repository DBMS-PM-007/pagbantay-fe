import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Calendar,
  Clock,
  MapPin,
  ClipboardList,
  Pencil,
  Search,
  Plus,
} from "lucide-react";
import axios from "axios";
import Loader from "@/components/Loader";
import { Input } from "@/components/ui/input";
import { toast } from "react-toastify";
import Modal from "react-modal";

Modal.setAppElement("#root");

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<string | null>(null);

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(`${API_URL}/events`, {
          headers: { "Content-Type": "application/json" },
        });
        if (!Array.isArray(response.data)) {
          throw new Error("Expected array response from /events API");
        }
        setEvents(response.data);
      } catch (err: any) {
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

  const confirmDelete = async () => {
    if (!eventToDelete) return;
    try {
      await axios.delete(`${API_URL}/events/${eventToDelete}`, {
        headers: { "Content-Type": "application/json" },
      });
      setEvents((prev) => prev.filter((e) => e.event_id !== eventToDelete));
      toast.success("Successfully Deleted Event");
    } catch (err: any) {
      console.error("Error deleting event:", err);
      toast.error("Failed to delete event.");
    } finally {
      setIsModalOpen(false);
      setEventToDelete(null);
    }
  };

  const cancelDelete = () => {
    setIsModalOpen(false);
    setEventToDelete(null);
  };

  const navigate = useNavigate();

  return (
    <>
      <div className="w-screen h-screen text-center items-center flex flex-col bg-white text-black">
        <div className="relative w-[350px] pt-[85px] pb-[100px] flex flex-col flex-start gap-[20px]">
          <div className="relative w-full max-w-md mx-auto">
            <Input
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
              className="h-[50px] rounded-[100px] border-black pl-[40px] pr-[20px]"
            />
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <Search className="w-4 h-4" />
            </span>

            {searchQuery.length > 0 && filteredEvents.length > 0 && showSuggestions && (
              <ul className="absolute left-1/2 transform -translate-x-1/2 w-[90%] pointed-lg border border-black-500 bg-white text-xs font-semibold shadow-md divide-y divide-black-500 z-10">
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
            <Loader text="Events" />
          ) : error ? (
            <p className="text-[maroon] text-xs font-semibold text-center">Error: {error}</p>
          ) : selectedEvent ? (
            <div className="w-full relative flex flex-col h-auto text-lg text-black overflow-hidden font-semibold bg-white border border-black rounded-lg text-left mx-auto shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-[1.01]">
              <div className="w-full flex items-center gap-2 h-auto px-4 text-white font-bold bg-[maroon] border-b border-black rounded-t-lg">
                <Calendar className="w-5 h-5" />
                <span className="text-lg truncate">{selectedEvent.event_name}</span>
              </div>
              <div className="flex flex-col justify-center pl-[50px] pr-[50px] pt-[20px] pb-[60px] text-xs font-semibold gap-[15px]">
                <p className="flex items-start gap-2">
                  <Clock className="w-4 h-4 flex-shrink-0 mt-1" />
                  <span className="break-words">{selectedEvent.date}</span>
                </p>
                <p className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 flex-shrink-0 mt-1" />
                  <span className="break-words">{selectedEvent.location}</span>
                </p>
                <p className="flex items-start gap-2">
                  <ClipboardList className="w-4 h-4 flex-shrink-0 mt-1" />
                  <span className="break-words">{selectedEvent.description}</span>
                </p>
              </div>
              <button
                onClick={() => navigate(`/admin/events/${selectedEvent.event_id}/edit`)}
                className="absolute bottom-3 right-3 flex items-center gap-1 bg-[maroon] text-white px-3 py-1 rounded-md shadow hover:bg-[maroon]/90 transition"
              >
                <Pencil className="w-4 h-4" />
                <span>Edit</span>
              </button>
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="w-full flex flex-col h-auto text-lg text-black overflow-hidden font-semibold bg-white border border-black rounded-lg text-left mx-auto shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-[1.01]">
              <div className="w-full flex items-center gap-2 h-auto px-4 text-white font-bold bg-[maroon] border-b border-black rounded-t-lg  pl-[15px] pr-[15px] pt-[10px] pb-[5px]">
                <span className="text-lg truncate">Scheduled Events</span>
              </div>
              <div className="flex flex-col justify-center pl-[50px] pr-[50px] pt-[20px] pb-[10px] text-xs font-semibold gap-[10px]">
                <p className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>Event Not Found.</span>
                </p>
              </div>
            </div>
          ) : (
            <div className="w-full max-w-2xl space-y-6 mx-auto">
              {filteredEvents.map((event) => (
                <div key={event.event_id} className="w-full relative flex flex-col h-auto text-lg text-black overflow-hidden font-semibold bg-white border border-black rounded-lg text-left mx-auto shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-[1.01]">
                  <div className="w-full flex items-center gap-2 h-auto px-4 text-white font-bold bg-[maroon] border-b border-black rounded-t-lg  pl-[15px] pr-[15px] pt-[10px] pb-[5px]">
                    <Calendar className="w-5 h-5" />
                    <span className="text-lg truncate">{event.event_name}</span>
                  </div>
                  <div className="flex flex-col justify-center pl-[25px] pr-[25px] pt-[20px] pb-[60px] text-xs font-semibold gap-[10px]">
                    <p className="flex items-start gap-2">
                      <Clock className="w-4 h-4 flex-shrink-0 mt-1" />
                      <span className="break-words">{event.date}</span>
                    </p>
                    <p className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 flex-shrink-0 mt-1" />
                      <span className="break-words">{event.location}</span>
                    </p>
                    <p className="flex items-start gap-2">
                      <ClipboardList className="w-4 h-4 flex-shrink-0 mt-1" />
                      <span className="break-words">{event.description}</span>
                    </p>
                  </div>
                  <button
                    onClick={() => navigate(`/admin/events/${event.event_id}/edit`)}
                    className="absolute bottom-3 right-3 flex items-center gap-1 bg-[maroon] text-white px-3 py-1 rounded-md shadow hover:bg-[maroon]/90 transition cursor-pointer"
                  >
                    <Pencil className="w-4 h-4" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => {
                      setEventToDelete(event.event_id);
                      setIsModalOpen(true);
                    }}
                    className="absolute bottom-3 right-24 flex items-center gap-1 bg-[maroon] text-white px-3 py-1 rounded-md shadow hover:bg-[maroon]/90 transition cursor-pointer"
                  >
                    <Pencil className="w-4 h-4" />
                    <span>Delete</span>
                  </button>
                </div>
              ))}
            </div>
          )}
          {!loading && (
            <div className="flex flex-col items-center">
              <button
                onClick={() => navigate('/admin/events/create')}
                className="flex items-center justify-center gap-2 px-2 py-2 bg-[maroon] text-white rounded-full shadow hover:bg-[maroon]/90 transition cursor-pointer"
              >
                <Plus className="w-4 h-4" />
              </button>
              <span
                onClick={() => navigate('/admin/events/create')}
                className="mt-1 text-[maroon] text-xs font-semibold cursor-pointer"
              >
                Add an Event
              </span>
            </div>
          )}
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={cancelDelete}
        contentLabel="Confirm Delete"
        className="w-[350px] h-auto bg-white items-center justify-center p-[20px] rounded-lg shadow-lg border border-black flex flex-col gap-[10px]"
        overlayClassName="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center z-50"
      >
        <h2 className="text-lg font-bold text-black">Confirm Delete</h2>
        <p className="text-sm font-semibold text-gray-800">Are you sure you want to delete this event?</p>
        <div className="text-xs font-semibold text-[red] flex flex-col p-[10px]">
          <p>This action is irreversible and will remove:</p>
          <p>- The event and all of its details</p>
          <p>- All volunteer assignments for this event</p>
          <p>- All submitted availabilities for this event</p>
        </div>
        <p className="align-center text-center text-sm font-semibold text-gray-800">This may impact your reports and schedule visibility. Proceed with caution.</p>
        <div className="text-sm font-semibold flex justify-end gap-3">
          <button
            onClick={cancelDelete}
            className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400 transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={confirmDelete}
            className="bg-[maroon] text-white px-4 py-2 rounded hover:bg-[maroon]/90 transition cursor-pointer"
          >
            Delete
          </button>
        </div>
      </Modal>
    </>
  );
}

