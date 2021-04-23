<template>
  <div>
    <div id="centreLeft1Chart" style="width:260px; height: 220px;"></div>
  </div>
</template>

<script>
const echarts = require("echarts");
export default {
  data() {
    return {
      myChartPieLeft: {}
    };
  },
  mounted() {
    this.drawPie();
  },
  beforeDestroy() {
    this.myChartPieLeft.clear()
  },
  methods: {
    drawPie(sidebar) {
      // 基于准备好的dom，初始化echarts实例
      this.myChartPieLeft = echarts.init(
        document.getElementById("centreLeft1Chart")
      );
      //  ----------------------------------------------------------------

      this.myChartPieLeft.setOption({
        color: [
          "#37a2da",
          "#32c5e9",
          "#9fe6b8",
          "#ffdb5c",
          "#ff9f7f",
          "#fb7293",
          "#e7bcf3",
          "#8378ea"
        ],
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        toolbox: {
          show: true
        },
        calculable: true,
        legend: {
          orient: "horizontal",
          icon: "circle",
          bottom: 0,
          x: "center",
          data: ["40001", "40002", "40003", "40004", "40005", "40006"],
          textStyle: {
            color: "#fff"
          }
        },
        series: [
          {
            name: "Device Information",
            type: "pie",
            radius: [10, 60],
            center: ["50%", "50%"],
            selectedMode: 'single',
            minAngle: 50,
            data: [
              { value: 1, name: "40001" },
              { value: 5, name: "40002" },
              { value: 2, name: "40003" },
              { value: 136, name: "40004" },
              { value: 1000, name: "40005" },
              { value: -100, name: "40006" }
            ]
          }
        ]
      });
      // -----------------------------------------------------------------
      // 响应式变化
      window.addEventListener("resize", () => this.myChartPieLeft.resize(), false);
      // 侧边栏变化
      if (sidebar) {
        this.myChartPieLeft.resize();
      }
    }
  },
  destroyed() {
    window.onresize = null;
  }
};
</script>

<style lang="scss" scoped>
</style>
