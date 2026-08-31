import { useEffect, useRef, useState } from "react";
import {
  CheckCircle2,
  FileSignature,
  ImagePlus,
  Save,
  ScanLine,
  Trash2,
} from "lucide-react";

import PageContainer from "../../components/layout/PageContainer";
import PageHeader from "../../components/layout/PageHeader";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import Select from "../../components/common/Select";

import signatureService from "../../services/signatureService";

const MODE_OPTIONS = [
  {
    value: "scan",
    label: "Scan Tanda Tangan",
  },
  {
    value: "barcode",
    label: "Barcode",
  },
];

const Signature = () => {
  const fileInputRef = useRef(null);

  const [setting, setSetting] = useState(null);

  const [form, setForm] = useState({
    mode: "scan",
    signer_name: "",
    signer_position: "",
  });

  const [selectedFile, setSelectedFile] =
    useState(null);

  const [previewUrl, setPreviewUrl] =
    useState("");

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
        await signatureService.get();

      const data = response.data;

      setSetting(data);

      setForm({
        mode: data.mode || "scan",
        signer_name: data.signer_name || "",
        signer_position:
          data.signer_position || "",
      });
    } catch (requestError) {
      console.error(requestError);

      setError(
        requestError.response?.data?.message ||
          "Gagal mengambil konfigurasi tanda tangan."
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
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleChange = (event) => {
    const {
      name,
      value,
    } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setSuccess("");
  };

  const handleFileChange = (event) => {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    const allowedTypes = [
      "image/png",
      "image/jpeg",
    ];

    if (!allowedTypes.includes(file.type)) {
      setError(
        "File tanda tangan harus berupa PNG atau JPG."
      );

      event.target.value = "";
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setError(
        "Ukuran file tanda tangan maksimal 2 MB."
      );

      event.target.value = "";
      return;
    }

    if (previewUrl) {
      URL.revokeObjectURL(
        previewUrl
      );
    }

    setSelectedFile(file);
    setPreviewUrl(
      URL.createObjectURL(file)
    );
    setError("");
    setSuccess("");
  };

  const handleRemoveSelectedFile = () => {
    if (previewUrl) {
      URL.revokeObjectURL(
        previewUrl
      );
    }

    setSelectedFile(null);
    setPreviewUrl("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (
    event
  ) => {
    event.preventDefault();

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const formData = new FormData();

      formData.append(
        "mode",
        form.mode
      );

      formData.append(
        "signer_name",
        form.signer_name
      );

      formData.append(
        "signer_position",
        form.signer_position
      );

      if (selectedFile) {
        formData.append(
          "signature",
          selectedFile
        );
      }

      const response =
        await signatureService.update(
          formData
        );

      setSetting(response.data);

      setSelectedFile(null);

      if (previewUrl) {
        URL.revokeObjectURL(
          previewUrl
        );
      }

      setPreviewUrl("");

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      setSuccess(
        "Konfigurasi tanda tangan berhasil disimpan."
      );
    } catch (requestError) {
      console.error(requestError);

      setError(
        requestError.response?.data?.message ||
          "Gagal menyimpan konfigurasi tanda tangan."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <PageContainer>
        <div className="flex min-h-96 items-center justify-center text-sm text-neutral-500">
          Memuat konfigurasi tanda tangan...
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader
        title="Tanda Tangan"
        description="Kelola identitas penanda tangan dan metode tanda tangan yang digunakan pada surat."
      />

      {error && (
        <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-6 flex items-center gap-3 rounded-2xl border border-green-200 bg-green-50 px-5 py-4 text-sm text-green-700">
          <CheckCircle2 size={18} />
          <span>{success}</span>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        <Card
          title="Identitas Penanda Tangan"
          description="Data ini akan ditampilkan pada bagian tanda tangan surat."
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <Input
              label="Nama Penanda Tangan"
              name="signer_name"
              value={form.signer_name}
              onChange={handleChange}
              placeholder="Nama Ketua RJI"
              required
            />

            <Input
              label="Jabatan"
              name="signer_position"
              value={form.signer_position}
              onChange={handleChange}
              placeholder="Ketua RJI"
              required
            />
          </div>
        </Card>

        <Card
          title="Metode Tanda Tangan"
          description="Pilih bagaimana tanda tangan ditampilkan pada PDF."
        >
          <div className="max-w-md">
            <Select
              label="Metode"
              name="mode"
              value={form.mode}
              onChange={handleChange}
              options={MODE_OPTIONS}
              required
            />
          </div>

          <div className="mt-6 rounded-2xl border border-neutral-200 bg-neutral-50 p-5">
            {form.mode === "scan" ? (
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-rji-orange">
                  <FileSignature size={20} />
                </div>

                <div>
                  <p className="text-sm font-semibold text-rji-black">
                    Scan Tanda Tangan
                  </p>

                  <p className="mt-1 text-sm leading-6 text-neutral-500">
                    Sistem akan menempatkan gambar tanda tangan Ketua RJI ke dalam PDF surat.
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-rji-orange">
                  <ScanLine size={20} />
                </div>

                <div>
                  <p className="text-sm font-semibold text-rji-black">
                    Barcode
                  </p>

                  <p className="mt-1 text-sm leading-6 text-neutral-500">
                    Sistem akan menampilkan barcode surat pada area tanda tangan.
                  </p>
                </div>
              </div>
            )}
          </div>
        </Card>

        {form.mode === "scan" && (
          <Card
            title="File Tanda Tangan"
            description="Gunakan file PNG atau JPG dengan latar yang sesuai untuk dokumen resmi."
          >
            <div className="grid gap-6 xl:grid-cols-[1fr_320px]">
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".png,.jpg,.jpeg,image/png,image/jpeg"
                  onChange={handleFileChange}
                  className="hidden"
                />

                <button
                  type="button"
                  onClick={() =>
                    fileInputRef.current?.click()
                  }
                  className="flex min-h-44 w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-neutral-300 bg-neutral-50 px-6 text-center transition hover:border-rji-orange hover:bg-orange-50/40"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-rji-orange shadow-sm">
                    <ImagePlus size={22} />
                  </div>

                  <p className="mt-4 text-sm font-semibold text-rji-black">
                    Pilih file tanda tangan
                  </p>

                  <p className="mt-1 text-xs text-neutral-500">
                    PNG, JPG, JPEG maksimal 2 MB
                  </p>
                </button>

                {(selectedFile ||
                  setting?.signature_path) && (
                  <div className="mt-4 flex items-center justify-between gap-4 rounded-xl border border-neutral-200 bg-white p-4">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-rji-black">
                        {selectedFile?.name ||
                          setting.signature_path?.split("/").pop()}
                      </p>

                      <p className="mt-1 text-xs text-neutral-400">
                        {selectedFile
                          ? `${(
                              selectedFile.size /
                              1024
                            ).toFixed(1)} KB`
                          : "File tersimpan"}
                      </p>
                    </div>

                    {selectedFile && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        icon={Trash2}
                        onClick={
                          handleRemoveSelectedFile
                        }
                      >
                        Hapus
                      </Button>
                    )}
                  </div>
                )}
              </div>

              <div className="rounded-2xl border border-neutral-200 bg-white p-5">
                <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                  Preview
                </p>

                <div className="mt-4 flex min-h-36 items-center justify-center rounded-xl bg-neutral-50 p-4">
                  {previewUrl ? (
                    <img
                      src={previewUrl}
                      alt="Preview tanda tangan"
                      className="max-h-28 max-w-full object-contain"
                    />
                  ) : setting?.signature_path ? (
                    <img
                      src={`${import.meta.env.VITE_API_URL?.replace("/api", "") || "http://localhost:5000"}/${setting.signature_path}`}
                      alt="Tanda tangan tersimpan"
                      className="max-h-28 max-w-full object-contain"
                    />
                  ) : (
                    <div className="text-center">
                      <FileSignature
                        size={30}
                        className="mx-auto text-neutral-300"
                      />

                      <p className="mt-2 text-xs text-neutral-400">
                        Belum ada tanda tangan
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Card>
        )}

        <Card
          title="Status Konfigurasi"
          description="Ringkasan konfigurasi tanda tangan saat ini."
        >
          <div className="grid gap-5 sm:grid-cols-3">
            <div>
              <p className="text-xs text-neutral-400">
                Mode
              </p>

              <p className="mt-1 text-sm font-semibold capitalize text-rji-black">
                {form.mode}
              </p>
            </div>

            <div>
              <p className="text-xs text-neutral-400">
                Penanda Tangan
              </p>

              <p className="mt-1 text-sm font-semibold text-rji-black">
                {form.signer_name || "-"}
              </p>
            </div>

            <div>
              <p className="text-xs text-neutral-400">
                Jabatan
              </p>

              <p className="mt-1 text-sm font-semibold text-rji-black">
                {form.signer_position || "-"}
              </p>
            </div>
          </div>
        </Card>

        <div className="flex justify-end">
          <Button
            type="submit"
            icon={Save}
            loading={saving}
          >
            Simpan Konfigurasi
          </Button>
        </div>
      </form>
    </PageContainer>
  );
};

export default Signature;