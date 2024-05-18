<template>
  <div id="app" class="dark-mode">
    <h3>Account Keeper Viewer</h3>
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
        this.dbkey = this.text
        store.setDBKey(this.dbkey); // Save the dbKey to the store1
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

h3 {
  color: #fff;
}

.container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.big-textfield {
  width: 100%;
  min-height: 150px;
  margin-bottom: 20px;
  padding: 10px;
  border: none;
  border-radius: 5px;
  background-color: #333;
  color: #fff;
}

.button-container {
  display: flex;
  flex-direction: column;
}

.btn {
  padding: 10px 20px;
  margin-bottom: 10px;
  border: none;
  border-radius: 5px;
  background-color: #555;
  color: #fff;
  cursor: pointer;
}

.checkbox-input {
  margin-left: 10px;
}

/* Dark mode styles */
.dark-mode {
  background-color: #121212;
}

/* Responsive design */
@media only screen and (min-width: 768px) {
  .container {
    max-width: 600px;
    margin: 0 auto;
  }
}

@media only screen and (min-width: 1024px) {
  .container {
    max-width: 800px;
  }
}

@media only screen and (min-width: 1200px) {
  .container {
    max-width: 1000px;
  }
}
</style>
