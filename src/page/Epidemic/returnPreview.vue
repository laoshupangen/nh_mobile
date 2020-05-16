<template>
  <div class="_page_wrap">
    <search v-model="keyword" @on-change="getResult"></search>
    
    <mescroll-vue id="mescroll" class="mescroll-container" :up="up" :down="down">
      <div class="_section">
        <div class="_section_title">
          <span>归寝动态</span>
          <span v-if="!loading">更新时间 {{form.latestCreateTime}}</span>
        </div>
        <div v-if="loading" style="text-align:center;padding:40px 0;">
          <inline-loading></inline-loading>
        </div>
        <div v-if="!loading" class="_section_content">
          <div class="_s_item">
            <div class="s_item_title">住宿总人数</div>
            <div>{{form.stuTotalNum}}</div>
          </div>
          <div class="_divider"></div>
          <div class="_s_item">
            <div class="s_item_title">在寝总人数</div>
            <div>{{form.stuInDormNum}}</div>
          </div>
          <div class="_divider"></div>
          <div class="_s_item">
            <div class="s_item_title">不在寝人数</div>
            <div>{{form.stuNoInDormNum}}</div>
          </div>
        </div>
        <div v-if="!loading" class="_section_content">
          <div class="_s_item">
            <div class="s_item_title">已核查人数</div>
            <div>{{form.stuCheckNum}}</div>
          </div>
          <div class="_divider"></div>
          <div class="_s_item">
            <div class="s_item_title">未核查人数</div>
            <div>{{form.stuNoCheckNum}}</div>
          </div>
          <div class="_divider"></div>
          <div class="_s_item">
            <div class="s_item_title">未完成核查院系数</div>
            <div>{{form.noFinishCheckCollegeCount}}</div>
          </div>
        </div>
      </div>
      <div class="_section">
        <div style="padding:5px 10px;">未核查人员分布</div>
        <v-chart :appendPadding="5" prevent-render @on-render="renderVChart"></v-chart>
      </div>
      <div style="margin-top: 10px;">
        <div class="cardWrap" style="padding:0" v-if="!loading2">
          <div
            class="cardUtil"
            style="borderRadius:0;marginBottom:10px"
            v-for="(item,k) in list"
            :key="k"
            @click="goto(item.organId)"
          >
            <div class="cardTitle">
              <div class="flexWrap">
                <span class="_flex_title">
                  <!-- <span class="icolor" :style="{'background':`${k%2===0?'#4DA3F3':'#f38232'}`}"></span> -->
                  {{item.collegeName}}
                  (
                  <span>
                    <span style="color:red">未核查{{item.noCheckNum}}人</span>
                  </span>)
                </span>
                <div class="more">
                  明细
                  <i class="el-icon-d-arrow-right"></i>
                </div>
              </div>
            </div>
            <div class="cardContent">
              <div class="flexContainer">
                <div class="futilx">
                  <span style="color:#666">总人数:</span>
                  <span style="vertical-align:middle">{{item.totalNum}}人</span>
                </div>
                <div class="futilx">
                  <span style="color:#666">未归总数:</span>
                  <span style="vertical-align:middle">{{item.noReturnNum}}人</span>
                </div>
              </div>
            </div>
          </div>
          <div
            v-if="list.length===0"
            style="textAlign:center;padding:20px 0;color:#ccc;background:#fff"
          >--无数据--</div>
        </div>
        <div v-if="loading2" style="text-align:center;padding:20px 0;background:#fff">
          <inline-loading></inline-loading>
        </div>
      </div>
    </mescroll-vue>
  </div>
</template>
<script>
import MescrollVue from "mescroll.js/mescroll.vue";
import { Search, VChart, InlineLoading } from "vux";
import {
  GetLatestDormitoryStatistics,
  GetSafeDormReport,
  GetLatestDormitoryGraphicStatistics
} from "@/service";
import { mapGetters } from "vuex";
import moment from "moment";

