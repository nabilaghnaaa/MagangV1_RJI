import {
  CalendarDays,
  Clock3,
  FileText,
  MapPin,
} from "lucide-react";

import Card from "../../common/Card";
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

const ActivityCard = ({
  data,
  isInvitation,
}) => {
  return (
    <Card
      title="Detail Kegiatan"
      description="Informasi kegiatan yang akan dimuat ke dalam surat."
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
          label="Pukul"
          value={data.activity_time}
        />

        <DetailItem
          icon={MapPin}
          label="Tempat"
          value={data.location}
        />

        {isInvitation && data.activity_address && (
          <div className="sm:col-span-2">
            <DetailItem
              icon={MapPin}
              label="Alamat Kegiatan"
              value={data.activity_address}
            />
          </div>
        )}
      </div>

      {data.activity_description && (
        <div className="mt-6 border-t border-neutral-100 pt-6">
          <p className="text-xs font-semibold text-neutral-400">
            Deskripsi / Tujuan Kegiatan
          </p>

          <p className="mt-3 whitespace-pre-line text-sm leading-6 text-neutral-700">
            {data.activity_description}
          </p>
        </div>
      )}

      {data.notes && (
        <div className="mt-6 border-t border-neutral-100 pt-6">
          <p className="text-xs font-semibold text-neutral-400">
            Catatan Pemohon
          </p>

          <p className="mt-3 whitespace-pre-line text-sm leading-6 text-neutral-700">
            {data.notes}
          </p>
        </div>
      )}
    </Card>
  );
};

export default ActivityCard;