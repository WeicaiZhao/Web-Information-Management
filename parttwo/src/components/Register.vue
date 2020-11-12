<template>
  <div id="registerPage">
    <div class="register-Box">
      <div class="">Please Register</div>
      <div><span>username:</span><input v-model="username" class="vxe-input"></div>
      <div><span>password:</span><input type="password" v-model="password" class="vxe-input"></div>
      <div><span>role:</span>
        <select v-model="role"  class="vxe-select">
          <option value=1>admin</option>
          <option value=0>normal</option>
        </select></div>
      <div class="register-button">
        <button type="button" class="vxe-button type--button theme--primary" @click="register()"><span class="vxe-button--content">Register</span></button>
        <button type="button" class="vxe-button type--button" @click="$emit('update:router', 'login')"><span class="vxe-button--content">login</span></button>
      </div>
    </div>

    <div class="vxe-modal--wrapper is--mask is--visible is-active" v-show="isModel">
      <div class="vxe-modal--box">
        <div class="vxe-modal--header">register alert</div>
        <div class="vxe-modal--body editTitle">
          {{errMsg}}
        </div>
        <div class="model-footer">
          <button type="button" class="vxe-button type--button"><span class="vxe-button--content" @click="closeModel">close</span></button>
          <button v-if="registerSuccess" type="button" class="vxe-button type--button theme--primary"><span class="vxe-button--content" @click="$emit('update:router', 'login')">go to login</span></button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      username: '',
      password: '',
      role: 0,
      isModel: false,
      errMsg: 'register error!',
      registerSuccess: 0
    };
  },
  created() {
  },
  methods: {
    async register() {
      if (this.username && this.password) {
        fetch('http://localhost:3000/user/add',{
          method: 'POST',
          body: JSON.stringify({
            username: this.username,
            password: this.password,
            role: this.role
          }),
          headers: {
            'content-type': 'application/json'
          },
        }).then(res => {
            return res.json()
        }).then(res => {
          if (res.status) {
            this.isModel = true
            this.registerSuccess = 1
            this.errMsg = res.data
          } else {
            this.isModel = true
            this.errMsg = res.data
          }
        }).catch(err => {
          this.isModel = true
          this.errMsg = err
        })
      } else {
        this.isModel = true
        this.errMsg = 'please input username nad password'
      }
    },
    closeModel() {
      this.isModel = false
    },
    editExcel() {
      this.$emit('update:router', 'home')
    }
  }
};
</script>

<style scoped>
#registerPage {
  display: flex;
  justify-content: center;
  align-items: center;
}
.register-Box {
  margin-top: 100px;
}
.register-Box div {
  margin: 10px;
}
.register-button {
  margin-top: 20px;
}
.vxe-modal--wrapper {
  display: block;
  top: 100px;
  left: calc(50vw - 100px);
}
.model-footer {
  margin: 10px;
}
</style>