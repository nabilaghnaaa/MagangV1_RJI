import {
  BriefcaseBusiness,
  Building2,
  User,
} from "lucide-react";

import Card from "../../common/Card";
import DetailItem from "./DetailItem";

const RecipientCard = ({
  data,
}) => {
  return (
    <Card
      title="Penerima Surat"
      description="Data pihak yang akan menerima surat undangan."
    >
      <div className="grid gap-6 sm:grid-cols-2">
        <DetailItem
          icon={User}
          label="Nama Penerima"
          value={data.recipient_name}
        />

        <DetailItem
          icon={BriefcaseBusiness}
          label="Jabatan"
          value={data.recipient_position}
        />

        <div className="sm:col-span-2">
          <DetailItem
            icon={Building2}
            label="Instansi"
            value={data.recipient_organization}
          />
        </div>
      </div>
    </Card>
  );
};

export default RecipientCard;