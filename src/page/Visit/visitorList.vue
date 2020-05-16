<template>
  <div class="visitorList">
    <!-- <div class="select" @click="toggleList">
      <div ref="box">{{status === 1?'已审批':'待审批'}}</div>
    </div> -->
    <tab>
      <tab-item
        :selected="index === i"
        v-for="(item,index) in tabItems"
        @on-item-click="toggleList"
        :key="index"
      >{{item}}</tab-item>
    </tab>
    <!-- <div class="search" >
      <input type="search" placeholder="请输入姓名" v-model="keyword">
      <button @click="search">搜索</button>
    </div> -->

    <mescroll-vue id="mescroll" class="mescroll-scroll" @init="initCallBack" :up="up" :down="down">
      <plus v-if="userInfo.Duty==='studentDuty'&&status === 0" @click.native="apply"></plus>
      <ul v-if="visitorList.length !== 0" class="noti-list">
        <li
          :key="i"
          v-for="(item, i) in visitorList"
          class="clearfix"
          
        >
          <div class="v_card_title">
            <span class="title">{{item.applicantName}}提交的申请</span>
            <span style="flex:1;color:#666;font-size:16px">{{ item.applicationTime}}</span>
          </div>
          <div>
            访客姓名:
            <span>{{item.visitorName}}</span>
          </div>
          <div>
              访客类型:
              <span>{{item.visitType === '0'?'校内访客':'校外访客'}}</span>              
          </div>
          <div class="content-pos" @click="()=>$router.push({name:'VisitorApproval',params:{id:item.id}})">
            <img style="width: 0.3375rem; height: 0.625rem;" class="more" src="../../assets/icon/left.png" alt>
          </div>
          <div>开始时间：{{ item.visitStartTime.substr(0,16)}}</div>
          <div>结束时间：{{ item.visitEndTime.substr(0,16)}}</div>
          <div >
            审核状态：
            <span v-if="item.approvalStatus === '0'" style="color:red;">待审批</span>
            <span v-else>已审批</span>
            <div style="float:right" v-if="userInfo.Duty==='studentDuty'&&item.approvalStatus === '0'" @click="listdelete(item.id)">撤销</div>
          </div>
        </li>
      </ul>
      
      
      <!-- <no-data :visible="visitorList.length === 0"></no-data> -->
    </mescroll-vue>

    <actionsheet
      v-model="actionshow"
      :menus="actionmenu"
      theme="android"
      @on-click-menu="actionclick"
      >
    </actionsheet>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import _ from "lodash";
import { Search, CellBox, FormPreview, Group,Tab, TabItem ,Actionsheet} from "vux";
import MescrollVue from "mescroll.js/mescroll.vue"; 
import NoData from "@/components/NoData.vue";
import Plus from "@/components/Plus.vue";

import { getVisitorList,deleteVisitLog } from "@/service";

export default {
  data() {
    return {
      actionshow:false,
      actionmenu:{
        1:'同学互访',
        2:'校外来访'
      },
      i: 0,
      meScroll: {},
      visitorList: [],
      status: 0,
      keyword:'',
      up: {
        use: true,
        auto: true,
        isBounce: false,
        callback: this.upCallBack,
        page: {
          num: 0,
          size: 10
        }
      },
      down: {
        use: false
      }
    };
  },
  components: {
    Search,
    CellBox,
    FormPreview,
    Group,
    NoData,
    MescrollVue,
    Tab, TabItem ,
    Plus,Actionsheet
  },
  mounted() {
    //this.userInfo.UserId
  },
  computed: {
    ...mapGetters(["userInfo"]),
    tabItems: () => {
      return ["待审批","已审批" ];
    }
  },
  methods: {
    initCallBack(mescroll) {
      this.meScroll = mescroll;
    },
    upCallBack() {
      this.getList(this.up.page, this.status);
    },
    search(){
      //搜索不起作用
      // getVisitorList({ ApprovalStatus: this.status,keyword: this.keyword}).then(res => {  
      //   console.log(res);
      //   this.visitorList = res.data.data;
      //   this.meScroll.endSuccess(10, this.visitorList.length === 10);
      // });
    },
    async listdelete(id){
      try{
         let d = await deleteVisitLog(id)
        //  console.log(d)
          this.up.page.num = 1;
          this.upCallBack()

      }catch(err){
        console.log(err)
       this.$vux.toast.show({
          text: '撤销失败',
          type: "success",
          width:'80%'})
        this.upCallBack()
      }
      
       
       
    },

    getList(page,status) {
      //没有分页
      getVisitorList({ApprovalStatus: status }).then(res => {
        // console.log(res);
        this.visitorList = res.data.rows;
        this.meScroll.endSuccess(10, this.visitorList.length === 10);
      });
    },

    toggleList(index) {
      this.up.page.num = 1;
      this.status = index;
      this.i = index
      this.getList(this.up.page, this.status);
    },
    apply(){
     this.actionshow = true
    },
    actionclick(key){
      // console.log(key)
      if(key == 1){
        this.$router.push('/visitorInSchool')
      }else{
        this.$router.push('/Visitoroutschool')
      }

    }
  }
};
</script>
<style lang="less" scoped>
.visitorList {
  background: #f0f0f0;
  position: relative;
  .select {
    position: fixed;
    top: 0;
    right: 0;
    z-index: 999;
    height: 46px;
    padding: 16px 10px 0 0;
    color: rgba(255, 255, 255, 1);
  }
  .search {
    position: fixed;
    top: 46px;
    left: 0;
    height: 50px;
    width: 100%;
    display: flex;
    padding: 10px 0;
    background: #fff;
    z-index: 10;

    justify-content: center;
    & input[type="search"] {
      width: 70%;
      padding-left: 5px;
      height: 30px;
      line-height: 30px;
      background: #eeeeee;
      border: 1px solid #ccc;
      border-radius: 5px;
    }
    & button {
      background: none;
      padding-left: 20px;
      border: none;
      height: 100%;
      line-height: 30px;
    }
  }
  .mescroll {
    position: fixed;
    top: 44px;
    bottom: 0;
    height: auto;
  }
  
  .noti-list {
    border-top: 1px solid #dcdcdc;
    width: 100%;
    li {
      color: #333;
      background: #fff;
      position: relative;
      width: 100%;
      padding: 10px 15px;
      border-bottom: 1px solid #dcdcdc;
      margin-bottom: 10px;
    }
    div {
      padding: 1px;
      font-size: 13px;
      color: #666;
    }
    .v_card_title {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .title {
      flex: 1;
      font-size: 16px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      color: #1a1a1a;
    }
  }
  .content-pos {
    position: absolute;
    right: 20px;
    top: 80px;   
    text-align: center;
    vertical-align: middle;   
    padding: 10px 20px 0px 20px;
    img {
      width: 0.4375rem;
      height: 0.625rem;
    }
  }
}
</style>

