import {
  ArrowRight,
  FileText,
  ClipboardList,
  ShieldCheck,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import Button from "../../components/common/Button";

const Ajukan = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-neutral-50">
      <header className="border-b border-neutral-200 bg-white">
        <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-5 sm:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rji-orange">
              <span className="text-lg font-black text-white">
                R
              </span>
            </div>

            <div>
              <p className="text-sm font-bold tracking-tight text-rji-black">
                Relawan Jurnal
              </p>

              <p className="text-xs text-neutral-500">
                Indonesia
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() =>
              navigate("/login")
            }
            className="rounded-xl border border-neutral-200 px-4 py-2.5 text-sm font-semibold text-neutral-700 transition hover:border-neutral-300 hover:bg-neutral-50"
          >
            Login Admin
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5 py-10 sm:px-8 lg:py-14">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-3xl font-bold tracking-tight text-rji-black sm:text-4xl">
            Ajukan Surat
          </h1>

          <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-neutral-500 sm:text-base">
            Silakan pilih jenis surat yang ingin
            diajukan. Pengajuan dapat dilakukan tanpa login.
          </p>
        </div>

        <div className="mx-auto mt-8 grid max-w-5xl gap-5 md:grid-cols-2">
          <div className="group rounded-3xl border border-neutral-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:border-orange-200 hover:shadow-lg hover:shadow-orange-100/50">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50 text-rji-orange">
              <FileText size={23} />
            </div>

            <h2 className="mt-6 text-xl font-bold text-rji-black">
              Surat Undangan
            </h2>

            <p className="mt-3 text-sm leading-6 text-neutral-500">
              Digunakan untuk mengajukan surat undangan
              bagi peserta atau pihak eksternal dalam
              suatu kegiatan.
            </p>

            <div className="mt-6 space-y-3 text-sm text-neutral-600">
              <div className="flex items-center gap-3">
                <ShieldCheck
                  size={16}
                  className="text-rji-orange"
                />

                Pengajuan tanpa login
              </div>

              <div className="flex items-center gap-3">
                <ShieldCheck
                  size={16}
                  className="text-rji-orange"
                />

                Data diverifikasi oleh Admin
              </div>
            </div>

            <div className="mt-7">
              <Button
                type="button"
                className="w-full"
                icon={ArrowRight}
                onClick={() =>
                  navigate("/ajukan/undangan")
                }
              >
                Ajukan Surat Undangan
              </Button>
            </div>
          </div>

          <div className="group rounded-3xl border border-neutral-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:border-orange-200 hover:shadow-lg hover:shadow-orange-100/50">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50 text-rji-orange">
              <ClipboardList size={23} />
            </div>

            <h2 className="mt-6 text-xl font-bold text-rji-black">
              Surat Tugas
            </h2>

            <p className="mt-3 text-sm leading-6 text-neutral-500">
              Digunakan oleh anggota RJI untuk mengajukan
              surat tugas yang berkaitan dengan kegiatan
              organisasi.
            </p>

            <div className="mt-6 space-y-3 text-sm text-neutral-600">
              <div className="flex items-center gap-3">
                <ShieldCheck
                  size={16}
                  className="text-rji-orange"
                />

                Pengajuan tanpa login
              </div>

              <div className="flex items-center gap-3">
                <ShieldCheck
                  size={16}
                  className="text-rji-orange"
                />

                Wajib melampirkan surat permohonan
              </div>
            </div>

            <div className="mt-7">
              <Button
                type="button"
                className="w-full"
                icon={ArrowRight}
                onClick={() =>
                  navigate("/ajukan/tugas")
                }
              >
                Ajukan Surat Tugas
              </Button>
            </div>
          </div>
        </div>

        <div className="mx-auto mt-8 max-w-5xl rounded-2xl border border-neutral-200 bg-white px-5 py-4">
          <div className="flex items-start gap-3">
            <ShieldCheck
              size={18}
              className="mt-0.5 shrink-0 text-rji-orange"
            />

            <p className="text-xs leading-5 text-neutral-500 sm:text-sm">
              Setelah pengajuan dikirim, data akan diperiksa
              oleh Admin sebelum surat diterbitkan.
            </p>
          </div>
        </div>
      </main>

      <footer className="border-t border-neutral-200 bg-white">
        <div className="mx-auto max-w-6xl px-5 py-6 text-center text-xs text-neutral-400 sm:px-8">
          Sistem Persuratan · Relawan Jurnal Indonesia
        </div>
      </footer>
    </div>
  );
};

export default Ajukan;