import { useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  Edit3,
  Eye,
  FileText,
  Plus,
  Power,
  PowerOff,
  Trash2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import PageContainer from "../../components/layout/PageContainer";
import PageHeader from "../../components/layout/PageHeader";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import TableFilter from "../../components/table/TableFilter";
import DataTable from "../../components/table/DataTable";
import Badge from "../../components/common/Badge";

import templateService from "../../services/templateService";

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

const formatType = (type) => {
  return type === "invitation"
    ? "Surat Undangan"
    : "Surat Tugas";
};

const TemplateList = () => {
  const navigate = useNavigate();

  const [templates, setTemplates] = useState([]);
  const [type, setType] = useState("");
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const loadTemplates = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await templateService.getAll(
        type
          ? {
              type,
            }
          : {}
      );

      setTemplates(response.data || []);
    } catch (requestError) {
      console.error(requestError);

      setError(
        requestError.response?.data?.message ||
          "Gagal mengambil data template."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTemplates();
  }, [type]);

  const activeCount = useMemo(() => {
    return templates.filter(
      (template) => template.is_active
    ).length;
  }, [templates]);

  const invitationCount = useMemo(() => {
    return templates.filter(
      (template) =>
        template.type === "invitation"
    ).length;
  }, [templates]);

  const assignmentCount = useMemo(() => {
    return templates.filter(
      (template) =>
        template.type === "assignment"
    ).length;
  }, [templates]);

  const handleActivate = async (id) => {
    setActionLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      await templateService.activate(id);
      await loadTemplates();

      setSuccessMessage(
        "Template berhasil diaktifkan."
      );
    } catch (requestError) {
      console.error(requestError);

      setError(
        requestError.response?.data?.message ||
          "Gagal mengaktifkan template."
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeactivate = async (id) => {
    setActionLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      await templateService.deactivate(id);
      await loadTemplates();

      setSuccessMessage(
        "Template berhasil dinonaktifkan."
      );
    } catch (requestError) {
      console.error(requestError);

      setError(
        requestError.response?.data?.message ||
          "Gagal menonaktifkan template."
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Hapus template ini?"
    );

    if (!confirmed) {
      return;
    }

    setActionLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      await templateService.remove(id);
      await loadTemplates();

      setSuccessMessage(
        "Template berhasil dihapus."
      );
    } catch (requestError) {
      console.error(requestError);

      setError(
        requestError.response?.data?.message ||
          "Gagal menghapus template."
      );
    } finally {
      setActionLoading(false);
    }
  };

  const columns = [
    {
      key: "template",
      label: "Template",
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-rji-orange">
            <FileText size={18} />
          </div>

          <div className="min-w-0">
            <p className="font-semibold text-rji-black">
              {row.name}
            </p>

            <p className="mt-1 text-xs text-neutral-400">
              {row.description || "Tanpa deskripsi"}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: "type",
      label: "Jenis",
      render: (row) => (
        <span className="text-sm font-medium text-neutral-700">
          {formatType(row.type)}
        </span>
      ),
    },
    {
      key: "signature_type",
      label: "TTD",
      render: (row) => (
        <span className="capitalize text-sm text-neutral-600">
          {row.signature_type || "manual"}
        </span>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (row) =>
        row.is_active ? (
          <Badge variant="success" dot>
            Aktif
          </Badge>
        ) : (
          <Badge variant="neutral" dot>
            Nonaktif
          </Badge>
        ),
    },
    {
      key: "created_at",
      label: "Dibuat",
      render: (row) => (
        <span className="text-sm text-neutral-600">
          {row.created_at
            ? new Intl.DateTimeFormat(
                "id-ID",
                {
                  dateStyle: "medium",
                }
              ).format(new Date(row.created_at))
            : "-"}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Aksi",
      headerClassName: "text-right",
      render: (row) => (
        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            icon={Eye}
            onClick={() =>
              navigate(
                `/templates/${row.id}`
              )
            }
          >
            Lihat
          </Button>

          <Button
            variant="outline"
            size="sm"
            icon={Edit3}
            onClick={() =>
              navigate(
                `/templates/${row.id}/edit`
              )
            }
          >
            Edit
          </Button>

          {row.is_active ? (
            <Button
              variant="outline"
              size="sm"
              icon={PowerOff}
              disabled={actionLoading}
              onClick={() =>
                handleDeactivate(row.id)
              }
            >
              Nonaktifkan
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              icon={Power}
              disabled={actionLoading}
              onClick={() =>
                handleActivate(row.id)
              }
            >
              Aktifkan
            </Button>
          )}

          <Button
            variant="danger"
            size="sm"
            icon={Trash2}
            disabled={actionLoading}
            onClick={() =>
              handleDelete(row.id)
            }
          >
            Hapus
          </Button>
        </div>
      ),
    },
  ];

  return (
    <PageContainer>
      <PageHeader
        title="Template Surat"
        description="Kelola template Surat Undangan dan Surat Tugas yang digunakan saat penerbitan dokumen."
        action={
          <Button
            icon={Plus}
            onClick={() =>
              navigate("/templates/create")
            }
          >
            Buat Template
          </Button>
        }
      />

      {successMessage && (
        <div className="mb-6 flex items-center gap-3 rounded-2xl border border-green-200 bg-green-50 px-5 py-4 text-sm text-green-700">
          <CheckCircle2 size={18} />
          {successMessage}
        </div>
      )}

      {error && (
        <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card padding="p-5">
          <p className="text-sm text-neutral-500">
            Total Template
          </p>

          <p className="mt-2 text-3xl font-bold text-rji-black">
            {templates.length}
          </p>
        </Card>

        <Card padding="p-5">
          <p className="text-sm text-neutral-500">
            Template Aktif
          </p>

          <p className="mt-2 text-3xl font-bold text-rji-black">
            {activeCount}
          </p>
        </Card>

        <Card padding="p-5">
          <p className="text-sm text-neutral-500">
            Surat Undangan
          </p>

          <p className="mt-2 text-3xl font-bold text-rji-black">
            {invitationCount}
          </p>
        </Card>

        <Card padding="p-5">
          <p className="text-sm text-neutral-500">
            Surat Tugas
          </p>

          <p className="mt-2 text-3xl font-bold text-rji-black">
            {assignmentCount}
          </p>
        </Card>
      </div>

      <Card>
        <div className="flex flex-col gap-4 border-b border-neutral-200 pb-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-base font-semibold text-rji-black">
              Daftar Template
            </h2>

            <p className="mt-1 text-sm text-neutral-500">
              Template aktif digunakan oleh sistem saat membuat surat.
            </p>
          </div>

          <TableFilter
            value={type}
            onChange={setType}
            options={TYPE_OPTIONS}
            label="Semua jenis"
          />
        </div>

        <div className="mt-5">
          <DataTable
            columns={columns}
            data={templates}
            loading={loading}
            emptyTitle="Belum ada template"
            emptyDescription="Buat template Surat Undangan atau Surat Tugas untuk digunakan sistem."
          />
        </div>
      </Card>
    </PageContainer>
  );
};

export default TemplateList;