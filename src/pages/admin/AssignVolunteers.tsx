import { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import Header from "@components/Header";
import Footer from "@components/Footer";
import { Input } from "@components/ui/input";
import axios from "axios";
import { toast } from "react-toastify";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@components/ui/dropdown-menu";

export default function AssignVolunteers() {
  const { user } = useUser();
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${API_URL}/users`);
        setUsers(response.data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load users");
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = users.filter((user: any) => {
    const fullName = `${user.first_name} ${user.last_name}`.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase());
  });

  const handleAssignToStation = async (
    eventId: string,
    userId: string,
  ) => {
    try {
      console.log({
        event_id: eventId,
        user_id: userId,
      });

      const response = await axios.post(`${API_URL}/assignments`, {
        event_id: eventId,
        user_id: userId,
      });

      toast.success("Volunteer assigned successfully!");
      console.log("Assignment created:", response.data);
    } catch (error) {
      console.error("Error assigning volunteer:", error);
      toast.error("Failed to assign volunteer.");
    }
  };


  return (
    <div className="w-screen h-screen text-center items-center flex flex-col bg-white text-black">
      <Header title="Assign Volunteers" />
      <div className="w-[300px] pt-[85px] pb-[100px] flex flex-col flex-start gap-[20px]">
        <Input
          className="h-[50px] rounded-[100px] border-black pl-[20px] pr-[20px]"
          type="text"
          placeholder="Search Volunteer..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {filteredUsers.map((user: any) => (
          <div
            key={user.user_id}
            className="w-full flex flex-col h-auto text-sm text-black overflow-hidden font-bold bg-white border border-black rounded-lg text-left
            shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-[1.01]"
          >
            <div className="w-full flex flex-col h-[50px] justify-center text-sm pl-[20px] pr-[20px] pt-[10px] pb-[5px] text-white font-bold bg-[maroon] border border-black">
              <h2 className="font-semibold">{user.first_name} {user.last_name}</h2>
            </div>
            <div className="flex flex-col gap-3 p-5 font-semibold">
              <div>
                <h2>Email: </h2>
                <h2 className="text-xs pl-[10px] pr-[10px]">{user.email}</h2>
              </div>
              <div>
                <h2>Assigned to:</h2>
                {user.assignments && user.assignments.length > 0 ? (
                  user.assignments.map((assignment: any) => (
                    <h2 key={assignment.assignment_id} className="text-xs pl-[10px] pr-[10px]">
                      {assignment.event?.event_name || "Unnamed Event"}
                    </h2>
                  ))
                ) : (
                  <h2 className="text-xs pl-[10px] pr-[10px]">Not Assigned to any events</h2>
                )}
              </div>
              <div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="w-auto text-sm text-black border border-black px-4 py-2 rounded-[100px]">
                      Assign to Event
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    {user.availability && user.availability.filter((a: any) => a.availability === "AVAILABLE").length != 0 ? (
                      user.availability
                        .filter((a: any) => a.availability != "UNAVAILABLE" && a.event)
                        .map((a: any) => (
                          <DropdownMenuItem
                            key={a.availability_id}
                            onClick={() =>
                              handleAssignToStation(
                                a.event.event_id,
                                user.user_id,
                              )
                            }
                          >
                            {a.event.event_name} - {a.event.location}
                          </DropdownMenuItem>
                        ))
                    ) : (
                      <DropdownMenuItem disabled>No available events</DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        ))}
      </div>
      <Footer />
    </div>
  );
}

