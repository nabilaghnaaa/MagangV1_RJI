import {
  ClipboardList,
  FileCheck2,
  FileClock,
  FileText,
} from "lucide-react";

import PageContainer from "../../components/layout/PageContainer";
import PageHeader from "../../components/layout/PageHeader";
import useAuthStore from "../../store/authStore";

const statItems = [
  {
    label: "Total Pengajuan",
    value: "0",
    icon: ClipboardList,
    description: "Seluruh pengajuan masuk",
  },
  {
    label: "Menunggu Review",
    value: "0",
    icon: FileClock,
    description: "Perlu diperiksa admin",
  },
  {
    label: "Surat Diterbitkan",
    value: "0",
    icon: FileCheck2,
    description: "Surat sudah disetujui",
  },
  {
    label: "Total Surat",
    value: "0",
    icon: FileText,
    description: "Surat tersimpan",
  },
];

const Dashboard = () => {
  const user = useAuthStore((state) => state.user);

  return (
    <PageContainer>
      <PageHeader
        title="Dashboard"
        description="Ringkasan aktivitas Sistem Persuratan RJI."
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statItems.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.label}
              className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-neutral-500">
                    {item.label}
                  </p>

                  <p className="mt-2 text-3xl font-bold tracking-tight text-rji-black">
                    {item.value}
                  </p>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-rji-orange">
                  <Icon size={21} />
                </div>
              </div>

              <p className="mt-4 text-xs text-neutral-400">
                {item.description}
              </p>
            </div>
          );
        })}
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-rji-black">
                Pengajuan Terbaru
              </h2>

              <p className="mt-1 text-sm text-neutral-500">
                Pengajuan surat yang baru masuk.
              </p>
            </div>
          </div>

          <div className="mt-8 flex min-h-52 items-center justify-center rounded-xl border border-dashed border-neutral-200 bg-neutral-50">
            <div className="text-center">
              <ClipboardList
                size={30}
                className="mx-auto text-neutral-300"
              />

              <p className="mt-3 text-sm font-medium text-neutral-500">
                Belum ada pengajuan
              </p>

              <p className="mt-1 text-xs text-neutral-400">
                Data akan muncul ketika pemohon mengirim form.
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
          <h2 className="text-base font-semibold text-rji-black">
            Akun Aktif
          </h2>

          <div className="mt-6 flex items-center gap-4 rounded-xl bg-neutral-50 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-rji-black text-sm font-bold text-white">
              {user?.name
                ?.split(" ")
                .map((word) => word[0])
                .join("")
                .slice(0, 2)
                .toUpperCase()}
            </div>

            <div>
              <p className="font-semibold text-rji-black">
                {user?.name}
              </p>

              <p className="mt-0.5 text-sm text-neutral-500">
                {user?.email}
              </p>

              <span className="mt-2 inline-flex rounded-full bg-orange-50 px-2.5 py-1 text-xs font-semibold text-rji-orange-dark">
                Admin
              </span>
            </div>
          </div>
        </div>
      </section>
    </PageContainer>
  );
};

export default Dashboard;