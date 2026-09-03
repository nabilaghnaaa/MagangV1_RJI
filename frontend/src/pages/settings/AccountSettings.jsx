import {
  KeyRound,
  Mail,
  Save,
  Send,
  UserRound,
} from "lucide-react";
import { useState } from "react";

import PageContainer from "../../components/layout/PageContainer";
import PageHeader from "../../components/layout/PageHeader";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import useAuthStore from "../../store/authStore";

const AccountSettings = () => {
  const user = useAuthStore(
    (state) => state.user
  );

  const [loginForm, setLoginForm] =
    useState({
      email:
        user?.email || "",
    });

  const [passwordForm, setPasswordForm] =
    useState({
      current_password: "",
      new_password: "",
      confirmation_password: "",
    });

  const [emailForm, setEmailForm] =
    useState({
      sender_name:
        "Relawan Jurnal Indonesia",
      sender_email:
        "",
      smtp_app_password:
        "",
    });

  const [
    loginSaving,
    setLoginSaving,
  ] = useState(false);

  const [
    passwordSaving,
    setPasswordSaving,
  ] = useState(false);

  const [
    emailSaving,
    setEmailSaving,
  ] = useState(false);

  const [
    message,
    setMessage,
  ] = useState("");

  const [
    error,
    setError,
  ] = useState("");

  const handleLoginChange =
    (event) => {
      const {
        name,
        value,
      } = event.target;

      setLoginForm(
        (previous) => ({
          ...previous,
          [name]: value,
        })
      );
    };

  const handlePasswordChange =
    (event) => {
      const {
        name,
        value,
      } = event.target;

      setPasswordForm(
        (previous) => ({
          ...previous,
          [name]: value,
        })
      );
    };

  const handleEmailChange =
    (event) => {
      const {
        name,
        value,
      } = event.target;

      setEmailForm(
        (previous) => ({
          ...previous,
          [name]: value,
        })
      );
    };

  const handleLoginSubmit =
    async (event) => {
      event.preventDefault();

      setLoginSaving(true);
      setMessage("");
      setError("");

      try {
        setMessage(
          "Perubahan email login siap disimpan setelah endpoint pengaturan akun tersedia."
        );
      } finally {
        setLoginSaving(false);
      }
    };

  const handlePasswordSubmit =
    async (event) => {
      event.preventDefault();

      setPasswordSaving(true);
      setMessage("");
      setError("");

      if (
        passwordForm.new_password !==
        passwordForm.confirmation_password
      ) {
        setError(
          "Konfirmasi password baru tidak sesuai."
        );

        setPasswordSaving(false);
        return;
      }

      try {
        setMessage(
          "Form ganti password siap digunakan setelah endpoint pengaturan akun tersedia."
        );
      } finally {
        setPasswordSaving(false);
      }
    };

  const handleEmailSubmit =
    async (event) => {
      event.preventDefault();

      setEmailSaving(true);
      setMessage("");
      setError("");

      try {
        setMessage(
          "Form email pengirim siap digunakan setelah endpoint konfigurasi email tersedia."
        );
      } finally {
        setEmailSaving(false);
      }
    };

  return (
    <PageContainer>
      <PageHeader
        title="Pengaturan Akun"
        description="Kelola akun administrator, email login, dan konfigurasi email pengirim surat."
      />

      {message && (
        <div className="mb-6 rounded-2xl border border-green-200 bg-green-50 px-5 py-4 text-sm text-green-700">
          {message}
        </div>
      )}

      {error && (
        <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="space-y-6">
        <Card
          title="Informasi Akun"
          description="Informasi dasar akun administrator yang sedang digunakan."
        >
          <form
            onSubmit={
              handleLoginSubmit
            }
            className="space-y-6"
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <Input
                label="Nama Administrator"
                value={
                  user?.name || ""
                }
                disabled
              />

              <Input
                label="Email Login"
                name="email"
                type="email"
                value={
                  loginForm.email
                }
                onChange={
                  handleLoginChange
                }
                required
              />
            </div>

            <div className="flex justify-end">
              <Button
                type="submit"
                icon={Save}
                loading={loginSaving}
              >
                Simpan Email Login
              </Button>
            </div>
          </form>
        </Card>

        <Card
          title="Ganti Password"
          description="Gunakan password baru yang kuat untuk menjaga keamanan akun administrator."
        >
          <form
            onSubmit={
              handlePasswordSubmit
            }
            className="space-y-6"
          >
            <div className="grid gap-5 sm:grid-cols-3">
              <Input
                label="Password Saat Ini"
                name="current_password"
                type="password"
                value={
                  passwordForm.current_password
                }
                onChange={
                  handlePasswordChange
                }
                required
              />

              <Input
                label="Password Baru"
                name="new_password"
                type="password"
                value={
                  passwordForm.new_password
                }
                onChange={
                  handlePasswordChange
                }
                required
              />

              <Input
                label="Konfirmasi Password Baru"
                name="confirmation_password"
                type="password"
                value={
                  passwordForm.confirmation_password
                }
                onChange={
                  handlePasswordChange
                }
                required
              />
            </div>

            <div className="flex items-center gap-2 text-xs text-neutral-400">
              <KeyRound
                size={14}
              />

              <span>
                Pastikan password baru memiliki kombinasi yang kuat.
              </span>
            </div>

            <div className="flex justify-end">
              <Button
                type="submit"
                icon={Save}
                loading={
                  passwordSaving
                }
              >
                Ubah Password
              </Button>
            </div>
          </form>
        </Card>

        <Card
          title="Email Pengirim Surat"
          description="Konfigurasi akun Gmail yang digunakan sistem untuk mengirim surat kepada penerima."
        >
          <form
            onSubmit={
              handleEmailSubmit
            }
            className="space-y-6"
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <Input
                label="Nama Pengirim"
                name="sender_name"
                value={
                  emailForm.sender_name
                }
                onChange={
                  handleEmailChange
                }
                placeholder="Relawan Jurnal Indonesia"
                required
              />

              <Input
                label="Email Pengirim"
                name="sender_email"
                type="email"
                value={
                  emailForm.sender_email
                }
                onChange={
                  handleEmailChange
                }
                placeholder="admin@rji.id"
                required
              />

              <div className="sm:col-span-2">
                <Input
                  label="Gmail App Password"
                  name="smtp_app_password"
                  type="password"
                  value={
                    emailForm.smtp_app_password
                  }
                  onChange={
                    handleEmailChange
                  }
                  placeholder="Masukkan App Password Gmail"
                  required
                />
              </div>
            </div>

            <div className="rounded-2xl border border-orange-200 bg-orange-50 px-5 py-4">
              <div className="flex items-start gap-3">
                <Send
                  size={18}
                  className="mt-0.5 shrink-0 text-rji-orange"
                />

                <div>
                  <p className="text-sm font-semibold text-orange-800">
                    Email pengirim sistem
                  </p>

                  <p className="mt-1 text-xs leading-5 text-orange-700">
                    Email ini akan digunakan sebagai akun SMTP untuk mengirim surat yang diterbitkan sistem.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-neutral-400">
              <Mail
                size={14}
              />

              <span>
                Jangan gunakan password Gmail biasa. Gunakan Gmail App Password.
              </span>
            </div>

            <div className="flex justify-end">
              <Button
                type="submit"
                icon={Save}
                loading={
                  emailSaving
                }
              >
                Simpan Email Pengirim
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </PageContainer>
  );
};

export default AccountSettings;