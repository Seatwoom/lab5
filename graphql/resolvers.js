const db = require("../models/db");

const resolvers = {
  Query: {
    items: async () => {
      try {
        return await db.getAllItems();
      } catch (error) {
        throw new Error(`Error fetching items: ${error.message}`);
      }
    },
    item: async (_, { id }) => {
      try {
        return await db.getItemById(id);
      } catch (error) {
        throw new Error(`Error fetching item by id: ${error.message}`);
      }
    },
  },
  Mutation: {
    createItem: async (_, { name, description }) => {
      try {
        return await db.createItem({ name, description });
      } catch (error) {
        throw new Error(`Error creating item: ${error.message}`);
      }
    },
    updateItem: async (_, { id, name, description }) => {
      try {
        const item = await db.updateItem(id, { name, description });
        if (!item) {
          throw new Error(`Item with id ${id} not found`);
        }
        return item;
      } catch (error) {
        throw new Error(`Error updating item: ${error.message}`);
      }
    },
    deleteItem: async (_, { id }) => {
      try {
        const item = await db.deleteItem(id);
        if (!item) {
          throw new Error(`Item with id ${id} not found`);
        }
        return item;
      } catch (error) {
        throw new Error(`Error deleting item: ${error.message}`);
      }
    },
  },
};

module.exports = resolvers;
