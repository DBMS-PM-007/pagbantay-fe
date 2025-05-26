import { useEffect, useState } from "react"
import axios from "axios"
import { MapPin, Clock, FileText } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@components/ui/dropdown-menu"
import { useUser } from "@clerk/clerk-react"
import Loader from "@components/Loader"

type Event = {
  event_id: string
  admin_id: string
  event_name: string
  date: string
  location: string
  description: string
}

export default function Events() {
  const [events, setEvents] = useState<Event[]>([])
  const [selectedStatus, setSelectedStatus] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [userId, setUserId] = useState<string>("")

  const { user } = useUser()
  const API_URL = import.meta.env.VITE_API_URL

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.primaryEmailAddress?.emailAddress) return

      try {
        const userRes = await axios.get(`${API_URL}/users/email/${user.primaryEmailAddress.emailAddress}`)
        setUserId(userRes.data.user_id)

        const [eventsRes, availabilityRes] = await Promise.all([
          axios.get(`${API_URL}/events`),
          axios.get(`${API_URL}/availability`),
        ])

        setEvents(eventsRes.data)

        const statusMap: Record<string, string> = {}
        for (const item of availabilityRes.data) {
          if (item.user_id === userRes.data.user_id) {
            statusMap[item.event_id] = item.availability
          }
        }
        setSelectedStatus(statusMap)
      } catch {
        setError("Failed to load data.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [API_URL, user])

  const formatEventDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return isNaN(date.getTime())
      ? "Date not available"
      : date.toLocaleDateString(undefined, {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
  }

  const handleAvailabilityChange = async (eventId: string, status: string) => {
    try {
      const method = selectedStatus[eventId] ? "put" : "post"
      const url = method === "put"
        ? `${API_URL}/availability/${eventId}?user_id=${userId}`
        : `${API_URL}/availability/`

      if (method === "put") {
        await axios.put(url, {
          availability: status
        })
      } else {
        await axios.post(url, {
          event_id: eventId,
          user_id: userId,
          availability: status,
        })
      }

      setSelectedStatus((prev) => ({ ...prev, [eventId]: status }))
    } catch (error) {
      console.error("Failed to update availability:", error)
    }
  }

  return (
    <div className="w-screen h-screen text-center flex-start items-center flex flex-col bg-white text-black text-xs">
      <div className="w-[350px] pt-[100px] pb-[100px] flex flex-col flex-start gap-[20px]">
        {isLoading ? <Loader text="Events" /> :
          error ? <p className="text-red-600">{error}</p> :
            events.map((event) => (
              <div
                key={event.event_id}
                className="w-full bg-white rounded-lg shadow-md border border-black overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-[1.01]"
              >
                <div className="bg-[maroon] text-white pl-[15px] pr-[15px] pt-[10px] pb-[5px]">
                  <h2 className="text-lg font-bold">{event.event_name}</h2>
                </div>
                <div className="p-4 space-y-3 text-left">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-black text-xs" />
                    <span className="text-black text-xs font-semibold">{event.location}</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-black text-xs" />
                    <span className="text-black text-xs font-semibold">
                      {formatEventDate(event.date)}
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <FileText className="h-5 w-5 text-black text-xs" />
                    <span className="text-black text-xs font-semibold">
                      {event.description}
                    </span>
                  </div>
                  <div className="flex w-full">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="ml-auto bg-[maroon] text-white px-4 py-2 rounded border border-black font-semibold hover:cursor-pointer">
                          {selectedStatus[event.event_id] || "Mark Availability"}
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-48">
                        <DropdownMenuItem onClick={() => handleAvailabilityChange(event.event_id, "AVAILABLE")}>
                          Available
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleAvailabilityChange(event.event_id, "UNAVAILABLE")}>
                          Unavailable
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            ))}
      </div>
    </div>
  )
}
