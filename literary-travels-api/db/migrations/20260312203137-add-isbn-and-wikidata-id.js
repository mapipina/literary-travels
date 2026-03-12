'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('saved_books', 'isbn', {
      type: Sequelize.STRING,
      allowNull: true, // Nullable because Wikidata won't always have this field
    });
    
    await queryInterface.addColumn('saved_books', 'wikidataId', {
      type: Sequelize.STRING,
      allowNull: true,
      unique: true
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('saved_books', 'isbn');
    await queryInterface.removeColumn('saved_books', 'wikidataId');
  }
};
