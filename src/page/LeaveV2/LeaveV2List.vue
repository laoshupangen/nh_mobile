<template>
  <div style="height: 100%;position: relative;">
    

    <mescroll-vue id="mescroll" class="mescroll-scroll" @init="initCallBack" :up="up" :down="down">
      <plus @click.native="apply"></plus>
      <ul v-if="dataList.length !== 0" class="noti-list">
        <li @click="LeaveDetail(item)" :key="i" v-for="(item, i) in dataList" class="clearfix">
          <div class="title">
            {{ item.leaveerName }}提交的请假
            <span
              style="color:#999999;font-size:13px;"
            >{{ item.createdTime }}</span>
          </div>
          <div>
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
            <div @click.stop="cancelHoliday(item)"  v-if="item.cancelable"  class="celable">去销假</div>
            
            <img v-else class="more" src="../../assets/icon/left.png" alt>
          </div>
          <div>开始时间：{{ item.startTime }}</div>
          <div>结束时间：{{ item.endOfTime }}</div>
          <div v-if="item.approver&&item.approver.length > 0&&item.approver[0]">
            <span>当前审批人：</span>
            <span v-for="(person,i) in item.approver" :key="i">{{person + ' '}}</span>
          </div>
          <div class="status">
            <span v-if="item.approvalStatus==1">审核状态： 待审批</span>
            <span v-if="item.approvalStatus==2" style="color:#0EADFF;">审核状态： 已通过</span>
            <span v-if="item.approvalStatus==3" style="color:#EC525D;">审核状态： 未通过</span>
          </div>
        </li>
      </ul>
      <!-- <no-data :visible="dataList.length === 0"></no-data> -->
    </mescroll-vue>
  </div>
</template>

<script>
import _ from "lodash";
import { setTimeout } from "timers";
import { Flexbox, FlexboxItem, Tab, TabItem, Sticky, Confirm } from "vux";
import { mapGetters, mapMutations } from "vuex";
import { getLeaveV2List, postCancelholiday } from "@/service";
import MescrollVue from "mescroll.js/mescroll.vue";
import NoData from "@/components/NoData.vue";
import Plus from "@/components/Plus.vue";
export default {
  components: {
    Flexbox,
    FlexboxItem,
    Tab,
    TabItem,
    Sticky,
    MescrollVue,
    NoData,
    Confirm,
    Plus
  },
  data() {
    return {
      meScroll: {},
      dataList: [],
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
    ...mapGetters(["currentOb", "userInfo"])
  },
  mounted() {
    //this.getdataList();
  },
  methods: {
    initCallBack(mescroll) {
      this.meScroll = mescroll;
    },
    async upCallBack(page, mescroll) {
      try {
        let data = await this.getList(page.num, page.size);
        this.dataList = _.concat(this.dataList, data.rows);
        this.meScroll.endSuccess(15, data.rows.length === 15);
      } catch (err) {
        console.log(err);
      }
    },
    async getList(pageNum, pageSize) {
      try {
        let data = await getLeaveV2List({
          rows: pageSize,
          page: pageNum,
          userId: this.userInfo.UserId
        });
        return data.data;
      } catch (err) {}
    },
    LeaveDetail(item) {
      this.$router.push({
        name: "LeaveV2Detail",
        params: {
          id: item.id
        }
      });
    },
    cancelHoliday(item) {
      var _this = this;

      this.$vux.confirm.show({
        title: "确定要销假嘛",
        content:
          "如果已经在假期内，销假时间按提交日的第二天至假期结束日期计算。",
        onConfirm() {
          postCancelholiday({
            orderId: item.id
          }).then(data => {
            if (data.data.state == "success") {
              _this.dataList = [];
              _this.meScroll.resetUpScroll();
              _this.$vux.toast.show({
                text: "销假成功",
                type: "success"
              });
            }
          });
        }
      });
    },
    apply(){
      const _this = this
      this.$vux.confirm.show({
        content:'确认申请新的请假？',
        onCancel(){

        },
        onConfirm(){
          _this.$router.push('/leaveV2Form')

        }
      })
    }
  }
};
</script>
<style>
.weui-dialog{
  background: #fff !important; 
}
</style>
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
  .title {
    display: flex;
    align-items: Center;
    justify-content: space-between;
    font-size: 16px;
    color: #1a1a1a;
  }

  .NotApporal {
    color: #e18d43;
  }
  .isApporal {
    color: #0eadff;
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
  
  padding: 10px 20px 0px 20px;
  background: #ffffff;
  img {
    width: 0.3375rem;
    height: 0.625rem;
  }
  .celable {
    padding: 3px 10px;
    background: #2eb1fd;
    color: white;
    border-radius: 5px;
  }
}
</style>
