<template>
  <div id="homePage">
    <div>
      <button  type="button" class="vxe-button type--button theme--primary" @click="editExcel({})">Create new table</button>
      <button  type="button" class="vxe-button type--button" @click="loginout()">login out</button>
      <button  type="button" class="vxe-button type--button" @click="$emit('update:router', 'user')">User Info</button>
    </div>
    <div class="excel-item" v-for="(item, key) in dataList" :key="key">
      <h3>{{item.title}}</h3>
      <span>user: {{item.username}}</span>
      <button class="vxe-button type--button" v-if="item.isCopy" @click="copyExcel(item)">Copy</button>
      <button class="vxe-button type--button" v-if="+item.userid === +token.split('-')[0]" @click="editTitle(item)">Edit title</button>
      <button class="vxe-button type--button" v-if="+item.userid === +token.split('-')[0]" @click="editExcel(item)">Edit excel</button>
      <button class="vxe-button type--button" v-if="+item.userid === +token.split('-')[0] || +token.split('-')[2]" @click="deleteExcel(item)">Delete excel</button>
    </div>
    <div class="vxe-modal--wrapper is--mask is--visible is-active" v-show="isModel">
      <div class="vxe-modal--box">
        <div class="vxe-modal--header">Edit</div>
        <div class="vxe-modal--body editTitle">
          <div>title: <input class="vxe-input" v-model="active.title"></div>
          <div>
            status: 
            <select class="vxe-select" v-model="active.isCopy">
              <option value="0">hide</option>
              <option value="1">share</option>
            </select>
          </div>
          <div class="model-footer">
            <button type="button" class="vxe-button type--button"><span class="vxe-button--content" @click="closeModel">cancel</span></button>
            <button type="button" class="vxe-button type--button theme--primary"><span class="vxe-button--content" @click="saveTitle">save</span></button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: ["msg"],
  data() {
    return {
      tableData: [],
      dataList: [{
        id: 1,
        userid: 1212,
        title: 'excel 1',
        data: "ssss",
        isCopy: 1
      },{
        id: 2,
        userid: 1232,
        title: 'excel 2',
        data: "ssss",
        isCopy: 0
      }],
      active: {
        id: 2,
        userid: 1232,
        title: 'excel 2',
        data: "ssss",
        isCopy: 0
      },
      isModel: false,
      token: localStorage.getItem('token')
    };
  },
  created() {
    this.init();
  },
  methods: {
    async init () {
      if (this.token) {
        fetch('http://localhost:3000/excel',{
          method: 'GET',
          headers: {
            'content-type': 'application/json',
            'token': localStorage.getItem('token')
          },
        }).then(res => {
          if (res.status === 401) {
            this.$emit("update:router", 'login');
          } else {
            return res.json()
          }
        }).then(res => {
          if (res.status) {
            console.log(res)
            this.dataList = res.data
          } else {
            // this.isModel = true
            this.errMsg = res.data
          }
        }).catch(err => {
          // this.isModel = true
          this.errMsg = err
        })
      } else {
        this.$emit("update:router", 'login');
      }
    },
    async findSexList() {
      // this.sexList = await XEAjax.get("/api/conf/sex/list");
      var list = []
      fetch('http://localhost:3000/excel',{
          method: 'GET',
          headers: {
            'content-type': 'application/json',
            'token': localStorage.getItem('token')
          },
        }).then(res => {
          if (res.status === 401) {
            this.$emit("update:router", 'login');
          } else {
            return res.json()
          }
        }).then(res => {
          if (res.status) {
            console.log(res)
            this.$emit("update:router", 'home');
          } else {
            // this.isModel = true
            this.errMsg = res.data
          }
        }).catch(err => {
          // this.isModel = true
          this.errMsg = err
        })
      this.tableData = list
    },
    async editTitle(data) {
      this.isModel = true
      this.active = JSON.parse(JSON.stringify(data))
      
    },
    async saveTitle() {
      const data = {
        id: this.active.id,
        userid: this.active.userid,
        title: this.active.title,
        data: this.active.data,
        isCopy: +this.active.isCopy
      }
      console.log(data)
      fetch('http://localhost:3000/excel',{
        method: 'PUT',
        body: JSON.stringify(data),
        headers: {
          'content-type': 'application/json',
          'token': localStorage.getItem('token')
        },
      }).then(res => {
        console.log(res)
          if (res.status === 401) {
            this.$emit("update:router", 'login');
          } else {
            return res.json()
          }
      }).then(res => {
        if (res.status) {
          console.log(res)
          this.isModel = false
          this.init()
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
    editExcel(item) {
      this.$emit("update:router", 'edit');
      this.$emit('update:activyData', item)
      localStorage.setItem('editData', item)
    },
    loginout() {
      localStorage.removeItem('token')
      this.$emit("update:router", 'login')
    },
    copyExcel(item) {
      fetch('http://localhost:3000/excel',{
        method: 'POST',
        body: JSON.stringify({
          title: item.title,
          data: item.data,
          isCopy: +item.isCopy
        }),
        headers: {
          'content-type': 'application/json',
          'token': localStorage.getItem('token')
        },
      }).then(res => {
          return res.json()
      }).then(res => {
        if (res.status) {
          this.init()
        } else {
          this.errMsg = res.data
        }
      }).catch(err => {
        this.errMsg = err
      })
    },
    deleteExcel(item) {
      fetch(`http://localhost:3000/excel/${item.id}`,{
        method: 'DELETE',
        headers: {
          'content-type': 'application/json',
          'token': localStorage.getItem('token')
        },
      }).then(res => {
          return res.json()
      }).then(res => {
        if (res.status) {
          this.errMsg = ''
          this.init()
        } else {
          this.errMsg = res.data
        }
      }).catch(err => {
        this.errMsg = err
      })
    }
  }
};
</script>

<style scoped>
#homePage {
  margin: 1vw;
  display: flex;
  flex-direction: column;
}
.excel-item {
  display: flex;
  align-items: center;
}
.excel-item span {
  margin-left: 10px;
}
.excel-item button {
  margin-left: 10px;
}
.editTitle {
  display: flex;
  flex-direction: column;
}
.model-footer {
  padding-top: 20px;
  padding-bottom: 20px;
}
.is-active {
  display: block;
  z-index: 100;
  text-align: center;
}
.vxe-modal--box {
  margin-left: calc(50vw - 210px);
  margin-top: calc(50vh - 180px);
}
.editTitle div {
  margin: 10px;
}
</style>