import { useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  FileText,
  Send,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import Input from "../../components/common/Input";
import Textarea from "../../components/common/Textarea";
import Button from "../../components/common/Button";
import FormSection from "../../components/form/FormSection";
import FormActions from "../../components/form/FormActions";
import TurnstileWidget from "../../components/common/Turnstile";

import invitationService from "../../services/invitationService";

const initialForm = {
  participant_name: "",
  participant_email: "",
  participant_phone: "",
  organization: "",
  activity_name: "",
  activity_description: "",
  activity_date: "",
  activity_end_date: "",
  activity_time: "",
  location: "",
  invitation_subject: "",
  notes: "",
};

const AjukanUndangan = () => {
  const navigate = useNavigate();

  const [form, setForm] =
    useState(initialForm);

  const [turnstileToken, setTurnstileToken] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [result, setResult] =
    useState(null);

  const handleChange = (event) => {
    const {
      name,
      value,
    } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!turnstileToken) {
      setError(
        "Silakan selesaikan verifikasi keamanan terlebih dahulu."
      );

      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const payload = {
        ...form,
        turnstile_token:
          turnstileToken,
      };

      const response =
        await invitationService.create(
          payload
        );

      setResult(
        response.data
      );

      setForm(initialForm);
      setTurnstileToken("");

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } catch (requestError) {
      console.error(requestError);

      setError(
        requestError.response?.data?.message ||
          "Gagal mengirim pengajuan surat undangan."
      );

      setTurnstileToken("");
    } finally {
      setLoading(false);
    }
  };

  if (result) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <header className="border-b border-neutral-200 bg-white">
          <div className="mx-auto flex h-20 max-w-5xl items-center justify-between px-5 sm:px-8">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rji-orange">
                <span className="text-lg font-black text-white">
                  R
                </span>
              </div>

              <div>
                <p className="text-sm font-bold text-rji-black">
                  Relawan Jurnal
                </p>

                <p className="text-xs text-neutral-500">
                  Indonesia
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() =>
                navigate("/login")
              }
              className="rounded-xl border border-neutral-200 px-4 py-2.5 text-sm font-semibold text-neutral-700 transition hover:bg-neutral-50"
            >
              Login Admin
            </button>
          </div>
        </header>

        <main className="flex min-h-[calc(100vh-144px)] items-center justify-center px-5 py-12 sm:px-8">
          <div className="w-full max-w-xl rounded-3xl border border-neutral-200 bg-white p-8 text-center shadow-xl shadow-neutral-200/40 sm:p-10">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-50 text-green-600">
              <CheckCircle2 size={32} />
            </div>

            <h1 className="mt-6 text-2xl font-bold text-rji-black">
              Pengajuan Berhasil Dikirim
            </h1>

            <p className="mt-3 text-sm leading-6 text-neutral-500">
              Pengajuan Surat Undangan kamu sudah masuk
              ke sistem dan akan diperiksa oleh Admin.
            </p>

            <div className="mt-7 rounded-2xl bg-neutral-50 p-5 text-left">
              <p className="text-xs text-neutral-400">
                Nomor Pengajuan
              </p>

              <p className="mt-1 text-lg font-bold text-rji-black">
                #{result.id}
              </p>

              <div className="mt-4">
                <p className="text-xs text-neutral-400">
                  Status
                </p>

                <p className="mt-1 text-sm font-semibold capitalize text-rji-orange">
                  {result.status}
                </p>
              </div>
            </div>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Button
                variant="outline"
                className="w-full"
                onClick={() =>
                  navigate("/ajukan")
                }
              >
                Kembali
              </Button>

              <Button
                className="w-full"
                onClick={() =>
                  navigate("/ajukan/undangan")
                }
              >
                Ajukan Lagi
              </Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <header className="border-b border-neutral-200 bg-white">
        <div className="mx-auto flex h-20 max-w-5xl items-center justify-between px-5 sm:px-8">
          <button
            type="button"
            onClick={() =>
              navigate("/ajukan")
            }
            className="inline-flex items-center gap-2 text-sm font-medium text-neutral-500 transition hover:text-rji-black"
          >
            <ArrowLeft size={17} />
            Kembali
          </button>

          <button
            type="button"
            onClick={() =>
              navigate("/login")
            }
            className="rounded-xl border border-neutral-200 px-4 py-2.5 text-sm font-semibold text-neutral-700 transition hover:bg-neutral-50"
          >
            Login Admin
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-5 py-10 sm:px-8 lg:py-14">
        <div className="max-w-2xl">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50 text-rji-orange">
            <FileText size={22} />
          </div>

          <h1 className="mt-5 text-3xl font-bold tracking-tight text-rji-black">
            Pengajuan Surat Undangan
          </h1>

          <p className="mt-3 text-sm leading-6 text-neutral-500">
            Lengkapi data peserta dan kegiatan dengan
            benar sebelum mengirim pengajuan.
          </p>
        </div>

        {error && (
          <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm leading-6 text-red-700">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-6"
        >
          <FormSection
            title="Data Peserta"
            description="Informasi pihak yang akan menerima surat undangan."
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <Input
                label="Nama Peserta"
                name="participant_name"
                value={
                  form.participant_name
                }
                onChange={handleChange}
                placeholder="Nama lengkap"
                required
              />

              <Input
                label="Email Peserta"
                name="participant_email"
                type="email"
                value={
                  form.participant_email
                }
                onChange={handleChange}
                placeholder="nama@email.com"
                required
              />

              <Input
                label="Nomor Telepon"
                name="participant_phone"
                value={
                  form.participant_phone
                }
                onChange={handleChange}
                placeholder="08xxxxxxxxxx"
              />

              <Input
                label="Institusi / Organisasi"
                name="organization"
                value={
                  form.organization
                }
                onChange={handleChange}
                placeholder="Nama universitas / organisasi"
              />
            </div>
          </FormSection>

          <FormSection
            title="Detail Kegiatan"
            description="Informasi kegiatan yang menjadi tujuan surat undangan."
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Input
                  label="Nama Kegiatan"
                  name="activity_name"
                  value={
                    form.activity_name
                  }
                  onChange={handleChange}
                  placeholder="Nama kegiatan"
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <Textarea
                  label="Deskripsi Kegiatan"
                  name="activity_description"
                  value={
                    form.activity_description
                  }
                  onChange={handleChange}
                  placeholder="Jelaskan kegiatan secara singkat"
                  rows={5}
                />
              </div>

              <Input
                label="Tanggal Mulai"
                name="activity_date"
                type="date"
                value={
                  form.activity_date
                }
                onChange={handleChange}
                required
              />

              <Input
                label="Tanggal Selesai"
                name="activity_end_date"
                type="date"
                value={
                  form.activity_end_date
                }
                onChange={handleChange}
              />

              <Input
                label="Waktu"
                name="activity_time"
                value={
                  form.activity_time
                }
                onChange={handleChange}
                placeholder="08:00 - 12:00"
              />

              <Input
                label="Lokasi"
                name="location"
                value={
                  form.location
                }
                onChange={handleChange}
                placeholder="Lokasi kegiatan"
                required
              />

              <div className="sm:col-span-2">
                <Input
                  label="Perihal Undangan"
                  name="invitation_subject"
                  value={
                    form.invitation_subject
                  }
                  onChange={handleChange}
                  placeholder="Perihal surat"
                />
              </div>
            </div>
          </FormSection>

          <FormSection
            title="Catatan"
            description="Tambahkan informasi tambahan yang perlu diketahui Admin."
          >
            <Textarea
              label="Catatan Pengajuan"
              name="notes"
              value={form.notes}
              onChange={handleChange}
              placeholder="Catatan tambahan"
              rows={4}
            />
          </FormSection>

          <TurnstileWidget
            onVerify={(token) => {
              setTurnstileToken(token);
              setError("");
            }}
            onExpire={() => {
              setTurnstileToken("");
            }}
            onError={() => {
              setTurnstileToken("");
              setError(
                "Verifikasi keamanan gagal. Silakan coba lagi."
              );
            }}
          />

          <FormActions>
            <Button
              type="button"
              variant="ghost"
              onClick={() =>
                navigate("/ajukan")
              }
              disabled={loading}
            >
              Batal
            </Button>

            <Button
              type="submit"
              icon={Send}
              loading={loading}
              disabled={!turnstileToken}
            >
              Kirim Pengajuan
            </Button>
          </FormActions>
        </form>
      </main>
    </div>
  );
};

export default AjukanUndangan;