import { Bandage } from 'lucide-react'

export default function FirstAidGuide() {
  return (
    <div className="w-[350px] p-4 text-center flex flex-col items-center">
      <Bandage className="text-[maroon] mb-2 animate-bounce" size={50} />
      <p className="text-white-600 font-semibold">First Aid Guide</p>
      <p className="text-white-600 mt-2">
        This page is still under construction — but don’t worry, no bandages needed.
      </p>
      <p className="text-sm text-white-500 mt-1 italic">
        Soon you'll find quick tips, emergency steps, and essential info to help you respond confidently in any situation.
      </p>
    </div>
  )
}


