<template>
  <div class="school_container">
    <div class="school">
      <div class="school_flex1">
        <div class="school-bg">
          <h1>
            <!-- {{currentClass.value?currentClass.value:'未绑定机构'}} -->
            <pullselect
              style="display:inline-block;"
              :dataSource="switchOrg"
              @on-change="changeBindClass"
              v-model="currentClass.key"
              v-show="switchOrg.length>0"
            ></pullselect>
            <span v-if="SafeDataList.length!=0">共{{SafeDataList[0].totalQty}}人</span>
          </h1>
        </div>
        <div class="table">
          <div class="table_left">
            <p>
              <span class="p_title">
                <span></span>
                在寝状态
              </span>
            </p>
            <div
              v-if="currentClass.key&&(loading1||firstLoading)"
              style="text-align:center;marginTop:20px"
            >
              <inline-loading></inline-loading>
            </div>
            <div v-if="currentClass.key&&!loading1&&!firstLoading" class="tr">
              <div>
                <span style="color:#f5222d" v-if="SafeDataList.length>0">
                  <span>{{SafeDataList[1].inQty}}</span>
                  <span style="font-size:12px">人</span>
                </span>
                <span>在寝</span>
              </div>
              <div>
                <span style="color:#faad14;" v-if="SafeDataList.length>0">
                  <span @click="showOut" :class="isBefore?'':'isBefore'">{{SafeDataList[1].outQty}}</span>
                  <span style="font-size:12px">人</span>
                </span>
                <span>不在寝</span>
              </div>
              <div>
                <span style="color:#1890ff">
                  <span
                    @click="checkNoOut"
                    style="text-decoration:underline"
                  >{{firstDay.noOutCount}}</span>
                  <span style="font-size:12px">人</span>
                </span>
                <span>长时间未出</span>
              </div>
            </div>
            <div
              v-if="currentClass.key&&!loading1&&!firstLoading"
              class="tr"
              style="margin-top:5px"
            >
              <div>
                <span style="color:#13c2c2;" v-if="SafeDataList.length>0">
                  <span
                    @click="checkNoRecord"
                    style="text-decoration:underline"
                  >{{SafeDataList[1].noRecord}}</span>
                  <span style="font-size:12px">人</span>
                </span>
                <span>无进出记录</span>
              </div>
              <div>
                <span style="color:#52c41a">
                  {{firstDay.noReturnCount}}
                  <span style="font-size:12px">人</span>
                </span>
                <span>昨日未归</span>
              </div>
              <div>
                <span style="color:#1890ff">
                  {{firstDay.lateReturnCount}}
                  <span style="font-size:12px">人</span>
                </span>
                <span>昨日晚归</span>
              </div>
            </div>
          </div>
        </div>

        <div class="leave" v-if="leaveDataTotal>0" @click="showPopup">
          <span>
            <span class="leave_icon_origin"></span>您有
            <i>{{ leaveDataTotal }}条</i>请假申请待审批
          </span>
          <span class="leave_icon_right">
            <i class="el-icon-d-arrow-right"></i>
          </span>
        </div>
        <div v-if="currentClass.key" class="total_abnormal">
          <!-- <p style="font-size:14px;">
            <span></span>异常统计详情
          </p>-->
          <pullselect
            style="margin-right:5px;"
            :dataSource="options"
            v-model="value"
            @on-change="toggle"
          ></pullselect>
          <div style="display:flex;align-items:center">
            <m-switch :options="switchOpt" @item-click="itemClick"></m-switch>
          </div>
        </div>
      </div>

      <!-- 小卡片组件 -->
      <div v-if="currentClass.key" class="school_flex2">
        <div v-if="loading" class="loadUtils">
          <inline-loading></inline-loading>
        </div>
        <v-chart
          style="marginTop:-20px;"
          v-show="!loading&&switchIndex===1"
          ref="chart"
          prevent-render
          @on-render="renderChart"
        ></v-chart>
        <div v-if="switchIndex === 0&&!loading" class="cardWrap">
          <div class="cardUtil" v-for="(org,k) in carDataList" :key="k">
            <div class="cardTitle">
              <div class="flexWrap">
                <h1>
                  <span class="icolor" :style="{'background':`${k%2===0?'#4DA3F3':'#f38232'}`}"></span>
                  {{org.orgId.name.substring(org.orgId.name.indexOf('/')+1)}}
                  (
                  <span>
                    异常
                    <span style="color:red">{{org.lateReturnCount+org.noReturnCount}}</span>人
                  </span>)
                </h1>
                <div class="more" @click="showMore(org.orgId)">
                  明细
                  <i class="el-icon-d-arrow-right"></i>
                </div>
              </div>
            </div>
            <div class="cardContent">
              <div class="flexContainer">
                <div class="futilx">
                  未归人员:
                  <span>{{org.noReturnCount}}人</span>
                </div>
                <div class="futilx">
                  晚归人员:
                  <span>{{org.lateReturnCount}}人</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <no-data :visible="!currentClass.key"></no-data>
    </div>

    <x-dialog hide-on-blur v-model="flag">
      <div class="content">
        <p style="color: #000">
          当前未归
          (
          <span style="color: red">{{getSum(noReturnTop,'noReturnCount')}}</span>)
        </p>
        <ul>
          <li v-for="(org,i) in noReturnTop" :key="i">
            <span class="contentTable">{{org.orgId.name.substr(org.orgId.name.indexOf('/')+1)}}</span>
            <span>{{org.noReturnCount}}/人次</span>
          </li>
        </ul>
        <p @click="close">关闭</p>
      </div>
    </x-dialog>

    <!-- 人员 -->
  </div>
