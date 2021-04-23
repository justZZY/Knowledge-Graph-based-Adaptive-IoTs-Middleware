<template>
  <div id="centreRight1">
    <div class="bg-color-black">
      <div class="d-flex pt-2 pl-2">
        <span style="color:#5cd9e8">
          <icon name="chart-bar"></icon>
        </span>
        <div class="d-flex">
          <span class="fs-xl text mx-2">Address Data Scanning</span>
        </div>
      </div>
      <div class="d-flex jc-center body-box">
        <dv-scroll-board :config="config" style="width:270px;height:360px" />
      </div>
    </div>
  </div>
</template>

<script>
import elTableInfiniteScroll from 'el-table-infinite-scroll';
let cnt = 0;
export default {
  data() {
    return {
      config: {
        header: ["Addr", "Data", "State"],
        data: [
          ["40001", "1", "<i class=\"el-icon-loading\"></i>"],
          ["40002", "9600", "<i class=\"el-icon-loading\"></i>"],
          ["40003", "2", "<i class=\"el-icon-loading\"></i>"],
          ["40004", "136", "<i class=\"el-icon-loading\"></i>"],
          ["40005", "1000", "<i class=\"el-icon-loading\"></i>"],
          ["40006", "-100", "<i class=\"el-icon-loading\"></i>"],
          ["40007", "0", "<i class=\"el-icon-loading\"></i>"],
          ["40008", "0", "<i class=\"el-icon-loading\"></i>"],
          ["40009", "0", "<i class=\"el-icon-loading\"></i>"],
          ["40010", "0", "<i class=\"el-icon-loading\"></i>"]
        ],
        rowNum: 7, //表格行数
        headerHeight: 35,
        headerBGC: "#0f1325", //表头
        oddRowBGC: "#0f1325", //奇数行
        evenRowBGC: "#171c33", //偶数行
        columnWidth: [80],
        align: ["center"]
      }
    };
  },
  directives: {
    'el-table-infinite-scroll': elTableInfiniteScroll
  },
  components: {},
  mounted() {
    this.load()
  },
  beforeDestroy() {
    this.clear();
  },
  methods: {
    load() {
      setInterval(() => {
        let myConfig = {
          header: ["Addr", "Data", "State"],
              data: [
            ["40001", "1", "<i class=\"el-icon-loading\"></i>"],
            ["40002", "9600", "<i class=\"el-icon-loading\"></i>"],
            ["40003", "2", "<i class=\"el-icon-loading\"></i>"],
            ["40004", "136", "<i class=\"el-icon-loading\"></i>"],
            ["40005", "1000", "<i class=\"el-icon-loading\"></i>"],
            ["40006", "-100", "<i class=\"el-icon-loading\"></i>"],
            ["40007", "0", "<i class=\"el-icon-loading\"></i>"],
            ["40008", "0", "<i class=\"el-icon-loading\"></i>"],
            ["40009", "0", "<i class=\"el-icon-loading\"></i>"],
            ["40010", "0", "<i class=\"el-icon-loading\"></i>"]
          ],
              rowNum: 7, //表格行数
              headerHeight: 35,
              headerBGC: "#0f1325", //表头
              oddRowBGC: "#0f1325", //奇数行
              evenRowBGC: "#171c33", //偶数行
              columnWidth: [80],
              align: ["center"]
        }
        if (cnt < 10) {
          this.config.data[cnt][2] = "<i class=\"el-icon-circle-check\"></i>"
          cnt += 1

        } else {
          for (let i = 0; i < this.config.data.length; i++) {
            this.config.data[i][2] = "<i class=\"el-icon-loading\"></i>"
          }
          cnt = 0
        }
        myConfig.data = this.config.data
        this.config = myConfig
      }, 3000);
    }
  }
};
</script>

<style lang="scss">
#centreRight1 {
  padding: 1rem;
  height: 410px;
  min-width: 300px;
  border-radius: 5px;
  .bg-color-black {
    height: 385px;
    border-radius: 10px;
  }
  .text {
    color: #c3cbde;
  }
  .body-box {
    border-radius: 10px;
    overflow: hidden;
  }
}

.el-table,
.el-table__expanded-cell {
  background-color: transparent !important;
}
/* 表格内背景颜色 */
.el-table th,
.el-table tr,
.el-table td {
    background-color: transparent !important;
}
.el-table thead {
  color: #ffffff;
  font-weight: 500;
}
.el-table .cell {
  color: #ffffff;
}
.el-table::before {
  left: 0;
  bottom: 0;
  width: 100%;
  height: 0;
}
</style>
