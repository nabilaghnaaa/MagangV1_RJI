"use strict";

const INVITATION_CONTENT = `
<div style="text-align:right;">
  Yogyakarta, {{letter_date}}
</div>

<div style="margin-top:18px;">
  <table style="border-collapse:collapse;">
    <tr>
      <td style="width:80px;">
        Nomor
      </td>

      <td>
        : {{letter_number}}
      </td>
    </tr>

    <tr>
      <td>
        Perihal
      </td>

      <td>
        : <strong>{{subject}}</strong>
      </td>
    </tr>
  </table>
</div>

<div style="margin-top:20px;">
  <div>
    Kepada Yth.
  </div>

  <div>
    <strong>{{recipient_name}}</strong>
  </div>

  <div>
    {{recipient_position}}
  </div>

  <div>
    {{recipient_organization}}
  </div>

  <div style="margin-top:4px;">
    Di tempat
  </div>
</div>

<p style="margin-top:20px;">
  Dengan hormat,
</p>

<p>
  Dalam rangka {{activity_description}}, maka kami akan
  menyelenggarakan kegiatan
  <strong>{{activity_name}}</strong>.
  Adapun kegiatan tersebut akan dilaksanakan pada:
</p>

<table style="margin:10px 0 10px 22px; border-collapse:collapse;">
  <tr>
    <td style="width:125px;">
      Hari, Tanggal
    </td>

    <td>
      : {{activity_day}}, {{activity_date}}
    </td>
  </tr>

  <tr>
    <td>
      Pukul
    </td>

    <td>
      : {{activity_time}}
    </td>
  </tr>

  <tr>
    <td>
      Tempat
    </td>

    <td>
      : {{location}}
    </td>
  </tr>

  <tr>
    <td>
      Alamat
    </td>

    <td>
      : {{activity_address}}
    </td>
  </tr>
</table>

<p>
  Bersama ini kami memohon kesediaan Bapak/Ibu,
  <strong>{{recipient_position}}</strong>
  untuk memberikan izin kepada atas nama
  <strong>{{participant_name}}</strong>
  untuk mengikuti kegiatan dimaksud.
</p>

<p>
  Untuk konfirmasi lebih lanjut mohon berkenan untuk
  WhatsApp ke nomor berikut:
  <strong>{{confirmation_phone}}</strong>.
</p>

<p>
  Demikian undangan ini disampaikan, atas perhatian
  dan kerjasamanya kami ucapkan terima kasih.
</p>
`;

const INVITATION_FOOTER = `
<div style="margin-top:38px; text-align:right;">
  <div>
    Hormat kami,
  </div>

  <div style="margin-top:3px;">
    <strong>Pengurus Pusat Relawan Jurnal Indonesia</strong>
  </div>
</div>
`;

module.exports = {
  async up(queryInterface) {
    await queryInterface.sequelize.query(
      `
        UPDATE surat_templates
        SET
          content = :content,
          footer = :footer,
          updated_at = NOW()
        WHERE
          type = 'invitation'
          AND is_active = 1
      `,
      {
        replacements: {
          content:
            INVITATION_CONTENT,

          footer:
            INVITATION_FOOTER,
        },
      }
    );
  },

  async down(queryInterface) {
    await queryInterface.sequelize.query(
      `
        UPDATE surat_templates
        SET
          content = :content,
          footer = :footer,
          updated_at = NOW()
        WHERE
          type = 'invitation'
          AND is_active = 1
      `,
      {
        replacements: {
          content: `
            <p style="text-align:center;">
              <strong>
                Nomor: {{letter_number}}
              </strong>
            </p>

            <p>
              Yth.
              <strong>
                {{participant_name}}
              </strong>
            </p>

            <p>
              Dengan hormat,
            </p>

            <p>
              Relawan Jurnal Indonesia mengundang
              Saudara/i untuk mengikuti kegiatan
              <strong>
                {{activity_name}}
              </strong>
              yang akan dilaksanakan pada
              <strong>
                {{activity_date}}
              </strong>
              pukul
              <strong>
                {{activity_time}}
              </strong>
              bertempat di
              <strong>
                {{location}}
              </strong>.
            </p>

            <p>
              Demikian undangan kami sampaikan.
            </p>
          `,

          footer: `
            <p>
              Hormat kami,
            </p>

            <p>
              <strong>
                Relawan Jurnal Indonesia
              </strong>
            </p>
          `,
        },
      }
    );
  },
};