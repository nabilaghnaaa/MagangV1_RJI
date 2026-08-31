import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Edit3,
  FileText,
  Power,
  PowerOff,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import PageContainer from "../../components/layout/PageContainer";
import PageHeader from "../../components/layout/PageHeader";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import Badge from "../../components/common/Badge";

import templateService from "../../services/templateService";

const TemplateDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [template, setTemplate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");

  const loadTemplate = async () => {
    setLoading(true);
    setError("");

    try {
      const response =
        await templateService.getById(id);

      setTemplate(response.data);
    } catch (requestError) {
      console.error(requestError);

      setError(
        requestError.response?.data?.message ||
          "Gagal mengambil detail template."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTemplate();
  }, [id]);

  const handleActivate = async () => {
    setActionLoading(true);
    setError("");

    try {
      const response =
        await templateService.activate(id);

      setTemplate(response.data);
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

  const handleDeactivate = async () => {
    setActionLoading(true);
    setError("");

    try {
      const response =
        await templateService.deactivate(id);

      setTemplate(response.data);
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

  if (loading) {
    return (
      <PageContainer>
        <div className="flex min-h-96 items-center justify-center">
          <div className="text-sm text-neutral-500">
            Memuat template...
          </div>
        </div>
      </PageContainer>
    );
  }

  if (!template) {
    return (
      <PageContainer>
        <PageHeader
          title="Template Tidak Ditemukan"
          description={
            error ||
            "Template tidak tersedia."
          }
        />

        <Button
          variant="outline"
          icon={ArrowLeft}
          onClick={() =>
            navigate("/templates")
          }
        >
          Kembali
        </Button>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <button
        type="button"
        onClick={() =>
          navigate("/templates")
        }
        className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-neutral-500 hover:text-rji-black"
      >
        <ArrowLeft size={17} />
        Kembali ke Template
      </button>

      <PageHeader
        title={template.name}
        description={
          template.description ||
          "Detail template surat."
        }
        action={
          <div className="flex flex-wrap gap-2">
            {template.is_active ? (
              <Badge
                variant="success"
                dot
              >
                Aktif
              </Badge>
            ) : (
              <Badge
                variant="neutral"
                dot
              >
                Nonaktif
              </Badge>
            )}

            <Button
              variant="outline"
              icon={Edit3}
              onClick={() =>
                navigate(
                  `/templates/${id}/edit`
                )
              }
            >
              Edit
            </Button>
          </div>
        }
      />

      {error && (
        <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-[1fr_340px]">
        <Card
          title="Isi Template"
          description="Isi yang akan digunakan saat sistem membuat surat."
        >
          <div
            className="prose prose-sm max-w-none rounded-2xl border border-neutral-200 bg-neutral-50 p-6"
            dangerouslySetInnerHTML={{
              __html: template.content,
            }}
          />

          {template.footer && (
            <div className="mt-6">
              <p className="mb-3 text-sm font-semibold text-rji-black">
                Footer
              </p>

              <div
                className="prose prose-sm max-w-none rounded-2xl border border-neutral-200 bg-neutral-50 p-6"
                dangerouslySetInnerHTML={{
                  __html:
                    template.footer,
                }}
              />
            </div>
          )}
        </Card>

        <div className="space-y-6">
          <Card
            title="Informasi"
            description="Pengaturan dasar template."
          >
            <div className="space-y-5">
              <div className="flex gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-rji-orange">
                  <FileText size={18} />
                </div>

                <div>
                  <p className="text-xs text-neutral-400">
                    Jenis
                  </p>

                  <p className="mt-1 text-sm font-semibold text-rji-black">
                    {template.type === "invitation"
                      ? "Surat Undangan"
                      : "Surat Tugas"}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-xs text-neutral-400">
                  Tanda Tangan
                </p>

                <p className="mt-1 text-sm font-semibold capitalize text-rji-black">
                  {template.signature_type ||
                    "manual"}
                </p>
              </div>
            </div>
          </Card>

          <Card
            title="Status Template"
            description="Aktif atau nonaktif."
          >
            {template.is_active ? (
              <Button
                variant="outline"
                className="w-full"
                icon={PowerOff}
                loading={actionLoading}
                onClick={handleDeactivate}
              >
                Nonaktifkan
              </Button>
            ) : (
              <Button
                variant="primary"
                className="w-full"
                icon={Power}
                loading={actionLoading}
                onClick={handleActivate}
              >
                Aktifkan
              </Button>
            )}
          </Card>
        </div>
      </div>
    </PageContainer>
  );
};

export default TemplateDetail;