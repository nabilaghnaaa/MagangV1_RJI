import {
  Bell,
  ClipboardList,
  FileText,
  ChevronRight,
} from "lucide-react";
import {
  useCallback,
  useEffect,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";

import Dropdown from "../common/Dropdown";
import invitationService from "../../services/invitationService";
import assignmentService from "../../services/assignmentService";

const MAX_NOTIFICATIONS = 5;
const POLLING_INTERVAL = 30000;

const formatDate = (value) => {
  if (!value) {
    return "-";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return new Intl.DateTimeFormat(
    "id-ID",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  ).format(date);
};

const NotificationDropdown = () => {
  const navigate = useNavigate();

  const [
    open,
    setOpen,
  ] = useState(false);

  const [
    notifications,
    setNotifications,
  ] = useState([]);

  const [
    loading,
    setLoading,
  ] = useState(false);

  const loadNotifications =
    useCallback(
      async () => {
        try {
          setLoading(true);

          const [
            invitationResponse,
            assignmentResponse,
          ] = await Promise.all([
            invitationService.getAll({
              status: "pending",
            }),
            assignmentService.getAll({
              status: "pending",
            }),
          ]);

          const invitations =
            Array.isArray(
              invitationResponse?.data
            )
              ? invitationResponse.data
              : [];

          const assignments =
            Array.isArray(
              assignmentResponse?.data
            )
              ? assignmentResponse.data
              : [];

          const combined = [
            ...invitations.map(
              (item) => ({
                ...item,
                notificationType:
                  "invitation",
                applicantName:
                  item.participant_name,
                typeLabel:
                  "Surat Undangan",
              })
            ),
            ...assignments.map(
              (item) => ({
                ...item,
                notificationType:
                  "assignment",
                applicantName:
                  item.member_name,
                typeLabel:
                  "Surat Tugas",
              })
            ),
          ]
            .sort(
              (a, b) =>
                new Date(
                  b.createdAt ||
                    b.created_at ||
                    0
                ).getTime() -
                new Date(
                  a.createdAt ||
                    a.created_at ||
                    0
                ).getTime()
            )
            .slice(
              0,
              MAX_NOTIFICATIONS
            );

          setNotifications(
            combined
          );
        } catch (error) {
          console.error(
            "Gagal mengambil notifikasi pengajuan:",
            error
          );
        } finally {
          setLoading(false);
        }
      },
      []
    );

  useEffect(() => {
    loadNotifications();

    const interval =
      window.setInterval(
        loadNotifications,
        POLLING_INTERVAL
      );

    return () => {
      window.clearInterval(
        interval
      );
    };
  }, [
    loadNotifications,
  ]);

  useEffect(() => {
    if (open) {
      loadNotifications();
    }
  }, [
    open,
    loadNotifications,
  ]);

  const handleOpenNotification =
    (item) => {
      setOpen(false);

      navigate(
        `/pengajuan/${item.notificationType}/${item.id}`
      );
    };

  return (
    <Dropdown
      open={open}
      onClose={() =>
        setOpen(false)
      }
      align="right"
      width="w-[360px]"
      trigger={
        <button
          type="button"
          onClick={() =>
            setOpen(
              (previous) =>
                !previous
            )
          }
          aria-label="Notifikasi pengajuan"
          aria-expanded={open}
          className={[
            "relative flex h-10 w-10 items-center justify-center rounded-xl",
            "transition",
            open
              ? "bg-neutral-100 text-rji-black"
              : "text-neutral-500 hover:bg-neutral-100 hover:text-rji-black",
          ].join(" ")}
        >
          <Bell size={20} />

          {notifications.length >
            0 && (
            <span className="absolute right-2 top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-rji-orange px-1 text-[9px] font-bold leading-none text-white">
              {notifications.length >
              9
                ? "9+"
                : notifications.length}
            </span>
          )}
        </button>
      }
    >
      <div className="overflow-hidden">
        <div className="flex items-center justify-between border-b border-neutral-100 px-4 py-3.5">
          <div>
            <p className="text-sm font-semibold text-rji-black">
              Notifikasi Pengajuan
            </p>

            <p className="mt-0.5 text-xs text-neutral-400">
              Pengajuan baru yang perlu diperiksa.
            </p>
          </div>

          {notifications.length >
            0 && (
            <span className="rounded-full bg-orange-50 px-2 py-1 text-[11px] font-semibold text-rji-orange">
              {notifications.length}
            </span>
          )}
        </div>

        <div className="max-h-[390px] overflow-y-auto">
          {loading &&
          notifications.length ===
            0 ? (
            <div className="flex min-h-32 items-center justify-center px-5">
              <div className="text-center">
                <div className="mx-auto h-6 w-6 animate-spin rounded-full border-3 border-neutral-200 border-t-rji-orange" />

                <p className="mt-3 text-xs text-neutral-400">
                  Memuat pengajuan...
                </p>
              </div>
            </div>
          ) : notifications.length ===
            0 ? (
            <div className="px-5 py-10 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100 text-neutral-400">
                <Bell size={21} />
              </div>

              <p className="mt-4 text-sm font-semibold text-neutral-600">
                Belum ada pengajuan terbaru
              </p>

              <p className="mt-1 text-xs leading-5 text-neutral-400">
                Pengajuan baru akan muncul di sini.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-neutral-100">
              {notifications.map(
                (item) => (
                  <button
                    key={`${item.notificationType}-${item.id}`}
                    type="button"
                    onClick={() =>
                      handleOpenNotification(
                        item
                      )
                    }
                    className="flex w-full gap-3 px-4 py-3.5 text-left transition hover:bg-neutral-50"
                  >
                    <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-rji-orange">
                      <FileText
                        size={18}
                      />

                      <span className="absolute right-0 top-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-rji-orange" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <p className="truncate text-sm font-semibold text-rji-black">
                          Pengajuan baru
                        </p>

                        <ChevronRight
                          size={15}
                          className="mt-0.5 shrink-0 text-neutral-300"
                        />
                      </div>

                      <p className="mt-1 truncate text-sm font-medium text-neutral-700">
                        {item.activity_name ||
                          "-"}
                      </p>

                      <p className="mt-1 truncate text-xs text-neutral-500">
                        {item.applicantName ||
                          "-"}
                      </p>

                      <div className="mt-1 flex items-center gap-2 text-[11px] text-neutral-400">
                        <span>
                          {
                            item.typeLabel
                          }
                        </span>

                        <span>
                          •
                        </span>

                        <span>
                          {formatDate(
                            item.createdAt ||
                              item.created_at
                          )}
                        </span>
                      </div>
                    </div>
                  </button>
                )
              )}
            </div>
          )}
        </div>

        {notifications.length >
          0 && (
          <div className="border-t border-neutral-100 p-2">
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                navigate(
                  "/pengajuan"
                );
              }}
              className="flex w-full items-center justify-center rounded-xl px-3 py-2.5 text-xs font-semibold text-rji-orange transition hover:bg-orange-50"
            >
              Lihat semua pengajuan
            </button>
          </div>
        )}
      </div>
    </Dropdown>
  );
};

export default NotificationDropdown;