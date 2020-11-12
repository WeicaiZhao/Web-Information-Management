<template>
  <div style="margin: 10px">
    <!-- login -->
    <div v-if="router === 'login'">
      <Login :router.sync="router" />
    </div>

    <!-- register -->
    <div v-if="router === 'register'">
      <Register :router.sync="router" />
    </div>

    <!-- user -->
    <div v-if="router === 'user'">
      <User :router.sync="router" />
    </div>

    <!-- home -->
    <div v-if="router === 'home'">
      <Home :router.sync="router" :activyData.sync="activyData" />
    </div>
    <!-- edit -->
    <div v-if="router === 'edit'">
      <div>
        <label>Title:</label>
        <vxe-input width="200px" v-model="activyData.title" placeholder="input title" />
        <label>status:</label>
        <select class="vxe-select" v-model="activyData.isCopy">
          <option value="0">hide</option>
          <option value="1">share</option>
        </select>
      </div>
      <vxe-toolbar>
        <template v-slot:buttons>
          <vxe-button @click="changeRoute('home')">Return Home</vxe-button>
          <vxe-button icon="fa fa-plus" @click="insertEvent()">New row</vxe-button>
          <vxe-button @click="insertEvent(-1)">Insert last row</vxe-button>
          <vxe-button @click="$refs.xTable.removeCheckboxRow()">Delete checked</vxe-button>
          <vxe-button @click="exportDataEvent">Export CSV</vxe-button>
          <vxe-button @click="importDataEvent">Import CSV</vxe-button>
          <vxe-button @click="drawPie">Draw pie</vxe-button>
          <vxe-button @click="drawLine">Draw Line</vxe-button>
          <vxe-button @click="drawCircle">Draw Circle</vxe-button>
          <vxe-button
            v-if="activyData.id"
            class="vxe-button type--button theme--primary"
            @click="saveEvent"
          >Save</vxe-button>
          <vxe-button
            v-if="!activyData.id"
            class="vxe-button type--button theme--primary"
            @click="addNew"
          >Add</vxe-button>
          <span style="color: red">{{ errMsg }}</span>
        </template>
      </vxe-toolbar>

      <vxe-table
        border
        show-overflow
        keep-source
        export-config
        ref="xTable"
        class="my_table_insert"
        max-height="400"
        :data="JSON.parse(activyData.data || '[]')"
        :edit-config="{trigger: 'click', mode: 'cell', icon: 'fa fa-pencil'}"
      >
        <vxe-table-column type="checkbox" width="60"></vxe-table-column>
        <vxe-table-column type="seq" width="60"></vxe-table-column>
        <vxe-table-column
          field="name"
          title="Name"
          :edit-render="{name: 'input', attrs: {type: 'text'}}"
        ></vxe-table-column>
        <vxe-table-column
          field="role"
          title="Role"
          :edit-render="{name: 'input', attrs: {type: 'text'}}"
        ></vxe-table-column>
        <vxe-table-column
          field="sexs"
          title="Sex"
          :edit-render="{name: 'input', attrs: {type: 'text'}}"
        ></vxe-table-column>
        <vxe-table-column
          field="age"
          title="Age"
          :edit-render="{name: '$input', props: {type: 'number'}}"
        ></vxe-table-column>
        <vxe-table-column field="address" title="Address" :edit-render="{name: 'textarea'}"></vxe-table-column>
      </vxe-table>

      <div v-if="isPie">
        <chart ref="chart1" :options="pieBar" ></chart>
      </div>
      <div v-if="isLine">
        <chart ref="chart2" :options="lineBar" :auto-resize="true"></chart>
      </div>
      <div v-if="isCircle">
        <chart ref="chart3" :options="circleBar" :auto-resize="true"></chart>
      </div>
    </div>
  </div>
