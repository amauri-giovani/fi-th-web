import { Home, Users, MapPin } from "lucide-react";
import { NavLink } from "react-router-dom";

const menuItems = [
  { label: "Home", icon: <Home size={20} />, to: "/" },
  { label: "Grupos", icon: <Users size={20} />, to: "/companies/groups" },
  { label: "Pos", icon: <MapPin size={20} />, to: "/pos" },
];

export function Sidebar() {
  return (
    <aside className="w-64 h-full bg-white border-r border-gray-200">
      <div className="text-xl font-bold px-6 py-4 text-primary">FI-TH</div>
      <nav className="flex flex-col px-4 pt-2 space-y-2">
        {menuItems.map(({ label, icon, to }) => (
          <NavLink
            key={label}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-full transition-all font-medium ${
                isActive
                  ? "bg-primary text-white shadow"
                  : "text-primary hover:bg-primary/10"
              }`
            }
          >
            {icon}
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
