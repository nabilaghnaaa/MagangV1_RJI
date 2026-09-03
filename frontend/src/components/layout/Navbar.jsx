import {
  ChevronDown,
  LogOut,
  Menu,
  Settings,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import useAuthStore from "../../store/authStore";
import Dropdown from "../common/Dropdown";
import ConfirmDialog from "../common/ConfirmDialog";
import NotificationDropdown from "./NotificationDropdown";

const Navbar = ({
  onMenuClick,
}) => {
  const navigate = useNavigate();

  const user = useAuthStore(
    (state) => state.user
  );

  const logout = useAuthStore(
    (state) => state.logout
  );

  const [
    dropdownOpen,
    setDropdownOpen,
  ] = useState(false);

  const [
    logoutOpen,
    setLogoutOpen,
  ] = useState(false);

  const initials =
    user?.name
      ?.split(" ")
      .filter(Boolean)
      .map(
        (word) =>
          word[0]
      )
      .join("")
      .slice(0, 2)
      .toUpperCase() ||
    "AR";

  const handleAccountSettings =
    () => {
      setDropdownOpen(false);

      navigate(
        "/settings/account"
      );
    };

  const handleLogoutClick =
    () => {
      setDropdownOpen(false);
      setLogoutOpen(true);
    };

  const handleConfirmLogout =
    () => {
      logout();
      setLogoutOpen(false);

      navigate("/login", {
        replace: true,
      });
    };

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-neutral-200 bg-white/95 backdrop-blur">
        <div className="flex h-20 items-center justify-between px-4 sm:px-6 lg:px-8">
          <button
            type="button"
            onClick={onMenuClick}
            className="rounded-xl p-2.5 text-neutral-600 transition hover:bg-neutral-100 lg:hidden"
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
            <NotificationDropdown />

            <div className="hidden h-8 w-px bg-neutral-200 sm:block" />

            <Dropdown
              open={dropdownOpen}
              onClose={() =>
                setDropdownOpen(
                  false
                )
              }
              align="right"
              width="w-72"
              trigger={
                <button
                  type="button"
                  onClick={() =>
                    setDropdownOpen(
                      (previous) =>
                        !previous
                    )
                  }
                  aria-expanded={
                    dropdownOpen
                  }
                  className={[
                    "flex items-center gap-3 rounded-xl px-2 py-1.5",
                    "transition hover:bg-neutral-50",
                    dropdownOpen
                      ? "bg-neutral-50"
                      : "",
                  ].join(" ")}
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-rji-black text-xs font-bold text-white">
                    {initials}
                  </div>

                  <div className="hidden min-w-0 text-left sm:block">
                    <p className="truncate text-sm font-semibold text-rji-black">
                      {user?.name ||
                        "Admin RJI"}
                    </p>

                    <p className="truncate text-xs text-neutral-500">
                      {user?.role?.name ||
                        "admin"}
                    </p>
                  </div>

                  <ChevronDown
                    size={16}
                    className={[
                      "hidden shrink-0 text-neutral-400 transition-transform sm:block",
                      dropdownOpen
                        ? "rotate-180"
                        : "",
                    ].join(" ")}
                  />
                </button>
              }
            >
              <div className="p-2">
                <button
                  type="button"
                  onClick={
                    handleAccountSettings
                  }
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition hover:bg-orange-50"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-rji-orange">
                    <Settings
                      size={18}
                    />
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-rji-black">
                      {user?.name ||
                        "Admin RJI"}
                    </p>

                    <p className="truncate text-xs text-neutral-500">
                      {user?.email ||
                        "-"}
                    </p>

                    <p className="mt-1 text-xs font-medium text-rji-orange">
                      Buka pengaturan akun
                    </p>
                  </div>
                </button>

                <div className="my-1 border-t border-neutral-100" />

                <button
                  type="button"
                  onClick={
                    handleLogoutClick
                  }
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-neutral-600 transition hover:bg-red-50 hover:text-red-600"
                >
                  <LogOut
                    size={17}
                  />

                  <span>
                    Keluar
                  </span>
                </button>
              </div>
            </Dropdown>
          </div>
        </div>
      </header>

      <ConfirmDialog
        open={logoutOpen}
        onClose={() =>
          setLogoutOpen(false)
        }
        onConfirm={
          handleConfirmLogout
        }
        title="Konfirmasi Keluar"
        description="Apakah Anda yakin ingin keluar dari sistem?"
        confirmText="Ya, Keluar"
        cancelText="Batal"
        variant="danger"
      />
    </>
  );
};

export default Navbar;