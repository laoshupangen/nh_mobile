<template>
  
    <div class="headView">
      <div class="home-bg">
        <div class="title">
          <span>{{userInfo.UserName}}-异常总览（本周）</span>
        </div>
        
         <flexbox :gutter="0">
          <flexbox-item @click.native="()=>$router.push('/NotInStudent')">
            <div class="flexitem-title">未归：</div>
            <div class="flexitem-info">
              {{dataInfo.noReturnQty}}
              <span>次</span>
            </div>
          </flexbox-item>
          <flexbox-item @click.native="()=>$router.push('/LateInStudent')">
            <div class="flexitem-title">晚归：</div>
            <div class="flexitem-info">
              {{dataInfo.laterReturnQty}}
              <span>次</span>
            </div>
          </flexbox-item>
          <flexbox-item @click.native="()=>$router.push('/LeaveV2List')"> 
            <div class="flexitem-title">请假：</div>
            <div class="flexitem-info">
              {{dataInfo.leaveDay}}
              <span>天</span>
            </div>
          </flexbox-item>
         
         
        </flexbox>
      </div>
      <div class="check-menu">
        <button-tab v-model="checkListIndex" :height="30">
          <button-tab-item>待审核的请假单</button-tab-item>
          <button-tab-item>校外访问登记</button-tab-item>
        </button-tab>
      </div>
      
      <div v-if="dataList.length !== 0" class="list-header">
        <span class="title">{{titleModel.listTitle}}</span>
        <span class="more" @click="leaveV2ListShow">更多</span>
      </div>
      <div class="list">
        <div
          v-show="dataList.length == 0"
          style="text-align: center;font-size: 15;padding: 10px 0;color: #979799;"
        >-- 无数据 --</div>
        <ul>
          <li
            @click="LeaveDetail(item)"
            v-for="(item,i) in dataList"
            :key="i"
            style="padding: 10px 0;border-top: 1px solid #e7e7e7;"
          >
            <div class="title">
              <span>{{item.leaveerName + '提交的' + titleModel.nameTitle}}</span>
              <span class="date">{{item.createdTime}}</span>
            </div>
            <div class="info">{{'开始时间：'+ item.startTime}}</div>
            <div class="info">{{'结束时间：'+ item.endOfTime}}</div>
            <div class="info">{{titleModel.nameTitle + '类型：' + item.typeName}}</div>
            <div class="info">
              <span>{{titleModel.manTitle + item.leaveName}}</span>
              <span class="status">审核中</span>
            </div>
          </li>
        </ul>
      </div>
    </div>
 
</template>

<script>
import { mapGetters } from "vuex";
import { ButtonTab, ButtonTabItem, Flexbox, FlexboxItem, XImg } from "vux";
import { getLeaveV2List, postLoadByStu, getVisitorList } from "@/service";
import moment from "moment";
import MescrollVue from "mescroll.js/mescroll.vue";

