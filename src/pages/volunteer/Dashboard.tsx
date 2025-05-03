import { useEffect, useState } from "react";
import axios from "axios";

interface Volunteer {
  full_name: string;
  email: string;
  contact_number?: string;
  committee?: string;
  motivation?: string;
}

export default function VolunteerDashboard() {
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchVolunteers = async () => {
      try {
        const response = await axios.get(
          "https://vozfgc1nwa.execute-api.ap-southeast-1.amazonaws.com/users"
        );
        console.log("Fetched users:", response.data);
        setVolunteers(response.data);
      } catch (err: any) {
        console.error("Error fetching users:", err);
        setError("Failed to fetch volunteers.");
      }
    };

    fetchVolunteers();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Volunteer Dashboard</h2>
      {error && <p className="text-red-600">{error}</p>}
      <ul className="space-y-2">
        {volunteers.length > 0 ? (
          volunteers.map((v, idx) => (
            <li key={idx} className="border p-3 rounded shadow">
              <p><strong>Name:</strong> {v.full_name}</p>
              <p><strong>Email:</strong> {v.email}</p>
              {v.contact_number && <p><strong>Phone:</strong> {v.contact_number}</p>}
            </li>
          ))
        ) : (
          <p>No volunteers found.</p>
        )}
      </ul>
    </div>
  );
}


