import { useEffect, useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Copy,
  Download,
  FileCheck2,
  FileText,
  Mail,
  MapPin,
  RefreshCw,
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

const DetailItem = ({
  icon: Icon,
  label,
  value,
}) => {
  return (
    <div className="flex min-w-0 gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-rji-orange">
        <Icon size={18} />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-neutral-400">
          {label}
        </p>

        <p className="mt-1 break-words text-sm font-semibold leading-6 text-rji-black">
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
  const [copySuccess, setCopySuccess] = useState(false);

  const loadSurat = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await suratService.getById(id);

      setSurat(response?.data || null);
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

      setSurat(
        response?.data?.surat ||
          surat
      );

      setMessage(
        "PDF surat berhasil dibuat."
      );

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
      const response =
        await suratService.downloadPdf(id);

      const blob = new Blob(
        [response.data],
        {
          type: "application/pdf",
        }
      );

      const url =
        window.URL.createObjectURL(blob);

      const anchor =
        document.createElement("a");

      anchor.href = url;
      anchor.download = `${String(
        surat.letter_number ||
          `surat-${surat.id}`
      ).replace(
        /[^a-zA-Z0-9-_]/g,
        "_"
      )}.pdf`;

      document.body.appendChild(
        anchor
      );

      anchor.click();
      anchor.remove();

      window.URL.revokeObjectURL(url);

      setMessage(
        "PDF berhasil diunduh."
      );
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
      const response =
        await suratService.downloadPdf(id);

      const blob = new Blob(
        [response.data],
        {
          type: "application/pdf",
        }
      );

      const url =
        window.URL.createObjectURL(blob);

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

  const handleCopyVerification = async () => {
    const verificationUrl =
      surat?.verification
        ?.verification_url;

    if (!verificationUrl) {
      return;
    }

    try {
      await navigator.clipboard.writeText(
        verificationUrl
      );

      setCopySuccess(true);

      setTimeout(() => {
        setCopySuccess(false);
      }, 2000);
    } catch (copyError) {
      console.error(
        "Gagal menyalin URL:",
        copyError
      );

      setError(
        "URL verifikasi gagal disalin."
      );
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

  const sourceData =
    surat.type === "invitation"
      ? surat.invitation
      : surat.assignment;

  const applicantName =
    surat.type === "invitation"
      ? sourceData?.participant_name
      : sourceData?.member_name;

  const applicantEmail =
    surat.type === "invitation"
      ? sourceData?.participant_email
      : sourceData?.member_email;

  const fileName = surat.pdf_path
    ? surat.pdf_path.split("/").pop()
    : "PDF belum tersedia";

  const verificationUrl =
    surat.verification
      ?.verification_url || "";

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

      <div className="space-y-6">
        <div className="grid gap-6 xl:grid-cols-2">
          <Card
            title="Informasi Surat"
            description="Identitas lengkap surat yang telah diterbitkan."
          >
            <div className="grid gap-x-10 gap-y-7 sm:grid-cols-2">
              <DetailItem
                icon={FileText}
                label="Nomor Surat"
                value={
                  surat.letter_number
                }
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
                icon={UserRound}
                label="Penerima"
                value={
                  surat.recipient_name
                }
              />

              <DetailItem
                icon={Mail}
                label="Email Penerima"
                value={
                  surat.recipient_email
                }
              />

              <DetailItem
                icon={FileText}
                label="Perihal"
                value={
                  surat.subject
                }
              />
            </div>
          </Card>

          <Card
            title="Sumber Pengajuan"
            description="Data pengajuan yang menjadi dasar penerbitan surat."
          >
            <div className="grid gap-x-10 gap-y-7 sm:grid-cols-2">
              <DetailItem
                icon={UserRound}
                label={
                  surat.type ===
                  "invitation"
                    ? "Peserta"
                    : "Anggota"
                }
                value={
                  applicantName
                }
              />

              <DetailItem
                icon={Mail}
                label={
                  surat.type ===
                  "invitation"
                    ? "Email Peserta"
                    : "Email Anggota"
                }
                value={
                  applicantEmail
                }
              />

              <DetailItem
                icon={FileText}
                label="Kegiatan"
                value={
                  sourceData?.activity_name
                }
              />

              <DetailItem
                icon={CalendarDays}
                label="Tanggal Kegiatan"
                value={formatDate(
                  sourceData?.activity_date
                )}
              />

              <DetailItem
                icon={MapPin}
                label="Lokasi"
                value={
                  sourceData?.location
                }
              />

              {surat.type ===
                "assignment" && (
                <>
                  <DetailItem
                    icon={FileCheck2}
                    label="Peran"
                    value={
                      sourceData?.member_role
                    }
                  />

                  <DetailItem
                    icon={FileText}
                    label="Nomor Surat Permohonan"
                    value={
                      sourceData?.request_letter_number
                    }
                  />
                </>
              )}
            </div>
          </Card>
        </div>

        <div className="grid gap-6 xl:grid-cols-2">
          <Card
            title="PDF Surat"
            description="Dokumen final yang dihasilkan oleh sistem."
          >
            <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-5">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-rji-orange">
                  <FileText size={21} />
                </div>

                <div className="min-w-0">
                  <p className="break-all text-sm font-semibold text-rji-black">
                    {fileName}
                  </p>

                  <p className="mt-1 text-xs leading-5 text-neutral-500">
                    {surat.pdf_generated_at
                      ? `Dibuat ${formatDate(
                          surat.pdf_generated_at
                        )}`
                      : "PDF belum pernah dibuat"}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-5 grid gap-2.5 sm:grid-cols-2">
              <Button
                variant="outline"
                className="w-full"
                icon={RefreshCw}
                loading={
                  actionLoading
                }
                onClick={
                  handleGeneratePdf
                }
              >
                Generate Ulang PDF
              </Button>

              <Button
                variant="outline"
                className="w-full"
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
                className="w-full"
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
                className="w-full"
                icon={Mail}
                loading={
                  actionLoading
                }
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
            title="Informasi Penerima"
            description="Kontak penerima dokumen surat."
          >
            <div className="space-y-5">
              <DetailItem
                icon={UserRound}
                label="Nama Penerima"
                value={
                  surat.recipient_name
                }
              />

              <DetailItem
                icon={Mail}
                label="Email Penerima"
                value={
                  surat.recipient_email
                }
              />

              {sourceData?.member_phone ||
              sourceData?.participant_phone ? (
                <DetailItem
                  icon={FileText}
                  label="Nomor Telepon"
                  value={
                    sourceData?.member_phone ||
                    sourceData?.participant_phone
                  }
                />
              ) : null}
            </div>
          </Card>
        </div>

        <Card
          title="URL Verifikasi"
          description="Gunakan tautan ini untuk memverifikasi keaslian surat."
        >
          <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-rji-orange">
                <FileText size={20} />
              </div>

              <div className="min-w-0 flex-1">
                <p className="break-all text-sm font-medium leading-6 text-rji-black">
                  {verificationUrl ||
                    "URL verifikasi belum tersedia."}
                </p>

                {verificationUrl && (
                  <p className="mt-1 text-xs text-neutral-400">
                    Tautan ini dapat dibagikan untuk
                    pemeriksaan keaslian dokumen.
                  </p>
                )}
              </div>

              {verificationUrl && (
                <button
                  type="button"
                  onClick={
                    handleCopyVerification
                  }
                  className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm font-semibold text-neutral-600 transition hover:bg-neutral-100"
                >
                  <Copy size={16} />

                  {copySuccess
                    ? "Tersalin"
                    : "Salin URL"}
                </button>
              )}
            </div>
          </div>
        </Card>
      </div>
    </PageContainer>
  );
};

export default DetailSurat;