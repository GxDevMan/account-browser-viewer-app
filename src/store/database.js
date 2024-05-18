import { defineStore } from 'pinia';

export const databaseStore = defineStore('database', {
  state: () => ({
    dbBuffer: null,
    dbKey: null
  }),
  actions: {
    setDBBuffer(buffer) {
      this.dbBuffer = buffer;
    },
    setDBKey(key) {
      this.dbKey = key;
    }
  }
});

