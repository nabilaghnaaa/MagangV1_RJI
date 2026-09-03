import {
  Building2,
  BriefcaseBusiness,
  Mail,
  Phone,
  User,
} from "lucide-react";

import Card from "../../common/Card";
import DetailItem from "./DetailItem";

const ApplicantCard = ({
  isInvitation,
  title,
  data,
}) => {
  const name = isInvitation ? data.participant_name : data.member_name;
  const email = isInvitation ? data.participant_email : data.member_email;
  const phone = isInvitation ? data.participant_phone : data.member_phone;

  return (
    <Card title={title} description="Informasi pihak yang mengajukan surat.">
      <div className="grid gap-6 sm:grid-cols-2">
        <DetailItem
          icon={User}
          label="Nama"
          value={name}
        />

        <DetailItem
          icon={Mail}
          label="Email"
          value={email}
        />

        <DetailItem
          icon={Phone}
          label="Nomor Telepon"
          value={phone}
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
  );
};

export default ApplicantCard;