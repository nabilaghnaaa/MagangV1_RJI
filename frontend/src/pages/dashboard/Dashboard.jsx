import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  ClipboardList,
  FileText,
  MapPin,
  RefreshCw,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import PageContainer from "../../components/layout/PageContainer";
import PageHeader from "../../components/layout/PageHeader";
import Button from "../../components/common/Button";
import StatCard from "../../components/common/StatCard";

import invitationService from "../../services/invitationService";
import assignmentService from "../../services/assignmentService";
import suratService from "../../services/suratService";

const ITEMS_PER_PAGE = 5;

const formatDate = (value) => {
  if (!value) {
    return "-";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
  }).format(date);
};

const getStatusLabel = (status) => {
  const labels = {
    pending: "Menunggu",
    review: "Direview",
    approved: "Disetujui",
    rejected: "Ditolak",
    issued: "Terbit",
    sent: "Terkirim",
    cancelled: "Dibatalkan",
  };

  return labels[status] || status || "-";
};

const getStatusClass = (status) => {
  const classes = {
    pending:
      "bg-yellow-50 text-yellow-700",
    review:
      "bg-blue-50 text-blue-700",
    approved:
      "bg-green-50 text-green-700",
    rejected:
      "bg-red-50 text-red-700",
    issued:
      "bg-orange-50 text-rji-orange",
    sent:
      "bg-green-50 text-green-700",
    cancelled:
      "bg-neutral-100 text-neutral-500",
  };

  return (
    classes[status] ||
    "bg-neutral-100 text-neutral-500"
  );
};

