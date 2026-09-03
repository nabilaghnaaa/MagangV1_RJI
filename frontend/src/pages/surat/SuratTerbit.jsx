import { useEffect, useMemo, useState } from "react";
import {
  Download,
  Eye,
  Mail,
  RefreshCw,
  Search,
  ShieldCheck,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import PageContainer from "../../components/layout/PageContainer";
import PageHeader from "../../components/layout/PageHeader";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import StatCard from "../../components/common/StatCard";
import TableFilter from "../../components/table/TableFilter";
import DataTable from "../../components/table/DataTable";
import SuratIssuedStatusBadge from "../../components/surat/SuratIssuedStatusBadge";

import suratService from "../../services/suratService";

const STATUS_OPTIONS = [
  {
    value: "",
    label: "Semua status",
  },
  {
    value: "issued",
    label: "Terbit",
  },
  {
    value: "sent",
    label: "Terkirim",
  },
  {
    value: "cancelled",
    label: "Dibatalkan",
  },
];

const TYPE_OPTIONS = [
  {
    value: "",
    label: "Semua jenis",
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

const SuratTerbit = () => {
  const navigate = useNavigate();

  const [data, setData] = useState([]);
  const [loading, setLoading] =
    useState(false);
  const [error, setError] =
    useState("");
  const [search, setSearch] =
    useState("");
  const [status, setStatus] =
    useState("");
  const [type, setType] =
    useState("");

  const loadData = async () => {
    setLoading(true);
    setError("");

    try {
      const response =
        await suratService.getAll({
          ...(status
            ? { status }
            : {}),
          ...(type
            ? { type }
            : {}),
        });

      setData(
        Array.isArray(
          response?.data
        )
          ? response.data
          : []
      );
    } catch (requestError) {
      console.error(
        requestError
      );

      setError(
        requestError.response
          ?.data?.message ||
          "Gagal mengambil data surat terbit."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [status, type]);

  const filteredData = useMemo(() => {
    const keyword = search
      .trim()
      .toLowerCase();

    if (!keyword) {
      return data;
    }

    return data.filter(
      (item) => {
        const values = [
          item.letter_number,
          item.subject,
          item.recipient_name,
          item.recipient_email,
        ];

        return values
          .filter(Boolean)
          .some((value) =>
            String(value)
              .toLowerCase()
              .includes(keyword)
          );
      }
    );
  }, [data, search]);

  const summary = useMemo(() => {
    return {
      total:
        data.length,

      invitation:
        data.filter(
          (item) =>
            item.type ===
            "invitation"
        ).length,

      assignment:
        data.filter(
          (item) =>
            item.type ===
            "assignment"
        ).length,

      sent:
        data.filter(
          (item) =>
            item.status ===
            "sent"
        ).length,
    };
  }, [data]);

  const handleDownload = async (
    id,
    letterNumber
  ) => {
    try {
      const response =
        await suratService.downloadPdf(
          id
        );

      const blob = new Blob(
        [response.data],
        {
          type: "application/pdf",
        }
      );

      const url =
        window.URL.createObjectURL(
          blob
        );

      const anchor =
        document.createElement(
          "a"
        );

      anchor.href = url;

      anchor.download = `${String(
        letterNumber
      ).replace(
        /[^a-zA-Z0-9-_]/g,
        "_"
      )}.pdf`;

      document.body.appendChild(
        anchor
      );

      anchor.click();
      anchor.remove();

      window.URL.revokeObjectURL(
        url
      );
    } catch (requestError) {
      console.error(
        requestError
      );

      setError(
        requestError.response
          ?.data?.message ||
          "Gagal mengunduh PDF."
      );
    }
  };

  const handleSendEmail = async (
    id
  ) => {
    const confirmed =
      window.confirm(
        "Kirim ulang surat ini melalui email?"
      );

    if (!confirmed) {
      return;
    }

    try {
      await suratService.sendEmail(
        id
      );

      await loadData();
    } catch (requestError) {
      console.error(
        requestError
      );

      setError(
        requestError.response
          ?.data?.message ||
          "Gagal mengirim email."
      );
    }
  };

  const columns = [
    {
      key: "letter_number",
      label: "Nomor Surat",
      headerClassName:
        "bg-orange-50 text-rji-black",

      render: (row) => (
        <div>
          <p className="font-semibold text-rji-black">
            {row.letter_number}
          </p>

          <p className="mt-1 text-xs text-neutral-400">
            {row.type ===
            "invitation"
              ? "Surat Undangan"
              : "Surat Tugas"}
          </p>
        </div>
      ),
    },

    {
      key: "recipient_name",
      label: "Penerima",
      headerClassName:
        "bg-orange-50 text-rji-black",

      render: (row) => (
        <div>
          <p className="font-medium text-rji-black">
            {row.recipient_name}
          </p>

          <p className="mt-1 text-xs text-neutral-400">
            {row.recipient_email ||
              "-"}
          </p>
        </div>
      ),
    },

    {
      key: "subject",
      label: "Perihal",
      headerClassName:
        "bg-orange-50 text-rji-black",

      render: (row) => (
        <span className="block max-w-xs truncate">
          {row.subject ||
            "-"}
        </span>
      ),
    },

    {
      key: "letter_date",
      label: "Tanggal",
      headerClassName:
        "bg-orange-50 text-rji-black",

      render: (row) => (
        <span className="whitespace-nowrap">
          {formatDate(
            row.letter_date
          )}
        </span>
      ),
    },

    {
      key: "status",
      label: "Status",
      headerClassName:
        "bg-orange-50 text-rji-black",

      render: (row) => (
        <SuratIssuedStatusBadge
          status={row.status}
        />
      ),
    },

    {
      key: "verification",
      label: "Verifikasi",
      headerClassName:
        "bg-orange-50 text-rji-black",

      render: () => (
        <div className="flex items-center gap-2">
          <ShieldCheck
            size={16}
            className="text-green-600"
          />

          <span className="text-xs font-medium text-green-700">
            Aktif
          </span>
        </div>
      ),
    },

    {
      key: "actions",
      label: "Aksi",
      headerClassName:
        "bg-orange-50 pl-8 pr-40 text-right text-rji-black",
      className:
        "pl-8 pr-12",

      render: (row) => (
        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            icon={Eye}
            onClick={() =>
              navigate(
                `/surat/${row.id}`
              )
            }
          >
            Detail
          </Button>

          <Button
            variant="outline"
            size="sm"
            icon={Download}
            onClick={() =>
              handleDownload(
                row.id,
                row.letter_number
              )
            }
          >
            PDF
          </Button>

          <Button
            variant="outline"
            size="sm"
            icon={Mail}
            onClick={() =>
              handleSendEmail(
                row.id
              )
            }
          >
            Email
          </Button>
        </div>
      ),
    },
  ];

  return (
    <PageContainer>
      <PageHeader
        title="Surat Terbit"
        description="Kelola surat yang sudah diterbitkan, PDF, verifikasi, dan pengiriman email."
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
        <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Surat"
          value={
            loading
              ? "..."
              : summary.total
          }
          description="Seluruh surat tersimpan"
        />

        <StatCard
          label="Undangan"
          value={
            loading
              ? "..."
              : summary.invitation
          }
          description="Surat undangan diterbitkan"
        />

        <StatCard
          label="Surat Tugas"
          value={
            loading
              ? "..."
              : summary.assignment
          }
          description="Surat tugas diterbitkan"
        />

        <StatCard
          label="Terkirim"
          value={
            loading
              ? "..."
              : summary.sent
          }
          description="Surat berhasil dikirim"
        />
      </div>

      <Card>
        <div className="flex flex-col gap-4 border-b border-neutral-200 pb-5 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <h2 className="text-base font-semibold text-rji-black">
              Daftar Surat Terbit
            </h2>

            <p className="mt-1 text-sm text-neutral-500">
              Surat yang telah melalui proses penerbitan.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative sm:w-72">
              <Search
                size={17}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400"
              />

              <input
                type="text"
                value={search}
                onChange={(event) =>
                  setSearch(
                    event.target.value
                  )
                }
                placeholder="Cari nomor, penerima, perihal..."
                className="h-10 w-full rounded-xl border border-neutral-300 bg-white pl-10 pr-4 text-sm outline-none transition focus:border-rji-orange focus:ring-4 focus:ring-rji-orange/10"
              />
            </div>

            <div className="w-full sm:w-52">
              <TableFilter
                value={type}
                onChange={setType}
                options={
                  TYPE_OPTIONS
                }
                label="Semua jenis"
              />
            </div>

            <div className="w-full sm:w-52">
              <TableFilter
                value={status}
                onChange={setStatus}
                options={
                  STATUS_OPTIONS
                }
                label="Semua status"
              />
            </div>
          </div>
        </div>

        <div className="mt-5">
          <DataTable
            columns={columns}
            data={filteredData}
            loading={loading}
            emptyTitle="Belum ada surat terbit"
            emptyDescription="Surat yang berhasil diterbitkan akan muncul di sini."
          />
        </div>
      </Card>
    </PageContainer>
  );
};

export default SuratTerbit;