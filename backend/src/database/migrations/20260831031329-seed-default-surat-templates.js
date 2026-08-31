"use strict";

module.exports = {
  async up(queryInterface) {
    const now = new Date();

    const [
      adminUsers,
    ] = await queryInterface.sequelize.query(`
      SELECT id
      FROM users
      WHERE email = 'admin@rji.id'
      LIMIT 1
    `);

    const createdBy =
      adminUsers.length
        ? adminUsers[0].id
        : null;

    await queryInterface.bulkInsert(
      "surat_templates",
      [
        {
          type: "invitation",

          name: "Template Surat Undangan RJI",

          description:
            "Template standar Surat Undangan kegiatan RJI.",

          content: `
<p style="text-align:center;">
  <strong>Nomor: {{letter_number}}</strong>
</p>

<p>
  Yth. <strong>{{participant_name}}</strong>
</p>

<p>
  Dengan hormat,
</p>

<p>
  Relawan Jurnal Indonesia mengundang
  Saudara/i untuk mengikuti kegiatan
  <strong>{{activity_name}}</strong>
  yang akan dilaksanakan pada
  <strong>{{activity_date}}</strong>
  pukul <strong>{{activity_time}}</strong>
  bertempat di
  <strong>{{location}}</strong>.
</p>

<p>
  Demikian undangan ini kami sampaikan.
  Atas perhatian dan kehadirannya kami
  ucapkan terima kasih.
</p>
`,

          footer: `
<p>
  Hormat kami,
</p>

<p>
  <strong>Relawan Jurnal Indonesia</strong>
</p>
`,

          signature_type: "manual",

          is_active: true,

          created_by: createdBy,

          created_at: now,

          updated_at: now,
        },

        {
          type: "assignment",

          name: "Template Surat Tugas RJI",

          description:
            "Template standar Surat Tugas anggota RJI.",

          content: `
<p style="text-align:center;">
  <strong>SURAT TUGAS</strong>
</p>

<p style="text-align:center;">
  Nomor: <strong>{{letter_number}}</strong>
</p>

<p>
  Yang bertanda tangan di bawah ini
  menugaskan:
</p>

<p>
  Nama:
  <strong>{{member_name}}</strong>
  <br />

  Peran:
  <strong>{{member_role}}</strong>
  <br />

  Organisasi:
  <strong>{{member_organization}}</strong>
</p>

<p>
  Untuk melaksanakan tugas sebagai
  <strong>{{member_role}}</strong>
  dalam kegiatan
  <strong>{{activity_name}}</strong>
  pada
  <strong>{{activity_date}}</strong>
  pukul
  <strong>{{activity_time}}</strong>
  bertempat di
  <strong>{{location}}</strong>.
</p>

<p>
  Demikian surat tugas ini dibuat untuk
  dapat dilaksanakan sebagaimana mestinya.
</p>
`,

          footer: `
<p>
  Hormat kami,
</p>

<p>
  <strong>Relawan Jurnal Indonesia</strong>
</p>
`,

          signature_type: "manual",

          is_active: true,

          created_by: createdBy,

          created_at: now,

          updated_at: now,
        },
      ]
    );
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete(
      "surat_templates",
      {
        name: [
          "Template Surat Undangan RJI",
          "Template Surat Tugas RJI",
        ],
      }
    );
  },
};