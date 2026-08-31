import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import PageContainer from "../../components/layout/PageContainer";
import PageHeader from "../../components/layout/PageHeader";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import TemplateForm from "../../components/form/TemplateForm";

import templateService from "../../services/templateService";

const TemplateEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [template, setTemplate] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

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
          "Gagal mengambil template."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTemplate();
  }, [id]);

  const handleSubmit = async (form) => {
    setSaving(true);
    setError("");

    try {
      const response =
        await templateService.update(
          id,
          form
        );

      setTemplate(response.data);

      navigate(
        `/templates/${id}`
      );
    } catch (requestError) {
      console.error(requestError);

      setError(
        requestError.response?.data?.message ||
          "Gagal memperbarui template."
      );
    } finally {
      setSaving(false);
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
          navigate(
            `/templates/${id}`
          )
        }
        className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-neutral-500 hover:text-rji-black"
      >
        <ArrowLeft size={17} />
        Kembali ke Detail
      </button>

      <PageHeader
        title="Edit Template"
        description="Perbarui isi template yang digunakan saat menerbitkan surat."
      />

      {error && (
        <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <Card>
        <TemplateForm
          initialData={template}
          onSubmit={handleSubmit}
          loading={saving}
          submitLabel="Simpan Perubahan"
        />
      </Card>
    </PageContainer>
  );
};

export default TemplateEdit;