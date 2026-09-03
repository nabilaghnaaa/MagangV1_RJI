const formatDate = (value) => {
  if (!value) {
    return "-";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "long",
  }).format(date);
};

const SuratPreview = ({ data }) => {
  if (!data) {
    return (
      <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-8 text-center text-sm text-neutral-500">
        Preview surat belum tersedia.
      </div>
    );
  }

  const previewData = data.data || {};

  const signerName =
    previewData.signer_name ||
    "Dr. Arbain, Sp.Pd., M.Pd.";

  const signerPosition =
    previewData.signer_position ||
    "Ketua RJI";

  const organizationName =
    previewData.organization_name ||
    "Pengurus Pusat Relawan Jurnal Indonesia";

  const signatureMode =
    previewData.signature_mode ||
    "scan";

  const signatureDataUri =
    previewData.signature_data_uri ||
    null;

  const letterheadTopDataUri =
    previewData.letterhead_top_data_uri ||
    null;

  const letterheadBottomDataUri =
    previewData.letterhead_bottom_data_uri ||
    null;

  const recipientName =
    previewData.recipient_name ||
    "-";

  const recipientPosition =
    previewData.recipient_position ||
    "";

  const recipientOrganization =
    previewData.recipient_organization ||
    "";

  const letterNumber =
    previewData.letter_number ||
    "-";

  const letterDate =
    previewData.letter_date
      ? formatDate(previewData.letter_date)
      : "-";

  const subject =
    previewData.subject ||
    "-";

  return (
    <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-neutral-200 bg-neutral-50 px-5 py-4">
        <div>
          <p className="text-sm font-semibold text-rji-black">
            Preview Surat
          </p>

          <p className="mt-1 text-xs text-neutral-500">
            Preview berdasarkan data pengajuan saat ini.
          </p>
        </div>

        <span className="rounded-lg bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700">
          PREVIEW
        </span>
      </div>

      <div className="overflow-auto bg-neutral-100 p-4 sm:p-8">
        <div className="mx-auto w-full max-w-[794px] bg-white shadow-sm">
          {letterheadTopDataUri ? (
            <img
              src={letterheadTopDataUri}
              alt="Kop Surat Atas"
              className="block h-auto w-full object-fill"
            />
          ) : (
            <div className="px-10 pt-10 sm:px-16">
              <div className="flex items-center gap-4 border-b-2 border-rji-orange pb-4">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-rji-orange text-xl font-black text-white">
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
            </div>
          )}

          <div className="px-10 py-10 sm:px-16 sm:py-12">
            <div className="text-sm leading-7 text-neutral-700">
              <div className="mb-8">
                <table className="text-sm leading-6">
                  <tbody>
                    <tr>
                      <td className="w-[85px] pr-4 align-top">
                        Nomor
                      </td>

                      <td className="w-[15px] align-top">
                        :
                      </td>

                      <td className="pl-2 font-medium text-rji-black">
                        {letterNumber}
                      </td>
                    </tr>

                    <tr>
                      <td className="pr-4 align-top">
                        Tanggal
                      </td>

                      <td className="align-top">
                        :
                      </td>

                      <td className="pl-2">
                        {letterDate}
                      </td>
                    </tr>

                    <tr>
                      <td className="pr-4 align-top">
                        Perihal
                      </td>

                      <td className="align-top">
                        :
                      </td>

                      <td className="pl-2 font-medium text-rji-black">
                        {subject}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="mb-8">
                <p>
                  Kepada Yth.
                </p>

                <p className="font-semibold text-rji-black">
                  {recipientName}
                </p>

                {recipientPosition && (
                  <p>
                    {recipientPosition}
                  </p>
                )}

                {recipientOrganization && (
                  <p>
                    {recipientOrganization}
                  </p>
                )}

                <p>
                  Di tempat
                </p>
              </div>

              <div
                className="prose prose-sm max-w-none text-neutral-700 prose-p:my-3 prose-p:leading-7 prose-strong:font-bold"
                dangerouslySetInnerHTML={{
                  __html:
                    data.content || "",
                }}
              />

              {data.footer && (
                <div
                  className="prose prose-sm mt-3 max-w-none text-neutral-700 prose-p:my-3 prose-p:leading-7 prose-strong:font-bold"
                  dangerouslySetInnerHTML={{
                    __html:
                      data.footer,
                  }}
                />
              )}

              <div className="mt-12 ml-auto w-full max-w-[300px] text-center text-sm leading-6 text-neutral-700">
                <p>
                  Hormat kami,
                </p>

                <p className="mt-1 font-semibold text-rji-black">
                  {organizationName}
                </p>

                <div className="mt-3 flex h-[105px] items-center justify-center">
                  {signatureMode ===
                    "scan" &&
                  signatureDataUri ? (
                    <img
                      src={
                        signatureDataUri
                      }
                      alt="Tanda Tangan"
                      className="max-h-[95px] max-w-[190px] object-contain"
                    />
                  ) : (
                    <div className="h-[95px]" />
                  )}
                </div>

                <p className="font-bold underline text-rji-black">
                  {signerName}
                </p>

                <p className="mt-1 text-rji-black">
                  {signerPosition}
                </p>
              </div>

              <div className="mt-12 border-t border-neutral-200 pt-4 text-xs leading-5 text-neutral-400">
                Dokumen ini masih berupa preview dan belum diterbitkan.
              </div>
            </div>
          </div>

          {letterheadBottomDataUri && (
            <img
              src={letterheadBottomDataUri}
              alt="Kop Surat Bawah"
              className="block h-auto w-full object-fill"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default SuratPreview;