const Dashboard = () => {
  const navigate = useNavigate();

  const [invitations, setInvitations] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [surats, setSurats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [recentPage, setRecentPage] = useState(1);

  const loadDashboard = async () => {
    setLoading(true);
    setError("");

    try {
      const [
        invitationResponse,
        assignmentResponse,
        suratResponse,
      ] = await Promise.all([
        invitationService.getAll(),
        assignmentService.getAll(),
        suratService.getAll(),
      ]);

      setInvitations(
        Array.isArray(
          invitationResponse?.data
        )
          ? invitationResponse.data
          : []
      );

      setAssignments(
        Array.isArray(
          assignmentResponse?.data
        )
          ? assignmentResponse.data
          : []
      );

      setSurats(
        Array.isArray(
          suratResponse?.data
        )
          ? suratResponse.data
          : []
      );
    } catch (requestError) {
      console.error(
        "Gagal mengambil data dashboard:",
        requestError
      );

      setError(
        requestError.response?.data?.message ||
          "Gagal mengambil data dashboard."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const stats = useMemo(() => {
    const allSubmissions = [
      ...invitations.map((item) => ({
        ...item,
        type: "invitation",
      })),
      ...assignments.map((item) => ({
        ...item,
        type: "assignment",
      })),
    ];

    const waitingReview =
      allSubmissions.filter(
        (item) =>
          item.status === "pending" ||
          item.status === "review"
      );

    const publishedSurats =
      surats.filter(
        (item) =>
          item.status === "issued" ||
          item.status === "sent"
      );

    return {
      totalSubmissions:
        allSubmissions.length,
      waitingReview:
        waitingReview.length,
      publishedSurats:
        publishedSurats.length,
      totalSurats:
        surats.length,
    };
  }, [
    invitations,
    assignments,
    surats,
  ]);

  const allRecentSubmissions = useMemo(() => {
    return [
      ...invitations.map((item) => ({
        ...item,
        type: "invitation",
        applicantName:
          item.participant_name,
      })),
      ...assignments.map((item) => ({
        ...item,
        type: "assignment",
        applicantName:
          item.member_name,
      })),
    ].sort(
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
    );
  }, [
    invitations,
    assignments,
  ]);

  const totalRecentPages = Math.max(
    1,
    Math.ceil(
      allRecentSubmissions.length /
        ITEMS_PER_PAGE
    )
  );

  const recentSubmissions = useMemo(() => {
    const startIndex =
      (recentPage - 1) *
      ITEMS_PER_PAGE;

    return allRecentSubmissions.slice(
      startIndex,
      startIndex + ITEMS_PER_PAGE
    );
  }, [
    allRecentSubmissions,
    recentPage,
  ]);

  useEffect(() => {
    if (
      recentPage >
      totalRecentPages
    ) {
      setRecentPage(
        totalRecentPages
      );
    }
  }, [
    recentPage,
    totalRecentPages,
  ]);

  const goToRecentPage = (page) => {
    if (
      page < 1 ||
      page > totalRecentPages
    ) {
      return;
    }

    setRecentPage(page);
  };

  return (
    <PageContainer>
      <PageHeader
        title="Dashboard"
        description="Ringkasan aktivitas Sistem Persuratan RJI."
        action={
          <Button
            variant="outline"
            icon={RefreshCw}
            onClick={() => {
              setRecentPage(1);
              loadDashboard();
            }}
            loading={loading}
          >
            Refresh
          </Button>
        }
      />

      {error && (
        <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Pengajuan"
          value={
            loading
              ? "..."
              : stats.totalSubmissions
          }
          description="Seluruh pengajuan masuk"
        />

        <StatCard
          label="Menunggu Review"
          value={
            loading
              ? "..."
              : stats.waitingReview
          }
          description="Perlu diperiksa admin"
        />

        <StatCard
          label="Surat Diterbitkan"
          value={
            loading
              ? "..."
              : stats.publishedSurats
          }
          description="Surat sudah diterbitkan"
        />

        <StatCard
          label="Total Surat"
          value={
            loading
              ? "..."
              : stats.totalSurats
          }
          description="Seluruh surat tersimpan"
        />
      </section>

      <section className="mt-6 w-full">
        <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-semibold text-rji-black">
                Pengajuan Terbaru
              </h2>

              <p className="mt-1 text-sm text-neutral-500">
                Pengajuan surat yang baru masuk.
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                navigate("/pengajuan")
              }
              className="text-sm font-semibold text-rji-orange transition hover:text-orange-600"
            >
              Lihat semua
            </button>
          </div>

          <div className="mt-6">
            {loading ? (
              <div className="flex min-h-52 items-center justify-center rounded-xl border border-dashed border-neutral-200 bg-neutral-50">
                <div className="text-center">
                  <div className="mx-auto h-7 w-7 animate-spin rounded-full border-4 border-neutral-200 border-t-rji-orange" />

                  <p className="mt-3 text-sm text-neutral-500">
                    Memuat pengajuan...
                  </p>
                </div>
              </div>
            ) : recentSubmissions.length === 0 ? (
              <div className="flex min-h-52 items-center justify-center rounded-xl border border-dashed border-neutral-200 bg-neutral-50">
                <div className="text-center">
                  <ClipboardList
                    size={30}
                    className="mx-auto text-neutral-300"
                  />

                  <p className="mt-3 text-sm font-medium text-neutral-500">
                    Belum ada pengajuan
                  </p>

                  <p className="mt-1 text-xs text-neutral-400">
                    Data akan muncul ketika pemohon mengirim form.
                  </p>
                </div>
              </div>
            ) : (
              <>
                <div className="divide-y divide-neutral-100">
                  {recentSubmissions.map(
                    (item) => (
                      <button
                        key={`${item.type}-${item.id}`}
                        type="button"
                        onClick={() =>
                          navigate(
                            `/pengajuan/${item.type}/${item.id}`
                          )
                        }
                        className="flex w-full items-center gap-4 py-4 text-left transition first:pt-0 last:pb-0 hover:bg-neutral-50"
                      >
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-rji-orange">
                          <FileText
                            size={19}
                          />
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="truncate text-sm font-semibold text-rji-black">
                              {item.activity_name ||
                                "-"}
                            </p>

                            <span
                              className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${getStatusClass(
                                item.status
                              )}`}
                            >
                              {getStatusLabel(
                                item.status
                              )}
                            </span>
                          </div>

                          <p className="mt-1 truncate text-xs text-neutral-500">
                            {item.applicantName ||
                              "-"}
                          </p>

                          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-neutral-400">
                            <span className="inline-flex items-center gap-1">
                              <CalendarDays
                                size={13}
                              />
                              {formatDate(
                                item.activity_date
                              )}
                            </span>

                            <span className="inline-flex items-center gap-1">
                              <MapPin
                                size={13}
                              />
                              {item.location ||
                                "-"}
                            </span>
                          </div>
                        </div>
                      </button>
                    )
                  )}
                </div>

                {totalRecentPages > 1 && (
                  <div className="mt-5 flex flex-col gap-4 border-t border-neutral-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-xs text-neutral-400">
                      Halaman{" "}
                      <span className="font-semibold text-neutral-600">
                        {recentPage}
                      </span>{" "}
                      dari{" "}
                      <span className="font-semibold text-neutral-600">
                        {totalRecentPages}
                      </span>
                    </p>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() =>
                          goToRecentPage(
                            recentPage - 1
                          )
                        }
                        disabled={
                          recentPage === 1
                        }
                        className="flex h-9 min-w-9 items-center justify-center rounded-lg border border-neutral-200 px-3 text-sm font-medium text-neutral-600 transition hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        ‹
                      </button>

                      {Array.from(
                        {
                          length:
                            totalRecentPages,
                        },
                        (_, index) =>
                          index + 1
                      ).map((page) => (
                        <button
                          key={page}
                          type="button"
                          onClick={() =>
                            goToRecentPage(
                              page
                            )
                          }
                          className={[
                            "flex h-9 min-w-9 items-center justify-center rounded-lg px-3 text-sm font-semibold transition",
                            recentPage ===
                            page
                              ? "bg-rji-orange text-white"
                              : "border border-neutral-200 text-neutral-600 hover:bg-neutral-50",
                          ].join(" ")}
                        >
                          {page}
                        </button>
                      ))}

                      <button
                        type="button"
                        onClick={() =>
                          goToRecentPage(
                            recentPage + 1
                          )
                        }
                        disabled={
                          recentPage ===
                          totalRecentPages
                        }
                        className="flex h-9 min-w-9 items-center justify-center rounded-lg border border-neutral-200 px-3 text-sm font-medium text-neutral-600 transition hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        ›
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </section>
    </PageContainer>
  );
};

export default Dashboard;