'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('saved_books', 'coverUrl', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn('saved_books', 'description', {
      type: Sequelize.TEXT,
      allowNull: true,
    });
  },

  async down (queryInterface) {
    await queryInterface.removeColumn('saved_books', 'coverUrl');
    await queryInterface.removeColumn('saved_books', 'description');
  }
};
