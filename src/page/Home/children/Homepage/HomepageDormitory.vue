<template>
  <mescroll-vue
    
    id="mescroll"
    class="mescroll-scroll"
    :up="{use: false}"
    :down="{use: false}"
  >
    <div class="headView">
      <div class="home-bg">
        <flexbox>
          <flexbox-item>
            <div class="title">
              <span>学生宿舍楼</span>
            </div>
          </flexbox-item>
          <flexbox-item>
            <group style="float:right">
              <popup-radio
                class="check"
                is-link
                arrow-direction="down"
                :options="dormList"
                v-model="checkDormIndex"
              ></popup-radio>
            </group>
          </flexbox-item>
        </flexbox>

        <flexbox :gutter="0">
          <flexbox-item>
            <div class="flexitem-title">总人数：</div>
            <div class="flexitem-info">
              {{dataInfo.TotalCount}}
              <span>人</span>
            </div>
          </flexbox-item>
          <flexbox-item>
            <div class="flexitem-title">在寝：</div>
            <div class="flexitem-info">
              {{dataInfo.InCount}}
              <span>人</span>
            </div>
          </flexbox-item>
          <flexbox-item>
            <div class="flexitem-title">外出：</div>
            <div class="flexitem-info">
              {{dataInfo.OutCount}}
              <span>人</span>
            </div>
          </flexbox-item>
        </flexbox>
      </div>
      <div class="check-menu">
        <button-tab v-model="checkListIndex" :height="30">
          <button-tab-item>头像更新</button-tab-item>
          <button-tab-item>校外访客</button-tab-item>
        </button-tab>
      </div>
      <div class="list-header">
        <span class="title">{{checkListIndex == 0 ? '头像更新' : '校外访客'}}</span>
        <span class="more" @click="showMore">更多</span>
      </div>
      <div class="list">
        <ul v-if="checkListIndex == 0">
          <div
            v-show="photoList.length == 0"
            style="text-align: center;font-size: 15;padding: 10px 0;color: #979799;"
          >-- 无数据 --</div>
          <li
            @click="showDetail(item)"
            v-for="(item,i) in photoList"
            :key="i"
            style="padding: 10px 0;border-top: 1px solid #e7e7e7;"
          >
            <div id="title">{{item.applierName + '提交的申请'}}</div>
            <div id="info">
              <span>{{'提交的时间：'+ item.createdTime}}</span>
              <span id="status">立即审批</span>
            </div>
          </li>
        </ul>
        <ul v-if="checkListIndex == 1">
           <div
            v-show="visitList.length == 0"
            style="text-align: center;font-size: 15;padding: 10px 0;color: #979799;"
          >-- 无数据 --</div>
          <li
            @click="showDetail(item)"
            v-for="(item,i) in visitList"
            :key="i"
            style="padding: 10px 0;border-top: 1px solid #e7e7e7;"
          >
            <div id="title">
              <span>{{item.leaveerName + '提交的申请'}}</span>
              <span id="date">{{item.createdTime}}</span>
            </div>
            <div id="info">{{'开始时间：'+ item.startTime}}</div>
            <div id="info">{{'结束时间：'+ item.endOfTime}}</div>
            <div id="info">{{'访问类型：' + item.typeName}}</div>
            <div id="info">
              <span>{{'访 问 人：' + item.leaveName}}</span>
              <span id="status">立即审批</span>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </mescroll-vue>
</template>

<script>
import { mapGetters } from "vuex";
import {
  ButtonTab,
  ButtonTabItem,
  Flexbox,
  FlexboxItem,
  XImg,
  PopupRadio,
  Group
} from "vux";
import {
  getDorms,
  getDormInfo,
  getVisitorList,
  getPhotosList
} from "@/service";
import moment from "moment";
import MescrollVue from "mescroll.js/mescroll.vue";

export default {
  data() {
    return {
      checkDormIndex: "",
      checkListIndex: 0,
      dataList: [],
      dormList: [],
      photoList: [],
      visitList: [],
      dataInfo: {}
    };
  },
  watch: {
    checkDormIndex(val) {
      this.getInfo(val);
    },
    checkListIndex(val) {
      if (val == 0) {
        this.getList();
      } else {
        this.getVisitList();
      }
    }
  },
  mounted() {
    this.getDorm();
    this.getList();
  },
  components: {
    ButtonTab,
    ButtonTabItem,
    Flexbox,
    FlexboxItem,
    XImg,
    MescrollVue,
    PopupRadio,
    Group
  },
  computed: {
    ...mapGetters(["userInfo"])
  },
  methods: {
    async getList() {
      try {
        let data = await getPhotosList({
          rows: 5,
          page: 1,
          CurrentUserId: this.userInfo.UserId,
          SearchPattern: "0"
        });
        this.photoList = data.data.rows;
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
            typeName: item.visitType == "1" ? "校外访客" : "同学互访",
            leaveName: item.visitorName,
            id: item.id
          };
        });
      } catch (err) {}
    },
    async getDorm() {
      try {
        let data = await getDorms();
        this.dormList = Array.isArray(data.data)
          ? _.map(data.data, (item, i) => {
              if (i == 0) {
                this.checkDormIndex = item.id;
              }
              return {
                key: item.id,
                value: item.buildingNo + "栋"
              };
            })
          : [];
      } catch (err) {}
    },
    async getInfo(val) {
      try {
        let data = await getDormInfo(val);
        this.dataInfo = data.data;
      } catch (err) {}
    },
    showMore() {
      if (this.checkListIndex == 0) {
        this.$router.push({ name: "PhotosList" });
      } else {
        this.$router.push({ name: "VisitList" });
      }
    },
    showDetail(item) {
      if (this.checkListIndex == 0) {
        this.$router.push({
          name: "PhotoDetail",
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
  margin-bottom: 70px;
  .home-bg {
    background-repeat: no-repeat;
    background-image: url("./../../../../assets/icon/home_bg.png");
    height: 5.6rem;
    background-size: cover;
    width: 100%;
    background-position: top center;
    padding: 20px 30px;
    padding-right: 20px;

    .title {
      padding-top: 20px;
      color: white;
      font-size: 16px;
    }
    .check {
      background: #fff;
      height: 20px;
      font-size: 13px;
    }
    .flexitem-title {
      padding-top: 50px;
      font-size: 14px;
      text-align: left;
      color: #fff;
    }
    .flexitem-info {
      font-size: 26px;
      text-align: left;
      color: #fff;

      span {
        font-size: 22px;
      }
    }
  }
  .check-menu {
    padding: 15px 68px;
  }
  .list-header {
    margin: auto 15px;
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
    #title {
      padding-bottom: 5px;
      font-size: 15px;
      color: #4d4d4d;
      #date {
        color: #979799;
        font-size: 12px;
        float: right;
      }
    }
    #info {
      padding-bottom: 2px;
      font-size: 12px;
      color: #4d4d4d;
    }

    #status {
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
