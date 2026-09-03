import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ClipboardList,
  Eye,
  FileText,
  RefreshCw,
  UserRound,
} from "lucide-react";

import PageContainer from "../../components/layout/PageContainer";
import PageHeader from "../../components/layout/PageHeader";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import StatCard from "../../components/common/StatCard";
import TableSearch from "../../components/table/TableSearch";
import TableFilter from "../../components/table/TableFilter";
import DataTable from "../../components/table/DataTable";

import invitationService from "../../services/invitationService";
import assignmentService from "../../services/assignmentService";

const STATUS_OPTIONS = [
  {
    value: "pending",
    label: "Menunggu",
  },
  {
    value: "review",
    label: "Direview",
  },
  {
    value: "approved",
    label: "Disetujui",
  },
  {
    value: "rejected",
    label: "Ditolak",
  },
];

const TYPE_OPTIONS = [
  {
    value: "all",
    label: "Semua Jenis",
  },
  {
    value: "invitation",
    label: "Surat Undangan",
  },
  {
    value: "assignment",
    label: "Surat Tugas",
  },
];

const TYPE_LABELS = {
  invitation: "Surat Undangan",
  assignment: "Surat Tugas",
};

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

const normalizeInvitation = (item) => ({
  ...item,
  type: "invitation",
  applicant_name:
    item.participant_name,
  applicant_email:
    item.participant_email,
});

const normalizeAssignment = (item) => ({
  ...item,
  type: "assignment",
  applicant_name:
    item.member_name,
  applicant_email:
    item.member_email,
});

const StatusBadge = ({
  status,
}) => {
  const labels = {
    pending: "Menunggu",
    review: "Direview",
    approved: "Disetujui",
    rejected: "Ditolak",
  };

  const classes = {
    pending:
      "border-yellow-200 bg-yellow-50 text-yellow-700",
    review:
      "border-blue-200 bg-blue-50 text-blue-700",
    approved:
      "border-green-200 bg-green-50 text-green-700",
    rejected:
      "border-red-200 bg-red-50 text-red-700",
  };

  return (
    <span
      className={[
        "inline-flex rounded-full border px-3 py-1 text-xs font-semibold",
        classes[status] ||
          "border-neutral-200 bg-neutral-50 text-neutral-600",
      ].join(" ")}
    >
      {labels[status] ||
        status ||
        "-"}
    </span>
  );
};

