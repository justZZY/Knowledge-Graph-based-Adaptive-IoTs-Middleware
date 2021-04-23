<template>
  <div id="bottomLeft">
    <div class="bg-color-black ">
      <div class="d-flex pt-2 pl-2">
        <span style="color:#5cd9e8">
          <icon name="chart-bar"></icon>
        </span>
        <div class="d-flex">
          <span class="fs-xl text mx-2">Sensor Knowledge Graph</span>
        </div>
      </div>
      <div>
        <relationChart />
      </div>
    </div>
  </div>
</template>

<script>
import relationChart from "@/components/echart/bottom/relationChart";
export default {
  data() {
    return {};
  },
  components: {
    relationChart
  },
  mounted() {
  },
  beforeDestroy() {
    this.clear();
  },
  methods: {}
};
</script>

<style lang="scss">
#bottomLeft {
  padding: 1.5rem 1rem;
  height: 435px;
  min-width: 300px;
  border-radius: 5px;
  .bg-color-black {
    height: 400px;
    border-radius: 10px;
  }
  .text {
    color: #c3cbde;
  }
  .chart-box {
    margin-top: 1rem;
    width: 170px;
    height: 170px;
    .active-ring-name {
      padding-top: 10px;
    }
  }
}
</style>
