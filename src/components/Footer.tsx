import { NavLink } from "react-router-dom";
import Dashboard_Icon from "@assets/navbar/admin/Dashboard_Icon.svg?react";
import Events_Icon from "@assets/navbar/admin/Events_Icon.svg?react";
import Assign_Icon from "@assets/navbar/admin/Assign_Icon.svg?react";
import Emergency_Icon from "@assets/navbar/admin/Emergency_Icon.svg?react";

export default function Footer() {
  const navItems = [
    { label: "DASHBOARD", path: "/admin", Icon: Dashboard_Icon },
    { label: "EVENTS", path: "/admin/events", Icon: Events_Icon },
    { label: "ASSIGN", path: "/admin/assignment", Icon: Assign_Icon },
    { label: "EMERGENCY", path: "/admin/emergency", Icon: Emergency_Icon },
  ];

  return (
    <div className="w-full flex flex-row justify-center border-t p-4">
      <div className="w-[400px] justify-between flex flex-row items-center text-center text-[10px]">
        {navItems.map(({ label, path, Icon }) => (
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
