import { useUser, useClerk } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import axios from "axios";

type Assignment = {
  assignment_id: string;
  event: {
    event_id: string;
    event_name: string;
    date: string;
  };
};

type Availability = {
  event_id: string;
  availability: "AVAILABLE" | "UNAVAILABLE";
};

type VolunteerData = {
  user_id: string;
  assignments: Assignment[];
  availability: Availability[];
};

export default function ProfilePage() {
  const { user } = useUser();
  const { signOut } = useClerk();

  const API_URL = import.meta.env.VITE_API_URL;

  const [volunteerData, setVolunteerData] = useState<VolunteerData | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchVolunteerData = async () => {
      if (!user?.primaryEmailAddress?.emailAddress) return;

      try {
        const res = await axios.get(`${API_URL}/users/email/${user.primaryEmailAddress.emailAddress}`);
        setVolunteerData(res.data);
      } catch (err) {
        setError("Failed to load profile.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVolunteerData();
  }, [API_URL, user]);

  const filteredAssignments =
    volunteerData?.assignments.filter((assignment) =>
      volunteerData.availability.some(
        (a) =>
          a.event_id === assignment.event.event_id &&
          a.availability === "AVAILABLE"
      )
    ) || [];

  if (!user) return <div>Loading user...</div>;
  if (isLoading) return <div>Loading profile...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="p-6">
      <div className="w-[350px] bg-white rounded-lg shadow-md border border-black overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-[1.01]">
        <div className="flex flex-col justify-center items-center bg-[maroon] text-white pl-[15px] pr-[15px] pt-[10px] pb-[10px]">
          <img
            src={user.imageUrl}
            alt="Profile"
            className="w-6 h-6 rounded-full"
          />
          <p className="font-semibold text-lg">{user.fullName}</p>
          <p className="text-white text-sm">{user.primaryEmailAddress?.emailAddress}</p>
        </div>
        <div className="flex flex-col items-right pl-[15px] pr-[15px] pt-[30px] pb-[20px]">
          <div className="w-full">
            <h2 className="font-semibold text-md mb-2">Assigned Events</h2>
            {filteredAssignments.length ? (
              <ul className="list-disc pl-5 text-sm text-gray-700">
                {filteredAssignments.map(({ assignment_id, event }) => (
                  <li key={assignment_id}>
                    {event.event_name} — {new Date(event.date).toLocaleDateString()}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No assigned events yet.</p>
            )}
          </div>
          <button
            onClick={() => signOut()}
            className="text-center bg-[maroon] text-white p-[5px] rounded-md shadow hover:bg-[maroon]/90 transition cursor-pointer mb-[10px] mt-[20px]"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}

