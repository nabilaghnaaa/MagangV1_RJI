import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  Building2,
  CalendarDays,
  Check,
  Clock3,
  Download,
  Edit3,
  Eye,
  FileText,
  Mail,
  MapPin,
  Phone,
  User,
  BriefcaseBusiness,
  X,
  RotateCcw,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import PageContainer from "../../components/layout/PageContainer";
import PageHeader from "../../components/layout/PageHeader";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import Textarea from "../../components/common/Textarea";
import Modal from "../../components/common/Modal";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import SuratStatusBadge from "../../components/surat/SuratStatusBadge";
import SuratPreview from "../../components/surat/SuratPreview";

import invitationService from "../../services/invitationService";
import assignmentService from "../../services/assignmentService";
import templatePreviewService from "../../services/templatePreviewService";

const TYPE_CONFIG = {
  invitation: {
    title: "Detail Surat Undangan",
    description: "Periksa data peserta dan kegiatan sebelum surat undangan diterbitkan.",
    applicantTitle: "Data Peserta",
  },
  assignment: {
    title: "Detail Surat Tugas",
    description: "Periksa data anggota dan bukti surat permohonan sebelum surat tugas diterbitkan.",
    applicantTitle: "Data Anggota RJI",
  },
};

const VALID_TYPES = ["invitation", "assignment"];

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

