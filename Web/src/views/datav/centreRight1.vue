<template>
  <div id="centreRight1">
    <div class="bg-color-black">
      <div class="d-flex pt-2 pl-2">
        <span style="color:#5cd9e8">
          <icon name="chart-line"></icon>
        </span>
        <div class="d-flex">
          <span class="fs-xl text mx-2">Address Entity Results</span>
        </div>
      </div>
      <div class="d-flex jc-center body-box">
        <dv-scroll-board :config="config" style="width:400px;height:360px" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      config: {
        header: ["Addr", "Data", "Result"],
        data: [
          ["40001", "1", "<span  class='colorGrass'>Slave</span>"],
          ["40002", "9600", "<span  class='colorGrass'>Baud Rate</span>"],
          ["40003", "CM", "<span  class='colorGrass'>Unit</span>"],
          ["40004", "136", "<span  class='colorGrass'>Value</span>"],
          ["40005", "1000", "<span  class='colorGrass'>Max Value</span>"],
          ["40006", "-100", "<span  class='colorGrass'>Min Value</span>"],
          ["40007", "0", "<span  class='colorRed'>null</span>"],
          ["40008", "0", "<span  class='colorRed'>null</span>"],
          ["40009", "0", "<span  class='colorRed'>null</span>"],
          ["40010", "0", "<span  class='colorRed'>null</span>"]
        ],
        rowNum: 7, //表格行数
        headerHeight: 35,
        headerBGC: "#0f1325", //表头
        oddRowBGC: "#0f1325", //奇数行
        evenRowBGC: "#171c33", //偶数行
        index: true,
        columnWidth: [50],
        align: ["center"]
      }
    };
  },
  components: {},
  mounted() {},
  beforeDestroy() {
    this.clear();
  },
  methods: {}
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
</style>
