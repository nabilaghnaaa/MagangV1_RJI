import { useEffect, useRef } from "react";

const Dropdown = ({
  open = false,
  onClose,
  trigger,
  children,
  align = "right",
  width = "w-64",
}) => {
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    const handleClickOutside = (
      event
    ) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(
          event.target
        )
      ) {
        onClose?.();
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, [open, onClose]);

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    const handleKeyDown = (
      event
    ) => {
      if (event.key === "Escape") {
        onClose?.();
      }
    };

    document.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      document.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [open, onClose]);

  const alignmentClass =
    align === "left"
      ? "left-0"
      : align === "center"
      ? "left-1/2 -translate-x-1/2"
      : "right-0";

  return (
    <div
      ref={dropdownRef}
      className="relative"
    >
      {trigger}

      {open && (
        <div
          className={[
            "absolute top-full z-[80] mt-2",
            width,
            alignmentClass,
            "overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-xl",
          ].join(" ")}
        >
          {children}
        </div>
      )}
    </div>
  );
};

export default Dropdown;