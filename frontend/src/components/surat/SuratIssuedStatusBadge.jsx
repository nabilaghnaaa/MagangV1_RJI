import Badge from "../common/Badge";

const STATUS_CONFIG = {
  draft: {
    label: "Draft",
    variant: "warning",
  },
  issued: {
    label: "Terbit",
    variant: "info",
  },
  sent: {
    label: "Terkirim",
    variant: "success",
  },
  cancelled: {
    label: "Dibatalkan",
    variant: "danger",
  },
};

const SuratIssuedStatusBadge = ({ status }) => {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.draft;

  return (
    <Badge variant={config.variant} dot>
      {config.label}
    </Badge>
  );
};

export default SuratIssuedStatusBadge;