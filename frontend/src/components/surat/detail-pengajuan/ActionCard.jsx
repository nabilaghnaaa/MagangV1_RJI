import {
  Check,
  RotateCcw,
  X,
} from "lucide-react";

import Card from "../../common/Card";
import Button from "../../common/Button";

const ActionCard = ({
  status,
  actionLoading,
  onReview,
  onApprove,
  onReject,
}) => {
  const processed = [
    "approved",
    "rejected",
  ].includes(status);

  if (processed) {
    return null;
  }

  return (
    <Card
      title="Tindakan Admin"
      description="Lanjutkan proses pemeriksaan pengajuan."
    >
      <div className="space-y-3">
        {status === "pending" && (
          <Button
            variant="secondary"
            className="w-full"
            icon={RotateCcw}
            disabled={actionLoading}
            onClick={onReview}
          >
            Mulai Review
          </Button>
        )}

        <Button
          variant="primary"
          className="w-full"
          icon={Check}
          disabled={actionLoading}
          onClick={onApprove}
        >
          Setujui Pengajuan
        </Button>

        <Button
          variant="danger"
          className="w-full"
          icon={X}
          disabled={actionLoading}
          onClick={onReject}
        >
          Tolak Pengajuan
        </Button>
      </div>
    </Card>
  );
};

export default ActionCard;