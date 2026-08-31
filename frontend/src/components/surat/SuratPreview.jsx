const SuratPreview = ({ data }) => {
  if (!data) {
    return (
      <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-8 text-center text-sm text-neutral-500">
        Preview surat belum tersedia.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-neutral-200 bg-neutral-50 px-5 py-4">
        <div>
          <p className="text-sm font-semibold text-rji-black">
            Preview Surat
          </p>

          <p className="mt-1 text-xs text-neutral-500">
            Preview ini belum menerbitkan surat.
          </p>
        </div>

        <span className="rounded-lg bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700">
          PREVIEW
        </span>
      </div>

      <div className="bg-neutral-100 p-4 sm:p-8">
        <div className="mx-auto min-h-[1123px] max-w-[794px] bg-white px-10 py-12 shadow-sm sm:px-16">
          <div className="flex items-center gap-4 border-b-2 border-rji-orange pb-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-rji-orange text-xl font-black text-white">
              R
            </div>

            <div>
              <p className="text-lg font-bold text-rji-black">
                RELAWAN JURNAL INDONESIA
              </p>

              <p className="text-xs text-neutral-500">
                Sistem Persuratan
              </p>
            </div>
          </div>

          <div
            className="prose prose-sm mt-8 max-w-none text-neutral-700"
            dangerouslySetInnerHTML={{
              __html: data.content,
            }}
          />

          {data.footer && (
            <div
              className="prose prose-sm mt-6 max-w-none text-neutral-700"
              dangerouslySetInnerHTML={{
                __html: data.footer,
              }}
            />
          )}

          <div className="mt-14 ml-auto max-w-[200px] text-center text-sm text-neutral-700">
            <p>Hormat kami,</p>

            <div className="h-20" />

            <p className="font-bold underline">
              Ketua RJI
            </p>
          </div>

          <div className="mt-10 border-t border-neutral-200 pt-4 text-xs text-neutral-400">
            Dokumen ini masih berupa preview dan belum diterbitkan.
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuratPreview;