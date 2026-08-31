import { useEffect, useState } from "react";
import {
  BadgeCheck,
  CalendarDays,
  FileText,
  ShieldCheck,
  UserRound,
  XCircle,
} from "lucide-react";
import { useParams } from "react-router-dom";

import api from "../../services/api";

const formatDate = (value) => {
  if (!value) {
    return "-";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "long",
  }).format(date);
};

const VerifySurat = () => {
  const { token } = useParams();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const verifySurat = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await api.get(
          `/verification/${token}`
        );

        setData(response.data);
      } catch (requestError) {
        console.error(requestError);

        setError(
          requestError.response?.data?.message ||
            "Surat tidak dapat diverifikasi."
        );
      } finally {
        setLoading(false);
      }
    };

    verifySurat();
  }, [token]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-rji-background px-4">
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-50 text-rji-orange">
            <ShieldCheck
              size={28}
              className="animate-pulse"
            />
          </div>

          <p className="mt-4 text-sm font-medium text-neutral-600">
            Memverifikasi surat...
          </p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-rji-background px-4 py-10">
        <div className="w-full max-w-lg rounded-3xl border border-neutral-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-600">
            <XCircle size={32} />
          </div>

          <h1 className="mt-6 text-2xl font-bold text-rji-black">
            Surat Tidak Valid
          </h1>

          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-neutral-500">
            {error ||
              "Data verifikasi surat tidak ditemukan atau sudah tidak berlaku."}
          </p>
        </div>
      </div>
    );
  }

  const surat = data.surat;
  const verification = data.verification;

  return (
    <div className="min-h-screen bg-rji-background px-4 py-8 sm:px-6 lg:py-12">
      <div className="mx-auto w-full max-w-2xl">
        <div className="overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-sm">
          {/* Header */}

          <div className="bg-rji-black px-6 py-8 text-white sm:px-8">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rji-orange">
                <span className="text-xl font-black">
                  R
                </span>
              </div>

              <div>
                <p className="text-sm font-bold">
                  Relawan Jurnal Indonesia
                </p>

                <p className="mt-0.5 text-xs text-white/60">
                  Sistem Verifikasi Surat
                </p>
              </div>
            </div>

            <div className="mt-8 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-green-500/15 text-green-400">
                <BadgeCheck size={25} />
              </div>

              <div>
                <h1 className="text-xl font-bold">
                  Surat Terverifikasi
                </h1>

                <p className="mt-1 text-sm text-white/60">
                  Dokumen ini terdaftar dalam sistem persuratan RJI.
                </p>
              </div>
            </div>
          </div>

          {/* Content */}

          <div className="space-y-8 p-6 sm:p-8">
            <section>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-400">
                Informasi Surat
              </p>

              <div className="mt-4 space-y-5">
                <div className="flex gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-rji-orange">
                    <FileText size={18} />
                  </div>

                  <div>
                    <p className="text-xs text-neutral-400">
                      Nomor Surat
                    </p>

                    <p className="mt-1 text-sm font-bold text-rji-black">
                      {surat.letter_number}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-rji-orange">
                    <CalendarDays size={18} />
                  </div>

                  <div>
                    <p className="text-xs text-neutral-400">
                      Tanggal Surat
                    </p>

                    <p className="mt-1 text-sm font-medium text-rji-black">
                      {formatDate(
                        surat.letter_date
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-rji-orange">
                    <UserRound size={18} />
                  </div>

                  <div>
                    <p className="text-xs text-neutral-400">
                      Penerima
                    </p>

                    <p className="mt-1 text-sm font-medium text-rji-black">
                      {surat.recipient_name}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-rji-orange">
                    <FileText size={18} />
                  </div>

                  <div>
                    <p className="text-xs text-neutral-400">
                      Perihal
                    </p>

                    <p className="mt-1 text-sm font-medium text-rji-black">
                      {surat.subject || "-"}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section className="rounded-2xl bg-green-50 p-5">
              <div className="flex items-start gap-3">
                <BadgeCheck
                  size={20}
                  className="mt-0.5 shrink-0 text-green-600"
                />

                <div>
                  <p className="text-sm font-semibold text-green-800">
                    Surat dinyatakan valid
                  </p>

                  <p className="mt-1 text-xs leading-5 text-green-700">
                    Verifikasi berhasil dilakukan melalui sistem resmi RJI.
                  </p>
                </div>
              </div>
            </section>

            <section className="border-t border-neutral-200 pt-6">
              <div className="flex flex-col gap-3 text-xs text-neutral-400 sm:flex-row sm:items-center sm:justify-between">
                <span>
                  Verifikasi ke-
                  {" "}
                  {verification.verified_count}
                </span>

                <span>
                  Terakhir diverifikasi:{" "}
                  {verification.last_verified_at
                    ? formatDate(
                        verification.last_verified_at
                      )
                    : "-"}
                </span>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifySurat;