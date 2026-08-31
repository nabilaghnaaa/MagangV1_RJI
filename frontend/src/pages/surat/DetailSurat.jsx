import { useEffect, useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Download,
  FileCheck2,
  FileText,
  Mail,
  RefreshCw,
  ShieldCheck,
  UserRound,
  XCircle,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import PageContainer from "../../components/layout/PageContainer";
import PageHeader from "../../components/layout/PageHeader";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import SuratIssuedStatusBadge from "../../components/surat/SuratIssuedStatusBadge";

import suratService from "../../services/suratService";

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

const formatType = (type) => {
  return type === "invitation"
    ? "Surat Undangan"
    : "Surat Tugas";
};

const DetailItem = ({ icon: Icon, label, value }) => {
  return (
    <div className="flex gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-rji-orange">
        <Icon size={18} />
      </div>

      <div className="min-w-0">
        <p className="text-xs font-medium text-neutral-400">
          {label}
        </p>

        <p className="mt-1 break-words text-sm font-semibold text-rji-black">
          {value || "-"}
        </p>
      </div>
    </div>
  );
};

const DetailSurat = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [surat, setSurat] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadSurat = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await suratService.getById(id);
      setSurat(response.data);
    } catch (requestError) {
      console.error(requestError);

      setError(
        requestError.response?.data?.message ||
          "Gagal mengambil detail surat."
      );

      setSurat(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSurat();
  }, [id]);

  const handleGeneratePdf = async () => {
    setActionLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await suratService.generatePdf(id);

      setSurat(response.data?.surat || surat);
      setMessage("PDF surat berhasil dibuat.");
      await loadSurat();
    } catch (requestError) {
      console.error(requestError);

      setError(
        requestError.response?.data?.message ||
          "Gagal membuat PDF surat."
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleDownload = async () => {
    setActionLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await suratService.downloadPdf(id);

      const blob = new Blob([response.data], {
        type: "application/pdf",
      });

      const url = window.URL.createObjectURL(blob);
      const anchor = document.createElement("a");

      anchor.href = url;
      anchor.download = `${String(
        surat.letter_number || `surat-${surat.id}`
      ).replace(/[^a-zA-Z0-9-_]/g, "_")}.pdf`;

      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();

      window.URL.revokeObjectURL(url);
    } catch (requestError) {
      console.error(requestError);

      setError(
        requestError.response?.data?.message ||
          "Gagal mengunduh PDF."
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleOpenPdf = async () => {
    setActionLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await suratService.downloadPdf(id);

      const blob = new Blob([response.data], {
        type: "application/pdf",
      });

      const url = window.URL.createObjectURL(blob);

      window.open(
        url,
        "_blank",
        "noopener,noreferrer"
      );

      setTimeout(() => {
        window.URL.revokeObjectURL(url);
      }, 60000);
    } catch (requestError) {
      console.error(requestError);

      setError(
        requestError.response?.data?.message ||
          "Gagal membuka PDF."
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleSendEmail = async () => {
    const confirmed = window.confirm(
      "Kirim ulang surat ini melalui email?"
    );

    if (!confirmed) {
      return;
    }

    setActionLoading(true);
    setError("");
    setMessage("");

    try {
      await suratService.sendEmail(id);

      setMessage(
        "Email surat berhasil dikirim."
      );

      await loadSurat();
    } catch (requestError) {
      console.error(requestError);

      setError(
        requestError.response?.data?.message ||
          "Gagal mengirim email."
      );
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <PageContainer>
        <div className="flex min-h-96 items-center justify-center">
          <div className="text-center">
            <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-neutral-200 border-t-rji-orange" />

            <p className="mt-4 text-sm text-neutral-500">
              Memuat detail surat...
            </p>
          </div>
        </div>
      </PageContainer>
    );
  }

  if (!surat) {
    return (
      <PageContainer>
        <PageHeader
          title="Surat Tidak Ditemukan"
          description={
            error ||
            "Data surat tidak tersedia."
          }
        />

        <Button
          variant="outline"
          icon={ArrowLeft}
          onClick={() =>
            navigate("/surat")
          }
        >
          Kembali ke Surat Terbit
        </Button>
      </PageContainer>
    );
  }

  const verification =
    surat.verification || null;

  const verificationActive =
    verification?.status === "active";

  return (
    <PageContainer>
      <button
        type="button"
        onClick={() =>
          navigate("/surat")
        }
        className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-neutral-500 transition hover:text-rji-black"
      >
        <ArrowLeft size={17} />
        Kembali ke Surat Terbit
      </button>

      <PageHeader
        title="Detail Surat"
        description="Informasi lengkap surat yang sudah diterbitkan."
        action={
          <SuratIssuedStatusBadge
            status={surat.status}
          />
        }
      />

      {message && (
        <div className="mb-6 flex items-center gap-3 rounded-2xl border border-green-200 bg-green-50 px-5 py-4 text-sm text-green-700">
          <CheckCircle2
            size={18}
            className="shrink-0"
          />

          <span>{message}</span>
        </div>
      )}

      {error && (
        <div className="mb-6 flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
          <XCircle
            size={18}
            className="shrink-0"
          />

          <span>{error}</span>
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-[1.35fr_0.75fr]">
        <div className="space-y-6">
          <Card
            title="Informasi Surat"
            description="Identitas surat final yang diterbitkan."
          >
            <div className="grid gap-6 sm:grid-cols-2">
              <DetailItem
                icon={FileText}
                label="Nomor Surat"
                value={surat.letter_number}
              />

              <DetailItem
                icon={CalendarDays}
                label="Tanggal Surat"
                value={formatDate(
                  surat.letter_date
                )}
              />

              <DetailItem
                icon={FileCheck2}
                label="Jenis Surat"
                value={formatType(
                  surat.type
                )}
              />

              <DetailItem
                icon={Mail}
                label="Email Penerima"
                value={
                  surat.recipient_email
                }
              />

              <div className="sm:col-span-2">
                <DetailItem
                  icon={UserRound}
                  label="Penerima"
                  value={
                    surat.recipient_name
                  }
                />
              </div>

              <div className="sm:col-span-2">
                <DetailItem
                  icon={FileText}
                  label="Perihal"
                  value={
                    surat.subject
                  }
                />
              </div>
            </div>
          </Card>

          <Card
            title="Sumber Pengajuan"
            description="Data pengajuan yang menjadi dasar penerbitan surat."
          >
            {surat.type ===
            "invitation" ? (
              <div className="grid gap-6 sm:grid-cols-2">
                <DetailItem
                  icon={UserRound}
                  label="Peserta"
                  value={
                    surat.invitation
                      ?.participant_name
                  }
                />

                <DetailItem
                  icon={Mail}
                  label="Email Peserta"
                  value={
                    surat.invitation
                      ?.participant_email
                  }
                />

                <DetailItem
                  icon={FileText}
                  label="Kegiatan"
                  value={
                    surat.invitation
                      ?.activity_name
                  }
                />

                <DetailItem
                  icon={CalendarDays}
                  label="Tanggal Kegiatan"
                  value={formatDate(
                    surat.invitation
                      ?.activity_date
                  )}
                />
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2">
                <DetailItem
                  icon={UserRound}
                  label="Anggota"
                  value={
                    surat.assignment
                      ?.member_name
                  }
                />

                <DetailItem
                  icon={Mail}
                  label="Email Anggota"
                  value={
                    surat.assignment
                      ?.member_email
                  }
                />

                <DetailItem
                  icon={FileCheck2}
                  label="Peran"
                  value={
                    surat.assignment
                      ?.member_role
                  }
                />

                <DetailItem
                  icon={FileText}
                  label="Kegiatan"
                  value={
                    surat.assignment
                      ?.activity_name
                  }
                />

                <DetailItem
                  icon={CalendarDays}
                  label="Tanggal Kegiatan"
                  value={formatDate(
                    surat.assignment
                      ?.activity_date
                  )}
                />

                <DetailItem
                  icon={FileText}
                  label="Nomor Surat Permohonan"
                  value={
                    surat.assignment
                      ?.request_letter_number
                  }
                />
              </div>
            )}
          </Card>
        </div>

        <div className="space-y-6">
          <Card
            title="PDF Surat"
            description="Dokumen final yang dihasilkan sistem."
          >
            <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-5">
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-rji-orange">
                  <FileText size={20} />
                </div>

                <div className="min-w-0">
                  <p className="text-sm font-semibold text-rji-black">
                    {surat.pdf_path
                      ? surat.pdf_path.split("/").pop()
                      : "PDF belum tersedia"}
                  </p>

                  <p className="mt-1 text-xs text-neutral-500">
                    {surat.pdf_generated_at
                      ? `Dibuat ${formatDate(
                          surat.pdf_generated_at
                        )}`
                      : "Belum pernah dibuat"}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
              <Button
                variant="outline"
                icon={RefreshCw}
                loading={actionLoading}
                onClick={handleGeneratePdf}
              >
                Generate Ulang PDF
              </Button>

              <Button
                variant="outline"
                icon={FileText}
                disabled={
                  actionLoading ||
                  !surat.pdf_path
                }
                onClick={
                  handleOpenPdf
                }
              >
                Buka PDF
              </Button>

              <Button
                variant="outline"
                icon={Download}
                disabled={
                  actionLoading ||
                  !surat.pdf_path
                }
                onClick={
                  handleDownload
                }
              >
                Download PDF
              </Button>

              <Button
                variant="primary"
                icon={Mail}
                loading={actionLoading}
                disabled={
                  !surat.pdf_path
                }
                onClick={
                  handleSendEmail
                }
              >
                Kirim Email
              </Button>
            </div>
          </Card>

          <Card
            title="Verifikasi Surat"
            description="Status QR dan verifikasi dokumen."
          >
            <div
              className={[
                "rounded-2xl border p-5",
                verificationActive
                  ? "border-green-200 bg-green-50"
                  : "border-red-200 bg-red-50",
              ].join(" ")}
            >
              <div className="flex items-start gap-3">
                <div
                  className={[
                    "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl",
                    verificationActive
                      ? "bg-green-100 text-green-600"
                      : "bg-red-100 text-red-600",
                  ].join(" ")}
                >
                  {verificationActive ? (
                    <ShieldCheck size={21} />
                  ) : (
                    <XCircle size={21} />
                  )}
                </div>

                <div>
                  <p
                    className={[
                      "text-sm font-semibold",
                      verificationActive
                        ? "text-green-800"
                        : "text-red-800",
                    ].join(" ")}
                  >
                    {verificationActive
                      ? "Verifikasi Aktif"
                      : "Verifikasi Tidak Aktif"}
                  </p>

                  <p
                    className={[
                      "mt-1 text-xs leading-5",
                      verificationActive
                        ? "text-green-700"
                        : "text-red-700",
                    ].join(" ")}
                  >
                    {verificationActive
                      ? "QR Code surat dapat digunakan untuk memverifikasi keaslian dokumen."
                      : "QR Code surat tidak dapat digunakan saat ini."}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-5 space-y-4">
              <DetailItem
                icon={ShieldCheck}
                label="Jumlah Verifikasi"
                value={
                  verification
                    ? verification.verified_count
                    : "0"
                }
              />

              <DetailItem
                icon={CalendarDays}
                label="Terakhir Diverifikasi"
                value={
                  verification?.last_verified_at
                    ? formatDate(
                        verification.last_verified_at
                      )
                    : "-"
                }
              />

              <DetailItem
                icon={FileText}
                label="URL Verifikasi"
                value={
                  verification?.verification_url ||
                  "-"
                }
              />
            </div>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
};

export default DetailSurat;