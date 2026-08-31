import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

import PageContainer from "../../components/layout/PageContainer";
import PageHeader from "../../components/layout/PageHeader";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import TemplateForm from "../../components/form/TemplateForm";

import templateService from "../../services/templateService";

const TemplateCreate = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (form) => {
    setLoading(true);
    setError("");

    try {
      const response =
        await templateService.create(form);

      navigate(
        `/templates/${response.data.id}`
      );
    } catch (requestError) {
      console.error(requestError);

      setError(
        requestError.response?.data?.message ||
          "Gagal membuat template."
      );
    } finally {
      setLoading(false);
    }
  };

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
        title="Buat Template"
        description="Buat template baru untuk Surat Undangan atau Surat Tugas."
      />

      {error && (
        <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <Card>
        <TemplateForm
          onSubmit={handleSubmit}
          loading={loading}
          submitLabel="Buat Template"
        />
      </Card>
    </PageContainer>
  );
};

export default TemplateCreate;