import { Siren } from 'lucide-react'

export default function EmergencyPage() {
  return (
    <div className="w-[350px] p-4 text-center flex flex-col items-center">
      <Siren className="text-[maroon] mb-2 animate-bounce" size={50} />
      <p className="text-white-600 font-semibold">Emergency Hub</p>
      <p className="text-white-600 mt-2">
        Uh-oh! This page isn't quite ready to save the day just yet.
      </p>
      <p className="text-sm text-white-500 mt-1 italic">
        Soon you'll find quick links, emergency contacts, and urgent action plans — because when chaos calls, you'll be ready to answer.
      </p>
    </div>
  )
}

