<template>
  <div class="school_container">
    <div class="school">
      <div class="flex1">
        <div class="school-bg">
          <h1>
            {{currentClass.value}}:
            <i v-if="SafeDataList.length!=0">总计{{ SafeDataList[0].totalQty}}人</i>
          </h1>
          <div class="table">
            <div v-if="SafeDataList.length!=0">
              <div class="tableWrap" style="fontSize:.38rem;">
                <div>在寝：</div>
                <div>外出：</div>
                <div>请假：</div>
              </div>
              <div class="tableWrap" style="fontSize:.52rem">
                <div>{{ SafeDataList[1].inQty}}人</div>
                <div>{{ SafeDataList[1].outQty}}人</div>
                <div>{{ SafeDataList[1].leaveQty}}人</div>
              </div>
            </div>
          </div>
        </div>
        <router-link to="/ApprovalV2" class="leave" tag="div">
          <span>
            <span class="leave_icon_origin"></span>您有
            <i v-if="SafeDataList.length!=0">{{ leaveDataTotal }}条</i>请假申请待审批
          </span>
          <span class="leave_icon_right">
            <i class="el-icon-d-arrow-right"></i>
          </span>
        </router-link>
      </div>

      <div class="flex2">
        <div class="scroll">
          <div class="total_abnormal">
            <h1 v-if="SafeDataList.length!=0">{{currentClass.value}}异常统计</h1>
            <pullselect :dataSource="options" v-model="value" @on-change="toggle"></pullselect>
            <!-- <select class="total_abnormal_list" @change="toggle" ref="select">
              <option v-for="date in options" :key="date.key" :value="date.key">{{date.value}}</option>
            </select>-->
          </div>

          <Class-car :HeadmasterList="HeadmasterList" />
        </div>
      </div>
    </div>
    <x-dialog v-model="show" hide-on-blur>
      <div class="content">
        <p style="color: #000">
          {{modalTitle.title}}
          (
          <span style="color: red">{{modalTitle.totalCount}}</span>)
        </p>
        <ul>
          <li v-for="(org,i) in modalData" :key="i">
            <span>{{org.name}}</span>
            <span>{{org.count}}</span>
          </li>
        </ul>
        <p @click="show=false">关闭</p>
      </div>
    </x-dialog>
  </div>
</template>

<script>
import { Marquee, MarqueeItem, XDialog } from "vux";
import { mapGetters, mapActions } from "vuex";
import { searchStudentByNameOrNum, getApprovalV2List } from "@/service";
import Pullselect from "@/components/Pullselector";
import ClassCar from "@/components/SubMajorCar/ClassCar";
import MescrollVue from "mescroll.js/mescroll.vue";
import moment from "moment";

export default {
  data() {
    return {
      value: {},
      show: false,
      dateType: "1",
      userDetail: Object,
      modalData: [],
      modalTitle: Object,
      leaveDataTotal: null
    };
  },
  components: {
    ClassCar,
    Marquee,
    MarqueeItem,
    XDialog,
    MescrollVue,
    Pullselect
  },
  computed: {
    ...mapGetters([
      "HeadmasterList",
      "userInfo",
      "SafeDataList",
      "currentClass"
    ]),
    options: function() {
      //1=昨日，2=本周，3=本月，4=本学期，5=本学年
      return [
        { key: "1", value: "昨日" },
        { key: "2", value: "本周" },
        { key: "3", value: "本月" },
        // { key: "4", value: "本学期" },
        // { key: "5", value: "本学年" }
      ];
    }
  },
  created() {
    // this.searchStudentByNameOrNum();
    this.getPageData();
    this.setSafeData({
      orgId: this.currentClass.key,
      startTime: null,
      EndTime: null
    });
  },
  methods: {
    ...mapActions(["setHeadmasterData", "setSafeData"]),
    async getPageData() {
      //1=昨日，2=本周，3=本月，4=本学期，5=本学年
      await this.setHeadmasterData({
        classId: this.currentClass.key,
        dateType: this.dateType
      });
      let data = await getApprovalV2List({
        rows: 50,
        page: 1,
        Status: 0
      });
      this.leaveDataTotal = data.data.records;
    },

    toggle() {
      this.dateType = this.value.key;
      this.getPageData();
    },
    showPopup(hd) {
      this.modalData = [];
      hd.newArr.forEach(element => {
        element.forEach(el => {
          this.modalData = [...this.modalData, el];
        });
      });
      this.modalTitle = { title: hd.title, totalCount: hd.totalCount };
      this.show = true;
    },
    async searchStudentByNameOrNum() {
      const { data } = await searchStudentByNameOrNum(this.userInfo.Num);

      this.userDetail = data.find(d => d.id === this.userInfo.UserId);
    }
  },
  mounted() {
    // console.log(this.currentClass);
  }
};
</script>

<style lang="less" scoped>
.school_container {
  
  background-color: #fff;

  margin-top: -46px;

  .school {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    .school-bg {
      height: 4.6rem;
      h1 {
        color: #fff;
        font-size: 16px;
        font-weight: 400;
        padding: 20px 0;
        padding-left: 20px;
      }
      .table {
        // padding-top: 30px;
        .tableWrap {
          display: flex;
          width: 100%;
          color: #fff;
          align-items: center;
          div {
            width: 33.333333%;
            padding-left: 30px;
          }
        }
      }
      background-repeat: no-repeat;
      background-image: url("./../../../../assets/icon/home_bg.png");
      background-size: 100%;
      width: 100%;
      background-position: center center;
    }
  }
  .leave {
    width: 90%;
    margin: 0 auto;
    background-color: #eee;
    line-height: 35px;
    display: flex;
    padding: 0 15px;
    border-radius: 15px;
    color: #666;
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
      display: block;
      height: 30px;
      line-height: 30px;
      font-size: 20px;
      color: #46a1f7;
    }
  }
  .total_abnormal {
    display: flex;
    justify-content: space-between;
    width: 90%;
    margin: 0 auto;
    padding: 10px 0;
    .total_abnormal_list {
      padding-left: 35px;
    }
    h1 {
      font-size: 16px;
      font-weight: 600;
      margin: 0;
      padding: 0;
    }
    select,
    textarea {
      width: 100px !important;
      background-color: #0e9bec;
      margin: 0;
      padding: 0;
      color: #fff;
    }
  }
}

.flex2 {
  flex: 1;
  overflow: auto;
  -webkit-overflow-scrolling: touch;
  padding-bottom: 20px;
  .scroll {
    position: relative;
    height: 100%;
  }
}

.content {
  background: #fff;
  // display: table;

  border-radius: 0 30px 0 30px;
  -webkit-overflow-scrolling: auto;

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
  ul {
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
}
</style>
<style>
.el-icon-d-arrow-right:before {
  font-size: 14px;
}
.school_container .weui-dialog {
    background: none !important;
  }
</style>
