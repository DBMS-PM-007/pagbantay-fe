import { useState, useEffect } from "react";
import { Input } from "@components/ui/input";
import axios from "axios";
import { toast } from "react-toastify";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@components/ui/dropdown-menu";
import Loader from "@components/Loader"
import { User, Mail, ClipboardList } from "lucide-react"

export default function AssignVolunteers() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [refetch, setRefetch] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${API_URL}/users`);
        setUsers(response.data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load users");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [refetch]);

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

      setRefetch((prev) => !prev)
      toast.success("Volunteer assigned successfully!");
      console.log("Assignment created:", response.data);
    } catch (error) {
      console.error("Error assigning volunteer:", error);
      toast.error("Failed to assign volunteer.");
    }
  };

  const filteredUsers = users
    .filter((user: any) => {
      const fullName = `${user.first_name} ${user.last_name}`.toLowerCase();
      return fullName.includes(searchTerm.toLowerCase());
    })
    .sort((a: any, b: any) => {
      const nameA = `${a.first_name} ${a.last_name}`.toLowerCase();
      const nameB = `${b.first_name} ${b.last_name}`.toLowerCase();
      return nameA.localeCompare(nameB);
    });

  return (
    <div className="w-screen h-screen text-center items-center flex flex-col bg-white text-black">
      <div className="w-[300px] pt-[85px] pb-[100px] flex flex-col flex-start gap-[20px]">
        <Input
          className="h-[50px] rounded-[100px] border-black pl-[20px] pr-[20px]"
          type="text"
          placeholder="⌕ Search Volunteer..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {isLoading ? (
          <Loader text="Users" />
        ) : filteredUsers.length === 0 ? (
          <h1>No volunteers found.</h1>
        ) : (
          filteredUsers.map((user: any) => (
            <div
              key={user.user_id}
              className="w-full flex flex-col h-auto text-sm text-black overflow-hidden font-bold bg-white border border-black rounded-lg text-left shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-[1.01]"
            >
              <div className="w-full flex flex-row h-[50px] justify-left items-center text-sm gap-[10px] pl-[15px] pr-[15px] pt-[10px] pb-[5px] text-white font-bold bg-[maroon] border border-black">
                <User />
                <h2 className="font-semibold">{user.first_name} {user.last_name}</h2>
              </div>
              <div className="flex flex-col gap-3 p-5 font-semibold">
                <div>
                  <div className="flex flex-row gap-[10px] items-center">
                    <Mail />
                    <h2>Email: </h2>
                  </div>
                  <h2 className="text-xs pl-[35px] pr-[10px]">{user.email}</h2>
                </div>
                <div>
                  <div className="flex flex-row gap-[10px] items-center">
                    <ClipboardList />
                    <h2>Assigned to:</h2>
                  </div>
                  {user.assignments && user.assignments.length > 0 ? (
                    user.assignments.map((assignment: any) => (
                      <h2 key={assignment.assignment_id} className="text-xs pl-[35px] pr-[10px]">
                        {assignment.event?.event_name || "Unnamed Event"}
                      </h2>
                    ))
                  ) : (
                    <h2 className="text-xs pl-[35px] pr-[10px]">Not Assigned to any events</h2>
                  )}
                </div>
                <div>
                  <DropdownMenu>
                    {user.availability.some((a: any) =>
                      a.availability === "AVAILABLE" &&
                      a.event &&
                      !user.assignments.some(
                        (assignment: any) =>
                          assignment.event?.event_id === a.event.event_id
                      )
                    ) ? (
                      <DropdownMenuTrigger asChild>
                        <button className="w-auto text-sm text-black border border-black px-4 py-2 rounded-[100px] hover:cursor-pointer transition-all duration-300 hover:bg-[maroon] hover:text-white">
                          Assign to Event
                        </button>
                      </DropdownMenuTrigger>
                    ) : (
                      <div className="pointer-events-none">
                        <DropdownMenuTrigger asChild>
                          <button
                            className="w-auto text-sm border border-gray-400 text-gray-400 px-4 py-2 rounded-[100px] cursor-not-allowed"
                            disabled
                          >
                            Cannot be Assigned
                          </button>
                        </DropdownMenuTrigger>
                      </div>
                    )}
                    <DropdownMenuContent className="w-56">
                      {user.availability
                        .filter((a: any) =>
                          a.availability === "AVAILABLE" &&
                          a.event &&
                          !user.assignments.some(
                            (assignment: any) =>
                              assignment.event?.event_id === a.event.event_id
                          )
                        )
                        .map((a: any) => (
                          <DropdownMenuItem
                            key={a.availability_id}
                            onClick={() =>
                              handleAssignToStation(a.event.event_id, user.user_id)
                            }
                          >
                            {a.event.event_name} - {a.event.location}
                          </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          )))}
      </div>
    </div>
  );
}

