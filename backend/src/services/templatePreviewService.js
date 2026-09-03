const path = require("path");
const fs = require("fs/promises");

const {
  SuratInvitation,
  SuratAssignment,
  SuratTemplate,
  OrganizationSetting,
  SignatureSetting,
} = require("../models");

const {
  replacePlaceholders,
} = require("./templateRendererService");

const fileExists = async (filePath) => {
  try {
    await fs.access(
      filePath
    );

    return true;
  } catch {
    return false;
  }
};

const fileToDataUri = async (filePath) => {
  if (
    !filePath ||
    !(await fileExists(filePath))
  ) {
    return null;
  }

  const buffer =
    await fs.readFile(
      filePath
    );

  const extension =
    path.extname(
      filePath
    ).toLowerCase();

  const mimeTypes = {
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".webp": "image/webp",
  };

  const mimeType =
    mimeTypes[extension] ||
    "application/octet-stream";

  return `data:${mimeType};base64,${buffer.toString(
    "base64"
  )}`;
};

const getTemplate = async (
  type
) => {
  const template =
    await SuratTemplate.findOne({
      where: {
        type,
        is_active: true,
      },

      order: [
        ["created_at", "DESC"],
      ],
    });

  if (!template) {
    throw new Error(
      `Template aktif untuk jenis surat "${type}" belum tersedia.`
    );
  }

  return template;
};

const getOrganization = async () => {
  return OrganizationSetting.findOne({
    where: {
      is_active: true,
    },

    order: [
      ["id", "DESC"],
    ],
  });
};

const getSignature = async () => {
  return SignatureSetting.findOne({
    where: {
      is_active: true,
    },

    order: [
      ["id", "DESC"],
    ],
  });
};

const getAbsoluteStoragePath = (
  value
) => {
  if (!value) {
    return null;
  }

  return path.resolve(
    __dirname,
    "../..",
    value
  );
};

const getDayName = (
  value
) => {
  if (!value) {
    return "";
  }

  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return "";
  }

  return new Intl.DateTimeFormat(
    "id-ID",
    {
      weekday:
        "long",
    }
  ).format(date);
};

const buildInvitationData =
  async (
    invitation,
    organization,
    signature
  ) => {
    let signatureDataUri =
      null;

    let topDataUri =
      null;

    let bottomDataUri =
      null;

    if (
      signature?.signature_path
    ) {
      signatureDataUri =
        await fileToDataUri(
          getAbsoluteStoragePath(
            signature.signature_path
          )
        );
    }

    if (
      organization?.letterhead_top_path
    ) {
      topDataUri =
        await fileToDataUri(
          getAbsoluteStoragePath(
            organization.letterhead_top_path
          )
        );
    }

    if (
      organization?.letterhead_bottom_path
    ) {
      bottomDataUri =
        await fileToDataUri(
          getAbsoluteStoragePath(
            organization.letterhead_bottom_path
          )
        );
    }

    return {
      letter_number:
        invitation.letter_number,

      letter_date:
        invitation.letter_date,

      subject:
        invitation.invitation_subject ||
        invitation.activity_name,

      recipient_name:
        invitation.recipient_name,

      recipient_position:
        invitation.recipient_position,

      recipient_organization:
        invitation.recipient_organization,

      recipient_email:
        invitation.participant_email,

      participant_name:
        invitation.participant_name,

      participant_email:
        invitation.participant_email,

      participant_phone:
        invitation.participant_phone,

      organization:
        invitation.organization,

      organization_name:
        organization?.organization_name ||
        "Pengurus Pusat Relawan Jurnal Indonesia",

      organization_short_name:
        organization?.organization_short_name ||
        "RJI",

      organization_phone:
        organization?.phone ||
        "",

      confirmation_phone:
        organization?.phone ||
        "",

      activity_name:
        invitation.activity_name,

      activity_description:
        invitation.activity_description,

      activity_day:
        getDayName(
          invitation.activity_date
        ),

      activity_date:
        invitation.activity_date,

      activity_end_date:
        invitation.activity_end_date,

      activity_time:
        invitation.activity_time,

      location:
        invitation.location,

      activity_address:
        invitation.activity_address,

      invitation_subject:
        invitation.invitation_subject,

      signer_name:
        invitation.signer_name ||
        signature?.signer_name ||
        "Dr. Arbain, Sp.Pd., M.Pd.",

      signer_position:
        invitation.signer_position ||
        signature?.signer_position ||
        "Ketua RJI",

      signature_mode:
        signature?.mode ||
        "scan",

      signature_data_uri:
        signatureDataUri,

      letterhead_top_data_uri:
        topDataUri,

      letterhead_bottom_data_uri:
        bottomDataUri,

      notes:
        invitation.notes,
    };
  };

