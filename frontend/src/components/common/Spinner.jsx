import { Loader2 } from "lucide-react";

const Spinner = ({
  size = 20,
  className = "",
}) => {
  return (
    <Loader2
      size={size}
      className={[
        "animate-spin text-rji-orange",
        className,
      ].join(" ")}
      aria-label="Memuat"
    />
  );
};

export default Spinner;