</template>

<script>
import _ from "lodash";
import { mapGetters, mapActions, mapMutations } from "vuex";
import ClassCar from "@/components/SubMajorCar/ClassCar";
import Pullselect from "@/components/Pullselector";
import { VChart, InlineLoading, XDialog } from "vux";
import MescrollVue from "mescroll.js/mescroll.vue";
import { getExceptionInfo } from "@/service";
import Drawer from "@/components/Drawer.vue";
import NoData from "@/components/NoData.vue";
import MSwitch from "@/components/MSwitch.vue";
import moment from "moment";

export default {
  data() {
    return {
      curCls:"",
      value: "",
      switchIndex: 0,
      flag: false,
      show: false,
      loading: true,
      loading1: true,
      firstLoading: true,
      noReturnData: [],
      leaveData: [],
      leaveDataTotal: null,
      dateType: "1",
      showMember: false,

      madalData: {
        name: "",
        data: {
          lateReturn: [],
          noReturn: [],
          noOut: [],
          contiInOut: []
        }
      },
      firstDay: {
        noReturnCount: null,
        lateReturnCount: null,
        noOutCount: null
      },
      modelDataDetail: []
    };
  },
  components: {
    ClassCar,
    VChart,
    InlineLoading,
    MescrollVue,
    XDialog,
    Pullselect,
    NoData,
    Drawer,
    MSwitch
  },
  computed: {
    ...mapGetters([
      "SafeDataList",
      "carDataList",
      "userInfo",
      "barData",
      "currentClass",
      "HeadmasterList",
      "bindClass"
    ]),
    ALLOWLENGTH: function() {
      return 5;
    },
    noReturnTop: function() {
      let tem = this.noReturnData.reduce((pre, cur) => {
        if (pre.length > 0) {
          let index = pre.findIndex(p => p.noReturnCount < cur.noReturnCount);
          if (index !== -1) {
            let tem = [...pre, cur];
            tem.forEach((el, i) => {
              if (i < index) {
                tem[i] = pre[i];
              }
              if (i === index) {
                tem[i] = cur;
              }
              if (i > index) {
                tem[i] = pre[i - 1];
              }
            });
            return tem;
          } else {
            return [...pre, cur];
          }
        } else {
          return [...pre, cur];
        }
      }, []);

      return tem;
    },
    options: function() {
      return [
        { key: "1", value: "昨日" },
        { key: "2", value: "本周" },
        { key: "3", value: "本月" }
        // { key: "4", value: "本学期" },
        // { key: "5", value: "本学年" }
      ];
    },
    
    switchOrg() {
      return this.bindClass.map(c => {
        return { key: c.Id, value: c.Name };
      });
    },
    switchOpt: () => ["列表模式", "图表模式"],
    isBefore: () => {
      let curTime = moment().format("YYYY-MM-DD hh:mm");
      let deadline = moment().format("YYYY-MM-DD") + " 22:30";
      let isBefore = moment(curTime).isBefore(deadline);
      return isBefore;
    }
  },

  methods: {
    ...mapActions(["setSafeData", "setCarData", "setHeadmasterData"]),
    ...mapMutations(["SET_FOOTER_DISPLAY", "SET_CURRENTCLASS"]),
    toggle() {
      this.dateType = this.value;
      let chart = this.$refs.chart;

      this.loading = true;
      chart.rerender();
    },
    changeBindClass(value) {
      // console.log('value',value)
      let tm = this.bindClass.find(so=>so.Id===value)

      // console.log(this.switchOrg)
      this.SET_CURRENTCLASS({key:tm.Id,value:tm.Name});
      
      
      this.getData();
      this.getInfo();
      let chart = this.$refs.chart;

      this.loading = true;
      chart.rerender();
    },
    
    getTop(array, num) {
      return array.filter((a, index) => index < num);
    },
    async getData() {
      await this.setSafeData({
        orgId: this.currentClass.key
      });

      this.loading1 = false;
    },

    isShow(i, index) {
      switch (index) {
        case 0:
          return i < this.allowLength0;
        case 1:
          return i < this.allowLength1;
        case 2:
          return i < this.allowLength2;
        case 3:
          return i < this.allowLength3;
      }
    },
    changeAllowLength(data, index) {
      let fullLength = data.length;
      let curAllow =
        index === 0
          ? this.allowLength0
          : index === 1
          ? this.allowLength1
          : index === 2
          ? this.allowLength2
          : this.allowLength3;

      if (curAllow === fullLength) {
        switch (index) {
          case 0:
            this.allowLength0 = this.ALLOWLENGTH;
            break;
          case 1:
            this.allowLength1 = this.ALLOWLENGTH;
            break;
          case 2:
            this.allowLength2 = this.ALLOWLENGTH;
            break;
          case 3:
            this.allowLength3 = this.ALLOWLENGTH;
            break;
        }
      } else {
        switch (index) {
          case 0:
            this.allowLength0 = fullLength;
            break;
          case 1:
            this.allowLength1 = fullLength;
            break;
          case 2:
            this.allowLength2 = fullLength;
            break;
          case 3:
            this.allowLength3 = fullLength;
            break;
        }
      }
    },

    showtoast() {
      this.flag = true;
    },
    close() {
      this.flag = false;
    },
    showPopup() {
      // this.show = true;
      this.$router.push("/ApprovalV2");
    },
    async renderChart({ chart }) {
      await this.setCarData({
        orgId: this.currentClass.key,
        dateType: this.dateType
      });

      this.loading = false;
      chart.legend("type", {
        position: "bottom",
        align: "center",
        itemMarginBottom: 0,
        offsetY: -10,
        wordSpace: 10,
        marker: (x, y, r, ctx) => {
          ctx.lineWidth = 1;
          const L = 6,
            W = 2,
            R = 2;
          ctx.strokeStyle = ctx.fillStyle;
          ctx.arc(x - L, y - W, R, -Math.PI, -Math.PI / 2, false);
          ctx.lineTo(x + L, y - W - R);
          ctx.arc(x + L, y - W, R, -Math.PI / 2, 0, false);
          ctx.lineTo(x + L + R, y + W);
          ctx.arc(x + L, y + W, R, 0, Math.PI / 2, false);
          ctx.lineTo(x - L, y + W + R);
          ctx.arc(x - L, y + W, R, Math.PI / 2, -Math.PI, false);
          ctx.lineTo(x - L - R, y - W);
          ctx.stroke();
          ctx.fill();
        }
      });
      chart.axis("year", {
        label: text => {
          let l = text.length,
            temstr = text;
          if (l > 5) {
            let str1 = text.substring(0, 5);
            let str2 = text.substring(5);
            temstr = str1 + "\n" + str2;
          }
          return {
            text: temstr
          };
        }
      });

      chart.tooltip(false);

      const LIMIT_LENGTH = 6;
      let length = this.barData.length;
      if (length > LIMIT_LENGTH * 2) {
        const topData = this.barData
          .filter((b, index) => index % 2 === 0 && index / 2 < LIMIT_LENGTH)
          .map(c => c.year);
        chart.source(this.barData, {
          year: {
            tickCount: 5,
            values: topData
          }
        });
      } else {
        chart.source(this.barData);
      }
      chart.coord({
        transposed: false
      });

      chart
        .interval()
        .position("year*value")
        .color("type")
        .adjust({
          type: "dodge",
          marginRatio: 0.1
        });
      chart.render();
      // console.log(chart);
      if (length > LIMIT_LENGTH * 3) {
        chart.interaction("pan");
        // chart.interaction("pan");
      }
      chart.interaction("interval-select", {
        onEnd: e => {
          // console.log(e);
          // let pdata = chart.getSnapRecords({
          //   x: e.changedTouches[0].pageX,
          //   y: e.changedTouches[0].pageY
          // });
          // console.log(pdata);
          if (!e.data) {
            return;
          }
          let dateType = this.dateType;
          let valueType = null;
          if (e.data.type === "未归") {
            valueType = 0;
          }
          if (e.data.type === "晚归") {
            valueType = 1;
          }
          if (e.data.type === "未出") {
            valueType = 2;
          }

          this.$router.push({
            name: "Details",
            params: {
              orgId: e.data.orgId,
              dateType,
              valueType: valueType
            }
          });

          // var legend = chart.get("legendController").legends.bottom[0];
          // var legendItems = legend.items;
          // var map = {};
          // legendItems.map(function(item) {
          //   map[item.name] = _.clone(item);
          // });

          // map[e.data.type].value = e.data.value;
          // legend.setItems(_.values(map));
        },
        onProcess: e => {
          // console.log(e);
        }
      });

      this.noReturnData = this.carDataList.filter(c => c.noReturnCount > 0);
    },

    getSum(a, key) {
      let sum = a.reduce((pre, cur) => {
        return pre + cur[key];
      }, 0);

      return sum;
    },
    showMore(orgId) {
      let dateType = this.dateType;
      this.$router.push({
        name: "Details",
        params: {
          orgId: orgId.id,
          dateType
        }
      });
    },
    itemClick(index) {
      this.switchIndex = index;
    },
    async getInfo() {
      let { data } = await getExceptionInfo(this.currentClass.key);

      this.firstLoading = false;
      this.firstDay = data.data;
      // console.log('getExceptionInfo',data)
    },
    checkNoOut() {
      this.$router.push({
        name: "Tablelist",
        params: {
          orgId: this.currentClass.key,
          type: 2
        }
      });
    },
    showOut() {
      // let curTime = moment().format("YYYY-MM-DD hh:mm");
      // let deadline = moment().format("YYYY-MM-DD") + " 22:30";
      

      // let isBefore1 = moment(curTime).isBefore(deadline);

      // if (isBefore1) {
      //   return;
      // }

      this.$router.push({
        name: "Tablelist",
        params: {
          orgId: this.currentClass.key,
          type: 3
        }
      });
    },

    checkNoRecord() {
      this.$router.push({
        name: "Tablelist",
        params: {
          orgId: this.currentClass.key,
          type: 1
        }
      });
    }
  },
  mounted() {
    if (this.currentClass.key) {
      console.log(this.currentClass, this.switchOrg);
      // this.curCls = this.currentClass
      this.getData();
      this.getInfo();
    }
  }
};
</script>

