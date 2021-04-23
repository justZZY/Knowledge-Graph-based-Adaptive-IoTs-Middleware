<template>
  <div id="index">
    <dv-full-screen-container class="bg">
      <dv-loading v-if="loading">Loading...</dv-loading>
      <div v-else class="host-body">
        <div class="d-flex jc-center">
          <dv-decoration-10 style="width:33.3%;height:5px;" />
          <div class="d-flex jc-center">
            <dv-decoration-8 :color="['#568aea', '#000000']" style="width:200px;height:50px;" />
            <div class="title" style="margin-top: 20px">
              <span class="title-text">The Adaptive IoT Access Middleware System</span>
              <dv-decoration-6
                class="title-bototm"
                :reverse="true"
                :color="['#50e 3c2', '#67a1e5']"
                style="width:250px;height:8px;"
              />
            </div>
            <dv-decoration-8
              :reverse="true"
              :color="['#568aea', '#000000']"
              style="width:200px;height:50px;"
            />
          </div>
          <dv-decoration-10 style="width:33.3%;height:5px;" />
        </div>

        <!-- 第二行 -->
        <div class="d-flex jc-between px-2">
          <div class="d-flex" style="width: 40%">
            <div
              class="react-right ml-4"
              style="width: 500px; text-align: left;background-color: #0f1325;"
            >
              <span class="react-before"></span>
              <span class="text fw-b">Sensor Statistic</span>
            </div>
            <div class="react-right ml-3" style="background-color: #0f1325;">
              <span class="text colorBlue fw-b">Access State</span>
            </div>
          </div>
          <div style="width: 40%" class="d-flex">
<!--            <div class="react-left bg-color-blue mr-3">-->
<!--&lt;!&ndash;              <span class="text fw-b">数据分析3</span>&ndash;&gt;-->
<!--            </div>-->
            <div
              class="react-left mr-4"
              style="width: 800px; background-color: #0f1325; text-align: right;"
            >
              <span class="react-after"></span>
              <span class="text">{{ nowTime }}</span>
            </div>
          </div>
        </div>

        <div class="body-box">
          <div id="vertical-box">
            <dv-border-box-12>
              <centreLeft1 />
            </dv-border-box-12>
          </div>
          <!-- 第三行数据 -->
          <div class="content-box">
            <div >
              <dv-border-box-14>
                <access-video />
              </dv-border-box-14>
            </div>
            <div>
              <dv-border-box-12>
                <accessProcess />
              </dv-border-box-12>
            </div>
            <div>
              <dv-border-box-13>
                <centreRight1 />
              </dv-border-box-13>
            </div>
          <div/>
        </div>

<!--           第四行数据-->
          <div class="bototm-box">
            <div>
              <dv-border-box-13>
                <bottomLeft />
              </dv-border-box-13>
            </div>
          </div>
        </div>
      </div>
    </dv-full-screen-container>
  </div>
</template>

<script>
import accessProcess from "./accessProcess";
import centreLeft1 from "./centreLeft1";
import centreRight1 from "./centreRight1";
import bottomLeft from "./bottomLeft";
import AccessVideo from "./accessVideo";
export default {
  data() {
    return {
      loading: true,
      nowTime:''
    };
  },
  components: {
    accessProcess,
    AccessVideo,
    centreLeft1,
    centreRight1,
    bottomLeft
  },
  mounted() {
    this.cancelLoading();
  },
  created() {
    setInterval(this.nowTimes,1000);
  },
  beforeDestroy() {
    this.clear();
  },
  methods: {
    cancelLoading() {
      setTimeout(() => {
        this.loading = false;
      }, 500);
    },
    //显示当前时间（年月日时分秒）
    timeFormate(timeStamp) {
      let date = new Date(timeStamp)
      let year = date.getFullYear();
      let month = date.getMonth() + 1 < 10? "0" + (date.getMonth() + 1): date.getMonth() + 1;
      let dated = date.getDate() < 10? "0" + date.getDate(): date.getDate();
      let hh = date.getHours() < 10? "0" + date.getHours(): date.getHours();
      let mm = date.getMinutes() < 10? "0" + date.getMinutes(): date.getMinutes();
      let ss = date.getSeconds() < 10? "0" + date.getSeconds(): date.getSeconds();
      this.nowTime = year + "年" + month + "月" + dated +"日"+" "+hh+":"+mm+':'+ss ;
      date = null;
    },
    nowTimes(){
      this.timeFormate(new Date());
    },
    clear(){
      clearInterval(this.nowTimes)
      this.nowTimes = null;
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../assets/scss/index";
</style>
