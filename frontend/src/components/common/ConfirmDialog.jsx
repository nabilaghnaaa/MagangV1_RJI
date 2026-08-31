import { AlertTriangle, CheckCircle2, Trash2, XCircle } from "lucide-react";
import Modal from "./Modal";
import Button from "./Button";

const VARIANTS = {
  warning: {
    icon: AlertTriangle,
    iconClass: "bg-yellow-50 text-yellow-600",
    buttonVariant: "primary",
  },

  success: {
    icon: CheckCircle2,
    iconClass: "bg-green-50 text-green-600",
    buttonVariant: "primary",
  },

  danger: {
    icon: XCircle,
    iconClass: "bg-red-50 text-red-600",
    buttonVariant: "danger",
  },

  delete: {
    icon: Trash2,
    iconClass: "bg-red-50 text-red-600",
    buttonVariant: "danger",
  },
};

const ConfirmDialog = ({
  open,
  onClose,
  onConfirm,
  title = "Konfirmasi",
  description = "Apakah kamu yakin ingin melanjutkan?",
  confirmText = "Konfirmasi",
  cancelText = "Batal",
  loading = false,
  variant = "warning",
}) => {
  const config =
    VARIANTS[variant] || VARIANTS.warning;

  const Icon = config.icon;

  return (
    <Modal
      open={open}
      onClose={loading ? undefined : onClose}
      title={title}
      size="sm"
      footer={
        <div className="flex justify-end gap-3">
          <Button
            variant="ghost"
            disabled={loading}
            onClick={onClose}
          >
            {cancelText}
          </Button>

          <Button
            variant={config.buttonVariant}
            loading={loading}
            onClick={onConfirm}
          >
            {confirmText}
          </Button>
        </div>
      }
    >
      <div className="flex gap-4">
        <div
          className={[
            "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl",
            config.iconClass,
          ].join(" ")}
        >
          <Icon size={21} />
        </div>

        <p className="pt-1 text-sm leading-6 text-neutral-600">
          {description}
        </p>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;