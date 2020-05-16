<template>
  <div class="_page_wrap">
    <search v-model="keyword" @on-change="getResult">
      <div class="_slot_right" @click="ReportStudent" slot="right">
        <img class="_img" src="@/assets/icon/sc@2x.png" />
      </div>
    </search>
    <mescroll-vue
      id="mescroll"
      class="mescroll-container"
      @init="initCallBack"
      :up="up"
      :down="down"
    >
      <plus @click.native="apply"></plus>
      <div class="cardWrap">
        <div class="cardUtil" v-for="(item,k) in list" @click="goto(item.id)" :key="k">
          <div class="cardTitle">
            <div class="flexWrap">
              <span class="_flex_title">
                <span class="icolor" :style="{'background':`${k%2===0?'#4DA3F3':'#f38232'}`}"></span>
                {{item.name}}
                (
                <span>
                  <span>{{item.dormName}}</span>
                </span>)
              </span>
              <div class="more">
                <i class="el-icon-d-arrow-right"></i>
              </div>
            </div>
          </div>
          <div class="cardContent">
            <div class="flexContainer">
              <div class="futilx">
                <img class="_img" src="@/assets/icon/bj@2x.png" />
                <span style="vertical-align:middle">{{item.organNameAll}}</span>
              </div>
              <div class="futilx">
                <img class="_img" src="@/assets/icon/ss@2x.png" />
                <span style="vertical-align:middle">{{item.reportTime||'暂无数据'}}</span>
              </div>
              <div
                class="_status"
                :style="`color:${item.checkStatus==0?'red':'blue'}`"
              >{{item.checkStatus==0?'待核查':'已核查'}}</div>
            </div>
          </div>
        </div>
      </div>
    </mescroll-vue>
  </div>
</template>
<script>
import { GetSafeDormReportList, ReportStudent } from "@/service";
import Plus from "@/components/Plus.vue";
import MescrollVue from "mescroll.js/mescroll.vue";
import { Search } from "vux";
import moment from "moment";

export default {
  data() {
    return {
      meScroll: {},
      list: [],
      loading: false,
      up: {
        use: true,
        callback: this.upCallBack,
        auto: true,
        isBounce: false,
        page: {
          num: 0,
          size: 10
        }
      },
      down: {
        use: false
      },
      keyword: ""
    };
  },
  computed: {},
  components: { MescrollVue, Search, Plus },
  methods: {
    initCallBack(mescroll) {
      this.meScroll = mescroll;
    },
    //  moment().format("YYYY-MM-DD")
    async upCallBack(page, mescroll) {
      try {
        let { data } = await GetSafeDormReportList({
          rows: page.size,
          page: page.num,
          startDate: moment().format("YYYY-MM-DD"),
          checkStatus: -1,
          keyword: this.keyword,
          organId: this.$route.params.organId,
          sord: "desc",
          sidx: "id"
        });
        // console.log('data',data);
        this.list = this.list.concat(data.rows);
        this.meScroll.endSuccess(10, true);
      } catch (err) {
        // console.log(err);
        this.meScroll.endSuccess(10, true);
      }
    },
    //  classId
    async getResult(val) {
      if (!val) return;
      let { data } = await GetSafeDormReportList({
        rows: this.up.page.size,
        page: 1,
        keyword: val,
        startDate: moment().format("YYYY-MM-DD"),
        checkStatus: -1,
        sord: "desc",
        sidx: "id"
      });
      this.list = data.rows;
      this.meScroll.endSuccess(10, true);
    },
    //  moment().format("YYYY-MM-DD")
    async ReportStudent() {
      try {
        let { data } = await ReportStudent({
          reportDay: moment().format("YYYY-MM-DD")
        });
        // console.log('res',res)
        this.$vux.toast.show({
          text: data.message,
          width: "80%"
        });
      } catch (err) {
        this.$vux.toast.show({
          text: err.message,
          type: "warn",
          width: "80%"
        });
      }
    },
    goto(id) {
      this.$router.push({
        name: "noReturnReport",
        params: { id }
      });
    },
    apply() {
      const _this = this;
      this.$vux.confirm.show({
        content: "确认新增?",
        onCancel() {},
        onConfirm() {
          _this.$router.push("/returnReport");
        }
      });
    }
  },
  mounted() {
    // this.upCallBack(this.page,this.meScroll)
  }
};
</script>
<style lang="less" scoped>
._page_wrap {
  background: #f0f0f0;
}
.mescroll-container {
  position: absolute;
  top: 44px;
  bottom: 0;
  left: 0;
  right: 0;
}
.cardWrap {
  font-size: 15px;
}
.cardTitle {
  border-bottom: none;
}
.cardUtil {
  background: #fff;
}
._img {
  width: 20px;
  height: 20px;
  vertical-align: middle;
}
.cardContent {
  padding: 2px 15px;
}
.futilx {
  padding-bottom: 5px;
}
.flexContainer {
  position: relative;
}
._status {
  position: absolute;
  right: 10px;
  top: 40%;
}
._slot_right {
  line-height: 28px;
  padding-left: 5px;
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