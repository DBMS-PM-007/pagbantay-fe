import { useEffect, useState, useRef } from "react"
import { SignedIn, SignedOut, RedirectToSignIn, useUser, useClerk } from "@clerk/clerk-react"
import { MapPin, Clock, FileText, ArrowLeft } from "lucide-react"
import axios from "axios"

type Event = {
  event_id: string
  admin_id: string
  event_name: string
  date: string
  location: string
  description: string
}

type AvailabilityRecord = {
  event_id: string
  user_id: string
  availability: string
  station_assignment: string
}

export default function Events() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const [userID, setUserID] = useState<string | null>(null)
  const [userAvailability, setUserAvailability] = useState<{ [eventId: string]: string }>({})
  const [updatingEventId, setUpdatingEventId] = useState<string | null>(null)

  const [rawAvailabilityData, setRawAvailabilityData] = useState<AvailabilityRecord[]>([])

  const problematicEvents = useRef<Set<string>>(new Set())

  const [localOverrides, setLocalOverrides] = useState<{ [eventId: string]: string }>({})

  const { isLoaded, isSignedIn, user } = useUser()
  const { signOut } = useClerk()

  const API_URL = import.meta.env.VITE_API_URL

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        console.log("Fetching events from:", `${API_URL}/events`)
        const response = await axios.get(`${API_URL}/events`)
        console.log("Events response:", response.data)
        setEvents(response.data)
      } catch (error) {
        console.error("Failed to fetch events", error)
        setError("Failed to fetch events.")
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [API_URL])

  useEffect(() => {
    if (isLoaded && isSignedIn && user) {
      const email = user?.primaryEmailAddress?.emailAddress

      const fetchUserID = async () => {
        try {
          console.log("Fetching user ID for email:", email)
          const response = await axios.get(`${API_URL}/users/email/${email}`)
          console.log("User ID response:", response.data)
          setUserID(response.data.user_id)
        } catch (error) {
          console.error("Failed to query user by email", error)
        }
      }

      fetchUserID()
    }
  }, [isLoaded, isSignedIn, user, API_URL])

  useEffect(() => {
    const fetchUserAvailability = async () => {
      if (!userID) return

      try {
        console.log("Fetching availability for user ID:", userID)

        const timestamp = new Date().getTime()
        const response = await axios.get(`${API_URL}/availability?_=${timestamp}`)
        console.log("Availability response:", response.data)

        const allAvailability = response.data

        setRawAvailabilityData(allAvailability)

        const filtered = allAvailability.filter((a: AvailabilityRecord) => a.user_id === userID)
        console.log("Filtered availability for current user:", filtered)

        const eventCounts: { [key: string]: number } = {}
        filtered.forEach((a: AvailabilityRecord) => {
          eventCounts[a.event_id] = (eventCounts[a.event_id] || 0) + 1
          if (eventCounts[a.event_id] > 1) {
            console.warn(`Duplicate availability record found for event ${a.event_id}`)
            problematicEvents.current.add(a.event_id)
          }
        })

        const availabilityMap: { [eventId: string]: string } = {}
        filtered.forEach((a: AvailabilityRecord) => {
          availabilityMap[a.event_id] = a.availability
          console.log(`Setting event ${a.event_id} to ${a.availability}`)
        })

        console.log("Final availability map:", availabilityMap)

        const mergedAvailability = { ...availabilityMap }

        if (userID) {
          Object.keys(localOverrides).forEach((key) => {
            const [eventId, storedUserId] = key.split("_")
            if (storedUserId === userID) {
              mergedAvailability[eventId] = localOverrides[key]
              console.log(`Applied local override for event ${eventId}: ${localOverrides[key]}`)
            }
          })
        }

        setUserAvailability(mergedAvailability)
      } catch (err) {
        console.error("Failed to fetch availability", err)
      }
    }

    if (userID) fetchUserAvailability()
  }, [userID, API_URL, localOverrides])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (!target.closest(".profile-menu") && !target.closest(".profile-button")) {
        setShowProfileMenu(false)
      }
    }

    const handleDropdownClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (!target.closest(".availability-dropdown") && !target.closest(".availability-button")) {
        setActiveDropdown(null)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    document.addEventListener("mousedown", handleDropdownClickOutside)

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("mousedown", handleDropdownClickOutside)
    }
  }, [])

  useEffect(() => {
    const style = document.createElement("style")
    style.textContent = `
      .cl-userButtonBox {
        display: none !important;
      }
      .cl-rootBox {
        display: none !important;
      }
      .cl-userButtonTrigger {
        display: none !important;
      }
    `
    document.head.appendChild(style)

    return () => {
      document.head.removeChild(style)
    }
  }, [])

  const findExistingAvailabilityRecord = (eventId: string) => {
    return rawAvailabilityData.find(
      (record: AvailabilityRecord) => record.user_id === userID && record.event_id === eventId,
    )
  }

  const handleAvailability = async (eventId: string, isAvailable: boolean) => {
    if (!userID) {
      alert("User ID not loaded yet.")
      return
    }

    setUpdatingEventId(eventId)
    const availabilityStatus = isAvailable ? "AVAILABLE" : "UNAVAILABLE"
    console.log(`Setting event ${eventId} to ${availabilityStatus}`)

    try {
      const existingRecord = findExistingAvailabilityRecord(eventId)
      console.log("Existing availability record:", existingRecord)

      setUserAvailability((prev) => ({
        ...prev,
        [eventId]: availabilityStatus,
      }))

      const response = await axios.post(`${API_URL}/availability`, {
        event_id: eventId,
        user_id: userID,
        station_assignment: "To be assigned",
        availability: availabilityStatus,
      })

      console.log("Availability update response:", response.data)

      setActiveDropdown(null)

      const overrideKey = `${eventId}_${userID}`
      setLocalOverrides((prev) => ({
        ...prev,
        [overrideKey]: availabilityStatus,
      }))
    } catch (err) {
      console.error("Failed to update availability:", err)
      alert("Failed to mark availability. Please try again.")

      const overrideKey = `${eventId}_${userID}`
      setLocalOverrides((prev) => ({
        ...prev,
        [overrideKey]: availabilityStatus,
      }))
    } finally {
      setUpdatingEventId(null)
    }
  }

  const toggleDropdown = (eventId: string) => {
    if (activeDropdown === eventId) {
      setActiveDropdown(null)
    } else {
      setActiveDropdown(eventId)
    }
  }

  function formatEventDate(dateStr: string) {
    try {
      const date = new Date(dateStr)
      if (isNaN(date.getTime())) {
        return "Date not available"
      }

      return date.toLocaleDateString(undefined, {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    } catch (error) {
      return "Invalid date format"
    }
  }

  const retryFetchEvents = async () => {
    setLoading(true)
    setError("")

    try {
      const response = await axios.get(`${API_URL}/events`)
      setEvents(response.data)
    } catch (error) {
      console.error("Failed to fetch events", error)
      setError("Failed to fetch events.")
    } finally {
      setLoading(false)
    }
  }

  const toggleProfileMenu = () => {
    setShowProfileMenu(!showProfileMenu)
  }

  const handleSignOut = () => {
    signOut()
  }

  const handleManageAccount = () => {
    window.location.href = "/user/account"
  }

  const getAvailabilityButtonStyle = (eventId: string) => {
    if (updatingEventId === eventId) {
      return "bg-gray-400 text-white cursor-wait"
    }

    const status = userAvailability[eventId]

    if (status === "AVAILABLE") {
      return "bg-[#B32113] hover:bg-[#a01d10] text-white"
    } else if (status === "UNAVAILABLE") {
      return "bg-[#6F6F6F] hover:bg-[#5a5a5a] text-white"
    } else {
      return "bg-[#831005] hover:bg-[#6e0d04] text-white"
    }
  }

  const getAvailabilityButtonText = (eventId: string) => {
    if (updatingEventId === eventId) {
      return "Updating..."
    }

    const status = userAvailability[eventId]

    if (status === "AVAILABLE") {
      return "Available"
    } else if (status === "UNAVAILABLE") {
      return "Unavailable"
    } else {
      return "Mark Availability"
    }
  }

  return (
    <>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>

      <SignedIn>
        <div className="flex flex-col min-h-screen w-full bg-white overflow-hidden">
          <div className="fixed top-0 left-0 right-0 z-20 bg-white border-b border-black w-full">
            <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-screen-xl">
              <div className="flex items-center py-4">
                <button className="mr-4" onClick={() => window.history.back()}>
                  <ArrowLeft className="h-6 w-6 text-black" />
                </button>
                <h1 className="text-2xl font-bold text-center flex-1">Events</h1>
              </div>
            </div>
          </div>

          <div className="flex-1 w-full p-4 pt-20 pb-20 overflow-y-auto overflow-x-hidden">
            <div className="container mx-auto px-0 sm:px-4 md:px-6 lg:px-8 max-w-screen-xl">
              {error && (
                <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                  <span className="block sm:inline">{error}</span>
                  <button
                    onClick={retryFetchEvents}
                    className="mt-2 bg-[#831005] hover:bg-red-800 text-white py-1 px-3 rounded text-sm"
                  >
                    Retry
                  </button>
                </div>
              )}

              {loading && (
                <div className="flex justify-center items-center h-40">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#831005]"></div>
                </div>
              )}

              {!loading && !error && events.length === 0 && (
                <div className="bg-white rounded-lg shadow-md p-6 text-center">
                  <div className="flex justify-center mb-2">
                    <Clock className="h-6 w-6 text-gray-500" />
                  </div>
                  <p className="text-lg font-medium">No events scheduled.</p>
                  <p className="text-gray-500">Check back soon!</p>
                </div>
              )}

              {!loading && !error && events.length > 0 && (
                <div className="space-y-6 max-w-3xl mx-auto">
                  {events.map((event) => (
                    <div
                      key={event.event_id}
                      className="bg-white rounded-lg shadow-md border border-black overflow-hidden"
                    >
                      <div className="bg-[#831005] text-white p-4">
                        <h2 className="text-xl font-bold text-center sm:text-left">{event.event_name}</h2>
                      </div>
                      <div className="p-4 space-y-3">
                        <div className="flex items-start gap-3">
                          <MapPin className="h-5 w-5 text-black flex-shrink-0" />
                          <span className="text-black font-semibold">{event.location}</span>
                        </div>
                        <div className="flex items-start gap-3">
                          <Clock className="h-5 w-5 text-black flex-shrink-0" />
                          <span className="text-black font-semibold">{formatEventDate(event.date)}</span>
                        </div>
                        <div className="flex items-start gap-3">
                          <FileText className="h-5 w-5 text-black flex-shrink-0" />
                          <span className="text-black font-semibold">{event.description}</span>
                        </div>

                        <div className="flex justify-end relative mt-2">
                          {userAvailability[event.event_id] === "AVAILABLE" ? (
                            <button
                              className="px-4 py-2 rounded text-sm font-medium bg-[#B32113] hover:bg-[#a01d10] text-white"
                              onClick={() => toggleDropdown(event.event_id)}
                              disabled={updatingEventId === event.event_id}
                            >
                              Available
                            </button>
                          ) : userAvailability[event.event_id] === "UNAVAILABLE" ? (
                            <button
                              className="px-4 py-2 rounded text-sm font-medium bg-[#6F6F6F] hover:bg-[#5a5a5a] text-white"
                              onClick={() => toggleDropdown(event.event_id)}
                              disabled={updatingEventId === event.event_id}
                            >
                              Unavailable
                            </button>
                          ) : (
                            <button
                              className="availability-button px-4 py-2 rounded text-sm font-medium bg-[#831005] hover:bg-[#6e0d04] text-white"
                              onClick={() => toggleDropdown(event.event_id)}
                              disabled={updatingEventId === event.event_id}
                            >
                              {updatingEventId === event.event_id ? "Updating..." : "Mark Availability"}
                            </button>
                          )}

                          {activeDropdown === event.event_id && (
                            <div className="availability-dropdown absolute right-0 bottom-full mb-1 w-48 bg-white border border-[#D9D9D9] rounded-md shadow-lg z-30">
                              <div className="py-1">
                                <button
                                  onClick={() => handleAvailability(event.event_id, true)}
                                  className="w-full px-4 py-2 text-left flex items-center gap-2 hover:bg-gray-100"
                                >
                                  <div className="w-5 h-5 border border-[#831005] rounded flex items-center justify-center">
                                    {userAvailability[event.event_id] === "AVAILABLE" && (
                                      <div className="w-3 h-3 bg-[#831005] flex items-center justify-center text-white text-xs">
                                        ✓
                                      </div>
                                    )}
                                  </div>
                                  Available
                                </button>
                                <button
                                  onClick={() => handleAvailability(event.event_id, false)}
                                  className="w-full px-4 py-2 text-left flex items-center gap-2 hover:bg-gray-100"
                                >
                                  <div className="w-5 h-5 border border-[#831005] rounded flex items-center justify-center">
                                    {userAvailability[event.event_id] === "UNAVAILABLE" && (
                                      <div className="w-3 h-3 bg-[#831005] flex items-center justify-center text-white text-xs">
                                        ✕
                                      </div>
                                    )}
                                  </div>
                                  Unavailable
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-black w-full z-20">
            <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-screen-xl">
              <div className="flex justify-around items-center py-3">
                <a href="/volunteer/home" className="flex flex-col items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <polyline points="9 22 9 12 15 12 15 22" />
                  </svg>
                  <span className="text-xs mt-1 font-bold">HOME</span>
                </a>
                <a href="/volunteer/events" className="flex flex-col items-center text-[#831005]">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-[#831005]"
                  >
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                  <span className="text-xs mt-1 font-bold">EVENTS</span>
                </a>
                <a href="/volunteer/guide" className="flex flex-col items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                  </svg>
                  <span className="text-xs mt-1 font-bold">GUIDE</span>
                </a>

                <div className="relative profile-button">
                  <button onClick={toggleProfileMenu} className="flex flex-col items-center focus:outline-none">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                    <span className="text-xs mt-1 font-bold">PROFILE</span>
                  </button>

                  {showProfileMenu && (
                    <div className="absolute bottom-full mb-2 right-0 w-64 bg-white rounded-md shadow-lg py-1 z-50 profile-menu">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 mr-3">
                            <div className="w-10 h-10 rounded-full bg-[#e25822] flex items-center justify-center text-white font-bold">
                              {user?.firstName?.charAt(0) || user?.username?.charAt(0) || "U"}
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {user?.firstName && user?.lastName
                                ? `${user.firstName} ${user.lastName}`
                                : user?.username || "User"}
                            </p>
                            <p className="text-sm text-gray-500 truncate">
                              {user?.emailAddresses?.[0]?.emailAddress || ""}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="py-1">
                        <button
                          onClick={handleManageAccount}
                          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <svg
                            className="mr-3 h-5 w-5 text-gray-400"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Manage account
                        </button>
                        <button
                          onClick={handleSignOut}
                          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <svg
                            className="mr-3 h-5 w-5 text-gray-400"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V4a1 1 0 00-1-1H3zm11 4a1 1 0 10-2 0v4a1 1 0 102 0V7zm-3 1a1 1 0 10-2 0v3a1 1 0 102 0V8zM8 9a1 1 0 00-2 0v2a1 1 0 102 0V9z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Sign out
                        </button>
                      </div>
                      <div className="px-4 py-2 border-t border-gray-100 text-xs text-gray-400 text-center">
                        Secured by Clerk
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </SignedIn>
    </>
  )
}
