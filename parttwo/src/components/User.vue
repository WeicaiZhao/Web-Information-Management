<template>
  <div id="userPage">
    <div class="user-Box">
      <div class="">Change Your User Info</div>
      <div><span>username: </span><span>{{token.split('-')[1]}}</span></div>
      <div><span>password: </span><input type="password" v-model="password" class="vxe-input"></div>
      <div>
        <button type="button" class="vxe-button type--button theme--primary" @click="changeInfo()"><span class="vxe-button--content">change</span></button>
        <button type="button" class="vxe-button type--button" @click="$emit('update:router', 'home')"><span class="vxe-button--content">Return home</span></button>
        <div style="color: red">{{errMsg}}</div>
      </div>
    </div>
    <div class="user-list">
      <div>Other User List</div>
      <div v-if="isModel" >
        <div>Edit</div>
        <div>
          <div>Userid: <input class="vxe-input" type="number" v-model="userInfo.id"></div>
          <div>
            Role: 
            <select class="vxe-select" v-model="userInfo.role">
              <option value="0">Normal</option>
              <option value="1">Admin</option>
            </select>
          </div>
          <div>Username: <input class="vxe-input" v-model="userInfo.username"></div>
          <div>Password: <input class="vxe-input" type="password" v-model="userInfo.password"></div>
          <div class="model-footer">
            <button type="button" class="vxe-button type--button"><span class="vxe-button--content" @click="closeModel()">cancel</span></button>
            <button type="button" class="vxe-button type--button theme--primary"><span class="vxe-button--content" @click="saveChange">save</span></button>
          </div>
        </div>
      </div>
      <div v-for="(item, key) in userdata" :key="key">
        <span>Userid: {{item.id}}</span><span>Username: {{item.username}}</span><span>Role: {{+item.role === 1? 'Admin': 'Normal'}}</span>
        <button type="button" class="vxe-button type--button" @click="editUser(item)" v-if="+token.split('-')[0] !== +item.id"><span class="vxe-button--content">Edit</span></button>
        <button type="button" class="vxe-button type--button" @click="deleteUser(item)" v-if="+token.split('-')[0] !== +item.id"><span class="vxe-button--content">Delete</span></button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      password: '',
      isModel: false,
      userdata: [],
      token: localStorage.getItem('token'),
      errMsg: '',
      userInfo: {
        id: null,
        username: null,
        password: null,
        role: 0
      }
    };
  },
  mounted () {
    this.getUser()
  },
  methods: {
    async getUser() {
      fetch('http://localhost:3000/user',{
        method: 'GET',
        headers: {
          'content-type': 'application/json',
          'token': localStorage.getItem('token')
        },
      }).then(res => {
          return res.json()
      }).then(res => {
        if (res.status) {
          this.userdata = res.data
        } else {
          this.isModel = true
          this.errMsg = res.data
        }
      }).catch(err => {
        this.isModel = true
        this.errMsg = err
        })
    },
    closeModel() {
      this.isModel = false
    },
    editExcel() {
      this.isModel = false
      this.$emit("update:router", 'home');
    },
    changeInfo() {
      if (this.password) {
        fetch('http://localhost:3000/user',{
          method: 'PATCH',
          body: JSON.stringify({
            password: this.password
          }),
          headers: {
            'content-type': 'application/json',
            'token': localStorage.getItem('token')
          },
        }).then(res => {
            return res.json()
        }).then(res => {
          if (res.status) {
            localStorage.removeItem('token')
            this.$emit("update:router", 'login');
          } else {
            this.isModel = true
            this.errMsg = res.data
          }
        }).catch(err => {
          this.isModel = true
          this.errMsg = err
        })
      } else {
        this.errMsg = 'please check account and password'
      }
    },
    deleteUser(item) {
      fetch(`http://localhost:3000/user/${item.id}`,{
          method: 'DELETE',
          headers: {
            'content-type': 'application/json',
            'token': localStorage.getItem('token')
          },
        }).then(res => {
            return res.json()
        }).then(res => {
          if (res.status) {
            this.getUser()
          } else {
            this.isModel = true
            this.errMsg = res.data
          }
        }).catch(err => {
          this.isModel = true
          this.errMsg = err
        })
    },
    editUser(item) {
      this.isModel = true
      this.userInfo = JSON.parse(JSON.stringify(item))
      console.log(item)
    },
    saveChange() {
      fetch(`http://localhost:3000/user/${this.userInfo.id}`,{
        method: 'PUT',
        body: JSON.stringify({
          password: this.userInfo.password,
          username: this.userInfo.username,
          role: +this.userInfo.role
        }),
        headers: {
          'content-type': 'application/json',
          'token': localStorage.getItem('token')
        },
      }).then(res => {
          return res.json()
      }).then(res => {
        if (res.status) {
          this.isModel = false
          this.getUser()
        } else {
          this.isModel = true
          this.errMsg = res.data
        }
      }).catch(err => {
        this.isModel = true
        this.errMsg = err
      })
    }
  }
};
</script>

<style scoped>
#userPage {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
.user-list {
  margin: 20px;
}
.user-list div {
  margin: 10px;
}
.user-list div span {
  margin: 10px;
}
</style>