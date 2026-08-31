import Badge from "../common/Badge";

const STATUS_CONFIG = {
  pending: {
    label: "Menunggu",
    variant: "warning",
  },

  review: {
    label: "Direview",
    variant: "info",
  },

  approved: {
    label: "Disetujui",
    variant: "success",
  },

  rejected: {
    label: "Ditolak",
    variant: "danger",
  },
};

const SuratStatusBadge = ({
  status,
}) => {
  const config =
    STATUS_CONFIG[status] ||
    STATUS_CONFIG.pending;

  return (
    <Badge
      variant={config.variant}
      dot
    >
      {config.label}
    </Badge>
  );
};

export default SuratStatusBadge;