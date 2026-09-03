import Input from "../../common/Input";
import Textarea from "../../common/Textarea";

const SectionTitle = ({
  children,
}) => {
  return (
    <div className="border-b border-neutral-100 pb-3">
      <h3 className="text-sm font-semibold text-rji-black">
        {children}
      </h3>
    </div>
  );
};

const EditPengajuanForm = ({
  isInvitation,
  form,
  onChange,
  onSubmit,
}) => {
  return (
    <form
      id="edit-pengajuan-form"
      onSubmit={onSubmit}
      className="space-y-6"
    >
      {isInvitation && (
        <>
          <SectionTitle>
            Data Penerima Surat
          </SectionTitle>

          <div className="grid gap-5 sm:grid-cols-2">
            <Input
              label="Nama Penerima"
              name="recipient_name"
              value={form.recipient_name || ""}
              onChange={onChange}
              required
            />

            <Input
              label="Jabatan Penerima"
              name="recipient_position"
              value={form.recipient_position || ""}
              onChange={onChange}
              required
            />

            <div className="sm:col-span-2">
              <Input
                label="Instansi Penerima"
                name="recipient_organization"
                value={form.recipient_organization || ""}
                onChange={onChange}
              />
            </div>
          </div>
        </>
      )}

      <SectionTitle>
        {isInvitation ? "Data Peserta" : "Data Anggota RJI"}
      </SectionTitle>

      <div className="grid gap-5 sm:grid-cols-2">
        {isInvitation ? (
          <>
            <Input
              label="Nama Peserta"
              name="participant_name"
              value={form.participant_name || ""}
              onChange={onChange}
              required
            />

            <Input
              label="Email Peserta"
              name="participant_email"
              type="email"
              value={form.participant_email || ""}
              onChange={onChange}
              required
            />

            <Input
              label="Nomor Telepon"
              name="participant_phone"
              value={form.participant_phone || ""}
              onChange={onChange}
            />

            <Input
              label="Institusi / Organisasi"
              name="organization"
              value={form.organization || ""}
              onChange={onChange}
            />
          </>
        ) : (
          <>
            <Input
              label="Nama Anggota"
              name="member_name"
              value={form.member_name || ""}
              onChange={onChange}
              required
            />

            <Input
              label="Email Anggota"
              name="member_email"
              type="email"
              value={form.member_email || ""}
              onChange={onChange}
              required
            />

            <Input
              label="Nomor Telepon"
              name="member_phone"
              value={form.member_phone || ""}
              onChange={onChange}
            />

            <Input
              label="Organisasi"
              name="member_organization"
              value={form.member_organization || ""}
              onChange={onChange}
            />

            <Input
              label="Peran"
              name="member_role"
              value={form.member_role || ""}
              onChange={onChange}
              required
            />
          </>
        )}
      </div>

      <SectionTitle>
        Data Surat
      </SectionTitle>

      <div className="grid gap-5 sm:grid-cols-2">
        <Input
          label="Nomor Surat"
          name="letter_number"
          value={form.letter_number || ""}
          onChange={onChange}
          placeholder="Contoh: D.10/0077/RJI/IX/2026"
        />

        <Input
          label="Tanggal Surat"
          name="letter_date"
          type="date"
          value={form.letter_date || ""}
          onChange={onChange}
        />

        <div className="sm:col-span-2">
          <Input
            label={isInvitation ? "Perihal Undangan" : "Perihal Surat Tugas"}
            name={isInvitation ? "invitation_subject" : "assignment_subject"}
            value={isInvitation ? form.invitation_subject || "" : form.assignment_subject || ""}
            onChange={onChange}
            placeholder="Perihal surat"
            required
          />
        </div>
      </div>

      <SectionTitle>
        Detail Kegiatan
      </SectionTitle>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Input
            label="Nama Kegiatan"
            name="activity_name"
            value={form.activity_name || ""}
            onChange={onChange}
            required
          />
        </div>

        <Input
          label="Tanggal Mulai"
          name="activity_date"
          type="date"
          value={form.activity_date || ""}
          onChange={onChange}
          required
        />

        <Input
          label="Tanggal Selesai"
          name="activity_end_date"
          type="date"
          value={form.activity_end_date || ""}
          onChange={onChange}
        />

        <Input
          label="Pukul"
          name="activity_time"
          value={form.activity_time || ""}
          onChange={onChange}
          placeholder="09.00 - 12.00 WIB"
        />

        <Input
          label="Tempat"
          name="location"
          value={form.location || ""}
          onChange={onChange}
          required
        />

        {isInvitation && (
          <div className="sm:col-span-2">
            <Textarea
              label="Alamat Kegiatan"
              name="activity_address"
              value={form.activity_address || ""}
              onChange={onChange}
              rows={3}
            />
          </div>
        )}

        <div className="sm:col-span-2">
          <Textarea
            label="Deskripsi / Tujuan Kegiatan"
            name="activity_description"
            value={form.activity_description || ""}
            onChange={onChange}
            rows={5}
          />
        </div>
      </div>

      {!isInvitation && (
        <>
          <SectionTitle>
            Surat Permohonan
          </SectionTitle>

          <div className="grid gap-5 sm:grid-cols-2">
            <Input
              label="Nomor Surat Permohonan"
              name="request_letter_number"
              value={form.request_letter_number || ""}
              onChange={onChange}
            />

            <Input
              label="Tanggal Surat Permohonan"
              name="request_letter_date"
              type="date"
              value={form.request_letter_date || ""}
              onChange={onChange}
            />
          </div>
        </>
      )}

      <SectionTitle>
        Catatan
      </SectionTitle>

      <div className="grid gap-5">
        <Textarea
          label="Catatan Pemohon"
          name="notes"
          value={form.notes || ""}
          onChange={onChange}
          rows={3}
        />

        <Textarea
          label="Catatan Admin"
          name="admin_notes"
          value={form.admin_notes || ""}
          onChange={onChange}
          rows={3}
          placeholder="Catatan pemeriksaan admin..."
        />
      </div>
    </form>
  );
};

export default EditPengajuanForm;