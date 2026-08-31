import { X } from "lucide-react";
import { useEffect } from "react";

const SIZE_CLASSES = {
  sm: "max-w-md",
  md: "max-w-lg",
  lg: "max-w-2xl",
  xl: "max-w-4xl",
};

const Modal = ({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  size = "md",
}) => {
  useEffect(() => {
    if (!open) {
      return undefined;
    }

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose?.();
      }
    };

    document.addEventListener(
      "keydown",
      handleKeyDown
    );

    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener(
        "keydown",
        handleKeyDown
      );

      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Tutup modal"
        className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
        onClick={onClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        className={[
          "relative z-10 max-h-[90vh] w-full overflow-hidden",
          "rounded-2xl border border-neutral-200 bg-white shadow-2xl",
          SIZE_CLASSES[size] || SIZE_CLASSES.md,
        ].join(" ")}
      >
        <div className="flex items-start justify-between gap-4 border-b border-neutral-200 px-6 py-5">
          <div>
            <h2 className="text-lg font-semibold text-rji-black">
              {title}
            </h2>

            {description && (
              <p className="mt-1 text-sm text-neutral-500">
                {description}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-neutral-500 transition hover:bg-neutral-100 hover:text-rji-black"
            aria-label="Tutup"
          >
            <X size={19} />
          </button>
        </div>

        <div className="max-h-[calc(90vh-145px)] overflow-y-auto px-6 py-6">
          {children}
        </div>

        {footer && (
          <div className="border-t border-neutral-200 bg-neutral-50 px-6 py-4">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;