const buildAssignmentData =
  async (
    assignment,
    organization,
    signature
  ) => {
    let signatureDataUri =
      null;

    let topDataUri =
      null;

    let bottomDataUri =
      null;

    if (
      signature?.signature_path
    ) {
      signatureDataUri =
        await fileToDataUri(
          getAbsoluteStoragePath(
            signature.signature_path
          )
        );
    }

    if (
      organization?.letterhead_top_path
    ) {
      topDataUri =
        await fileToDataUri(
          getAbsoluteStoragePath(
            organization.letterhead_top_path
          )
        );
    }

    if (
      organization?.letterhead_bottom_path
    ) {
      bottomDataUri =
        await fileToDataUri(
          getAbsoluteStoragePath(
            organization.letterhead_bottom_path
          )
        );
    }

    return {
      letter_number:
        assignment.letter_number,

      letter_date:
        assignment.letter_date,

      subject:
        assignment.assignment_subject ||
        assignment.activity_name,

      recipient_name:
        assignment.member_name,

      recipient_email:
        assignment.member_email,

      member_name:
        assignment.member_name,

      member_email:
        assignment.member_email,

      member_phone:
        assignment.member_phone,

      member_organization:
        assignment.member_organization,

      member_role:
        assignment.member_role,

      activity_name:
        assignment.activity_name,

      activity_description:
        assignment.activity_description,

      activity_day:
        getDayName(
          assignment.activity_date
        ),

      activity_date:
        assignment.activity_date,

      activity_end_date:
        assignment.activity_end_date,

      activity_time:
        assignment.activity_time,

      location:
        assignment.location,

      assignment_subject:
        assignment.assignment_subject,

      request_letter_number:
        assignment.request_letter_number,

      request_letter_date:
        assignment.request_letter_date,

      organization_name:
        organization?.organization_name ||
        "Pengurus Pusat Relawan Jurnal Indonesia",

      organization_short_name:
        organization?.organization_short_name ||
        "RJI",

      organization_phone:
        organization?.phone ||
        "",

      confirmation_phone:
        organization?.phone ||
        "",

      signer_name:
        signature?.signer_name ||
        "Dr. Arbain, Sp.Pd., M.Pd.",

      signer_position:
        signature?.signer_position ||
        "Ketua RJI",

      signature_mode:
        signature?.mode ||
        "scan",

      signature_data_uri:
        signatureDataUri,

      letterhead_top_data_uri:
        topDataUri,

      letterhead_bottom_data_uri:
        bottomDataUri,

      notes:
        assignment.notes,
    };
  };

const previewInvitation = async (
  id
) => {
  const invitation =
    await SuratInvitation.findByPk(
      id
    );

  if (!invitation) {
    throw new Error(
      "Pengajuan surat undangan tidak ditemukan."
    );
  }

  const template =
    await getTemplate(
      "invitation"
    );

  const organization =
    await getOrganization();

  const signature =
    await getSignature();

  const data =
    await buildInvitationData(
      invitation,
      organization,
      signature
    );

  return {
    type:
      "invitation",

    template: {
      id:
        template.id,

      name:
        template.name,

      content:
        template.content,

      footer:
        "",
    },

    data,

    content:
      replacePlaceholders(
        template.content,
        data
      ),

    footer:
      "",
  };
};

const previewAssignment = async (
  id
) => {
  const assignment =
    await SuratAssignment.findByPk(
      id
    );

  if (!assignment) {
    throw new Error(
      "Pengajuan surat tugas tidak ditemukan."
    );
  }

  const template =
    await getTemplate(
      "assignment"
    );

  const organization =
    await getOrganization();

  const signature =
    await getSignature();

  const data =
    await buildAssignmentData(
      assignment,
      organization,
      signature
    );

  return {
    type:
      "assignment",

    template: {
      id:
        template.id,

      name:
        template.name,

      content:
        template.content,

      footer:
        "",
    },

    data,

    content:
      replacePlaceholders(
        template.content,
        data
      ),

    footer:
      "",
  };
};

module.exports = {
  previewInvitation,
  previewAssignment,
};