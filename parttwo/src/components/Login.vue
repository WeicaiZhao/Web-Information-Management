<template>
  <div id="loginPage">
    <div class="login-Box">
      <div class="">Please Login</div>
      <div><span>username:</span><input v-model="username" class="vxe-input"></div>
      <div><span>password:</span><input type="password" v-model="password" class="vxe-input"></div>
      <div>
        <button type="button" class="vxe-button type--button theme--primary" @click="login()"><span class="vxe-button--content">Login</span></button>
        <button type="button" class="vxe-button type--button" @click="$emit('update:router', 'register')"><span class="vxe-button--content">Register</span></button>
      </div>
    </div>

    <div class="vxe-modal--wrapper is--mask is--visible is-active" v-show="isModel">
      <div class="vxe-modal--box">
        <div class="vxe-modal--header">login error</div>
        <div class="vxe-modal--body editTitle">
          {{errMsg}}
        </div>
        <div class="model-footer">
          <button type="button" class="vxe-button type--button"><span class="vxe-button--content" @click="closeModel">close</span></button>
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
      isModel: false,
      errMsg: 'login error!please check account id and password'
    };
  },
  created() {
  },
  methods: {
    async login() {
      if (this.username && this.password) {
        fetch('http://localhost:3000/user/login',{
          method: 'POST',
          body: JSON.stringify({
            username: this.username,
            password: this.password
          }),
          headers: {
            'content-type': 'application/json'
          },
        }).then(res => {
            return res.json()
        }).then(res => {
          if (res.status) {
            localStorage.setItem('token', res.data)
            this.$emit("update:router", 'home');
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
      }
    },
    closeModel() {
      this.isModel = false
    },
    editExcel() {
      this.isModel = false
      this.$emit("update:router", 'home');
    }
  }
};
</script>

<style scoped>
#loginPage {
  display: flex;
  justify-content: center;
  align-items: center;
}
.login-Box {
  margin-top: 100px;
}
.login-Box div {
  margin: 10px;
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