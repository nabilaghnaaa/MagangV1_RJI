import { useState } from "react";
import {
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldCheck,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

import useAuthStore from "../../store/authStore";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const login = useAuthStore((state) => state.login);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const from =
    location.state?.from || "/dashboard";

  const handleChange = (event) => {
    const {
      name,
      value,
    } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.email.trim()) {
      setError("Email wajib diisi.");
      return;
    }

    if (!form.password) {
      setError("Password wajib diisi.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const result = await login({
        email: form.email.trim(),
        password: form.password,
      });

      const role =
        typeof result?.user?.role === "string"
          ? result.user.role
          : result?.user?.role?.name;

      if (role && role !== "admin") {
        setError(
          "Akun ini tidak memiliki akses ke halaman administrasi."
        );
        return;
      }

      navigate(from, {
        replace: true,
      });
    } catch (requestError) {
      console.error(requestError);

      setError(
        requestError.response?.data?.message ||
          requestError.message ||
          "Email atau password tidak valid."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-100">
      <div className="grid min-h-screen lg:grid-cols-[1.05fr_0.95fr]">
        <div className="relative hidden overflow-hidden bg-rji-black lg:flex">
          <div className="absolute inset-0">
            <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-rji-orange/20 blur-3xl" />
            <div className="absolute -bottom-32 -right-20 h-96 w-96 rounded-full bg-orange-400/10 blur-3xl" />
          </div>

          <div className="relative flex w-full flex-col justify-between p-12 xl:p-16">
            <div>
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rji-orange shadow-lg shadow-orange-500/20">
                  <span className="text-xl font-black text-white">
                    R
                  </span>
                </div>

                <div>
                  <p className="text-base font-bold tracking-tight text-white">
                    Relawan Jurnal
                  </p>

                  <p className="text-sm text-neutral-400">
                    Indonesia
                  </p>
                </div>
              </div>
            </div>

            <div className="max-w-xl">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-neutral-300 backdrop-blur">
                <ShieldCheck
                  size={15}
                  className="text-rji-orange"
                />
                Sistem Persuratan RJI
              </div>

              <h1 className="text-4xl font-bold leading-tight text-white xl:text-5xl">
                Kelola persuratan
                <span className="text-rji-orange">
                  {" "}
                  dengan lebih mudah.
                </span>
              </h1>

              <p className="mt-6 max-w-lg text-base leading-7 text-neutral-400">
                Kelola pengajuan, review, template,
                penerbitan surat, verifikasi, hingga
                pengiriman dokumen dalam satu sistem
                terintegrasi.
              </p>

              <div className="mt-10 grid max-w-lg grid-cols-3 gap-3">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                  <p className="text-2xl font-bold text-white">
                    01
                  </p>

                  <p className="mt-2 text-xs leading-5 text-neutral-400">
                    Pengajuan
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                  <p className="text-2xl font-bold text-white">
                    02
                  </p>

                  <p className="mt-2 text-xs leading-5 text-neutral-400">
                    Review
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                  <p className="text-2xl font-bold text-white">
                    03
                  </p>

                  <p className="mt-2 text-xs leading-5 text-neutral-400">
                    Terbit
                  </p>
                </div>
              </div>
            </div>

            <p className="text-xs text-neutral-500">
              © {new Date().getFullYear()} Relawan
              Jurnal Indonesia
            </p>
          </div>
        </div>

        <div className="flex min-h-screen items-center justify-center px-5 py-10 sm:px-8 lg:px-12">
          <div className="w-full max-w-md">
            <div className="mb-8 lg:hidden">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-rji-orange">
                  <span className="text-lg font-black text-white">
                    R
                  </span>
                </div>

                <div>
                  <p className="text-sm font-bold text-rji-black">
                    Relawan Jurnal
                  </p>

                  <p className="text-xs text-neutral-500">
                    Indonesia
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-neutral-200 bg-white p-7 shadow-xl shadow-neutral-200/50 sm:p-9">
              <div className="mb-8">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50 text-rji-orange">
                  <LockKeyhole size={22} />
                </div>

                <h2 className="text-2xl font-bold tracking-tight text-rji-black">
                  Selamat datang
                </h2>

                <p className="mt-2 text-sm leading-6 text-neutral-500">
                  Masuk ke akun admin untuk mengakses
                  Sistem Persuratan RJI.
                </p>
              </div>

              {error && (
                <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-5 text-red-700">
                  {error}
                </div>
              )}

              <form
                onSubmit={handleSubmit}
                className="space-y-5"
              >
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-semibold text-rji-black"
                  >
                    Email
                  </label>

                  <div className="relative">
                    <Mail
                      size={18}
                      className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400"
                    />

                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="admin@rji.or.id"
                      className="h-12 w-full rounded-xl border border-neutral-200 bg-white pl-11 pr-4 text-sm text-rji-black outline-none transition placeholder:text-neutral-400 focus:border-rji-orange focus:ring-4 focus:ring-orange-100"
                    />
                  </div>
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label
                      htmlFor="password"
                      className="block text-sm font-semibold text-rji-black"
                    >
                      Password
                    </label>
                  </div>

                  <div className="relative">
                    <LockKeyhole
                      size={18}
                      className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400"
                    />

                    <input
                      id="password"
                      name="password"
                      type={
                        showPassword
                          ? "text"
                          : "password"
                      }
                      autoComplete="current-password"
                      value={form.password}
                      onChange={handleChange}
                      placeholder="Masukkan password"
                      className="h-12 w-full rounded-xl border border-neutral-200 bg-white pl-11 pr-12 text-sm text-rji-black outline-none transition placeholder:text-neutral-400 focus:border-rji-orange focus:ring-4 focus:ring-orange-100"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(
                          (previous) =>
                            !previous
                        )
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-neutral-400 transition hover:bg-neutral-100 hover:text-neutral-700"
                      aria-label={
                        showPassword
                          ? "Sembunyikan password"
                          : "Tampilkan password"
                      }
                    >
                      {showPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="group flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-rji-orange px-5 text-sm font-bold text-white shadow-lg shadow-orange-500/20 transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Memproses...
                    </>
                  ) : (
                    <>
                      Masuk ke Dashboard

                      <ArrowRight
                        size={17}
                        className="transition-transform group-hover:translate-x-0.5"
                      />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-7 border-t border-neutral-100 pt-6">
                <div className="flex items-start gap-3">
                  <ShieldCheck
                    size={17}
                    className="mt-0.5 shrink-0 text-neutral-400"
                  />

                  <p className="text-xs leading-5 text-neutral-400">
                    Halaman ini khusus untuk pengguna
                    yang memiliki akses administrasi
                    Sistem Persuratan RJI.
                  </p>
                </div>
              </div>
            </div>

            <p className="mt-6 text-center text-xs text-neutral-400">
              Sistem Persuratan · Relawan Jurnal Indonesia
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;