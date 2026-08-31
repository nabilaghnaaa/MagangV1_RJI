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
import TableSearch from "../../components/table/TableSearch";
import TableFilter from "../../components/table/TableFilter";
import DataTable from "../../components/table/DataTable";
import SuratStatusBadge from "../../components/surat/SuratStatusBadge";

import invitationService from "../../services/invitationService";
import assignmentService from "../../services/assignmentService";

/*
|--------------------------------------------------------------------------
| Configuration
|--------------------------------------------------------------------------
*/

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

/*
|--------------------------------------------------------------------------
| Helpers
|--------------------------------------------------------------------------
*/

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

  applicant_name: item.participant_name,
  applicant_email: item.participant_email,
});

const normalizeAssignment = (item) => ({
  ...item,
  type: "assignment",

  applicant_name: item.member_name,
  applicant_email: item.member_email,
});

/*
|--------------------------------------------------------------------------
| Component
|--------------------------------------------------------------------------
*/

const Pengajuan = () => {
  const navigate = useNavigate();

  const [activeType, setActiveType] = useState("all");
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");

  const [invitations, setInvitations] = useState([]);
  const [assignments, setAssignments] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /*
  |--------------------------------------------------------------------------
  | Load Data
  |--------------------------------------------------------------------------
  */

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
        invitationService.getAll(params),
        assignmentService.getAll(params),
      ]);

      setInvitations(
        invitationResponse?.data || []
      );

      setAssignments(
        assignmentResponse?.data || []
      );
    } catch (requestError) {
      console.error(
        "Gagal mengambil data pengajuan:",
        requestError
      );

      setError(
        requestError.response?.data?.message ||
          "Gagal mengambil data pengajuan."
      );

      setInvitations([]);
      setAssignments([]);
    } finally {
      setLoading(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Initial Load & Status Filter
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    loadData();
  }, [status]);

  /*
  |--------------------------------------------------------------------------
  | Combine + Filter Data
  |--------------------------------------------------------------------------
  */

  const rows = useMemo(() => {
    const invitationRows = invitations.map(
      normalizeInvitation
    );

    const assignmentRows = assignments.map(
      normalizeAssignment
    );

    let result = [
      ...invitationRows,
      ...assignmentRows,
    ];

    /*
    |--------------------------------------------------------------------------
    | Filter Type
    |--------------------------------------------------------------------------
    */

    if (activeType !== "all") {
      result = result.filter(
        (item) => item.type === activeType
      );
    }

    /*
    |--------------------------------------------------------------------------
    | Search
    |--------------------------------------------------------------------------
    */

    const keyword = search.trim().toLowerCase();

    if (keyword) {
      result = result.filter((item) => {
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
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Sort Newest First
    |--------------------------------------------------------------------------
    */

    return result.sort((a, b) => {
      const firstDate = new Date(
        a.createdAt || a.created_at || 0
      ).getTime();

      const secondDate = new Date(
        b.createdAt || b.created_at || 0
      ).getTime();

      return secondDate - firstDate;
    });
  }, [
    invitations,
    assignments,
    activeType,
    search,
  ]);

  /*
  |--------------------------------------------------------------------------
  | Summary
  |--------------------------------------------------------------------------
  */

  const summary = useMemo(() => {
    return {
      all:
        invitations.length +
        assignments.length,

      invitation: invitations.length,

      assignment: assignments.length,

      pending: [
        ...invitations,
        ...assignments,
      ].filter(
        (item) => item.status === "pending"
      ).length,

      review: [
        ...invitations,
        ...assignments,
      ].filter(
        (item) => item.status === "review"
      ).length,

      approved: [
        ...invitations,
        ...assignments,
      ].filter(
        (item) => item.status === "approved"
      ).length,

      rejected: [
        ...invitations,
        ...assignments,
      ].filter(
        (item) => item.status === "rejected"
      ).length,
    };
  }, [invitations, assignments]);

  /*
  |--------------------------------------------------------------------------
  | Open Detail
  |--------------------------------------------------------------------------
  */

  const handleOpenDetail = (row) => {
    navigate(
      `/pengajuan/${row.type}/${row.id}`
    );
  };

  /*
  |--------------------------------------------------------------------------
  | Table Columns
  |--------------------------------------------------------------------------
  */

  const columns = [
    {
      key: "applicant",
      label: "Pemohon",

      render: (row) => {
        return (
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
        );
      },
    },

    {
      key: "type",
      label: "Jenis",

      render: (row) => {
        return (
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-100 text-neutral-500">
              <FileText size={16} />
            </div>

            <span className="text-sm font-medium text-rji-black">
              {TYPE_LABELS[row.type] || "-"}
            </span>
          </div>
        );
      },
    },

    {
      key: "activity_name",
      label: "Kegiatan",

      render: (row) => {
        return (
          <div className="max-w-xs">
            <p className="truncate font-medium text-rji-black">
              {row.activity_name}
            </p>

            <p className="mt-1 truncate text-xs text-neutral-500">
              {row.location || "-"}
            </p>
          </div>
        );
      },
    },

    {
      key: "activity_date",
      label: "Tanggal",

      render: (row) => (
        <span className="whitespace-nowrap text-sm text-neutral-600">
          {formatDate(row.activity_date)}
        </span>
      ),
    },

    {
      key: "status",
      label: "Status",

      render: (row) => (
        <SuratStatusBadge
          status={row.status}
        />
      ),
    },

    {
      key: "action",
      label: "Aksi",
      headerClassName: "text-right",

      render: (row) => (
        <div className="flex justify-end">
          <Button
            variant="outline"
            size="sm"
            icon={Eye}
            onClick={() =>
              handleOpenDetail(row)
            }
          >
            Detail
          </Button>
        </div>
      ),
    },
  ];

  /*
  |--------------------------------------------------------------------------
  | Render
  |--------------------------------------------------------------------------
  */

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
            <ClipboardList size={17} />
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

      {/* ===========================================================
          Summary
      ============================================================ */}

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card padding="p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-500">
                Total Pengajuan
              </p>

              <p className="mt-2 text-3xl font-bold tracking-tight text-rji-black">
                {summary.all}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-rji-orange">
              <ClipboardList size={21} />
            </div>
          </div>

          <p className="mt-3 text-xs text-neutral-400">
            Semua jenis pengajuan
          </p>
        </Card>

        <Card padding="p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-500">
                Surat Undangan
              </p>

              <p className="mt-2 text-3xl font-bold tracking-tight text-rji-black">
                {summary.invitation}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <FileText size={21} />
            </div>
          </div>

          <p className="mt-3 text-xs text-neutral-400">
            Pengajuan dari peserta
          </p>
        </Card>

        <Card padding="p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-500">
                Surat Tugas
              </p>

              <p className="mt-2 text-3xl font-bold tracking-tight text-rji-black">
                {summary.assignment}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
              <FileText size={21} />
            </div>
          </div>

          <p className="mt-3 text-xs text-neutral-400">
            Pengajuan dari anggota RJI
          </p>
        </Card>

        <Card padding="p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-500">
                Perlu Review
              </p>

              <p className="mt-2 text-3xl font-bold tracking-tight text-rji-black">
                {summary.pending +
                  summary.review}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-yellow-50 text-yellow-600">
              <ClipboardList size={21} />
            </div>
          </div>

          <p className="mt-3 text-xs text-neutral-400">
            Menunggu pemeriksaan admin
          </p>
        </Card>
      </div>

      {/* ===========================================================
          Main Table
      ============================================================ */}

      <Card>
        <div className="flex flex-col gap-5 border-b border-neutral-200 pb-5">
          <div>
            <h2 className="text-base font-semibold text-rji-black">
              Daftar Pengajuan
            </h2>

            <p className="mt-1 text-sm text-neutral-500">
              Periksa kesesuaian data sebelum
              pengajuan disetujui.
            </p>
          </div>

          <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
            {/* Type tabs */}

            <div className="flex flex-wrap gap-2">
              {TYPE_OPTIONS.map((option) => {
                const active =
                  activeType === option.value;

                let count = summary.all;

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
                    key={option.value}
                    type="button"
                    onClick={() =>
                      setActiveType(
                        option.value
                      )
                    }
                    className={[
                      "inline-flex items-center gap-2 rounded-xl px-4 py-2",
                      "text-sm font-semibold transition-all",
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
              })}
            </div>

            {/* Search + Filter */}

            <div className="flex flex-col gap-3 sm:flex-row">
              <TableSearch
                value={search}
                onChange={setSearch}
                placeholder="Cari pemohon atau kegiatan..."
              />

              <div className="sm:w-44">
                <TableFilter
                  value={status}
                  onChange={setStatus}
                  options={STATUS_OPTIONS}
                  label="Semua status"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-5">
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