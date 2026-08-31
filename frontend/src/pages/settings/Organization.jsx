import { useEffect, useState } from "react";
import {
  Building2,
  Globe,
  Mail,
  Phone,
  Save,
} from "lucide-react";

import PageContainer from "../../components/layout/PageContainer";
import PageHeader from "../../components/layout/PageHeader";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import Textarea from "../../components/common/Textarea";

import api from "../../services/api";

const Organization = () => {
  const [form, setForm] = useState({
    organization_name: "",
    organization_short_name: "",
    address: "",
    email: "",
    phone: "",
    website: "",
  });

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const loadData = async () => {
    setLoading(true);
    setError("");

    try {
      const response =
        await api.get("/organization");

      setForm({
        organization_name:
          response.data.data.organization_name ||
          "",
        organization_short_name:
          response.data.data.organization_short_name ||
          "",
        address:
          response.data.data.address ||
          "",
        email:
          response.data.data.email ||
          "",
        phone:
          response.data.data.phone ||
          "",
        website:
          response.data.data.website ||
          "",
      });
    } catch (requestError) {
      console.error(requestError);

      setError(
        requestError.response?.data?.message ||
          "Gagal mengambil konfigurasi organisasi."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleChange = (event) => {
    const {
      name,
      value,
    } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (
    event
  ) => {
    event.preventDefault();

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      await api.put(
        "/organization",
        form
      );

      setSuccess(
        "Konfigurasi organisasi berhasil disimpan."
      );
    } catch (requestError) {
      console.error(requestError);

      setError(
        requestError.response?.data?.message ||
          "Gagal menyimpan konfigurasi organisasi."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <PageContainer>
        <div className="flex min-h-96 items-center justify-center text-sm text-neutral-500">
          Memuat pengaturan organisasi...
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader
        title="Organisasi"
        description="Kelola identitas Relawan Jurnal Indonesia yang digunakan pada dokumen surat."
      />

      {error && (
        <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-6 rounded-2xl border border-green-200 bg-green-50 px-5 py-4 text-sm text-green-700">
          {success}
        </div>
      )}

      <Card>
        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <Input
              label="Nama Organisasi"
              name="organization_name"
              value={
                form.organization_name
              }
              onChange={handleChange}
              required
            />

            <Input
              label="Nama Singkat"
              name="organization_short_name"
              value={
                form.organization_short_name
              }
              onChange={handleChange}
              placeholder="RJI"
            />

            <div className="sm:col-span-2">
              <Textarea
                label="Alamat"
                name="address"
                value={form.address}
                onChange={handleChange}
                rows={4}
              />
            </div>

            <Input
              label="Email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
            />

            <Input
              label="Telepon"
              name="phone"
              value={form.phone}
              onChange={handleChange}
            />

            <div className="sm:col-span-2">
              <Input
                label="Website"
                name="website"
                value={form.website}
                onChange={handleChange}
                placeholder="https://..."
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              type="submit"
              icon={Save}
              loading={saving}
            >
              Simpan Perubahan
            </Button>
          </div>
        </form>
      </Card>
    </PageContainer>
  );
};

export default Organization;