const formatFileSize = (bytes) => {
  if (!bytes || bytes <= 0) {
    return "0 KB";
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
};

const DetailItem = ({ icon: Icon, label, value }) => {
  return (
    <div className="flex gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-rji-orange">
        <Icon size={17} />
      </div>

      <div className="min-w-0">
        <p className="text-xs font-medium text-neutral-400">
          {label}
        </p>

        <p className="mt-1 break-words text-sm font-medium text-rji-black">
          {value || "-"}
        </p>
      </div>
    </div>
  );
};

const DetailPengajuan = () => {
  const navigate = useNavigate();
  const { type, id } = useParams();

  const isValidType = VALID_TYPES.includes(type);
  const isInvitation = type === "invitation";

  const service = useMemo(() => {
    if (!isValidType) {
      return null;
    }

    return isInvitation ? invitationService : assignmentService;
  }, [isInvitation, isValidType]);

  const config = TYPE_CONFIG[type];

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [pageError, setPageError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [editOpen, setEditOpen] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [approveOpen, setApproveOpen] = useState(false);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);

  const [previewData, setPreviewData] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [reviewNote, setReviewNote] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");

  const loadData = async () => {
    if (!service) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setPageError("");

    try {
      const response = await service.getById(id);

      setData(response.data);
      setEditForm(response.data || {});
      setReviewNote(response.data?.admin_notes || "");
    } catch (error) {
      console.error(error);

      setPageError(
        error.response?.data?.message ||
          "Gagal mengambil detail pengajuan."
      );

      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [id, service]);

  const handleEditChange = (event) => {
    const { name, value } = event.target;

    setEditForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSaveEdit = async (event) => {
    event.preventDefault();

    setActionLoading(true);
    setPageError("");
    setSuccessMessage("");

    try {
      const response = await service.update(id, editForm);

      setData(response.data);
      setEditForm(response.data || {});
      setEditOpen(false);

      setSuccessMessage(
        "Data pengajuan berhasil diperbarui."
      );
    } catch (error) {
      console.error(error);

      setPageError(
        error.response?.data?.message ||
          "Gagal memperbarui data pengajuan."
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleReview = async () => {
    setActionLoading(true);
    setPageError("");
    setSuccessMessage("");

    try {
      const response = await service.review(id, {
        admin_notes: reviewNote.trim(),
      });

      setData(response.data);
      setReviewOpen(false);

      setSuccessMessage(
        "Pengajuan berhasil ditandai sebagai direview."
      );
    } catch (error) {
      console.error(error);

      setPageError(
        error.response?.data?.message ||
          "Gagal melakukan review."
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handlePreview = async () => {
    setPreviewLoading(true);
    setPageError("");
    setSuccessMessage("");

    try {
      const response = isInvitation
        ? await templatePreviewService.previewInvitation(id)
        : await templatePreviewService.previewAssignment(id);

      setPreviewData(response.data);
      setPreviewOpen(true);
    } catch (error) {
      console.error(error);

      setPageError(
        error.response?.data?.message ||
          "Gagal membuat preview surat."
      );
    } finally {
      setPreviewLoading(false);
    }
  };

  const handleApprove = async () => {
    setApproveOpen(false);
    setActionLoading(true);
    setPageError("");
    setSuccessMessage("");

    try {
      const response = await service.approve(id);

      setData(response.data);
      setSuccessMessage(
        "Pengajuan berhasil disetujui dan surat diproses."
      );
    } catch (error) {
      console.error(error);

      setPageError(
        error.response?.data?.message ||
          "Gagal menyetujui pengajuan."
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (event) => {
    event.preventDefault();

    if (!rejectionReason.trim()) {
      return;
    }

    setActionLoading(true);
    setPageError("");
    setSuccessMessage("");

    try {
      const response = await service.reject(id, {
        rejection_reason: rejectionReason.trim(),
      });

      setData(response.data);
      setRejectOpen(false);
      setRejectionReason("");

      setSuccessMessage(
        "Pengajuan berhasil ditolak."
      );
    } catch (error) {
      console.error(error);

      setPageError(
        error.response?.data?.message ||
          "Gagal menolak pengajuan."
      );
    } finally {
      setActionLoading(false);
    }
  };

  if (!isValidType) {
    return (
      <PageContainer>
        <PageHeader
          title="Pengajuan Tidak Valid"
          description="Jenis pengajuan yang diminta tidak tersedia."
        />

        <Button
          variant="outline"
          icon={ArrowLeft}
          onClick={() => navigate("/pengajuan")}
        >
          Kembali ke Pengajuan
        </Button>
      </PageContainer>
    );
  }

  if (loading) {
    return (
      <PageContainer>
        <div className="flex min-h-96 items-center justify-center">
          <div className="text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-neutral-200 border-t-rji-orange" />

            <p className="mt-4 text-sm text-neutral-500">
              Memuat detail pengajuan...
            </p>
          </div>
        </div>
      </PageContainer>
    );
  }

  if (!data) {
    return (
      <PageContainer>
        <PageHeader
          title="Pengajuan Tidak Ditemukan"
          description={
            pageError ||
            "Data pengajuan tidak tersedia."
          }
        />

        <Button
          variant="outline"
          icon={ArrowLeft}
          onClick={() => navigate("/pengajuan")}
        >
          Kembali ke Pengajuan
        </Button>
      </PageContainer>
    );
  }

  const isProcessed = ["approved", "rejected"].includes(data.status);

  const applicantName = isInvitation
    ? data.participant_name
    : data.member_name;

  const applicantEmail = isInvitation
    ? data.participant_email
    : data.member_email;

  const applicantPhone = isInvitation
    ? data.participant_phone
    : data.member_phone;

  return (
    <PageContainer>
      <button
        type="button"
        onClick={() => navigate("/pengajuan")}
        className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-neutral-500 transition hover:text-rji-black"
      >
        <ArrowLeft size={17} />
        Kembali ke Pengajuan
      </button>

      <PageHeader
        title={config.title}
        description={config.description}
        action={
          <div className="flex flex-wrap items-center gap-2">
            <SuratStatusBadge status={data.status} />

            {!isProcessed && (
              <>
                <Button
                  variant="outline"
                  icon={Eye}
                  loading={previewLoading}
                  onClick={handlePreview}
                >
                  Preview Surat
                </Button>

                <Button
                  variant="outline"
                  icon={Edit3}
                  onClick={() => setEditOpen(true)}
                >
                  Edit
                </Button>
              </>
            )}
          </div>
        }
      />

      {successMessage && (
        <div className="mb-6 flex items-center gap-3 rounded-2xl border border-green-200 bg-green-50 px-5 py-4 text-sm text-green-700">
          <Check size={18} className="shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {pageError && (
        <div className="mb-6 flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
          <X size={18} className="shrink-0" />
          <span>{pageError}</span>
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-[1.35fr_0.75fr]">
        <div className="space-y-6">
          <Card
            title={config.applicantTitle}
            description="Informasi pemohon pengajuan."
          >
            <div className="grid gap-6 sm:grid-cols-2">
              <DetailItem
                icon={User}
                label="Nama"
                value={applicantName}
              />

              <DetailItem
                icon={Mail}
                label="Email"
                value={applicantEmail}
              />

              <DetailItem
                icon={Phone}
                label="Nomor Telepon"
                value={applicantPhone}
              />

              {isInvitation ? (
                <DetailItem
                  icon={Building2}
                  label="Institusi / Organisasi"
                  value={data.organization}
                />
              ) : (
                <>
                  <DetailItem
                    icon={Building2}
                    label="Organisasi"
                    value={data.member_organization}
                  />

                  <DetailItem
                    icon={BriefcaseBusiness}
                    label="Peran"
                    value={data.member_role}
                  />
                </>
              )}
            </div>
          </Card>

          <Card
            title="Detail Kegiatan"
            description="Informasi kegiatan yang diajukan."
          >
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <DetailItem
                  icon={FileText}
                  label="Nama Kegiatan"
                  value={data.activity_name}
                />
              </div>

              <DetailItem
                icon={CalendarDays}
                label="Tanggal Mulai"
                value={formatDate(data.activity_date)}
              />

              <DetailItem
                icon={CalendarDays}
                label="Tanggal Selesai"
                value={formatDate(data.activity_end_date)}
              />

              <DetailItem
                icon={Clock3}
                label="Waktu"
                value={data.activity_time}
              />

              <DetailItem
                icon={MapPin}
                label="Lokasi"
                value={data.location}
              />

              {isInvitation && data.invitation_subject && (
                <div className="sm:col-span-2">
                  <DetailItem
                    icon={FileText}
                    label="Perihal Undangan"
                    value={data.invitation_subject}
                  />
                </div>
              )}

              {!isInvitation && data.assignment_subject && (
                <div className="sm:col-span-2">
                  <DetailItem
                    icon={FileText}
                    label="Perihal Surat Tugas"
                    value={data.assignment_subject}
                  />
                </div>
              )}
            </div>

            {data.activity_description && (
              <div className="mt-6 border-t border-neutral-100 pt-6">
                <p className="text-xs font-medium text-neutral-400">
                  Deskripsi Kegiatan
                </p>

                <p className="mt-2 whitespace-pre-line text-sm leading-6 text-neutral-700">
                  {data.activity_description}
                </p>
              </div>
            )}

            {data.notes && (
              <div className="mt-6 border-t border-neutral-100 pt-6">
                <p className="text-xs font-medium text-neutral-400">
                  Catatan Pemohon
                </p>

                <p className="mt-2 whitespace-pre-line text-sm leading-6 text-neutral-700">
                  {data.notes}
                </p>
              </div>
            )}
          </Card>

          {!isInvitation && (
            <Card
              title="Surat Permohonan"
              description="Bukti surat permohonan yang dikirim anggota RJI."
            >
              <div className="grid gap-6 sm:grid-cols-2">
                <DetailItem
                  icon={FileText}
                  label="Nomor Surat"
                  value={data.request_letter_number}
                />

                <DetailItem
                  icon={CalendarDays}
                  label="Tanggal Surat"
                  value={formatDate(data.request_letter_date)}
                />
              </div>

              <div className="mt-6 border-t border-neutral-100 pt-6">
                {data.attachments?.length ? (
                  <div className="space-y-3">
                    {data.attachments.map((attachment) => (
                      <div
                        key={attachment.id}
                        className="flex items-center justify-between gap-4 rounded-xl border border-neutral-200 p-4"
                      >
                        <div className="flex min-w-0 items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-rji-orange">
                            <FileText size={18} />
                          </div>

                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-rji-black">
                              {attachment.original_name}
                            </p>

                            <p className="mt-1 text-xs text-neutral-400">
                              {formatFileSize(attachment.file_size)}
                            </p>
                          </div>
                        </div>

                        <Button
                          variant="outline"
                          size="sm"
                          icon={Download}
                          onClick={() =>
                            window.open(
                              attachment.file_path,
                              "_blank",
                              "noopener,noreferrer"
                            )
                          }
                        >
                          Buka
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-xl border border-dashed border-neutral-200 bg-neutral-50 px-4 py-6 text-center text-sm text-neutral-500">
                    Belum ada bukti surat permohonan.
                  </div>
                )}
              </div>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card
            title="Status Pengajuan"
            description="Informasi proses pengajuan."
          >
            <div className="rounded-xl bg-neutral-50 p-4">
              <div className="flex items-center justify-between gap-4">
                <span className="text-sm text-neutral-500">
                  Status saat ini
                </span>

                <SuratStatusBadge status={data.status} />
              </div>
            </div>

            <div className="mt-5 space-y-4">
              <DetailItem
                icon={CalendarDays}
                label="Diajukan"
                value={formatDate(data.createdAt)}
              />

              {data.reviewed_at && (
                <DetailItem
                  icon={Check}
                  label="Direview"
                  value={formatDate(data.reviewed_at)}
                />
              )}

              {data.approved_at && (
                <DetailItem
                  icon={Check}
                  label="Disetujui"
                  value={formatDate(data.approved_at)}
                />
              )}

              {data.rejected_at && (
                <DetailItem
                  icon={X}
                  label="Ditolak"
                  value={formatDate(data.rejected_at)}
                />
              )}
            </div>

            {data.reviewer && (
              <div className="mt-5 border-t border-neutral-200 pt-5">
                <p className="text-xs font-medium text-neutral-400">
                  Admin yang menangani
                </p>

                <p className="mt-1 text-sm font-semibold text-rji-black">
                  {data.reviewer.name}
                </p>

                <p className="mt-0.5 text-xs text-neutral-500">
                  {data.reviewer.email}
                </p>
              </div>
            )}
          </Card>

          {data.admin_notes && (
            <Card
              title="Catatan Admin"
              description="Catatan selama pemeriksaan."
            >
              <p className="whitespace-pre-line text-sm leading-6 text-neutral-700">
                {data.admin_notes}
              </p>
            </Card>
          )}

          {data.rejection_reason && (
            <Card
              title="Alasan Penolakan"
              description="Informasi alasan pengajuan ditolak."
            >
              <div className="rounded-xl bg-red-50 p-4">
                <p className="whitespace-pre-line text-sm leading-6 text-red-700">
                  {data.rejection_reason}
                </p>
              </div>
            </Card>
          )}

          {!isProcessed && (
            <Card
              title="Tindakan Admin"
              description="Lanjutkan proses pengajuan."
            >
              <div className="space-y-3">
                {data.status === "pending" && (
                  <Button
                    variant="secondary"
                    className="w-full"
                    icon={RotateCcw}
                    disabled={actionLoading}
                    onClick={() => setReviewOpen(true)}
                  >
                    Mulai Review
                  </Button>
                )}

                <Button
                  variant="primary"
                  className="w-full"
                  icon={Check}
                  disabled={actionLoading}
                  onClick={() => setApproveOpen(true)}
                >
                  Setujui Pengajuan
                </Button>

                <Button
                  variant="danger"
                  className="w-full"
                  icon={X}
                  disabled={actionLoading}
                  onClick={() => setRejectOpen(true)}
                >
                  Tolak Pengajuan
                </Button>
              </div>
            </Card>
          )}
        </div>
      </div>

      <Modal
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        title="Preview Surat"
        description="Preview ini belum menerbitkan surat dan belum mengirim email."
        size="xl"
        footer={
          <div className="flex justify-end">
            <Button
              variant="ghost"
              onClick={() => setPreviewOpen(false)}
            >
              Tutup
            </Button>
          </div>
        }
      >
        <SuratPreview data={previewData} />
      </Modal>

      <Modal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        title={
          isInvitation
            ? "Edit Surat Undangan"
            : "Edit Surat Tugas"
        }
        description="Perubahan data akan tersimpan pada pengajuan."
        size="xl"
        footer={
          <div className="flex justify-end gap-3">
            <Button
              variant="ghost"
              disabled={actionLoading}
              onClick={() => setEditOpen(false)}
            >
              Batal
            </Button>

            <Button
              type="submit"
              form="edit-pengajuan-form"
              loading={actionLoading}
            >
              Simpan Perubahan
            </Button>
          </div>
        }
      >
        <form
          id="edit-pengajuan-form"
          onSubmit={handleSaveEdit}
          className="space-y-6"
        >
          <div className="grid gap-5 sm:grid-cols-2">
            {isInvitation ? (
              <>
                <Input
                  label="Nama Peserta"
                  name="participant_name"
                  value={editForm.participant_name || ""}
                  onChange={handleEditChange}
                  required
                />

                <Input
                  label="Email Peserta"
                  name="participant_email"
                  type="email"
                  value={editForm.participant_email || ""}
                  onChange={handleEditChange}
                  required
                />

                <Input
                  label="Nomor Telepon"
                  name="participant_phone"
                  value={editForm.participant_phone || ""}
                  onChange={handleEditChange}
                />

                <Input
                  label="Institusi / Organisasi"
                  name="organization"
                  value={editForm.organization || ""}
                  onChange={handleEditChange}
                />
              </>
            ) : (
              <>
                <Input
                  label="Nama Anggota"
                  name="member_name"
                  value={editForm.member_name || ""}
                  onChange={handleEditChange}
                  required
                />

                <Input
                  label="Email Anggota"
                  name="member_email"
                  type="email"
                  value={editForm.member_email || ""}
                  onChange={handleEditChange}
                  required
                />

                <Input
                  label="Nomor Telepon"
                  name="member_phone"
                  value={editForm.member_phone || ""}
                  onChange={handleEditChange}
                />

                <Input
                  label="Organisasi"
                  name="member_organization"
                  value={editForm.member_organization || ""}
                  onChange={handleEditChange}
                />

                <Input
                  label="Peran"
                  name="member_role"
                  value={editForm.member_role || ""}
                  onChange={handleEditChange}
                  required
                />

                <Input
                  label="Nomor Surat Permohonan"
                  name="request_letter_number"
                  value={editForm.request_letter_number || ""}
                  onChange={handleEditChange}
                />

                <Input
                  label="Tanggal Surat Permohonan"
                  name="request_letter_date"
                  type="date"
                  value={editForm.request_letter_date || ""}
                  onChange={handleEditChange}
                />
              </>
            )}

            <div className="sm:col-span-2">
              <Input
                label="Nama Kegiatan"
                name="activity_name"
                value={editForm.activity_name || ""}
                onChange={handleEditChange}
                required
              />
            </div>

            <Input
              label="Tanggal Mulai"
              name="activity_date"
              type="date"
              value={editForm.activity_date || ""}
              onChange={handleEditChange}
              required
            />

            <Input
              label="Tanggal Selesai"
              name="activity_end_date"
              type="date"
              value={editForm.activity_end_date || ""}
              onChange={handleEditChange}
            />

            <Input
              label="Waktu"
              name="activity_time"
              value={editForm.activity_time || ""}
              onChange={handleEditChange}
            />

            <Input
              label="Lokasi"
              name="location"
              value={editForm.location || ""}
              onChange={handleEditChange}
              required
            />

            {isInvitation && (
              <div className="sm:col-span-2">
                <Input
                  label="Perihal Undangan"
                  name="invitation_subject"
                  value={editForm.invitation_subject || ""}
                  onChange={handleEditChange}
                />
              </div>
            )}

            {!isInvitation && (
              <div className="sm:col-span-2">
                <Input
                  label="Perihal Surat Tugas"
                  name="assignment_subject"
                  value={editForm.assignment_subject || ""}
                  onChange={handleEditChange}
                />
              </div>
            )}

            <div className="sm:col-span-2">
              <Textarea
                label="Deskripsi Kegiatan"
                name="activity_description"
                value={editForm.activity_description || ""}
                onChange={handleEditChange}
              />
            </div>

            <div className="sm:col-span-2">
              <Textarea
                label="Catatan Pemohon"
                name="notes"
                value={editForm.notes || ""}
                onChange={handleEditChange}
              />
            </div>

            <div className="sm:col-span-2">
              <Textarea
                label="Catatan Admin"
                name="admin_notes"
                value={editForm.admin_notes || ""}
                onChange={handleEditChange}
              />
            </div>
          </div>
        </form>
      </Modal>

      <Modal
        open={reviewOpen}
        onClose={() =>
          actionLoading
            ? undefined
            : setReviewOpen(false)
        }
        title="Mulai Review"
        description="Tambahkan catatan pemeriksaan sebelum pengajuan diproses."
        size="md"
        footer={
          <div className="flex justify-end gap-3">
            <Button
              variant="ghost"
              disabled={actionLoading}
              onClick={() => setReviewOpen(false)}
            >
              Batal
            </Button>

            <Button
              loading={actionLoading}
              onClick={handleReview}
            >
              Simpan Review
            </Button>
          </div>
        }
      >
        <Textarea
          label="Catatan Review"
          value={reviewNote}
          onChange={(event) =>
            setReviewNote(event.target.value)
          }
          placeholder="Contoh: Data peserta dan kegiatan sudah sesuai."
        />
      </Modal>

      <ConfirmDialog
        open={approveOpen}
        onClose={() =>
          actionLoading
            ? undefined
            : setApproveOpen(false)
        }
        onConfirm={handleApprove}
        title="Setujui Pengajuan"
        description="Setelah disetujui, sistem akan membuat surat, verification, QR, PDF, dan mencoba mengirim email ke penerima."
        confirmText="Ya, Setujui"
        variant="success"
        loading={actionLoading}
      />

      <Modal
        open={rejectOpen}
        onClose={() =>
          actionLoading
            ? undefined
            : setRejectOpen(false)
        }
        title="Tolak Pengajuan"
        description="Alasan penolakan akan disimpan sebagai catatan pengajuan."
        size="md"
        footer={
          <div className="flex justify-end gap-3">
            <Button
              variant="ghost"
              disabled={actionLoading}
              onClick={() => setRejectOpen(false)}
            >
              Batal
            </Button>

            <Button
              variant="danger"
              loading={actionLoading}
              type="submit"
              form="reject-form"
            >
              Tolak Pengajuan
            </Button>
          </div>
        }
      >
        <form
          id="reject-form"
          onSubmit={handleReject}
        >
          <Textarea
            label="Alasan Penolakan"
            name="rejection_reason"
            value={rejectionReason}
            onChange={(event) =>
              setRejectionReason(event.target.value)
            }
            placeholder="Jelaskan data atau bagian yang perlu diperbaiki."
            required
          />
        </form>
      </Modal>
    </PageContainer>
  );
};

export default DetailPengajuan;