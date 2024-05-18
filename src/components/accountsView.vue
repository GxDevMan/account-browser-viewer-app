<template>
  <div class="dark-mode">
    <div class="container">
      <div class="search-container">
        <input v-model="searchTerm" type="text" class="search-input" placeholder="Search...">
        <div class="button-container">
          <button @click="goBacktoPage" class="btn">Go Back</button>
          <button @click="clearSearch" class="btn">Clear Search</button>
        </div>
      </div>
      <div class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>User Platform</th>
              <th>User Name</th>
              <th>User Email</th>
              <th>User Password</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(user, index) in filteredUsers" :key="index">
              <td>{{ user.userPlatform }}</td>
              <td>
                <button class="btn" @click="copyText(decryptText(user.userName))">Copy</button>
                {{ decryptText(user.userName) }}
              </td>
              <td>
                <button class="btn" @click="copyText(decryptText(user.userEmail))">Copy</button>
                {{ decryptText(user.userEmail) }}
              </td>
              <td>
                <button class="btn" @click="copyText(decryptText(user.userPassword))">Copy</button>
                {{ decryptText(user.userPassword) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import selectAccounts from '../services/sqlLiteService.js';
import AESCrypto from '../services/decryptService.js';
import { databaseStore } from '@/store/database';

export default {
  name: 'accountsView',
  data() {
    return {
      searchTerm: '',
      users: [],
    };
  },
  created() {
    const store = databaseStore();
    const { dbBuffer } = store;
    try {
      selectAccounts(dbBuffer).then(data => {
       this.users = data
      }).catch(err => {
        console.error(err)
      })
    } catch (error) {
      console.error("Error selecting accounts:", error);
      this.users = null;
    }
  },
  computed: {
    filteredUsers() {
      if (!this.searchTerm) return this.users;
      const searchTermLowerCase = this.searchTerm.toLowerCase();
      return this.users.filter(user =>
        user.userPlatform.toLowerCase().includes(searchTermLowerCase)
      );
    }
  },
  methods: {
    clearSearch() {
      this.searchTerm = '';
    },
    copyText(text) {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    },
    decryptText(text){
      try{
      const store = databaseStore();
      const { dbKey } = store;
      const handleDecrypt = new AESCrypto(dbKey);
      let decryptedText =  handleDecrypt.decrypt(text)
      if (decryptedText === ''){
        return "____"
      }
      return decryptedText
      } catch(error){
        return "ERROR DECRYPT"
      }
    },
    goBacktoPage(){
      const store = databaseStore();
      store.clearData();
      this.$router.push({
        name: "mainPage"
      })
    }
  }
};
</script>

  <style scoped>
.table-container {
  max-height: 400px; /* Adjust height as needed */
  overflow-y: auto;
}

.data-table th {
  position: sticky;
  top: 0;
  background-color: #333;
  color: #ffffff;
}

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
    width: 80%;
    margin: auto;
  }
  
  .search-container {
    margin-bottom: 20px;
  }
  
  .search-input {
    width: 200px;
    padding: 5px;
    border: 1px solid #666;
    border-radius: 5px;
    margin-right: 10px;
  }
  
  .button-container {
    display: flex;
  }
  
  .button-container .btn {
    margin-right: 10px;
  }
  
  .data-table {
    width: 100%;
    border-collapse: collapse;
  }
  
  .data-table th,
  .data-table td {
    border: 1px solid #444;
    padding: 8px;
  }
  
  .data-table th {
    background-color: #333;
    color: #ffffff;
  }
  
  .btn {
    background-color: #333;
    color: #ffffff;
    border: 1px solid #555;
    border-radius: 5px;
    padding: 8px 16px;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }
  
  .btn:hover {
    background-color: #555;
  }
  </style>
  