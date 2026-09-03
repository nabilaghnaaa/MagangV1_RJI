import {
  Building2,
  CheckCircle2,
  ImagePlus,
  Mail,
  Save,
  Upload,
  Phone,
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

import organizationService from "../../services/organizationService";

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

const readImageDimensions = (
  file
) => {
  return new Promise(
    (resolve, reject) => {
      const reader =
        new FileReader();

      reader.onload = () => {
        const image =
          new window.Image();

        image.onload = () => {
          resolve({
            width:
              image.naturalWidth,
            height:
              image.naturalHeight,
          });
        };

        image.onerror = () => {
          reject(
            new Error(
              "Gambar tidak dapat dibaca."
            )
          );
        };

        image.src =
          reader.result;
      };

      reader.onerror = () => {
        reject(
          new Error(
            "File gambar tidak dapat dibaca."
          )
        );
      };

      reader.readAsDataURL(
        file
      );
    }
  );
};

const validateLetterhead = async (
  file
) => {
  if (!file) {
    throw new Error(
      "File belum dipilih."
    );
  }

  const allowedTypes = [
    "image/png",
    "image/jpeg",
  ];

  if (
    !allowedTypes.includes(
      file.type
    )
  ) {
    throw new Error(
      "Format kop hanya boleh PNG atau JPG/JPEG."
    );
  }

  const maxFileSize =
    5 * 1024 * 1024;

  if (
    file.size >
    maxFileSize
  ) {
    throw new Error(
      "Ukuran file maksimal 5 MB."
    );
  }

  const dimensions =
    await readImageDimensions(
      file
    );

  if (
    dimensions.width !==
      1900 ||
    dimensions.height !==
      200
  ) {
    throw new Error(
      `Ukuran gambar harus tepat 1900 × 200 px. File yang dipilih berukuran ${dimensions.width} × ${dimensions.height} px.`
    );
  }

  return dimensions;
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
            data.address || "",

          email:
            data.email || "",

          phone:
            data.phone || "",

          website:
            data.website || "",
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
          "Gagal mengambil organisasi:",
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
  }, []);

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

        await loadData();
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

      if (!file) {
        return;
      }

      setError("");
      setSuccess("");

      try {
        await validateLetterhead(
          file
        );

        const previewUrl =
          URL.createObjectURL(
            file
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
            file
          );

          setTopPreview(
            previewUrl
          );
        } else {
          if (
            bottomPreview
          ) {
            URL.revokeObjectURL(
              bottomPreview
            );
          }

          setLetterheadBottom(
            file
          );

          setBottomPreview(
            previewUrl
          );
        }
      } catch (
        validationError
      ) {
        event.target.value =
          "";

        setError(
          validationError.message
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
            letterheadTop
          );
        }

        if (
          letterheadBottom
        ) {
          formData.append(
            "letterhead_bottom",
            letterheadBottom
          );
        }

        const response =
          await organizationService.uploadLetterheads(
            formData
          );

        const data =
          response?.data || {};

        setSavedTopPath(
          data.letterhead_top_path ||
            ""
        );

        setSavedBottomPath(
          data.letterhead_bottom_path ||
            ""
        );

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

        setLetterheadTop(
          null
        );

        setLetterheadBottom(
          null
        );

        setTopPreview("");
        setBottomPreview("");

        setSuccess(
          "Kop surat berhasil disimpan."
        );

        await loadData();
      } catch (
        requestError
      ) {
        console.error(
          "Gagal upload kop surat:",
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
                  className="block h-auto w-full object-contain"
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
                    Upload gambar 1900 × 200 px.
                  </p>
                </div>
              </div>
            )}
          </div>

          {selectedFile && (
            <div className="mt-3 rounded-xl bg-orange-50 px-3.5 py-3">
              <p className="truncate text-xs font-semibold text-orange-800">
                File dipilih
              </p>

              <p className="mt-1 truncate text-xs text-orange-700">
                {selectedFile.name}
              </p>
            </div>
          )}

          <div className="mt-4">
            <label
              htmlFor={inputId}
              className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm font-semibold text-neutral-700 transition hover:bg-neutral-50"
            >
              <Upload size={16} />

              {selectedFile
                ? "Ganti Kop"
                : savedPath
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
            PNG/JPG · maksimal 5 MB · wajib 1900 × 200 px
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

      {success && (
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
                loading={saving}
              >
                Simpan Perubahan
              </Button>
            </div>
          </form>
        </Card>

        <Card
          title="Kop Surat"
          description="Kop ini akan digunakan otomatis pada Surat Undangan dan Surat Tugas yang baru diterbitkan."
        >
          <div className="mb-5 rounded-2xl border border-orange-200 bg-orange-50 px-5 py-4">
            <div className="flex items-start gap-3">
              <Building2
                size={18}
                className="mt-0.5 shrink-0 text-rji-orange"
              />

              <div>
                <p className="text-sm font-semibold text-orange-800">
                  Ukuran standar kop
                </p>

                <p className="mt-1 text-xs leading-5 text-orange-700">
                  Kedua gambar harus berukuran tepat
                  <strong>
                    {" "}
                    1900 × 200 px
                  </strong>
                  . Setelah memilih file, preview akan langsung muncul sebelum disimpan.
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-5 xl:grid-cols-2">
            {renderLetterheadCard({
              title: "Kop Surat Atas",
              description:
                "Bagian kepala surat yang muncul di bagian atas halaman.",
              savedPath:
                savedTopPath,
              selectedFile:
                letterheadTop,
              preview:
                topPreview,
              inputId:
                "letterhead-top-input",
              onChange: (
                event
              ) =>
                handleLetterheadChange(
                  event,
                  "top"
                ),
            })}

            {renderLetterheadCard({
              title: "Kop Surat Bawah",
              description:
                "Bagian identitas kontak yang muncul di bagian bawah surat.",
              savedPath:
                savedBottomPath,
              selectedFile:
                letterheadBottom,
              preview:
                bottomPreview,
              inputId:
                "letterhead-bottom-input",
              onChange: (
                event
              ) =>
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
  );
};

export default Organization;