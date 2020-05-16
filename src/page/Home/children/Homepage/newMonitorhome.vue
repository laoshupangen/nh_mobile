<template>
  <div class="school_container">
    <div class="school">
      <div class="flex1">
        <div class="school-bg">
          <h1>{{userInfo.OrgName}}:<i v-if="SafeDataList.length!=0">
             {{SafeDataList[0].totalQty}}
            </i>人</h1>
          <div class="table">
            <table v-if="SafeDataList.length!=0">
              <tr style="fontSize:14px">
                <td>在寝：</td>
                <td>外出：</td>
                <td>请假：</td>
              </tr>
              <tr style="fontSize:20px">
                <td>{{ SafeDataList[1].inQty}}人</td>
                <td>{{ SafeDataList[1].outQty}}人</td>
                <td>{{ SafeDataList[1].leaveQty}}人</td>
              </tr>
            </table>
          </div>
        </div>
        <div class="leave">
          <marquee>
            <marquee-item v-for="(hd,i) in marqueeData" :key="i" @click.native="showPopup(hd)">
              <div class="marItem">
                <span>
                  <span class="leave_icon_origin"></span>
                  {{hd.title}}:
                  <span>
                    <span>{{hd.newArr[0].map(hn=>hn.name).join(',')}}</span>
                  </span>
                </span>
                <span class="leave_icon_right">
                  <i class="el-icon-d-arrow-right"></i>
                </span>
              </div>
            </marquee-item>
          </marquee>
        </div>
      </div>

      <div class="flex2" >
        <div class="scroll">
          <div class="total_abnormal">
            <h1>{{userInfo.OrgName}}异常统计</h1>
            <pullselect :dataSource="options" v-model="value" @on-change="toggle"></pullselect>
          </div>
          <div v-if="loading">
             <inline-loading></inline-loading>
          </div>
          <Class-car v-show="!loading" :HeadmasterList="HeadmasterList" />

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
import { Marquee, MarqueeItem, XDialog ,InlineLoading} from "vux";
import { mapGetters, mapActions } from "vuex";
import { searchStudentByNameOrNum } from "@/service";
import ClassCar from "@/components/SubMajorCar/ClassCar";
import Pullselect from '@/components/Pullselector'
import MescrollVue from "mescroll.js/mescroll.vue";
import moment from "moment";
export default {
  data() {
    return {
      value:{},
      show: false,
      loading:false,
      userDetail: Object,
      modalData: [],
      modalTitle: Object,
      dateType:'1'
    };
  },
  components: {
    ClassCar,
    Marquee,
    MarqueeItem,
    XDialog,
    MescrollVue,
    InlineLoading,
    Pullselect
  },
  computed: {
    ...mapGetters(["HeadmasterList", "userInfo", "SafeDataList","currentClass"]),
    options: function() {
       return [
        { key: '1', value: "昨日" },
        { key: '2', value: "本周" },
        { key: '3', value: "本月" },
        // { key: '4', value: "本学期" },
        // {key:'5',value:"本学年"}
      ];
    },
    marqueeData: function() {
      if (!this.HeadmasterList.totalArr) {
        return;
      }
      return this.HeadmasterList.totalArr.filter(ht => ht.totalCount > 0);
    }
  },
  created() {
    this.searchStudentByNameOrNum();
    this.setSafeData({orgId: this.userInfo.Organ});
    this.getPageData();
  },
  methods: {
    ...mapActions(["setHeadmasterData", "setSafeData"]),
    async getPageData() {
      this.loading = true
      await this.setHeadmasterData({
        classId: this.userInfo.Organ,
        dateType: this.dateType
      });
      this.loading = false
    },

    toggle() {
      this.dateType = this.value.key
     
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
    console.log(this.userInfo);
  }
};
</script>

<style lang="less" scoped>
.school_container {
  background-color: #fff;
  // padding-bottom: 70px;
  // margin-top: -46px;
  height: calc(~"100% - 70px");
  .school {
    width: 100%;
    height: 100%;
    
    display: flex;
    flex-direction: column;
    .school-bg {
      height: 5.6rem;

      h1 {
        color: #fff;
        font-size: 16px;
        font-weight: 400;
        padding: 30px 0;
        padding-left: 40px;
      }
      .table {
        // padding-top: 30px;
        table {
          width: 100%;
          color: #fff;
          tr {
            width: 100%;
            display: flex;
            justify-content: space-around;
          }
        }
      }
      background-repeat: no-repeat;
      background-image: url("./../../../../assets/icon/home_bg.png");
      background-size: 100%;
      width: 100%;
      background-position: top center;
    }
    .leave {
      width: 90%;
      margin: 10px auto;
      background-color: #eee;
      // line-height: 30px;
      padding: 0 15px;
      border-radius: 15px;
      color: #666;
    }
    .marItem {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .leave_icon_origin {
        display: inline-block;
        width: 10px;
        height: 10px;
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

.flex2{
  flex:1;
  overflow: auto;
  -webkit-overflow-scrolling: touch;
   padding-bottom: 20px;
  .scroll{
    position:relative;
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
.school_container .weui-dialog {
  background: none !important;
}
</style>