export default {
  data() {
    return {
      loading: false,
      meScroll: {},
      list: [],
      up: {
        use: false,

        auto: true,
        isBounce: false,
        page: {
          num: 0,
          size: 15
        }
      },
      down: {
        use:false
      },
      form: {},
      chartData: [],
      keyword: "",
      loading: false,
      loading1: false,
      loading2: false
    };
  },
  computed: { ...mapGetters(["currentClass"]) },
  components: {
    Search,
    MescrollVue,
    VChart,
    InlineLoading
  },
  methods: {
    initCallBack(mescroll) {
      this.meScroll = mescroll;
    },
    async GetLatestDormitoryStatistics() {
      this.loading = true;
      let { data } = await GetLatestDormitoryStatistics();
      // console.log('GetLatestDormitoryStatistics',data)
      this.form = data.data;
      this.loading = false;
    },
    async GetSafeDormReport() {
      this.loading2 = true;
      //this.currentClass.key
      //moment().format("YYYY-MM-DD")
      let { data } = await GetSafeDormReport({
        organId: '',
        startDate: moment().format("YYYY-MM-DD"),
        endDate: ""
      });
      // console.log('GetSafeDormReport',data)
      this.list = data.rows;
      this.loading2 = false;
    },
   
    async renderVChart({ chart }) {
      let { data } = await GetLatestDormitoryGraphicStatistics(0);
      chart.tooltip(false);
      chart.axis(false);
      chart.source(data.data.map(dd => ({ ...dd, const: "const" })));
      chart.coord("polar", {
        transposed: true,
        innerRadius: 0.7,
        radius: 0.9
      });
      let sum = 0;
      data.data.forEach(el => {
        sum += Number(el.value);
      });
      chart.legend({
        position: "bottom",
        align: "center",
        marker: "square",
        itemFormatter: val => {
          return val + " " + data.data.find(item => item.name === val).value;
        }
      });
      // chart.pieLabel({
      //   sidePadding: 75,
      //   label1: function label1(data) {
      //     return {
      //       text: data.value,
      //       fill: "#343434"
      //     };
      //   },
      //   label2: function label2(data) {
      //     return {
      //       fill: "#999",
      //       text:  data.name,

      //     };
      //   }
      // });
      chart.guide().html({
        position: ["50%", "45%"],
        html: `<div style="width: 250px;height: 40px;text-align: center;">
           <div ">总数</div>
          <div >${sum}人</div>
          </div>`
      });
      chart
        .interval()
        .position("const*value")
        .color("name")
        .adjust("stack");
      chart.render();
    },
    goto(organId) {
      this.$router.push({
        name: "noReportList",
        params: {
          organId
        }
      });
    },
    async getResult(val) {
      if (!val) return;
      this.loading2 = true;
      let { data } = await GetSafeDormReport({
        organId: this.currentClass.key,
        startDate: moment().format("YYYY-MM-DD"),
        endDate: "",
        keyword:val
      });
      this.list = data.rows;
      this.loading2 = false;
      // this.meScroll.endSuccess(15, this.list.length === 15);
    },
    initData() {
      this.GetLatestDormitoryStatistics();
      this.GetSafeDormReport();
     
    }
  },
  mounted() {
    this.initData();
  }
};
</script>
<style lang="less" scoped>
._section_title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 5px 10px;
  color: #666;
}
._section_content {
  display: flex;
  // flex-wrap: wrap;
}
._s_item {
  width: 33.333%;
  position: relative;
  text-align: center;
  min-height: 60px;
}
.flexContainer {
  display: flex;
  justify-content: space-around;
}
.more {
  color: blue;
}
._divider {
  width: 1px;
  height: 20px;
  background: #999;
  margin-top: 15px;
  transform: scaleX(0.5);
}
.mescroll-container {
  position: absolute;
  top: 44px;
  bottom: 0;
  left: 0;
  right: 0;
}
._page_wrap {
  background: #f0f0f0;
}
.cardWrap {
  font-size: 15px;
}
.cardTitle {
  border-bottom: none;
}
.cardUtil {
  background: #fff;
  box-shadow: none;
}

._section {
  background: #fff;
}
._section + ._section {
  margin-top: 10px;
}
.flexWrap {
  display: flex;
  // align-items: baseline;
  justify-content: space-between;
  ._flex_title {
    // font-size: 13px;
    // font-weight: 600;
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
</style>