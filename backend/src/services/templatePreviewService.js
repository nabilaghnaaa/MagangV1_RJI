const {
  SuratInvitation,
  SuratAssignment,
  SuratTemplate,
} = require("../models");

const {
  replacePlaceholders,
} = require("./templateRendererService");

const getTemplate = async (type) => {
  const template = await SuratTemplate.findOne({
    where: {
      type,
      is_active: true,
    },
    order: [["created_at", "DESC"]],
  });

  if (!template) {
    throw new Error(
      `Template aktif untuk jenis surat "${type}" belum tersedia.`
    );
  }

  return template;
};

const buildInvitationData = (invitation) => {
  return {
    participant_name: invitation.participant_name,
    participant_email: invitation.participant_email,
    participant_phone: invitation.participant_phone,
    organization: invitation.organization,
    activity_name: invitation.activity_name,
    activity_description: invitation.activity_description,
    activity_date: invitation.activity_date,
    activity_end_date: invitation.activity_end_date,
    activity_time: invitation.activity_time,
    location: invitation.location,
    invitation_subject: invitation.invitation_subject,
    notes: invitation.notes,
  };
};

const buildAssignmentData = (assignment) => {
  return {
    member_name: assignment.member_name,
    member_email: assignment.member_email,
    member_phone: assignment.member_phone,
    member_organization: assignment.member_organization,
    member_role: assignment.member_role,
    activity_name: assignment.activity_name,
    activity_description: assignment.activity_description,
    activity_date: assignment.activity_date,
    activity_end_date: assignment.activity_end_date,
    activity_time: assignment.activity_time,
    location: assignment.location,
    assignment_subject: assignment.assignment_subject,
    request_letter_number: assignment.request_letter_number,
    request_letter_date: assignment.request_letter_date,
    notes: assignment.notes,
  };
};

const previewInvitation = async (id) => {
  const invitation = await SuratInvitation.findByPk(id);

  if (!invitation) {
    throw new Error(
      "Pengajuan surat undangan tidak ditemukan."
    );
  }

  const template = await getTemplate("invitation");

  const data = {
    ...buildInvitationData(invitation),
    letter_number: "PREVIEW",
    letter_date: new Date(),
    subject:
      invitation.invitation_subject ||
      invitation.activity_name,
    recipient_name:
      invitation.participant_name,
    recipient_email:
      invitation.participant_email,
  };

  return {
    type: "invitation",
    template,
    data,
    content: replacePlaceholders(
      template.content,
      data
    ),
    footer: replacePlaceholders(
      template.footer || "",
      data
    ),
  };
};

const previewAssignment = async (id) => {
  const assignment = await SuratAssignment.findByPk(id);

  if (!assignment) {
    throw new Error(
      "Pengajuan surat tugas tidak ditemukan."
    );
  }

  const template = await getTemplate("assignment");

  const data = {
    ...buildAssignmentData(assignment),
    letter_number: "PREVIEW",
    letter_date: new Date(),
    subject:
      assignment.assignment_subject ||
      assignment.activity_name,
    recipient_name:
      assignment.member_name,
    recipient_email:
      assignment.member_email,
  };

  return {
    type: "assignment",
    template,
    data,
    content: replacePlaceholders(
      template.content,
      data
    ),
    footer: replacePlaceholders(
      template.footer || "",
      data
    ),
  };
};

module.exports = {
  previewInvitation,
  previewAssignment,
};