</template>
<script>
import Home from "./Home";
import Login from "./Login";
import Register from "./Register";
import User from "./User";
export default {
  props: ["msg"],
  data() {
    return {
      router: "home",
      isModel: false,
      errMsg: "",
      token: localStorage.getItem("token"),
      activyData: {
        title: "s",
        data: null,
        isCopy: 0,
        id: null
      },
      tableData: [],
      isPie: false,
      isLine: false,
      isCircle: false,
      pieBar: {},
      lineBar: {
      },
      circleBar: {
        
      }
    };
  },
  components: {
    Home,
    Login,
    Register,
    User
  },
  mounted() {
    this.init();
  },
  methods: {
    async init() {
      if (this.token) {
        this.tableData = JSON.parse(this.activyData.data);
        console.log(this.tableData);
      } else {
        this.router = "login";
      }
    },
    async insertEvent(row) {
      let record = {
        sex: "1"
      };
      let { row: newRow } = await this.$refs.xTable.insertAt(record, row);
      await this.$refs.xTable.setActiveCell(newRow, "sex");
    },
    getInsertEvent() {
      let insertRecords = this.$refs.xTable.getInsertRecords();
      this.$XModal.alert(insertRecords.length);
    },
    getSelectionEvent() {
      let selectRecords = this.$refs.xTable.getCheckboxRecords();
      this.$XModal.alert(selectRecords.length);
    },
    addNew() {
      const { insertRecords, removeRecords } = this.$refs.xTable.getRecordset();
      if (this.activyData.title && insertRecords) {
        let tableData = this.$refs.xTable.getData();
        if (removeRecords) {
          removeRecords.map(e => {
            for (let i = 0; i < tableData.length; i++) {
              const element = tableData[i];
              if (element._XID === e._XID) {
                console.log("w", tableData[i]);
                tableData.splice(i, 1);
              }
            }
          });
        }
        if (insertRecords) {
          tableData = tableData.concat(insertRecords);
        }
        console.log(this.$refs.xTable.getRecordset());
        console.log(tableData);
        this.activyData.data = JSON.stringify(tableData);
        fetch("http://localhost:3000/excel", {
          method: "POST",
          body: JSON.stringify({
            title: this.activyData.title,
            data: this.activyData.data,
            isCopy: +this.activyData.isCopy
          }),
          headers: {
            "content-type": "application/json",
            token: localStorage.getItem("token")
          }
        })
          .then(res => {
            return res.json();
          })
          .then(res => {
            if (res.status) {
              this.errMsg = "";
              this.isPie = false;
              this.isLine = false;
              this.isCircle = false;
              this.router = "home";
            } else {
              this.errMsg = res.data;
            }
          })
          .catch(err => {
            this.errMsg = err;
          });
      } else {
        this.errMsg = "Add error!please input all";
      }
    },
    saveEvent() {
      const { insertRecords, removeRecords } = this.$refs.xTable.getRecordset();
      let tableData = this.$refs.xTable.getData();
      if (removeRecords) {
        removeRecords.map(e => {
          for (let i = 0; i < tableData.length; i++) {
            const element = tableData[i];
            if (element._XID === e._XID) {
              console.log("w", tableData[i]);
              tableData.splice(i, 1);
            }
          }
        });
      }
      if (insertRecords) {
        tableData = tableData.concat(insertRecords);
      }
      console.log(this.$refs.xTable.getRecordset());
      console.log(tableData);
      this.activyData.data = JSON.stringify(tableData);
      fetch("http://localhost:3000/excel", {
        method: "PUT",
        body: JSON.stringify({
          title: this.activyData.title,
          data: this.activyData.data,
          isCopy: +this.activyData.isCopy,
          id: this.activyData.id,
          userid: this.activyData.userid
        }),
        headers: {
          "content-type": "application/json",
          token: localStorage.getItem("token")
        }
      })
        .then(res => {
          return res.json();
        })
        .then(res => {
          if (res.status) {
            this.errMsg = "";
            this.isPie = false;
            this.isLine = false;
            this.isCircle = false;
            this.router = "home";
          } else {
            this.errMsg = res.data;
          }
        })
        .catch(err => {
          this.errMsg = err;
        });
    },
    exportDataEvent() {
      this.$refs.xTable.openExport({
        // 默认勾选源
        original: true,
        types: ["csv"]
      });
    },
    importDataEvent() {
      this.$refs.xTable.importData({ types: ["csv"] });
    },
    changeRoute(res) {
      console.log(res);
      if (res === "home") {
        this.isPie = false;
        this.isLine = false;
        this.isCircle = false;
      }
      this.router = res || "home";
    },
    closeModel() {
      this.isModel = false;
    },
    async drawPie() {
      this.isPie = false;
      this.isPie = true;
      const data = await this.dealData(this.activyData.data, 'pie')
      this.pieBar = {
        title: {
          text: "Pie Chart",
          x: "center"
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
          orient: "vertical",
          left: "left",
          data: ["child", "juvenile", "young", "middle-aged", "seniors"]
        },
        series: [
          {
            name: "age_group",
            type: "pie",
            radius: "55%",
            center: ["50%", "60%"],
            data,
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)"
              }
            }
          }
        ]
      };
    },
    async drawLine() {
      this.isLine = false
      this.isLine = true
      const data = await this.dealData(this.activyData.data, 'line')
      this.lineBar = {
        title: {
          text: "Line Chart"
        },
        tooltip: {},
        legend: {
          data: ["Age Group"]
        },
        xAxis: {
          data: ["child", "juvenile", "young", "middle-aged", "seniors"]
        },
        yAxis: {},
        series: [
          {
            name: "Age Group",
            type: "bar",
            data
          }
        ]
      }
    },
    async drawCircle() {
      this.isCircle = false
      this.isCircle = true
      const data = await this.dealData(this.activyData.data, 'bar')
      this.circleBar = {
        tooltip: {
          trigger: "axis"
        },
        legend: {
          data: ["man", "feman"]
        },
        calculable: true,
        xAxis: [
          {
            type: "category",
            boundaryGap: false,
            axisTick: {
              show: false
            },
            data: ["child", "juvenile", "young", "middle-aged", "seniors"]
          }
        ],
        yAxis: [
          {
            type: "value",
            axisTick: {
              show: false
            },
            name: "（People）"
          }
        ],
        series: data
      }
    },
    dealData(res, type) {
      const data = JSON.parse(res)
      const childData = data.filter(e => e.age < 12)
      const juvenileData = data.filter(e => e.age < 18 && e.age >= 12)
      const youngData = data.filter(e => e.age < 35 && e.age >= 18)
      const middleData = data.filter(e => e.age < 60 && e.age >= 35)
      const seniorsData = data.filter(e => e.age >= 60)
      if (type === 'pie') return [
        { value: childData.length, name: "child" },
        { value: juvenileData.length, name: "juvenile" },
        { value: youngData.length, name: "young" },
        { value: middleData.length, name: "middle-aged" },
        { value: seniorsData.length, name: "seniors" }
      ]
      if (type === 'line') return [childData.length, juvenileData.length, youngData.length, middleData.length, seniorsData.length]
      if (type === 'bar') {
        return [
          {
            name: "man",
            type: "line",
            stack: "（People）",
            data: [
              childData.filter(e=>e.sexs==='man').length,
              juvenileData.filter(e=>e.sexs==='man').length,
              youngData.filter(e=>e.sexs==='man').length,
              middleData.filter(e=>e.sexs==='man').length,
              seniorsData.filter(e=>e.sexs==='man').length
            ]
          },
          {
            name: "feman",
            type: "line",
            stack: "（People）",
            data: [
              childData.filter(e=>e.sexs==='feman').length,
              juvenileData.filter(e=>e.sexs==='feman').length,
              youngData.filter(e=>e.sexs==='feman').length,
              middleData.filter(e=>e.sexs==='feman').length,
              seniorsData.filter(e=>e.sexs==='feman').length
            ]
          },
        ]
      }
      return 
    }
  }
};
</script>

<style>
@import url("https://cdn.jsdelivr.net/npm/vxe-table/lib/index.css");

.vxe-checkbox--icon {
  display: block !important;
}
.vxe-modal--wrapper {
  display: none;
}

.vxe-modal--box {
  left: 0 !important;
  top: 0 !important;
}
.vxe-toolbar {
  margin: 10px 0;
}
.vxe-table--empty-content {
  display: none !important;
}
.echarts {
  width: 800px;
  height: 600px;
}
</style>