const Pengajuan = () => {
  const navigate = useNavigate();

  const [activeType, setActiveType] =
    useState("all");

  const [status, setStatus] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [invitations, setInvitations] =
    useState([]);

  const [assignments, setAssignments] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const loadData = async () => {
    setLoading(true);
    setError("");

    try {
      const params = status
        ? {
            status,
          }
        : {};

      const [
        invitationResponse,
        assignmentResponse,
      ] = await Promise.all([
        invitationService.getAll(
          params
        ),
        assignmentService.getAll(
          params
        ),
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
    } catch (requestError) {
      console.error(
        "Gagal mengambil data pengajuan:",
        requestError
      );

      setError(
        requestError.response?.data
          ?.message ||
          "Gagal mengambil data pengajuan."
      );

      setInvitations([]);
      setAssignments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [status]);

  const rows = useMemo(() => {
    const invitationRows =
      invitations.map(
        normalizeInvitation
      );

    const assignmentRows =
      assignments.map(
        normalizeAssignment
      );

    let result = [
      ...invitationRows,
      ...assignmentRows,
    ];

    if (activeType !== "all") {
      result = result.filter(
        (item) =>
          item.type ===
          activeType
      );
    }

    const keyword = search
      .trim()
      .toLowerCase();

    if (keyword) {
      result = result.filter(
        (item) => {
          const searchableValues = [
            item.applicant_name,
            item.applicant_email,
            item.activity_name,
            item.location,
            item.organization,
            item.member_organization,
            item.member_role,
          ];

          return searchableValues
            .filter(Boolean)
            .some((value) =>
              String(value)
                .toLowerCase()
                .includes(keyword)
            );
        }
      );
    }

    return result.sort(
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
    activeType,
    search,
  ]);

  const summary = useMemo(() => {
    const all = [
      ...invitations,
      ...assignments,
    ];

    return {
      all: all.length,
      invitation:
        invitations.length,
      assignment:
        assignments.length,
      pending: all.filter(
        (item) =>
          item.status ===
          "pending"
      ).length,
      review: all.filter(
        (item) =>
          item.status ===
          "review"
      ).length,
    };
  }, [
    invitations,
    assignments,
  ]);

  const handleOpenDetail = (
    row
  ) => {
    navigate(
      `/pengajuan/${row.type}/${row.id}`
    );
  };

  const columns = [
    {
      key: "applicant",
      label: "Pemohon",
      headerClassName:
        "bg-orange-50 text-rji-black",

      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-rji-orange">
            <UserRound size={18} />
          </div>

          <div className="min-w-0">
            <p className="truncate font-semibold text-rji-black">
              {row.applicant_name}
            </p>

            <p className="mt-0.5 truncate text-xs text-neutral-500">
              {row.applicant_email}
            </p>
          </div>
        </div>
      ),
    },

    {
      key: "type",
      label: "Jenis",
      headerClassName:
        "bg-orange-50 text-rji-black",

      render: (row) => (
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-100 text-neutral-500">
            <FileText size={16} />
          </div>

          <span className="text-sm font-medium text-rji-black">
            {TYPE_LABELS[
              row.type
            ] || "-"}
          </span>
        </div>
      ),
    },

    {
      key: "activity_name",
      label: "Kegiatan",
      headerClassName:
        "bg-orange-50 text-rji-black",

      render: (row) => (
        <div className="max-w-xs">
          <p className="truncate font-medium text-rji-black">
            {row.activity_name}
          </p>

          <p className="mt-1 truncate text-xs text-neutral-500">
            {row.location ||
              "-"}
          </p>
        </div>
      ),
    },

    {
      key: "activity_date",
      label: "Tanggal",
      headerClassName:
        "bg-orange-50 text-rji-black",

      render: (row) => (
        <span className="whitespace-nowrap text-sm text-neutral-600">
          {formatDate(
            row.activity_date
          )}
        </span>
      ),
    },

    {
      key: "status",
      label: "Status",
      headerClassName:
        "bg-orange-50 pr-10 text-rji-black",
      className: "pr-10",

      render: (row) => (
        <StatusBadge
          status={row.status}
        />
      ),
    },

    {
      key: "action",
      label: "Aksi",
      headerClassName:
        "bg-orange-50 pl-10 pr-20 text-right text-rji-black",
      className:
        "pl-10 pr-12",

      render: (row) => (
        <div className="flex justify-end">
          <Button
            variant="outline"
            size="sm"
            icon={Eye}
            onClick={() =>
              handleOpenDetail(
                row
              )
            }
          >
            Detail
          </Button>
        </div>
      ),
    },
  ];

  return (
    <PageContainer>
      <PageHeader
        title="Pengajuan"
        description="Kelola dan periksa pengajuan Surat Undangan dan Surat Tugas yang masuk."
        action={
          <Button
            variant="outline"
            icon={RefreshCw}
            loading={loading}
            onClick={loadData}
          >
            Refresh
          </Button>
        }
      />

      {error && (
        <div className="mb-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-5 py-4">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-600">
            <ClipboardList
              size={17}
            />
          </div>

          <div>
            <p className="text-sm font-semibold text-red-800">
              Gagal memuat data
            </p>

            <p className="mt-1 text-sm text-red-700">
              {error}
            </p>
          </div>
        </div>
      )}

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Pengajuan"
          value={summary.all}
          description="Semua jenis pengajuan"
        />

        <StatCard
          label="Surat Undangan"
          value={summary.invitation}
          description="Pengajuan dari peserta"
        />

        <StatCard
          label="Surat Tugas"
          value={summary.assignment}
          description="Pengajuan dari anggota RJI"
        />

        <StatCard
          label="Perlu Review"
          value={
            summary.pending +
            summary.review
          }
          description="Menunggu pemeriksaan admin"
        />
      </div>

      <Card>
        <div className="flex flex-col gap-5 border-b border-neutral-200 pb-5">
          <div>
            <h2 className="text-base font-semibold text-rji-black">
              Daftar Pengajuan
            </h2>

            <p className="mt-1 text-sm text-neutral-500">
              Periksa kesesuaian data sebelum pengajuan disetujui.
            </p>
          </div>

          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex flex-wrap gap-2">
              {TYPE_OPTIONS.map(
                (option) => {
                  const active =
                    activeType ===
                    option.value;

                  let count =
                    summary.all;

                  if (
                    option.value ===
                    "invitation"
                  ) {
                    count =
                      summary.invitation;
                  }

                  if (
                    option.value ===
                    "assignment"
                  ) {
                    count =
                      summary.assignment;
                  }

                  return (
                    <button
                      key={
                        option.value
                      }
                      type="button"
                      onClick={() =>
                        setActiveType(
                          option.value
                        )
                      }
                      className={[
                        "inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all",
                        active
                          ? "bg-rji-black text-white shadow-sm"
                          : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200 hover:text-rji-black",
                      ].join(" ")}
                    >
                      <span>
                        {option.label}
                      </span>

                      <span
                        className={[
                          "rounded-full px-2 py-0.5 text-[11px]",
                          active
                            ? "bg-white/15 text-white"
                            : "bg-white text-neutral-500",
                        ].join(" ")}
                      >
                        {count}
                      </span>
                    </button>
                  );
                }
              )}
            </div>

            <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center xl:w-auto">
              <div className="w-full sm:w-80 xl:w-80">
                <TableSearch
                  value={search}
                  onChange={
                    setSearch
                  }
                  placeholder="Cari pemohon atau kegiatan..."
                />
              </div>

              <div className="w-full sm:w-56 xl:w-60">
                <TableFilter
                  value={status}
                  onChange={
                    setStatus
                  }
                  options={
                    STATUS_OPTIONS
                  }
                  label="Semua status"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-5 overflow-hidden">
          <DataTable
            columns={columns}
            data={rows}
            loading={loading}
            emptyTitle="Belum ada pengajuan"
            emptyDescription="Pengajuan Surat Undangan dan Surat Tugas akan muncul di sini."
          />
        </div>
      </Card>
    </PageContainer>
  );
};

export default Pengajuan;