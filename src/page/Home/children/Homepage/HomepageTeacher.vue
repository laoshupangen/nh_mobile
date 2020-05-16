<template>
  <mescroll-vue
    style="margin-top:-46px"
    id="mescroll"
    class="mescroll-scroll"
    :up="{use: false}"
    :down="{use: false}"
  >
    <div>
      <div class="headView">
        <div class="home-bg">
          <div class="title">
            <span>{{'总人数：' + dataInfo.totalQty + '人'}}</span>
            <div style="float:right;">
              <select v-if="userInfo.Classes.length!==0" v-model="selectValue"  @change="getInfo">
                <option :value="option.Id" v-for="option in userInfo.Classes" :key="option.Id" >{{option.Name}}</option>
              </select>
              <span v-else>未绑定班级</span>
            </div>
          </div>
          <!-- <div class="check" style="height:20px;">
          <group gutter="0" style="height:100%;">
            <popup-radio 
              style="height:100%;"
              is-link
              arrow-direction="down"
              value="1"
              title
              :options="classList"
              v-model="classIndex"
            ></popup-radio>
          </group>
          </div>-->
          <flexbox :gutter="0">
            <flexbox-item>
              <div class="flexitem-title">在寝：</div>
              <div class="flexitem-info">
                {{dataInfo.inQty}}
                <span>人</span>
              </div>
            </flexbox-item>
            <flexbox-item>
              <div class="flexitem-title">外出：</div>
              <div class="flexitem-info">
                {{dataInfo.outQty}}
                <span>人</span>
              </div>
            </flexbox-item>
            <flexbox-item>
              <div class="flexitem-title">请假：</div>
              <div class="flexitem-info">
                {{dataInfo.leaveQty}}
                <span>人</span>
              </div>
            </flexbox-item>
          </flexbox>
        </div>
        <div class="list-header">
          <span class="title">待审批</span>
          <span>({{listCount}})</span>
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
              <div id="title">
                <span>{{item.leaveerName + '提交的' + titleModel.nameTitle}}</span>
                <span id="date">{{item.createdTime}}</span>
              </div>
              <div id="info">{{'开始时间：'+ item.startTime}}</div>
              <div id="info">{{'结束时间：'+ item.endOfTime}}</div>
              <div id="info">
                <span>{{titleModel.nameTitle + '类型：' + item.typeName}}</span>
                <span v-if="item.approvalStatus == '1'" id="status">立即审批</span>
                <span v-if="item.approvalStatus == '2'" id="status">待上级审批</span>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </mescroll-vue>
</template>

<script>
import { mapGetters,mapMutations } from "vuex";
import {
  ButtonTab,
  ButtonTabItem,
  Flexbox,
  FlexboxItem,
  XImg,
  PopupRadio,
  Group
} from "vux";
import { getApprovalV2List, postLoadByOrg } from "@/service";
import MescrollVue from "mescroll.js/mescroll.vue";

export default {
  data() {
    return {  
      selectValue:'',    
      classIndex: 0,
      checkListIndex: 0,
      dataInfo: {
        totalQty: ""
      },
      dataList: [],
      listCount:0,
      classList: ["1", "2"],
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
      titleModel: {}
    };
  },
  watch: {
    checkDateIndex(val) {},
    checkListIndex(val) {
      this.titleModel = this.titleModelList[val];
    }
  },
  mounted() {
    this.selectValue = this.currentClass.key
    this.titleModel = this.titleModelList[0];
    this.getList();
   
    if (this.currentClass.key) {
      this.getInfo();
    }
  },
  components: {
    ButtonTab,
    ButtonTabItem,
    Flexbox,
    FlexboxItem,
    XImg,
    PopupRadio,
    Group,
    MescrollVue
  },
  computed: {
    ...mapGetters(["userInfo", "currentClass"])
  },
  methods: {
    ...mapMutations([      
      'SET_CURRENTCLASS'
    ]),
    async getList() {
      try {
        let data = await getApprovalV2List({
          rows: 5,
          page: 1,
          userId: this.userInfo.UserId,
          Status: "0"
        });
        if(data.data.records > 0){
          this.listCount = data.data.records
        }
        for (let i = 0; i < data.data.rows.length; i++) {
          let dic = data.data.rows[i];
          if (dic.leaveType == "1") {
            this.$set(dic, "typeName", "事假");
          } else if (dic.leaveType == "2") {
            this.$set(dic, "typeName", "病假");
          } else if (dic.leaveType == "3") {
            this.$set(dic, "typeName", "节假日请假");
          }
          this.dataList.push(dic);
        }
      } catch (err) {}
    },
    
    async getInfo() {
      let b = this.userInfo.Classes.find(item=>item.Id === this.selectValue)
     
      this.SET_CURRENTCLASS({
        key:b.Id,
        value:b.Name
      })  
      try {
        let data = await postLoadByOrg({
          orgId: this.selectValue
        });
        this.dataInfo = data.data.data;
      } catch (err) {}
    },
    leaveV2ListShow() {
      this.$router.push({ name: "ApprovalV2" });
    },
    LeaveDetail(item) {
      if (item.approvalStatus == "1") {
        this.$router.push({ name: "ApprovalV2Form", params: item });
      } else {
        this.$router.push({ name: "LeaveV2Detail", params: item });
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
    padding: 30px 30px;
    padding-right: 20px;
    select{
      height: 1.5em;  
      color: #44bbff;
      border: none;
      border-radius: 6px;
      font-size: 14px;
    }
    select option{
      height: 1em;
      font-size: 12px;
      border: 0 solid transparent;
    }

    .title {
      float: left;
      width: 100%;
      color: white;
      font-size: 16px;
    }
    .check {
      height: 20px;
      width: 25%;
      float: right;
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
    margin: 15px 22px;
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
