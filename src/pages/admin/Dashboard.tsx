import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Users, Calendar, MapPin, Clock, ClipboardList, ChevronRight } from "lucide-react"
import axios from "axios"

interface Event {
  event_id: string
  admin_id: string
  event_name?: string
  name?: string
  date?: string
  start_time?: string
  end_time?: string
  location?: string
  description?: string
  status?: "upcoming" | "ongoing" | "completed"
  created_at?: string
}

export default function Dashboard() {
  const [totalVolunteers, setTotalVolunteers] = useState(0)
  const [totalEvents, setTotalEvents] = useState(0)
  const [upcomingEvent, setUpcomingEvent] = useState<Event | null>(null)
  const [daysRemaining, setDaysRemaining] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const API_URL = import.meta.env.VITE_API_URL
  const navigate = useNavigate()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      const volunteersResponse = await axios.get(`${API_URL}/users`, {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 10000,
      })

      if (volunteersResponse.data) {
        console.log("Volunteers data:", volunteersResponse.data)
        setTotalVolunteers(volunteersResponse.data.length)
      }

      const eventsResponse = await axios.get(`${API_URL}/events`, {
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
        },
        timeout: 10000,
        params: {
          _t: new Date().getTime(),
        },
      })

      if (eventsResponse.data) {
        console.log("Events data:", eventsResponse.data)

        const processedEvents = eventsResponse.data.map((event: Event) => ({
          ...event,
          event_name: event.name || event.event_name || "Unnamed Event",
          status: event.status || "upcoming",
          date: event.date || new Date().toISOString().split("T")[0],
          location: event.location || "Location not specified",
          description: event.description || "No description available",
        }))

        setTotalEvents(processedEvents.length)

        const upcomingEvents = processedEvents.filter((event: Event) => event.status === "upcoming" || !event.status)

        console.log("Upcoming events sorted:", upcomingEvents)

        const testingEvent = upcomingEvents.find((event: Event) => event.event_name === "Testing Admin Dashboard")

        if (testingEvent) {
          setUpcomingEvent(testingEvent)
          console.log("Selected specific event:", testingEvent)

          if (testingEvent.date) {
            const eventDate = new Date(testingEvent.date)
            const today = new Date()
            today.setHours(0, 0, 0, 0)

            const timeDiff = eventDate.getTime() - today.getTime()
            const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24))
            setDaysRemaining(daysDiff)
          }
        } else if (upcomingEvents.length > 0) {
          const sortedByNewest = [...upcomingEvents].sort((a: Event, b: Event) => b.event_id.localeCompare(a.event_id))

          const nextEvent = sortedByNewest[0]
          setUpcomingEvent(nextEvent)
          console.log("Selected newest event by ID:", nextEvent)

          if (nextEvent.date) {
            const eventDate = new Date(nextEvent.date)
            const today = new Date()
            today.setHours(0, 0, 0, 0)

            const timeDiff = eventDate.getTime() - today.getTime()
            const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24))
            setDaysRemaining(daysDiff)
          }
        }
      }
    } catch (err: any) {
      console.error("Error fetching data:", err)
      const message = err.response?.data?.detail || "Failed to fetch data"
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="w-screen h-screen text-center items-center flex flex-col bg-white text-black">
        <div className="relative w-[350px] pt-[100px] pb-[100px] flex flex-col flex-start gap-[20px] overflow-y-auto">
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <span className="text-gray-600">Loading Dashboard...</span>
            </div>
          ) : error ? (
            <div className="w-full p-4 bg-red-50 border border-red-200 rounded-lg text-center mt-4">
              <p className="text-[maroon] font-medium">{error}</p>
            </div>
          ) : (
            <>
              <div
                onClick={() => navigate("/admin/assign-volunteers")}
                className="w-full relative flex flex-col h-auto text-black overflow-hidden font-semibold bg-white border border-black rounded-lg text-center mx-auto shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
              >
                <div className="w-full flex flex-col items-center gap-1 px-4 py-4 text-white font-bold bg-[maroon] border-b border-black">
                  <Users className="h-6 w-6 mb-1" />
                  <h2 className="text-2xl font-bold">{totalVolunteers} Volunteers</h2>
                  <p className="text-xs italic font-medium">Active Volunteers in the System</p>
                </div>
              </div>

              <div
                onClick={() => navigate("/admin/events")}
                className="w-full relative flex flex-col h-auto text-black overflow-hidden font-semibold bg-white border border-black rounded-lg text-center mx-auto shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
              >
                <div className="w-full flex flex-col items-center gap-1 px-4 py-4 text-white font-bold bg-[maroon] border-b border-black">
                  <Calendar className="h-6 w-6 mb-1" />
                  <h2 className="text-2xl font-bold">{totalEvents} Events</h2>
                  <p className="text-xs italic font-medium">Scheduled Events in the System</p>
                </div>
              </div>

              <h3 className="font-bold text-lg text-center">Upcoming Event</h3>

              {upcomingEvent ? (
                <div className="w-full relative flex flex-col h-auto text-black overflow-hidden font-semibold bg-white border border-black rounded-lg text-left mx-auto shadow-md hover:shadow-xl transition-all duration-300">
                  <div className="w-full flex items-center gap-2 h-auto px-4 py-3 text-white font-bold bg-[maroon] border-b border-black rounded-t-lg">
                    <Calendar className="w-5 h-5" />
                    <span className="text-lg truncate">{upcomingEvent.event_name}</span>
                  </div>
                  <div className="flex flex-col justify-center pl-[25px] pr-[25px] pt-[15px] pb-[15px] text-xs font-semibold gap-[10px]">
                    <p className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 flex-shrink-0 mt-1" />
                      <span className="break-words">{upcomingEvent.location}</span>
                    </p>
                    <p className="flex items-start gap-2">
                      <Clock className="w-4 h-4 flex-shrink-0 mt-1" />
                      <span className="break-words">{upcomingEvent.date}</span>
                    </p>
                    <p className="flex items-start gap-2">
                      <ClipboardList className="w-4 h-4 flex-shrink-0 mt-1" />
                      <span className="break-words">{upcomingEvent.description}</span>
                    </p>
                    <div className="flex items-center justify-between gap-4 border-t pt-2">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 flex-shrink-0" />
                        <span>
                          {daysRemaining !== null ? `${daysRemaining} days left till event` : "Date not specified"}
                        </span>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          navigate("/admin/events")
                        }}
                        className="text-xl hover:cursor-pointer"
                      >
                        <ChevronRight />
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="w-full relative flex flex-col h-auto text-black overflow-hidden font-semibold bg-white border border-black rounded-lg text-center mx-auto shadow-md">
                  <div className="w-full flex items-center justify-center gap-2 h-auto px-4 py-3 text-white font-bold bg-[maroon] border-b border-black rounded-t-lg">
                    <Calendar className="w-5 h-5 mr-2" />
                    <h2 className="text-lg font-bold">No upcoming events</h2>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  )
}
