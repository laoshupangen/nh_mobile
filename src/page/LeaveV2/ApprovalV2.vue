<template>
  <div>
    <!-- <div class="select">
      <div ref="box" @click="resetList">未审批</div>
    </div> -->
     <tab>
      <tab-item
        :selected="index === 0"
        v-for="(item,index) in tabItems"
        @on-item-click="resetList"
        :key="index"
      >{{item}}</tab-item>
    </tab>

    <mescroll-vue id="mescroll" class="mescroll-scroll" @init="initCallBack" :up="up" :down="down">
      <ul v-if="dataList.length !== 0" class="noti-list">
        <li @click="approval(item)" :key="i" v-for="(item, i) in dataList" class="clearfix">
          <div class="title">
            {{ item.leaveerName + ' ' }}提交的请假
            <span
              style="float:right;color:#999999;font-size:12px"
            >{{ item.createdTime }}</span>
          </div>
          <div class="info">
            请假类型：
            <span v-if="item.leaveType==1">事假</span>
            <span v-if="item.leaveType==2">病假</span>
            <span v-if="item.leaveType==3">节假日请假</span>
            <span v-if="item.leaveType==4">周末请假</span>
          </div>
          <img
            v-if="item.canceled"
            style="width: 2.5rem;height: 1.8rem;float:right;"
            src="../../assets/icon/yiixaojia.png"
            alt
          >
          <div v-else class="content-pos">
            <img class="more" src="../../assets/icon/left.png" alt>
          </div>
          <div class="info">开始时间：{{ item.startTime }}</div>
          <div class="info">结束时间：{{ item.endOfTime }}</div>
          <div class="status">
            <span v-if="item.approvalStatus==1">审核状态： 待审批</span>
            <span v-if="item.approvalStatus==2" style="color:#0EADFF;">审核状态： 已通过</span>
            <span v-if="item.approvalStatus==3" style="color:#EC525D;">审核状态： 未通过</span>
          </div>
        </li>
      </ul>
      <no-data :visible="dataList.length === 0"></no-data>
    </mescroll-vue>
  </div>
</template>

<script>
import _ from "lodash";
import { setTimeout } from "timers";
import { Flexbox, FlexboxItem, Tab, TabItem, Sticky } from "vux";
import { mapGetters, mapMutations } from "vuex";
import { getApprovalV2List } from "@/service";
import MescrollVue from "mescroll.js/mescroll.vue";
import NoData from "@/components/NoData.vue";
export default {
  components: {
    Flexbox,
    FlexboxItem,
    Tab,
    TabItem,
    Sticky,
    MescrollVue,
    NoData
  },
  data() {
    return {
      meScroll: {},
      dataList: [],
      Status: 0,
      up: {
        use: true,
        auto: true,
        isBounce: false,
        callback: this.upCallBack,
        page: {
          num: 0,
          size: 15
        }
      },
      down: {
        use: false
      }
    };
  },
  computed: {
    ...mapGetters(["currentOb", "ADD_DETAILS"]),
    tabItems: () => {
      return ["待审批","已审批" ];
    }
  },
  mounted() {
    //this.getdataList();
  },
  methods: {
    ...mapMutations(["SET_BROWSERHEADERTITLE"]),
    initCallBack(mescroll) {
      this.meScroll = mescroll;
    },
    async upCallBack(page, mescroll) {
      try {
        let data = await this.getList(page.num, page.size);
        this.SET_BROWSERHEADERTITLE({
          browserHeaderTitle: "请假审批" + "(" + data.records + ")"
        });
        this.dataList = _.concat(this.dataList, data.rows);
        this.meScroll.endSuccess(15, data.rows.length === 15);
      } catch (err) {
        console.log(err);
      }
    },
    async getList(pageNum, pageSize) {
      try {
        let data = await getApprovalV2List({
          rows: pageSize,
          page: pageNum,
          Status: this.Status
        });
        return data.data;
      } catch (err) {}
    },
    resetList(index) {
      this.Status = index
      this.dataList = [];
      this.meScroll.resetUpScroll();
    },
    approval(item) {
      // this.ADD_DETAILS({ type: 'news', content: item })
      if (item.approvalStatus == "1") {
        // console.log('kkk',item)
        this.$router.push({ name: "ApprovalV2Form", params: item });
      } else {
        this.$router.push({ name: "LeaveV2Detail", params: item });
      }
    }
  }
};
</script>

<style lang="less" scoped>
.select {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 999;
  height: 46px;
  padding: 16px 10px 0 0;
  color: rgba(255, 255, 255, 1);
}
.mescroll-container {
  position: relative;
}
.mescroll {
    position: fixed;
    top: 46px;
    bottom: 0;
    height: auto;
  }
.noti-list {
  width: 100%;
  li {
    color: #999999;
    position: relative;
    width: 100%;
    padding: 20px;
    border-bottom: 1px solid #dcdcdc;
  }
  div {
    padding: 1px;
  }
  .more {
    width: 60%;
  }
  .title {
    font-size: 16px;
    color: #1a1a1a;
  }
  .info {
    font-size: 12px;
    color: #7f7f7f;
  }
  .status {
    font-size: 12px;
    color: #e18d43;
  }
}
.content-pos {
  position: absolute;
  right: 20px;
  top: 80px;
  bottom: 0;
  text-align: center;
  vertical-align: middle;
  height: 100%;
  padding: 10px 20px 0px 20px;
  img {
    width: 0.4375rem;
    height: 0.625rem;
  }
}
</style>
