import { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import Header from "@components/Header";
import Footer from "@components/Footer";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { toast } from 'react-toastify';

export default function CreateEvent() {
  const { user } = useUser();
  const [eventName, setEventName] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const API_URL = import.meta.env.VITE_API_URL;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      alert("User not logged in");
      return;
    }

    try {
      await axios.post(`${API_URL}/events`, {
        admin_id: "1",
        event_name: eventName,
        date: eventDate,
        location,
        description,
      });
      toast("Event created!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to create event");
    }
  };

  return (
    <div className="w-screen h-screen text-center items-center flex flex-col justify-center space-y-4 bg-white text-black">
      <Header title="CREATE EVENT" />
      <div className="w-[300px] align-middle flex flex-col gap-[20px]">
        <form
          className="w-full h-full flex flex-col justify-center gap-2"
          onSubmit={handleSubmit}
        >
          <div className="w-full flex flex-col h-auto text-md text-black overflow-hidden font-bold bg-white border border-black rounded-lg text-left">
            <div className="w-full flex flex-col h-[30px] justify-center text-md pl-[20px] pr-[20px] pt-[10px] pb-[5px] text-white font-bold bg-[maroon] border border-black">
              <h2 className="font-semibold">Create An Event</h2>
            </div>
            <div className="flex flex-col gap-3 p-5 font-semibold">
              <div>
                <h2>Event Name</h2>
                <Input
                  required
                  className="font-light text-sm"
                  value={eventName}
                  onChange={(e) => setEventName(e.target.value)}
                />
              </div>
              <div>
                <h2>Date</h2>
                <Input
                  required
                  type="date"
                  className="font-light text-sm"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                />
              </div>
              <div>
                <h2>Location</h2>
                <Input
                  required
                  className="font-light text-sm"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
              <div>
                <h2>Event Description</h2>
                <Input
                  required
                  className="font-light text-sm"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <button
                type="submit"
                className="w-full text-md text-white hover:cursor-pointer font-bold bg-[maroon] border border-black mt-5 p-2 rounded-lg"
              >
                SUBMIT
              </button>
            </div>
          </div>
        </form>
      </div>
      <Footer />
    </div>
  );
}


















