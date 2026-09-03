import {
  CalendarDays,
  Download,
  FileText,
} from "lucide-react";

import Card from "../../common/Card";
import Button from "../../common/Button";
import DetailItem from "./DetailItem";

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

const AssignmentRequestCard = ({
  data,
}) => {
  return (
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
  );
};

export default AssignmentRequestCard;