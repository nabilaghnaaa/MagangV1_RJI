import {
  LayoutDashboard,
  FileText,
  ClipboardList,
  FileCheck2,
  Settings,
  LogOut,
  X,
  Building2,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import SidebarItem from "./SidebarItem";
import useAuthStore from "../../store/authStore";
import usePermission from "../../hooks/usePermission";

const Sidebar = ({
  mobileOpen,
  onClose,
}) => {
  const navigate = useNavigate();

  const logout = useAuthStore(
    (state) => state.logout
  );

  const { hasPermission } =
    usePermission();

  const handleLogout = () => {
    logout();

    navigate("/login", {
      replace: true,
    });

    onClose?.();
  };

  const handleMenuClick = () => {
    onClose?.();
  };

  const menuItems = [
    {
      label: "Dashboard",
      to: "/dashboard",
      icon: LayoutDashboard,
      end: true,
      permission: "dashboard.view",
    },
    {
      label: "Pengajuan",
      to: "/pengajuan",
      icon: ClipboardList,
      permission: "submission.view",
    },
    {
      label: "Surat Terbit",
      to: "/surat",
      icon: FileText,
      permission: "surat.view",
    },
    {
      label: "Template",
      to: "/templates",
      icon: FileCheck2,
      permission: "template.view",
    },
    {
      label: "Organisasi",
      to: "/settings/organization",
      icon: Building2,
      permission: "settings.view",
    },
    {
      label: "Tanda Tangan",
      to: "/settings/signature",
      icon: FileCheck2,
      permission: "settings.view",
    },
    {
      label: "Pengaturan Profil",
      to: "/settings/account",
      icon: Settings,
      permission: "settings.view",
    },
  ];

  const visibleMenuItems =
    menuItems.filter((item) =>
      hasPermission(
        item.permission
      )
    );

  return (
    <>
      {mobileOpen && (
        <button
          type="button"
          aria-label="Tutup sidebar"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
        />
      )}

      <aside
        className={[
          "fixed inset-y-0 left-0 z-50 flex w-72 flex-col",
          "border-r border-neutral-200 bg-white",
          "transition-transform duration-300",
          mobileOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0",
        ].join(" ")}
      >
        <div className="flex h-20 items-center justify-between border-b border-neutral-200 px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rji-orange">
              <span className="text-lg font-black text-white">
                R
              </span>
            </div>

            <div>
              <p className="text-sm font-bold tracking-tight text-rji-black">
                Relawan Jurnal
              </p>

              <p className="text-xs text-neutral-500">
                Indonesia
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-neutral-500 transition hover:bg-neutral-100 hover:text-rji-black lg:hidden"
            aria-label="Tutup menu"
          >
            <X size={19} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-6">
          <p className="px-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-neutral-400">
            Menu Utama
          </p>

          <nav className="mt-3 space-y-1.5">
            {visibleMenuItems.map(
              (item) => (
                <div
                  key={item.to}
                  onClick={
                    handleMenuClick
                  }
                >
                  <SidebarItem
                    to={item.to}
                    icon={item.icon}
                    label={item.label}
                    end={item.end}
                  />
                </div>
              )
            )}
          </nav>
        </div>

        <div className="border-t border-neutral-200 p-4">
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-medium text-neutral-600 transition hover:bg-red-50 hover:text-red-600"
          >
            <LogOut size={19} />

            <span>Keluar</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;