import {
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  ArrowLeft,
  Check,
  Edit3,
  Eye,
  X,
} from "lucide-react";
import {
  useNavigate,
  useParams,
} from "react-router-dom";

import PageContainer from "../../components/layout/PageContainer";
import PageHeader from "../../components/layout/PageHeader";
import Button from "../../components/common/Button";
import Textarea from "../../components/common/Textarea";
import Card from "../../components/common/Card";
import Modal from "../../components/common/Modal";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import SuratStatusBadge from "../../components/surat/SuratStatusBadge";
import SuratPreview from "../../components/surat/SuratPreview";

import ApplicantCard from "../../components/surat/detail-pengajuan/ApplicantCard";
import RecipientCard from "../../components/surat/detail-pengajuan/RecipientCard";
import ActivityCard from "../../components/surat/detail-pengajuan/ActivityCard";
import AssignmentRequestCard from "../../components/surat/detail-pengajuan/AssignmentRequestCard";
import SubmissionStatusCard from "../../components/surat/detail-pengajuan/SubmissionStatusCard";
import ActionCard from "../../components/surat/detail-pengajuan/ActionCard";
import EditPengajuanForm from "../../components/surat/detail-pengajuan/EditPengajuanForm";

import invitationService from "../../services/invitationService";
import assignmentService from "../../services/assignmentService";
import templatePreviewService from "../../services/templatePreviewService";

const TYPE_CONFIG = {
  invitation: {
    title: "Detail Surat Undangan",
    description:
      "Periksa data penerima, peserta, dan kegiatan sebelum surat undangan diterbitkan.",
    applicantTitle: "Data Peserta",
  },
  assignment: {
    title: "Detail Surat Tugas",
    description:
      "Periksa data anggota dan bukti surat permohonan sebelum surat tugas diterbitkan.",
    applicantTitle: "Data Anggota RJI",
  },
};

const VALID_TYPES = [
  "invitation",
  "assignment",
];

