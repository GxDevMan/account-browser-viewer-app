<template>
  <div id="app" class="dark-mode">
    <!-- <h3>Account Keeper Viewer</h3> -->
    <div class="container">
      <textarea :value="text" class="big-textfield" placeholder="Enter your AES Key here..."></textarea>
      <div class="button-container">
        <input type="file" id="fileInput" ref="fileInput" accept=".key" @change="loadKeyFile" style="display: none;">
        <button @click="triggerFileInput" class="btn">Load Key File</button>
        <input type="file" id="fileInputDB" ref="fileInputDB" @change="handleFileChange" accept=".db" style="display: none;">
        <button class="btn" @click="triggerDBFileInput">
          Load Database
          <input type="checkbox" v-model="databaseFound" class="checkbox-input" :disabled="checkboxDisabled">
        </button>
        <button class="btn" @click="gotoNextPage">Proceed</button>
      </div>
    </div>
  </div>
</template>

<script>
import EncryptDecryptHandler from '../services/decryptService.js';
import { databaseStore } from '@/store/database'

export default {
  name: 'mainPage',
  data() {
    return {
      text: '',
      dbBuffer: null,
      dbkey: null,
      databaseFound: false,
      checkboxDisabled: true
    };
  },
  methods: {
    triggerFileInput() {
      this.$refs.fileInput.click();
    },
    triggerDBFileInput() {
      this.$refs.fileInputDB.click();
    },
    async loadKeyFile(event) {
      const store = databaseStore()
      const file = event.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = async (e) => {
        const arrayBuffer = e.target.result;

        const uint8Array = new Uint8Array(arrayBuffer);
        const base64String = btoa(String.fromCharCode(...uint8Array));
        this.text = base64String;
        const handlerKey = new EncryptDecryptHandler();
        this.dbkey = handlerKey.convertStringToCryptoKey(base64String);
        store.setDBKey(this.dbkey); // Save the dbKey to the store
      };
      reader.readAsArrayBuffer(file);
    },
    handleFileChange(event) {
      const store = databaseStore()
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const arrayBuffer = event.target.result;
          this.databaseFound = true;
          this.dbBuffer = arrayBuffer;
          store.setDBBuffer(this.dbBuffer); // Save the dbBuffer to the store
        };
        reader.readAsArrayBuffer(file);
      }
      this.databaseFound = !!file;
    },
    gotoNextPage() {
      if (this.databaseFound && (this.text !== null || this.text !== '')) {
        this.$router.push({
          name: "accountsView"
        });
      } else {
        window.alert('Missing conditions');
      }
    }
  }
};
</script>

<style scoped>
.dark-mode {
  background-color: #121212;
  color: #ffffff;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: 'Arial', sans-serif;
}

.container {
  text-align: center;
}

.big-textfield {
  width: 100%;
  max-width: 600px;
  height: 150px;
  background-color: #1e1e1e;
  color: #ffffff;
  border: 1px solid #444;
  border-radius: 5px;
  padding: 10px;
  margin-bottom: 20px;
  font-size: 16px;
}

.button-container {
  display: flex;
  justify-content: center;
  gap: 15px;
}

.btn {
  background-color: #333;
  color: #ffffff;
  border: 1px solid #555;
  border-radius: 5px;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn:hover {
  background-color: #555;
}
</style>
