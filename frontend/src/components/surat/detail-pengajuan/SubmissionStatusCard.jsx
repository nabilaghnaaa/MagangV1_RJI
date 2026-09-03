import {
  CalendarDays,
  Check,
  X,
} from "lucide-react";

import Card from "../../common/Card";
import DetailItem from "./DetailItem";
import SuratStatusBadge from "../SuratStatusBadge";

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

const SubmissionStatusCard = ({
  data,
}) => {
  return (
    <Card
      title="Status Pengajuan"
      description="Informasi proses pemeriksaan pengajuan."
    >
      <div className="rounded-xl bg-neutral-50 p-4">
        <div className="flex items-center justify-between gap-4">
          <span className="text-sm text-neutral-500">
            Status saat ini
          </span>

          <SuratStatusBadge
            status={data.status}
          />
        </div>
      </div>

      <div className="mt-5 space-y-4">
        <DetailItem
          icon={CalendarDays}
          label="Diajukan"
          value={formatDate(data.createdAt || data.created_at)}
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
  );
};

export default SubmissionStatusCard;