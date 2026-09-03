import {
  Building2,
  CheckCircle2,
  ImagePlus,
  Save,
  Upload,
  XCircle,
} from "lucide-react";
import {
  useEffect,
  useState,
} from "react";

import PageContainer from "../../components/layout/PageContainer";
import PageHeader from "../../components/layout/PageHeader";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import Textarea from "../../components/common/Textarea";
import Modal from "../../components/common/Modal";

import organizationService from "../../services/organizationService";

import {
  LETTERHEAD_WIDTH,
  LETTERHEAD_HEIGHT,
  resizeLetterhead,
  getImageDimensions,
} from "../../utils/letterhead";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api";

const STORAGE_URL =
  API_URL.replace(
    /\/api\/?$/,
    ""
  );

const getStorageUrl = (
  filePath
) => {
  if (!filePath) {
    return "";
  }

  if (
    filePath.startsWith(
      "http://"
    ) ||
    filePath.startsWith(
      "https://"
    )
  ) {
    return filePath;
  }

  return `${STORAGE_URL}/${filePath}`;
};

const Organization = () => {
  const [
    form,
    setForm,
  ] = useState({
    organization_name: "",
    organization_short_name:
      "",
    address: "",
    email: "",
    phone: "",
    website: "",
  });

  const [
    letterheadTop,
    setLetterheadTop,
  ] = useState(null);

  const [
    letterheadBottom,
    setLetterheadBottom,
  ] = useState(null);

  const [
    topPreview,
    setTopPreview,
  ] = useState("");

  const [
    bottomPreview,
    setBottomPreview,
  ] = useState("");

  const [
    topOriginalSize,
    setTopOriginalSize,
  ] = useState(null);

  const [
    bottomOriginalSize,
    setBottomOriginalSize,
  ] = useState(null);

  const [
    savedTopPath,
    setSavedTopPath,
  ] = useState("");

  const [
    savedBottomPath,
    setSavedBottomPath,
  ] = useState("");

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    saving,
    setSaving,
  ] = useState(false);

  const [
    uploadingLetterhead,
    setUploadingLetterhead,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");

  const [
    success,
    setSuccess,
  ] = useState("");

  const [
    successModalOpen,
    setSuccessModalOpen,
  ] = useState(false);

  const loadData =
    async () => {
      setLoading(true);
      setError("");

      try {
        const response =
          await organizationService.get();

        const data =
          response?.data || {};

        setForm({
          organization_name:
            data.organization_name ||
            "",

          organization_short_name:
            data.organization_short_name ||
            "",

          address:
            data.address ||
            "",

          email:
            data.email ||
            "",

          phone:
            data.phone ||
            "",

          website:
            data.website ||
            "",
        });

        setSavedTopPath(
          data.letterhead_top_path ||
            ""
        );

        setSavedBottomPath(
          data.letterhead_bottom_path ||
            ""
        );
      } catch (
        requestError
      ) {
        console.error(
          "Gagal mengambil data organisasi:",
          requestError
        );

        setError(
          requestError.response
            ?.data?.message ||
            "Gagal mengambil konfigurasi organisasi."
        );
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    return () => {
      if (topPreview) {
        URL.revokeObjectURL(
          topPreview
        );
      }

      if (bottomPreview) {
        URL.revokeObjectURL(
          bottomPreview
        );
      }
    };
  }, [
    topPreview,
    bottomPreview,
  ]);

  const handleChange = (
    event
  ) => {
    const {
      name,
      value,
    } = event.target;

    setForm(
      (previous) => ({
        ...previous,
        [name]: value,
      })
    );

    setError("");
    setSuccess("");
  };

  const handleSubmit =
    async (event) => {
      event.preventDefault();

      setSaving(true);
      setError("");
      setSuccess("");

      try {
        await organizationService.update(
          form
        );

        setSuccess(
          "Konfigurasi organisasi berhasil disimpan."
        );
      } catch (
        requestError
      ) {
        console.error(
          "Gagal menyimpan organisasi:",
          requestError
        );

        setError(
          requestError.response
            ?.data?.message ||
            "Gagal menyimpan konfigurasi organisasi."
        );
      } finally {
        setSaving(false);
      }
    };

  const handleLetterheadChange =
    async (
      event,
      type
    ) => {
      const file =
        event.target.files?.[0];

      event.target.value = "";

      if (!file) {
        return;
      }

      setError("");
      setSuccess("");

      try {
        const originalDimensions =
          await getImageDimensions(
            file
          );

        const resizedFile =
          await resizeLetterhead(
            file
          );

        const previewUrl =
          URL.createObjectURL(
            resizedFile
          );

        if (
          type === "top"
        ) {
          if (topPreview) {
            URL.revokeObjectURL(
              topPreview
            );
          }

          setLetterheadTop(
            resizedFile
          );

          setTopPreview(
            previewUrl
          );

          setTopOriginalSize(
            originalDimensions
          );

          return;
        }

        if (
          bottomPreview
        ) {
          URL.revokeObjectURL(
            bottomPreview
          );
        }

        setLetterheadBottom(
          resizedFile
        );

        setBottomPreview(
          previewUrl
        );

        setBottomOriginalSize(
          originalDimensions
        );
      } catch (
        validationError
      ) {
        console.error(
          "Gagal memproses kop:",
          validationError
        );

        setError(
          validationError.message ||
            "Gagal memproses gambar kop surat."
        );
      }
    };

  const handleUploadLetterheads =
    async () => {
      if (
        !letterheadTop &&
        !letterheadBottom
      ) {
        setError(
          "Pilih minimal satu kop surat terlebih dahulu."
        );

        return;
      }

      setUploadingLetterhead(
        true
      );

      setError("");
      setSuccess("");

      try {
        const formData =
          new FormData();

        if (letterheadTop) {
          formData.append(
            "letterhead_top",
            letterheadTop,
            letterheadTop.name
          );
        }

        if (
          letterheadBottom
        ) {
          formData.append(
            "letterhead_bottom",
            letterheadBottom,
            letterheadBottom.name
          );
        }

        console.log(
          "Kop atas:",
          letterheadTop
        );

        console.log(
          "Kop bawah:",
          letterheadBottom
        );

        console.log(
          "FormData letterhead_top:",
          formData.get(
            "letterhead_top"
          )
        );

        console.log(
          "FormData letterhead_bottom:",
          formData.get(
            "letterhead_bottom"
          )
        );

        const response =
          await organizationService.uploadLetterheads(
            formData
          );

        const data =
          response?.data || {};

        if (
          topPreview
        ) {
          URL.revokeObjectURL(
            topPreview
          );
        }

        if (
          bottomPreview
        ) {
          URL.revokeObjectURL(
            bottomPreview
          );
        }

        setLetterheadTop(
          null
        );

        setLetterheadBottom(
          null
        );

        setTopPreview("");

        setBottomPreview("");

        setTopOriginalSize(
          null
        );

        setBottomOriginalSize(
          null
        );

        setSavedTopPath(
          data.letterhead_top_path ||
            ""
        );

        setSavedBottomPath(
          data.letterhead_bottom_path ||
            ""
        );

        setSuccess(
          "Kop surat berhasil diperbarui."
        );

        setSuccessModalOpen(
          true
        );

        await loadData();
      } catch (
        requestError
      ) {
        console.error(
          "Gagal menyimpan kop surat:",
          requestError
        );

        setError(
          requestError.response
            ?.data?.message ||
            "Gagal menyimpan kop surat."
        );
      } finally {
        setUploadingLetterhead(
          false
        );
      }
    };

  const renderLetterheadCard =
    ({
      title,
      description,
      savedPath,
      selectedFile,
      preview,
      originalSize,
      inputId,
      onChange,
    }) => {
      const imageSource =
        preview ||
        getStorageUrl(
          savedPath
        );

      return (
        <div className="rounded-2xl border border-neutral-200 bg-white p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <h3 className="text-sm font-semibold text-rji-black">
                {title}
              </h3>

              <p className="mt-1 text-xs leading-5 text-neutral-500">
                {description}
              </p>
            </div>

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-rji-orange">
              <ImagePlus size={18} />
            </div>
          </div>

          <div className="mt-4 overflow-hidden rounded-xl border border-dashed border-neutral-300 bg-neutral-50">
            {imageSource ? (
              <div className="bg-white">
                <img
                  src={imageSource}
                  alt={title}
                  className="block h-auto w-full object-fill"
                />
              </div>
            ) : (
              <div className="flex min-h-32 items-center justify-center px-5 py-8 text-center">
                <div>
                  <ImagePlus
                    size={30}
                    className="mx-auto text-neutral-300"
                  />

                  <p className="mt-2 text-sm font-medium text-neutral-500">
                    Belum ada kop
                  </p>

                  <p className="mt-1 text-xs text-neutral-400">
                    Pilih gambar kop untuk digunakan.
                  </p>
                </div>
              </div>
            )}
          </div>

          {selectedFile && (
            <div className="mt-3 rounded-xl bg-green-50 px-3.5 py-3">
              <p className="text-xs font-semibold text-green-800">
                File siap disimpan
              </p>

              <p className="mt-1 truncate text-xs text-green-700">
                {selectedFile.name}
              </p>

              {originalSize && (
                <p className="mt-1 text-[11px] text-green-600">
                  {originalSize.width} ×{" "}
                  {originalSize.height} px
                  {" → "}
                  {LETTERHEAD_WIDTH} ×{" "}
                  {LETTERHEAD_HEIGHT} px
                </p>
              )}
            </div>
          )}

          <div className="mt-4">
            <label
              htmlFor={inputId}
              className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm font-semibold text-neutral-700 transition hover:bg-neutral-50"
            >
              <Upload size={16} />

              {selectedFile ||
              savedPath
                ? "Ganti Kop"
                : "Upload Kop"}
            </label>

            <input
              id={inputId}
              type="file"
              accept="image/png,image/jpeg,.png,.jpg,.jpeg"
              onChange={onChange}
              className="hidden"
            />
          </div>

          <p className="mt-3 text-[11px] leading-5 text-neutral-400">
            PNG/JPG · maksimal 5 MB · sistem otomatis menyesuaikan ke{" "}
            {LETTERHEAD_WIDTH} ×{" "}
            {LETTERHEAD_HEIGHT} px
          </p>
        </div>
      );
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
    <>
      <PageContainer>
        <PageHeader
          title="Organisasi"
          description="Kelola identitas dan kop surat Relawan Jurnal Indonesia yang digunakan pada dokumen."
        />

        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
            <XCircle
              size={18}
              className="mt-0.5 shrink-0"
            />

            <span>
              {error}
            </span>
          </div>
        )}

        {success && !successModalOpen && (
          <div className="mb-6 flex items-start gap-3 rounded-2xl border border-green-200 bg-green-50 px-5 py-4 text-sm text-green-700">
            <CheckCircle2
              size={18}
              className="mt-0.5 shrink-0"
            />

            <span>
              {success}
            </span>
          </div>
        )}

        <div className="space-y-6">
          <Card
            title="Identitas Organisasi"
            description="Informasi organisasi yang digunakan pada sistem persuratan."
          >
            <form
              onSubmit={
                handleSubmit
              }
              className="space-y-6"
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <Input
                  label="Nama Organisasi"
                  name="organization_name"
                  value={
                    form.organization_name
                  }
                  onChange={
                    handleChange
                  }
                  required
                />

                <Input
                  label="Nama Singkat"
                  name="organization_short_name"
                  value={
                    form.organization_short_name
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="RJI"
                />

                <div className="sm:col-span-2">
                  <Textarea
                    label="Alamat"
                    name="address"
                    value={
                      form.address
                    }
                    onChange={
                      handleChange
                    }
                    rows={4}
                  />
                </div>

                <Input
                  label="Email"
                  name="email"
                  type="email"
                  value={
                    form.email
                  }
                  onChange={
                    handleChange
                  }
                />

                <Input
                  label="Telepon"
                  name="phone"
                  value={
                    form.phone
                  }
                  onChange={
                    handleChange
                  }
                />

                <div className="sm:col-span-2">
                  <Input
                    label="Website"
                    name="website"
                    value={
                      form.website
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  type="submit"
                  icon={Save}
                  loading={
                    saving
                  }
                >
                  Simpan Perubahan
                </Button>
              </div>
            </form>
          </Card>

          <Card
            title="Kop Surat"
            description="Kop digunakan otomatis pada Surat Undangan dan Surat Tugas yang baru diterbitkan."
          >
            <div className="mb-5 rounded-2xl border border-orange-200 bg-orange-50 px-5 py-4">
              <div className="flex items-start gap-3">
                <Building2
                  size={18}
                  className="mt-0.5 shrink-0 text-rji-orange"
                />

                <div>
                  <p className="text-sm font-semibold text-orange-800">
                    Kop surat otomatis
                  </p>

                  <p className="mt-1 text-xs leading-5 text-orange-700">
                    Gambar akan otomatis disesuaikan menjadi{" "}
                    <strong>
                      1900 × 200 px
                    </strong>{" "}
                    sebelum dikirim ke server.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-5 xl:grid-cols-2">
              {renderLetterheadCard({
                title:
                  "Kop Surat Atas",

                description:
                  "Bagian kepala surat yang muncul di bagian atas halaman.",

                savedPath:
                  savedTopPath,

                selectedFile:
                  letterheadTop,

                preview:
                  topPreview,

                originalSize:
                  topOriginalSize,

                inputId:
                  "letterhead-top-input",

                onChange:
                  (event) =>
                    handleLetterheadChange(
                      event,
                      "top"
                    ),
              })}

              {renderLetterheadCard({
                title:
                  "Kop Surat Bawah",

                description:
                  "Bagian identitas kontak yang muncul di bagian bawah surat.",

                savedPath:
                  savedBottomPath,

                selectedFile:
                  letterheadBottom,

                preview:
                  bottomPreview,

                originalSize:
                  bottomOriginalSize,

                inputId:
                  "letterhead-bottom-input",

                onChange:
                  (event) =>
                    handleLetterheadChange(
                      event,
                      "bottom"
                    ),
              })}
            </div>

            <div className="mt-5 flex justify-end">
              <Button
                type="button"
                icon={Save}
                loading={
                  uploadingLetterhead
                }
                disabled={
                  !letterheadTop &&
                  !letterheadBottom
                }
                onClick={
                  handleUploadLetterheads
                }
              >
                Simpan Kop Surat
              </Button>
            </div>
          </Card>
        </div>
      </PageContainer>

      <Modal
        open={
          successModalOpen
        }
        onClose={() =>
          setSuccessModalOpen(
            false
          )
        }
        title="Kop Surat Berhasil Disimpan"
        description="Kop surat berhasil diperbarui dan akan digunakan pada surat baru."
        size="sm"
        footer={
          <div className="flex justify-end">
            <Button
              onClick={() =>
                setSuccessModalOpen(
                  false
                )
              }
            >
              Selesai
            </Button>
          </div>
        }
      >
        <div className="py-3">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-50 text-green-600">
            <CheckCircle2
              size={28}
            />
          </div>

          <p className="mt-4 text-center text-sm leading-6 text-neutral-600">
            Kop surat atas dan/atau bawah yang kamu simpan sudah berhasil diperbarui.
          </p>
        </div>
      </Modal>
    </>
  );
};

export default Organization;