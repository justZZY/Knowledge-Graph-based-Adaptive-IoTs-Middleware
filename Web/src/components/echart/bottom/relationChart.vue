<template>
  <div>
    <div ref="realtimeCurve" id="relationChart" style="width:100%;height:370px;"></div>
  </div>
</template>

<script>
  const echarts = require("echarts");
  export default {
    name: "relationChart",
    data() {
      return {
        myRelationChart: {}
      };
    },
    mounted() {
      this.drawPie();
    },
    beforeDestroy() {
      this.myRelationChart.clear()
    },
    methods: {
      drawPie() {
        // 基于准备好的dom，初始化echarts实例
        this.myRelationChart = echarts.init(
            document.getElementById("relationChart")
        );
        this.myRelationChart.showLoading();
        let option = getOption();
        this.myRelationChart.hideLoading();
        this.myRelationChart.setOption(option);
        this.myRelationChart.resize();
      }
    }
  }
  function getOption() {
    let option = {
      tooltip: {}, //提示框
      animationDurationUpdate: 1500,
      animationEasingUpdate: "quinticInOut",
      series: [
        {
          type: "graph",
          layout: "force",
          // symbolSize: 50, //倘若该属性不在link里，则其表示节点的大小；否则即为线两端标记的大小
          symbolSize: (value, params) => {
            switch (params.data.category) {
              case 0:
                return 100;
              case 1:
                return 80;
              case 2:
                return 60;
              case 3:
                return 40;
              case 4:
                return 30;
              case 5:
                return 20;
              case 6:
                return 20;
              case 7:
                return 10;
            }
          },
          roam: true, //鼠标缩放功能
          label: {
            show: true, //是否显示标签
          },
          focusNodeAdjacency: true, //鼠标移到节点上时突出显示结点以及邻节点和边
          edgeSymbol: ["none", "arrow"], //关系两边的展现形式，也即图中线两端的展现形式。arrow为箭头
          edgeSymbolSize: [4, 10],
          draggable: true,
          edgeLabel: {
            fontSize: 20, //关系（也即线）上的标签字体大小
          },
          force: {
            repulsion: 200,
            edgeLength: 120,
          },
          data: [
            {
              name: "Thing",
              category: 0,
            },
            {
              name: "Device",
              category: 1,
            },
            {
              name: "Variable",
              category: 1,
            },
            {
              name: "Functionality",
              category: 1,
            },
            {
              name: "Metadata",
              category: 1,
            },
            {
              name: "Manufacturer",
              category: 1,
            },
            {
              name: "Input",
              category: 2,
            },
            {
              name: "Output",
              category: 2,
            },
            {
              name: "IoT Middleware",
              category: 3,
            },
            {
              name: "IoT Gateway",
              category: 3,
            },
            {
              name: "PLC",
              category: 3,
            },
            {
              name: "Methane Sensor",
              category: 4
            },
            {
              name: "40000",
              category: 5
            },
            {
              name: "40001",
              category: 5
            },
            {
              name: "40002",
              category: 5
            },
            {
              name: "40003",
              category: 5
            },
            {
              name: "40004",
              category: 5
            },
            {
              name: "40005",
              category: 5
            },
            {
              name: "Temperature",
              category: 6
            },
            {
              name: "Humidity",
              category: 6
            },
            {
              name: "Methane",
              category: 6
            },
            {
              name: "Precision",
              category: 6
            },
            {
              name: "Slave",
              category: 6
            },
            {
              name: "Baud Rate",
              category: 6
            },
            {
              name: "189",
              category: 7
            },
            {
              name: "208",
              category: 7
            },
            {
              name: "5",
              category: 7
            },
            {
              name: "1",
              category: 7
            },
            {
              name: "3",
              category: 7
            },
            {
              name: "4800",
              category: 7
            }
          ],
          // links: [],
          links: [
            {
              source: "Thing",
              target: "Device",
            },
            {
              source: "Thing",
              target: "Manufacturer",
            },
            {
              source: "Thing",
              target: "Variable",
            },
            {
              source: "Device",
              target: "IoT Middleware",
            },
            {
              source: "Device",
              target: "Manufacturer",
            },
            {
              source: "Device",
              target: "Valuable",
            },
            {
              source: "Variable",
              target: "Input",
            },
            {
              source: "Variable",
              target: "Output",
            },
            {
              source: "Variable",
              target: "Metadata",
            },
            {
              source: "IoT Middleware",
              target: "IoT Gateway",
            },
            {
              source: "IoT Middleware",
              target: "PLC",
            },
            {
              source: "IoT Middleware",
              target: "Functionality",
            },
            {
              source: "IoT Gateway",
              target: "Functionality",
            },
            {
              source: "PLC",
              target: "Functionality",
            },
            {
              source: "PLC",
              target: "Methane Sensor",
            },
            {
              source: "Methane Sensor",
              target: "40000",
            },
            {
              source: "Methane Sensor",
              target: "40001",
            },
            {
              source: "Methane Sensor",
              target: "40002",
            },
            {
              source: "Methane Sensor",
              target: "40003",
            },
            {
              source: "Methane Sensor",
              target: "40004",
            },
            {
              source: "Methane Sensor",
              target: "40005",
            },
            {
              source: "40000",
              target: "Temperature",
            },
            {
              source: "40001",
              target: "Humidity",
            },
            {
              source: "40002",
              target: "Methane",
            },
            {
              source: "40003",
              target: "Precision",
            },
            {
              source: "40004",
              target: "Slave",
            },
            {
              source: "40005",
              target: "Baud Rate",
            },
            {
              source: "Temperature",
              target: "189",
            },
            {
              source: "Humidity",
              target: "208",
            },
            {
              source: "Methane",
              target: "5",
            },
            {
              source: "Precision",
              target: "1",
            },
            {
              source: "Slave",
              target: "3",
            },
            {
              source: "Baud Rate",
              target: "4800",
            }
          ],
          lineStyle: {
            opacity: 0.9,
            width: 2,
            curveness: 0,
          },
        },
      ],
    };
    return option;
  }
</script>

<style scoped>

</style>
