const formatDate = (
  value
) => {
  if (!value) {
    return "-";
  }

  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return "-";
  }

  return new Intl.DateTimeFormat(
    "id-ID",
    {
      dateStyle:
        "long",
    }
  ).format(date);
};

const getOrganizationCity = (
  address
) => {
  if (!address) {
    return "Yogyakarta";
  }

  const parts =
    String(address)
      .split(",");

  return (
    parts[0]?.trim() ||
    "Yogyakarta"
  );
};

const SuratPreview = ({
  data,
}) => {
  if (!data) {
    return (
      <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-8 text-center text-sm text-neutral-500">
        Preview surat belum tersedia.
      </div>
    );
  }

  const preview =
    data.data || {};

  const organizationName =
    preview.organization_name ||
    "Pengurus Pusat Relawan Jurnal Indonesia";

  const signerName =
    preview.signer_name ||
    "Dr. Arbain, Sp.Pd., M.Pd.";

  const signerPosition =
    preview.signer_position ||
    "Ketua RJI";

  const recipientName =
    preview.recipient_name ||
    "-";

  const recipientPosition =
    preview.recipient_position ||
    "";

  const recipientOrganization =
    preview.recipient_organization ||
    "";

  const letterNumber =
    preview.letter_number ||
    "-";

  const letterDate =
    formatDate(
      preview.letter_date
    );

  const organizationCity =
    getOrganizationCity(
      preview.organization_address
    );

  const signatureDataUri =
    preview.signature_data_uri ||
    null;

  const topLetterhead =
    preview.letterhead_top_data_uri ||
    null;

  const bottomLetterhead =
    preview.letterhead_bottom_data_uri ||
    null;

  return (
    <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-neutral-200 bg-neutral-50 px-5 py-4">
        <div>
          <p className="text-sm font-semibold text-rji-black">
            Preview Surat
          </p>

          <p className="mt-1 text-xs text-neutral-500">
            Preview berdasarkan data pengajuan saat ini. Preview tidak menerbitkan surat.
          </p>
        </div>

        <span className="rounded-lg bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700">
          PREVIEW
        </span>
      </div>

      <div className="overflow-auto bg-neutral-100 p-4 sm:p-8">
        <div className="mx-auto w-full max-w-[794px] bg-white shadow-sm">
          {topLetterhead ? (
            <img
              src={topLetterhead}
              alt="Kop Surat Atas"
              className="block w-full"
            />
          ) : (
            <div className="px-10 pt-10 sm:px-16">
              <div className="border-b-2 border-rji-orange pb-4">
                <p className="text-lg font-bold text-rji-black">
                  RELAWAN JURNAL INDONESIA
                </p>

                <p className="text-xs text-neutral-500">
                  Sistem Persuratan
                </p>
              </div>
            </div>
          )}

          <div className="px-10 py-10 sm:px-16 sm:py-12">
            <div className="text-sm leading-7 text-neutral-700">
              <div className="mb-5 text-right">
                <p>
                  {organizationCity},{" "}
                  {letterDate}
                </p>
              </div>

              <div className="mb-7">
                <table className="border-collapse text-sm leading-6">
                  <tbody>
                    <tr>
                      <td className="w-[80px] align-top pr-4">
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
                      <td className="align-top pr-4">
                        Perihal
                      </td>

                      <td className="align-top">
                        :
                      </td>

                      <td className="pl-2 font-medium text-rji-black">
                        {preview.subject ||
                          "-"}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="mb-7">
                <p>
                  Kepada Yth.
                </p>

                <p className="font-bold text-rji-black">
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
                className="text-justify"
                dangerouslySetInnerHTML={{
                  __html:
                    data.content ||
                    "",
                }}
              />

              <div className="mt-10 ml-auto w-full max-w-[300px] text-center text-sm leading-6 text-neutral-700">
                <p>
                  Hormat kami,
                </p>

                <p className="mt-1 font-semibold text-rji-black">
                  {organizationName}
                </p>

                <div className="mt-3 flex h-[105px] items-center justify-center">
                  {signatureDataUri ? (
                    <img
                      src={signatureDataUri}
                      alt="Tanda Tangan"
                      className="max-h-[100px] max-w-[200px] object-contain"
                    />
                  ) : (
                    <div className="h-[100px]" />
                  )}
                </div>

                <p className="font-bold underline text-rji-black">
                  {signerName}
                </p>

                <p className="mt-1 text-rji-black">
                  {signerPosition}
                </p>
              </div>

              <div className="mt-10 border-t border-neutral-200 pt-4 text-xs leading-5 text-neutral-400">
                Dokumen ini masih berupa preview dan belum diterbitkan.
              </div>
            </div>
          </div>

          {bottomLetterhead && (
            <img
              src={bottomLetterhead}
              alt="Kop Surat Bawah"
              className="block w-full"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default SuratPreview;