export default {
  data() {
    return {
     
      checkListIndex: 0,
      dataList: [],
      leaveList: [],
      visitList: [],
      dataInfo: {},
      titleModelList: [
        {
          listTitle: "待审核的请假单",
          nameTitle: "请假",
          manTitle: "审 批 人："
        },
        {
          listTitle: "校外访问登记",
          nameTitle: "访问",
          manTitle: "访 问 人："
        },
        {}
      ],
      timeChoose: [
        {
          title: "本周",
          startTime: moment()
            .week(moment().week())
            .startOf("week")
            .format("YYYY-MM-DD"),
          endTime: moment(new Date()).format("YYYY-MM-DD")
        },
        {
          title: "本月",
          startTime:
            moment()
              .subtract(0, "month")
              .format("YYYY-MM") + "-01",
          endTime: moment(new Date()).format("YYYY-MM-DD")
        }
      ],
      titleModel: {}
    };
  },
  watch: {
   
    checkListIndex(val) {
      this.titleModel = this.titleModelList[val];
      if (val == 0) {
        this.dataList = this.leaveList;
      } else {
        this.dataList = this.visitList;
      }
    }
  },
  mounted() {
    this.titleModel = this.titleModelList[0];
    this.getList();
    this.getVisitList();
    this.getInfo(0);
  },
  components: {
    ButtonTab,
    ButtonTabItem,
    Flexbox,
    FlexboxItem,
    XImg,
    MescrollVue
  },
  computed: {
    ...mapGetters(["userInfo"])
  },
  methods: {
    async getList() {
      try {
        let data = await getLeaveV2List({
          rows: 5,
          page: 1,
          userId: this.userInfo.UserId,
          Status: "0"
        });
        for (let i = 0; i < data.data.rows.length; i++) {
          let dic = data.data.rows[i];
          if (dic.leaveType == "1") {
            this.$set(dic, "typeName", "事假");
          } else if (dic.leaveType == "2") {
            this.$set(dic, "typeName", "病假");
          } else if (dic.leaveType == "3") {
            this.$set(dic, "typeName", "节假日请假");
          }else if(dic.leaveType == '4'){
            this.$set(dic,"typeName","周末休假")
          }

          let approver = "";
          if (Array.isArray( dic.approver)) {
            for (let j = 0; j < dic.approver.length; j++) {
              approver += dic.approver[j] + ' ';
            }
          }

          this.$set(dic, "leaveName", approver);
          this.leaveList.push(dic);
        }
        this.dataList = this.leaveList;
        // console.log(this.dataList) 
      } catch (err) {}
    },
    async getVisitList() {
      try {
        let data = await getVisitorList({
          rows: 5,
          page: 1,
          ApprovalStatus: "0"
        });
        this.visitList = _.map(data.data.rows, (item, i) => {
          return {
            leaveerName: item.applicantName,
            createdTime: item.createdTime,
            startTime: item.visitStartTime,
            endOfTime: item.visitEndTime,
            typeName: item.visitType == "1" ? "校外访问" : "同学互访",
            leaveName: item.visitorName,
            id: item.id
          };
        });
      } catch (err) {}
    },
    async getInfo(index) {
      try {
        let data = await postLoadByStu({
          userId: this.userInfo.UserId,
          startTime: this.timeChoose[index].startTime,
          endTime: this.timeChoose[index].endTime
        });
        this.dataInfo = data.data.data;
      } catch (err) {}
    },
    leaveV2ListShow() {
      if (this.checkListIndex == 0) {
        this.$router.push({ name: "LeaveV2List" });
      } else {
        this.$router.push({ name: "VisitList" });
      }
    },
    LeaveDetail(item) {
      if (this.checkListIndex == 0) {
        this.$router.push({
          name: "LeaveV2Detail",
          params: {
            id: item.id
          }
        });
      } else {
        this.$router.push({
          name: "VisitorApproval",
          params: {
            id: item.id
          }
        });
      }
    }
  }
};
</script>

<style lang="less"  scoped>
.headView {
  // margin-bottom: 70px;
  height: calc(~"100% - 70px");
  .home-bg {
    background-repeat: no-repeat;
    background-image: url("./../../../../assets/icon/home_bg.png");
    height: 5.6rem;
    background-size: cover;
    width: 100%;
    background-position: top center;
    padding: 20px 10px 0 .7rem;
    // padding-right: 20px;

    .title {
      // float: left;
      // width: 50%;
      color: white;
      font-size: 16px;
      margin-bottom: 30px;
    }
    
    .flexitem-title {
      padding-top: 5px;
      font-size: 14px;
      text-align: left;
      color: #fff;
    }
    .flexitem-info {
      font-size: 16px;
      text-align: left;
      color: #fff;

      span {
        font-size: 20px;
      }
    }
  }
  .check-menu {
    padding: 0 68px;
    margin-top: 10px;
  }
  .list-header {
    margin: 5px 20px;
    .title {
      color: #333;
      font-size: 16px;
      font-weight: 700;
    }
    .more {
      color: #4d4d4d;
      font-size: 14px;
      float: right;
    }
  }
  .list {
    margin: 5px 15px;
    .title {
      padding-bottom: 5px;
      font-size: 15px;
      color: #4d4d4d;
      #date {
        color: #979799;
        font-size: 12px;
        float: right;
      }
    }
    .info {
      padding-bottom: 2px;
      font-size: 12px;
      color: #4d4d4d;
    }

    .status {
      color: #e18d43;
      font-size: 12px;
      background: #ffefd2;
      text-align: center;
      float: right;
      padding: 3px 10px;
      border-radius: 5px;
    }
  }
}
</style>
