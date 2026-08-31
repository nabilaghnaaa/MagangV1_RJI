import {
  Menu,
  Bell,
  ChevronDown,
} from "lucide-react";

import useAuthStore from "../../store/authStore";

const Navbar = ({ onMenuClick }) => {
  const user = useAuthStore((state) => state.user);

  const initials =
    user?.name
      ?.split(" ")
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "AR";

  return (
    <header className="sticky top-0 z-30 border-b border-neutral-200 bg-white/90 backdrop-blur">
      <div className="flex h-20 items-center justify-between px-4 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={onMenuClick}
          className="rounded-xl p-2.5 text-neutral-600 hover:bg-neutral-100 lg:hidden"
          aria-label="Buka menu"
        >
          <Menu size={22} />
        </button>

        <div className="hidden lg:block">
          <p className="text-sm font-medium text-neutral-500">
            Sistem Persuratan
          </p>

          <p className="text-xs text-neutral-400">
            Relawan Jurnal Indonesia
          </p>
        </div>

        <div className="ml-auto flex items-center gap-3">
          <button
            type="button"
            className="relative rounded-xl p-2.5 text-neutral-500 transition hover:bg-neutral-100 hover:text-rji-black"
            aria-label="Notifikasi"
          >
            <Bell size={20} />

            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-rji-orange" />
          </button>

          <div className="hidden h-8 w-px bg-neutral-200 sm:block" />

          <button
            type="button"
            className="flex items-center gap-3 rounded-xl px-2 py-1.5 hover:bg-neutral-50"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-rji-black text-xs font-bold text-white">
              {initials}
            </div>

            <div className="hidden text-left sm:block">
              <p className="text-sm font-semibold text-rji-black">
                {user?.name || "Admin RJI"}
              </p>

              <p className="text-xs text-neutral-500">
                {user?.role?.name || "admin"}
              </p>
            </div>

            <ChevronDown
              size={16}
              className="hidden text-neutral-400 sm:block"
            />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;