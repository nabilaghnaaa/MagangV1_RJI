import { Turnstile } from "@marsidev/react-turnstile";

const TurnstileWidget = ({
  onVerify,
  onExpire,
  onError,
}) => {
  const siteKey =
    import.meta.env.VITE_TURNSTILE_SITE_KEY;

  if (!siteKey) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700">
        Konfigurasi Cloudflare Turnstile belum tersedia.
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-5">
      <div>
        <p className="text-sm font-semibold text-rji-black">
          Verifikasi Keamanan
        </p>

        <p className="mt-1 text-xs leading-5 text-neutral-500">
          Selesaikan verifikasi sebelum mengirim pengajuan.
        </p>
      </div>

      <div className="mt-4 overflow-x-auto">
        <Turnstile
          siteKey={siteKey}
          options={{
            theme: "light",
            size: "normal",
          }}
          onSuccess={onVerify}
          onExpire={() => {
            onExpire?.();
          }}
          onError={() => {
            onError?.();
          }}
        />
      </div>
    </div>
  );
};

export default TurnstileWidget;