const formatInputDate = (value) => {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const DetailPengajuan = () => {
  const navigate = useNavigate();
  const { type, id } = useParams();

  const isValidType = VALID_TYPES.includes(type);
  const isInvitation = type === "invitation";
  const config = TYPE_CONFIG[type];

  const service = useMemo(() => {
    if (!isValidType) {
      return null;
    }

    return isInvitation
      ? invitationService
      : assignmentService;
  }, [
    isInvitation,
    isValidType,
  ]);

  const [
    data,
    setData,
  ] = useState(null);

  const [
    editForm,
    setEditForm,
  ] = useState({});

  const [
    previewData,
    setPreviewData,
  ] = useState(null);

  const [
    reviewNote,
    setReviewNote,
  ] = useState("");

  const [
    rejectionReason,
    setRejectionReason,
  ] = useState("");

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    actionLoading,
    setActionLoading,
  ] = useState(false);

  const [
    previewLoading,
    setPreviewLoading,
  ] = useState(false);

  const [
    pageError,
    setPageError,
  ] = useState("");

  const [
    successMessage,
    setSuccessMessage,
  ] = useState("");

  const [
    editOpen,
    setEditOpen,
  ] = useState(false);

  const [
    previewOpen,
    setPreviewOpen,
  ] = useState(false);

  const [
    reviewOpen,
    setReviewOpen,
  ] = useState(false);

  const [
    approveOpen,
    setApproveOpen,
  ] = useState(false);

  const [
    rejectOpen,
    setRejectOpen,
  ] = useState(false);

  const loadData = async () => {
    if (!service) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setPageError("");

    try {
      const response = await service.getById(id);
      const result = response?.data || {};

      setData(result);

      setEditForm({
        ...result,
        activity_date: formatInputDate(
          result.activity_date
        ),
        activity_end_date: formatInputDate(
          result.activity_end_date
        ),
        letter_date: formatInputDate(
          result.letter_date
        ),
        request_letter_date: formatInputDate(
          result.request_letter_date
        ),
      });

      setReviewNote(
        result.admin_notes || ""
      );
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
  }, [
    id,
    service,
  ]);

  const handleEditChange = (event) => {
    const {
      name,
      value,
    } = event.target;

    setEditForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSaveEdit = async (event) => {
    event.preventDefault();

    if (actionLoading) {
      return;
    }

    setActionLoading(true);
    setPageError("");
    setSuccessMessage("");

    try {
      const payload = {
        ...editForm,
      };

      if (
        isInvitation &&
        !payload.invitation_subject?.trim()
      ) {
        payload.invitation_subject =
          payload.activity_name;
      }

      if (
        !isInvitation &&
        !payload.assignment_subject?.trim()
      ) {
        payload.assignment_subject =
          payload.activity_name;
      }

      const response = await service.update(
        id,
        payload
      );

      const updated =
        response?.data || {};

      setData(updated);

      setEditForm({
        ...updated,
        activity_date: formatInputDate(
          updated.activity_date
        ),
        activity_end_date: formatInputDate(
          updated.activity_end_date
        ),
        letter_date: formatInputDate(
          updated.letter_date
        ),
        request_letter_date: formatInputDate(
          updated.request_letter_date
        ),
      });

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
    if (actionLoading) {
      return;
    }

    setActionLoading(true);
    setPageError("");
    setSuccessMessage("");

    try {
      const response =
        await service.review(
          id,
          {
            admin_notes:
              reviewNote.trim(),
          }
        );

      setData(
        response?.data || data
      );

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
    if (previewLoading) {
      return;
    }

    setPreviewLoading(true);
    setPageError("");
    setSuccessMessage("");

    try {
      const response = isInvitation
        ? await templatePreviewService.previewInvitation(
            id
          )
        : await templatePreviewService.previewAssignment(
            id
          );

      setPreviewData(
        response?.data || null
      );

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
    if (actionLoading) {
      return;
    }

    setApproveOpen(false);
    setActionLoading(true);
    setPageError("");
    setSuccessMessage("");

    try {
      const response =
        await service.approve(id);

      setData(
        response?.data || data
      );

      setSuccessMessage(
        "Pengajuan berhasil disetujui dan surat sedang diproses."
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

    if (actionLoading) {
      return;
    }

    const reason =
      rejectionReason.trim();

    if (!reason) {
      setPageError(
        "Alasan penolakan wajib diisi."
      );
      return;
    }

    setActionLoading(true);
    setPageError("");
    setSuccessMessage("");

    try {
      const response =
        await service.reject(
          id,
          reason
        );

      setData(
        response?.data || data
      );

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

  const handleCloseEdit = () => {
    if (actionLoading) {
      return;
    }

    setEditOpen(false);
  };

  const handleCloseReview = () => {
    if (actionLoading) {
      return;
    }

    setReviewOpen(false);
  };

  const handleCloseReject = () => {
    if (actionLoading) {
      return;
    }

    setRejectOpen(false);
  };

  const handleCloseApprove = () => {
    if (actionLoading) {
      return;
    }

    setApproveOpen(false);
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
          onClick={() =>
            navigate("/pengajuan")
          }
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
          onClick={() =>
            navigate("/pengajuan")
          }
        >
          Kembali ke Pengajuan
        </Button>
      </PageContainer>
    );
  }

  const isProcessed = [
    "approved",
    "rejected",
  ].includes(data.status);

  return (
    <PageContainer>
      <button
        type="button"
        onClick={() =>
          navigate("/pengajuan")
        }
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
            <SuratStatusBadge
              status={data.status}
            />

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
                  disabled={actionLoading}
                  onClick={() =>
                    setEditOpen(true)
                  }
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
          <Check
            size={18}
            className="shrink-0"
          />

          <span>
            {successMessage}
          </span>
        </div>
      )}

      {pageError && (
        <div className="mb-6 flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
          <X
            size={18}
            className="shrink-0"
          />

          <span>
            {pageError}
          </span>
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-2">
        <ApplicantCard
          isInvitation={isInvitation}
          title={config.applicantTitle}
          data={data}
        />

        {isInvitation ? (
          <RecipientCard
            data={data}
          />
        ) : (
          <SubmissionStatusCard
            data={data}
          />
        )}

        <ActivityCard
          data={data}
          isInvitation={isInvitation}
        />

        {isInvitation ? (
          <SubmissionStatusCard
            data={data}
          />
        ) : (
          <AssignmentRequestCard
            data={data}
          />
        )}

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
      </div>

      <div className="mt-6">
        <ActionCard
          status={data.status}
          actionLoading={actionLoading}
          onReview={() =>
            setReviewOpen(true)
          }
          onApprove={() =>
            setApproveOpen(true)
          }
          onReject={() =>
            setRejectOpen(true)
          }
        />
      </div>

      <Modal
        open={previewOpen}
        onClose={() =>
          setPreviewOpen(false)
        }
        title="Preview Surat"
        description="Preview surat berdasarkan data pengajuan saat ini. Preview tidak menerbitkan surat."
        size="xl"
        footer={
          <div className="flex justify-end">
            <Button
              variant="ghost"
              onClick={() =>
                setPreviewOpen(false)
              }
            >
              Tutup
            </Button>
          </div>
        }
      >
        <SuratPreview
          data={previewData}
        />
      </Modal>

      <Modal
        open={editOpen}
        onClose={handleCloseEdit}
        title={
          isInvitation
            ? "Edit Surat Undangan"
            : "Edit Surat Tugas"
        }
        description="Admin dapat memperbaiki data sebelum pengajuan disetujui."
        size="xl"
        footer={
          <div className="flex justify-end gap-3">
            <Button
              variant="ghost"
              disabled={actionLoading}
              onClick={() =>
                setEditOpen(false)
              }
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
        <EditPengajuanForm
          isInvitation={isInvitation}
          form={editForm}
          onChange={handleEditChange}
          onSubmit={handleSaveEdit}
        />
      </Modal>

      <Modal
        open={reviewOpen}
        onClose={handleCloseReview}
        title="Mulai Review"
        description="Tambahkan catatan pemeriksaan sebelum pengajuan diproses."
        size="md"
        footer={
          <div className="flex justify-end gap-3">
            <Button
              variant="ghost"
              disabled={actionLoading}
              onClick={() =>
                setReviewOpen(false)
              }
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
            setReviewNote(
              event.target.value
            )
          }
          placeholder="Contoh: Data peserta, penerima, dan kegiatan sudah sesuai."
          rows={5}
        />
      </Modal>

      <ConfirmDialog
        open={approveOpen}
        onClose={handleCloseApprove}
        onConfirm={handleApprove}
        title="Setujui Pengajuan"
        description="Setelah disetujui, sistem akan mengambil template, kop surat, tanda tangan, membuat verification QR, menghasilkan PDF, dan mencoba mengirim surat melalui email."
        confirmText="Ya, Setujui"
        variant="success"
        loading={actionLoading}
      />

      <Modal
        open={rejectOpen}
        onClose={handleCloseReject}
        title="Tolak Pengajuan"
        description="Alasan penolakan akan disimpan sebagai bagian dari riwayat pengajuan."
        size="md"
        footer={
          <div className="flex justify-end gap-3">
            <Button
              variant="ghost"
              disabled={actionLoading}
              onClick={() =>
                setRejectOpen(false)
              }
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
              setRejectionReason(
                event.target.value
              )
            }
            placeholder="Jelaskan data atau bagian yang perlu diperbaiki."
            rows={5}
            required
          />
        </form>
      </Modal>
    </PageContainer>
  );
};

export default DetailPengajuan;