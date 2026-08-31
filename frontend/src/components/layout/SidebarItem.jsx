import { NavLink } from "react-router-dom";

const SidebarItem = ({
  to,
  icon: Icon,
  label,
  end = false,
}) => {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        [
          "group flex items-center gap-3 rounded-xl px-3.5 py-3",
          "text-sm font-medium transition-all duration-200",
          isActive
            ? "bg-rji-orange text-white shadow-sm"
            : "text-neutral-600 hover:bg-neutral-100 hover:text-rji-black",
        ].join(" ")
      }
    >
      <Icon size={19} strokeWidth={1.9} />
      <span>{label}</span>
    </NavLink>
  );
};

export default SidebarItem;