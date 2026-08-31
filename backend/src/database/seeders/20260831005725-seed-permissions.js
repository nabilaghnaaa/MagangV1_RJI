"use strict";

module.exports = {
  async up(queryInterface) {
    const now = new Date();

    const permissions = [
      {
        name: "dashboard.view",
        description: "Melihat dashboard.",
      },

      {
        name: "submission.view",
        description: "Melihat pengajuan surat.",
      },
      {
        name: "submission.update",
        description: "Mengubah data pengajuan surat.",
      },
      {
        name: "submission.review",
        description: "Memeriksa dan memverifikasi pengajuan surat.",
      },
      {
        name: "submission.approve",
        description: "Menyetujui pengajuan surat.",
      },
      {
        name: "submission.reject",
        description: "Menolak pengajuan surat.",
      },

      {
        name: "surat.view",
        description: "Melihat surat.",
      },
      {
        name: "surat.create",
        description: "Membuat surat.",
      },
      {
        name: "surat.update",
        description: "Mengubah surat.",
      },
      {
        name: "surat.delete",
        description: "Menghapus surat.",
      },
      {
        name: "surat.download",
        description: "Mengunduh surat.",
      },
      {
        name: "surat.archive",
        description: "Mengarsipkan surat.",
      },

      {
        name: "template.view",
        description: "Melihat template surat.",
      },
      {
        name: "template.create",
        description: "Membuat template surat.",
      },
      {
        name: "template.update",
        description: "Mengubah template surat.",
      },
      {
        name: "template.delete",
        description: "Menghapus template surat.",
      },

      {
        name: "verification.view",
        description: "Melihat informasi verifikasi surat.",
      },

      {
        name: "verification.create",
        description: "Membuat data verifikasi surat.",
      },
      
      {
        name: "verification.revoke",
        description: "Mencabut verifikasi surat.",
      },

      {
        name: "audit.view",
        description: "Melihat riwayat aktivitas sistem.",
      },

      {
        name: "settings.view",
        description: "Melihat pengaturan sistem.",
      },
      {
        name: "settings.update",
        description: "Mengubah pengaturan sistem.",
      },
    ];

    await queryInterface.bulkInsert(
      "permissions",
      permissions.map((permission) => ({
        ...permission,
        created_at: now,
        updated_at: now,
      }))
    );
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("permissions", null, {});
  },
};