const TEMPLATE_PLACEHOLDERS = {
  COMMON: [
    "{{letter_number}}",
    "{{letter_date}}",
    "{{subject}}",
    "{{recipient_name}}",
    "{{recipient_email}}",
  ],

  INVITATION: [
    "{{participant_name}}",
    "{{participant_email}}",
    "{{participant_phone}}",
    "{{organization}}",
    "{{activity_name}}",
    "{{activity_description}}",
    "{{activity_date}}",
    "{{activity_end_date}}",
    "{{activity_time}}",
    "{{location}}",
    "{{invitation_subject}}",
    "{{notes}}",
  ],

  ASSIGNMENT: [
    "{{member_name}}",
    "{{member_email}}",
    "{{member_phone}}",
    "{{member_organization}}",
    "{{member_role}}",
    "{{activity_name}}",
    "{{activity_description}}",
    "{{activity_date}}",
    "{{activity_end_date}}",
    "{{activity_time}}",
    "{{location}}",
    "{{assignment_subject}}",
    "{{request_letter_number}}",
    "{{request_letter_date}}",
    "{{notes}}",
  ],
};

const getPlaceholdersByType = (
  type
) => {
  if (type === "invitation") {
    return [
      ...TEMPLATE_PLACEHOLDERS.COMMON,
      ...TEMPLATE_PLACEHOLDERS.INVITATION,
    ];
  }

  if (type === "assignment") {
    return [
      ...TEMPLATE_PLACEHOLDERS.COMMON,
      ...TEMPLATE_PLACEHOLDERS.ASSIGNMENT,
    ];
  }

  return [];
};

module.exports = {
  TEMPLATE_PLACEHOLDERS,
  getPlaceholdersByType,
};