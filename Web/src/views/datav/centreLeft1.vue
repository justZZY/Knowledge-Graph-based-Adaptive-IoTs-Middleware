<template>
  <div id="centreLeft1">
    <div class="bg-color-black" style="margin-top: -5px">
      <el-card :body-style="{ padding: '0px' }">
        <img src="../../assets/img/sensor/ec.png" style="width: 100%; display: block;">
        <div>
          <table border="1">
            <tr>
              <th width=50px>Addr</th>
              <th width=50px>40000</th>
              <th width=50px>40001</th>
              <th width=50px>40002</th>
              <th width=50px>40003</th>
              <th width=50px>40004</th>
              <th width=50px>40005</th>
              <th width=50px>40006</th>
              <th width=50px>40007</th>
              <th width=50px>40008</th>
              <th width=50px>40009</th>
            </tr>
            <tr>
              <th width=50px>Data</th>
              <th width=50px>{{ calibrator }}</th>
              <th width=50px>{{ec}}</th>
              <th width=50px>1</th>
              <th width=50px>0</th>
              <th width=50px>0</th>
              <th width=50px>0</th>
              <th width=50px>0</th>
              <th width=50px>0</th>
              <th width=50px>0</th>
              <th width=50px>0</th>
            </tr>
            <tr>
              <th width=50px>Result</th>
              <th width=50px>Calibrator</th>
              <th width=50px>EC/TDS</th>
              <th width=50px>Slave</th>
              <th width=50px>Null</th>
              <th width=50px>Null</th>
              <th width=50px>Null</th>
              <th width=50px>Null</th>
              <th width=50px>Null</th>
              <th width=50px>Null</th>
              <th width=50px>Null</th>
            </tr>
          </table>
        </div>
      </el-card>
    </div>
    <div class="bg-color-black" style="margin-top: 7px">
      <el-card :body-style="{ padding: '0px' }">
        <img src="../../assets/img/sensor/Ammonia.png" style="width: 100%; display: block;">
        <div>
          <table border="1">
            <tr>
              <th width=50px>Addr</th>
              <th width=50px>40000</th>
              <th width=50px>40001</th>
              <th width=50px>40002</th>
              <th width=50px>40003</th>
              <th width=50px>40004</th>
              <th width=50px>40005</th>
              <th width=50px>40006</th>
              <th width=50px>40007</th>
              <th width=50px>40008</th>
              <th width=50px>40009</th>
            </tr>
            <tr>
              <th width=50px>Data</th>
              <th width=50px>{{ temp1 }}</th>
              <th width=50px>{{humidity1}}</th>
              <th width=50px>{{ammonia}}</th>
              <th width=50px>1</th>
              <th width=50px>2</th>
              <th width=50px>4800</th>
              <th width=50px>0</th>
              <th width=50px>0</th>
              <th width=50px>0</th>
              <th width=50px>0</th>
            </tr>
            <tr>
              <th width=50px>Result</th>
              <th width=50px>Temp</th>
              <th width=50px>Humidity</th>
              <th width=50px>Ammonia</th>
              <th width=50px>Precision</th>
              <th width=50px>Slave</th>
              <th width=50px>Baud</th>
              <th width=50px>Null</th>
              <th width=50px>Null</th>
              <th width=50px>Null</th>
              <th width=50px>Null</th>
            </tr>
          </table>
        </div>
      </el-card>
    </div>
    <div class="bg-color-black" style="margin-top: 7px">
      <el-card :body-style="{ padding: '0px' }">
        <img src="../../assets/img/sensor/Methane.png" style="width: 100%; display: block;">
        <div>
          <table border="1">
            <tr>
              <th width=50px>Addr</th>
              <th width=50px>40000</th>
              <th width=50px>40001</th>
              <th width=50px>40002</th>
              <th width=50px>40003</th>
              <th width=50px>40004</th>
              <th width=50px>40005</th>
              <th width=50px>40006</th>
              <th width=50px>40007</th>
              <th width=50px>40008</th>
              <th width=50px>40009</th>
            </tr>
            <tr>
              <th width=50px>Data</th>
              <th width=50px>{{temp2}}</th>
              <th width=50px>{{humidity2}}</th>
              <th width=50px>{{methane}}</th>
              <th width=50px>1</th>
              <th width=50px>3</th>
              <th width=50px>4800</th>
              <th width=50px>0</th>
              <th width=50px>0</th>
              <th width=50px>0</th>
              <th width=50px>0</th>
            </tr>
            <tr>
              <th width=50px>Result</th>
              <th width=50px>Temp</th>
              <th width=50px>Humidity</th>
              <th width=50px>MethaneMethane</th>
              <th width=50px>Precision</th>
              <th width=50px>Slave</th>
              <th width=50px>Baud</th>
              <th width=50px>Null</th>
              <th width=50px>Null</th>
              <th width=50px>Null</th>
              <th width=50px>Null</th>
            </tr>
          </table>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      timer: null,
      calibrator: Math.round(Math.random()*1000+14000),
      ec: Math.round(Math.random()*1000+43000),
      temp1: Math.round(Math.random()*50+180),
      humidity1: Math.round(Math.random()*60+170),
      ammonia: Math.round(Math.random()*6),
      temp2: Math.round(Math.random()*50+180),
      humidity2: Math.round(Math.random()*60+170),
      methane: Math.round(Math.random()*5)
    }
  },
  components: {
    // centreLeft1Chart
  },
  mounted() {

  },
  created() {
    clearInterval(this.timer)
    this.timer = null
    this.setTimer()
  },
  beforeDestroy() {
    clearInterval(this.timer)
    this.timer = null
  },
  methods: {
    setTimer() {
      if(this.timer == null) {
        this.timer = setInterval( () => {
          this.calibrator = Math.round(Math.random()*1000+14000)
          this.ec = Math.round(Math.random()*1000+43000)
          this.temp1 = Math.round(Math.random()*50+180)
          this.humidity1 = Math.round(Math.random()*60+170)
          this.ammonia = Math.round(Math.random()*6)
          this.temp2 = Math.round(Math.random()*50+180)
          this.humidity2 = Math.round(Math.random()*60+170)
          this.methane = Math.round(Math.random()*5)
        }, 2000)
      }
    }
  }
};
</script>

<style lang="scss">
#centreLeft1 {
  padding: 1rem;
  height: 410px;
  min-width: 300px;
  border-radius: 5px;
  .bg-color-black {
    height: 271px;
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

  .bottom-data {
    .item-box {
      margin-top: 20px;
      padding-left: 70px;
      float: right;
      position: relative;
      width: 50%;
      color: #d3d6dd;
      // 金币
      .coin {
        position: absolute;
        left: 13px;
        top: 17px;
        font-size: 2rem;
        color: #ffc107;
      }
      .colorYellow {
        color: yellowgreen;
      }
    }
  }
}
.th {
  width: 200px;
}
</style>
