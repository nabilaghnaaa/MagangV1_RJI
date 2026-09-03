const escapeHtml = (value) => {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
};

const formatDate = (value) => {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "long",
  }).format(date);
};

const replacePlaceholders = (content, data = {}) => {
  if (!content) {
    return "";
  }

  const replacements = {
    letter_number: escapeHtml(data.letter_number),
    letter_date: escapeHtml(formatDate(data.letter_date)),
    subject: escapeHtml(data.subject),
    recipient_name: escapeHtml(data.recipient_name),
    recipient_position: escapeHtml(data.recipient_position),
    recipient_organization: escapeHtml(data.recipient_organization),
    recipient_email: escapeHtml(data.recipient_email),
    participant_name: escapeHtml(data.participant_name),
    participant_email: escapeHtml(data.participant_email),
    participant_phone: escapeHtml(data.participant_phone),
    organization: escapeHtml(data.organization),
    organization_name: escapeHtml(data.organization_name),
    organization_short_name: escapeHtml(data.organization_short_name),
    confirmation_phone: escapeHtml(data.confirmation_phone),
    signer_name: escapeHtml(data.signer_name),
    signer_position: escapeHtml(data.signer_position),
    member_name: escapeHtml(data.member_name),
    member_email: escapeHtml(data.member_email),
    member_phone: escapeHtml(data.member_phone),
    member_organization: escapeHtml(data.member_organization),
    member_role: escapeHtml(data.member_role),
    activity_name: escapeHtml(data.activity_name),
    activity_description: escapeHtml(data.activity_description),
    activity_day: escapeHtml(data.activity_day),
    activity_date: escapeHtml(formatDate(data.activity_date)),
    activity_end_date: escapeHtml(formatDate(data.activity_end_date)),
    activity_time: escapeHtml(data.activity_time),
    location: escapeHtml(data.location),
    activity_address: escapeHtml(data.activity_address),
    invitation_subject: escapeHtml(data.invitation_subject),
    assignment_subject: escapeHtml(data.assignment_subject),
    request_letter_number: escapeHtml(data.request_letter_number),
    request_letter_date: escapeHtml(formatDate(data.request_letter_date)),
    notes: escapeHtml(data.notes),
  };

  return content.replace(
    /{{\s*([a-zA-Z0-9_]+)\s*}}/g,
    (match, key) =>
      Object.prototype.hasOwnProperty.call(
        replacements,
        key
      )
        ? replacements[key]
        : match
  );
};

module.exports = {
  replacePlaceholders,
};