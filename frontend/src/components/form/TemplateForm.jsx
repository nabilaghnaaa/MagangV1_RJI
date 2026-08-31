import { useEffect, useState } from "react";
import { Save } from "lucide-react";

import Button from "../common/Button";
import Input from "../common/Input";
import Select from "../common/Select";
import Textarea from "../common/Textarea";

const TYPE_OPTIONS = [
  {
    value: "invitation",
    label: "Surat Undangan",
  },
  {
    value: "assignment",
    label: "Surat Tugas",
  },
];

const SIGNATURE_OPTIONS = [
  {
    value: "manual",
    label: "Manual",
  },
  {
    value: "barcode",
    label: "Barcode",
  },
  {
    value: "digital",
    label: "Digital",
  },
];

const TemplateForm = ({
  initialData = {},
  onSubmit,
  loading = false,
  submitLabel = "Simpan Template",
}) => {
  const [form, setForm] = useState({
    type: "invitation",
    name: "",
    description: "",
    content: "",
    footer: "",
    signature_type: "manual",
    is_active: true,
  });

  useEffect(() => {
    setForm({
      type:
        initialData.type ||
        "invitation",
      name:
        initialData.name ||
        "",
      description:
        initialData.description ||
        "",
      content:
        initialData.content ||
        "",
      footer:
        initialData.footer ||
        "",
      signature_type:
        initialData.signature_type ||
        "manual",
      is_active:
        initialData.is_active ?? true,
    });
  }, [initialData]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    onSubmit(form);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <Select
          label="Jenis Template"
          name="type"
          value={form.type}
          onChange={handleChange}
          options={TYPE_OPTIONS}
          required
        />

        <Select
          label="Jenis Tanda Tangan"
          name="signature_type"
          value={form.signature_type}
          onChange={handleChange}
          options={SIGNATURE_OPTIONS}
          required
        />

        <div className="sm:col-span-2">
          <Input
            label="Nama Template"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Contoh: Template Surat Undangan RJI"
            required
          />
        </div>

        <div className="sm:col-span-2">
          <Input
            label="Deskripsi"
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Deskripsi template"
          />
        </div>

        <div className="sm:col-span-2">
          <Textarea
            label="Isi Template"
            name="content"
            value={form.content}
            onChange={handleChange}
            rows={16}
            required
          />

          <div className="mt-2 rounded-xl bg-neutral-50 p-4">
            <p className="text-xs font-semibold text-neutral-500">
              Placeholder
            </p>

            <p className="mt-2 text-xs leading-5 text-neutral-500">
              Gunakan format seperti
              {" "}
              {"{{participant_name}}"}
              {" "}
              atau
              {" "}
              {"{{activity_name}}"}.
            </p>
          </div>
        </div>

        <div className="sm:col-span-2">
          <Textarea
            label="Footer Template"
            name="footer"
            value={form.footer}
            onChange={handleChange}
            rows={6}
          />
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          type="submit"
          icon={Save}
          loading={loading}
        >
          {submitLabel}
        </Button>
      </div>
    </form>
  );
};

export default TemplateForm;