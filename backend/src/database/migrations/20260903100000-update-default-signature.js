"use strict";

module.exports = {
  async up(queryInterface) {
    await queryInterface.sequelize.query(`
      UPDATE signature_settings
      SET
        signer_name = 'Dr. Arbain, Sp.Pd., M.Pd.',
        signer_position = 'Ketua RJI'
      WHERE
        signer_name = 'Ketua RJI'
        AND signer_position = 'Ketua RJI'
    `);
  },

  async down(queryInterface) {
    await queryInterface.sequelize.query(`
      UPDATE signature_settings
      SET
        signer_name = 'Ketua RJI',
        signer_position = 'Ketua RJI'
      WHERE
        signer_name = 'Dr. Arbain, Sp.Pd., M.Pd.'
        AND signer_position = 'Ketua RJI'
    `);
  },
};