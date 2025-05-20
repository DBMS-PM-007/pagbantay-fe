import { NavLink } from "react-router-dom";
import Dashboard_Icon from "@assets/navbar/admin/Dashboard_Icon.svg?react";
import Events_Icon from "@assets/navbar/admin/Events_Icon.svg?react";
import Assign_Icon from "@assets/navbar/admin/Assign_Icon.svg?react";
import Emergency_Icon from "@assets/navbar/admin/Emergency_Icon.svg?react";
import Home_Icon from "@assets/navbar/volunteer/Home_Icon.svg?react";
import Guide_Icon from "@assets/navbar/volunteer/Guide_Icon.svg?react";
import Profile_Icon from "@assets/navbar/volunteer/Profile_Icon.svg?react";

type BottomNavProps = {
  type: "admin" | "volunteer" | "auth";
}

export default function BottomNav({ type }: BottomNavProps) {
  const adminNavItems = [
    { label: "DASHBOARD", path: "/admin", Icon: Dashboard_Icon },
    { label: "EVENTS", path: "/admin/events", Icon: Events_Icon },
    { label: "ASSIGN", path: "/admin/assign-volunteers", Icon: Assign_Icon },
    { label: "EMERGENCY", path: "/admin/emergency", Icon: Emergency_Icon },
  ];

  const volunteerNavItems = [
    { label: "HOME", path: "/volunteer", Icon: Home_Icon },
    { label: "EVENTS", path: "/volunteer/events", Icon: Events_Icon },
    { label: "GUIDE", path: "/volunteer/guide", Icon: Guide_Icon },
    { label: "PROFILE", path: "/volunteer/profile", Icon: Profile_Icon },
  ];

  return (
    type != "auth" && <div className="fixed bottom-0 bg-white w-full flex flex-row justify-center border-t p-4 z-10">
      <div className="w-[350px] justify-between flex flex-row items-center text-center text-[10px]">
        {(type == "admin" ? adminNavItems : volunteerNavItems).map(({ label, path, Icon }) => (
          <NavLink
            key={label}
            to={path}
            className="flex flex-col items-center hover:cursor-pointer gap-[2px]"
          >
            <Icon className="w-[30px] h-[30px]" />
            <span className="font-semibold">{label}</span>
          </NavLink>
        ))}
      </div>
    </div>
  );
}
