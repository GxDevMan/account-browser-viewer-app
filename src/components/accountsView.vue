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
.dark-mode {
  background-color: #121212;
  color: #fff;
}

/* Container styles */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

/* Search container styles */
.search-container {
  margin-bottom: 20px;
}

.search-input {
  width: 100%;
  padding: 10px;
  border: none;
  border-radius: 5px;
  background-color: #333;
  color: #fff;
}

/* Button container styles */
.button-container {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
}

/* Button styles */
.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  background-color: #555;
  color: #fff;
  cursor: pointer;
}

/* Table container styles */
.table-container {
  overflow-x: auto;
}

/* Data table styles */
.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table th,
.data-table td {
  padding: 10px;
  border: 1px solid #555;
}

/* Media queries for responsiveness */
@media only screen and (max-width: 768px) {
  .container {
    padding: 10px;
  }
  
  .btn {
    font-size: 14px;
  }
}

@media only screen and (max-width: 480px) {
  .search-input {
    font-size: 14px;
  }
  
  .btn {
    padding: 8px 16px;
    font-size: 12px;
  }
}
  </style>
  