<style lang="less" scoped>
.school_container {
  background-color: #fff;
  // margin-top: -46px;
  // height: calc(~"100% + 46px");
  // height: 100%;
  .school {
    height: 100%;
    display: flex;
    flex-direction: column;
    .school_flex2 {
      flex: 1;
      padding-bottom: 54px;
      overflow: auto;
    }
    .school-bg {
      padding-top: 20px;
      background-repeat: no-repeat;
      background-image: url("./../../../../assets/icon/home_bg.png");
      height: 220px;
      background-size: 100%;
      width: 100%;
      background-position: center center;
      h1 {
        color: #fff;
        font-size: 16px;
        font-weight: 400;
        padding-bottom: 20px;
        margin-left: 20px;
      }
    }
    .table {
      margin-top: -160px;
      display: flex;
      justify-content: space-around;
      padding: 0 10px;
      .table_left {
        width: 100%;
        // width: 46%;
        min-height: 130px;
        // height: 145px;
        padding: 8px 0;
        box-shadow: 0px 0px 18px 0px rgba(18, 71, 102, 0.3);
        border-radius: 5px;
        background-color: #fff;
        p {
          margin: 0;
          padding: 0;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 8px;

          .p_title {
            font-size: 14px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            display: block;
            position: relative;
            display: flex;
            align-items: center;
            color: #343434;
            font-weight: 600;
            font-family: "STHeitiSC-Medium";
            & > span {
              display: inline-block;
              width: 10px;
              height: 10px;
              margin-right: 5px;
              // vertical-align: middle;
              border-radius: 50%;
              background-color: #0094ff;
            }
          }
        }
        .tr {
          display: flex;
          // justify-content: space-around;
          padding: 0 10px;
          & div {
            width: 33.3333%;
            text-align: center;
            & > span:first-child {
              display: block;
              // width: 1.5rem;
              font-size: 14px;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }
            & > span:last-child {
              font-size: 14px;
            }
          }
        }
      }
    }

    // padding: 1px 0 50px;
    .loadUtils {
      // padding: 30px 0;
      margin-top: 40px;
      text-align: center;
    }
    .leave {
      width: 90%;
      margin: 10px auto;
      background-color: #eee;
      line-height: 35px;
      padding: 0 15px 0 15px;
      border-radius: 18px;
      color: #666;
      display: flex;
      justify-content: space-between;
      .leave_icon_origin {
        display: inline-block;
        width: 8px;
        height: 8px;
        background: #f00;
        border-radius: 50%;
        margin-right: 5px;
      }
      .leave_icon_right {
        display: inline-block;
        height: 30px;
        line-height: 30px;
        font-size: 20px;
        // width: 10px;
        color: #46a1f7;
        span:nth-child(1) {
          transform: translateX(22px);
        }
      }
      i {
        color: #58c1fd;
        font-style: normal;
      }
    }
  }

  .flexWrap {
    display: flex;
    // align-items: baseline;
    justify-content: space-between;
    h1 {
      font-size: 13px;
      font-weight: 600;
      .icolor {
        width: 3px;
        height: 15px;
        display: inline-block;
        // background: #f38232;
        vertical-align: middle;
        margin-bottom: 2px;
      }

      span {
        font-size: 12px;
        color: #989898;
      }
    }
  }
  .flexContainer {
    display: flex;
    justify-content: space-around;
    .futilx {
      font-size: 14px;
      color: #989898;
      & > span {
        font-size: 16px;
        font-weight: bold;
        color: #666666;
        padding-top: 4px;
      }
    }
  }
  .more {
    color: #56c1fd;
  }
  .total_abnormal {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 5px 20px;
    margin-top: 10px;
    & > p {
      & > span {
        display: inline-block;
        width: 10px;
        height: 10px;
        margin-right: 5px;
        // vertical-align: middle;
        border-radius: 50%;
        background-color: #0094ff;
      }
    }

    h1 {
      font-size: 0.4rem;
      color: #000;
      font-weight: bold;
      // padding-left: 15px;
    }
    select {
      width: 100px !important;
      background-color: #2cb1fd;
      margin: 0;
      padding: 0;
      color: #fff;
    }
  }
  .content {
    background: #fff;
    -webkit-overflow-scrolling: auto;
    border-radius: 0 30px 0 30px;
    p:first-of-type {
      background: #eee;
      border-radius: 0 30px 0 0;
      margin: 0;
      padding: 0;
      text-align: center;
      line-height: 40px;
    }
    p:nth-of-type(2) {
      background: #eee;
      border-radius: 0 0 0 30px;
      margin: 0;
      padding: 0;
      text-align: center;
      line-height: 40px;
      color: #000;
    }

    & > ul {
      height: 200px;
      overflow: auto;
      li {
        display: flex;
        justify-content: space-around;
        border-bottom: 1px solid #eee;
        margin: 0;
        padding: 0;
        line-height: 35px;
      }
      li:last-child {
        border-bottom: none;
      }
    }
    .content_wrap {
      max-height: 300px;
      overflow: auto;
    }
    .contentTable {
      display: inline-block;
      width: 3rem;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    .c_util {
      width: 90%;
      margin: auto;
      min-height: 80px;
      // overflow: hidden;
      background: #f8f8f8;
      padding: 0 5px;
      text-align: left;
      margin-top: 5px;
      .c_util_header {
        font-size: 14px;
        height: 30px;
        .c_util_left,
        .c_util_left_blue {
          display: inline-block;
          width: 4px;
          height: 30px;
          background: #f38232;
          vertical-align: middle;
          margin-right: 5px;
        }
        .c_util_left_blue {
          background: #10b7ee;
        }
        .c_util_header_right {
          height: 100%;
          line-height: 30px;
          font-size: 12px;
          float: right;
          color: red;
        }
      }
    }
    .expand {
      padding: 0 15px;
      text-align: right;
    }
    .c_util ul {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      padding-left: 10px;
      position: relative;
      li {
        padding: 0 5px;
      }
      .t_util {
        display: inline-block;
        width: 1rem;
        text-align-last: justify;
      }
    }
  }
}
.isBefore {
  text-decoration: underline;
}
.isNotBefore {
  text-decoration: none;
}
</style>
<style>
.el-icon-d-arrow-right:before {
  font-size: 14px;
}

.text-indent {
  width: 33%;
  white-space: nowrap;
  word-wrap: unset;
  text-overflow: ellipsis;
  overflow: hidden;
}
.util_title1 {
  color: #808080;
}
.util_title2 {
  color: #343434;
  font-size: 14px;
  padding-top: 5px;
  /* font-weight: 600; */
}
</style>
