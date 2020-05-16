<template>
<mescroll-vue id="mescroll" class="mescroll-scroll" @init="initCallBack" :up="up" :down="down">
  <ul v-if="dataList.length !== 0" >
    <li v-for="(data,index) in dataList" :key="index" @click="$router.push({name:'DomitoryDetail',params:{data:data,applyType:'1'}})">
      <div class="title">
        <span>审核状态:</span>
        <span class="status">{{data.status===0?'待审批':'已审批'}}</span>
      </div>
      <div class="info">
        <span class="date">申请时间:{{moment(data.createOn).format('YYYY-MM-DD HH:mm')}}</span>
      </div>

      <div class="info">
        <span>申请人:{{data.studentName}}</span>
      </div>
    </li>
  </ul>
  <no-data :visible="dataList.length === 0"></no-data>
</mescroll-vue>
</template>

<script>
import { checkOutPage } from "@/service";
import moment from "moment";
import MescrollVue from "mescroll.js/mescroll.vue";
import NoData from "@/components/NoData.vue";
export default {
  data() {
    return {
      meScroll: {},
      moment:moment,
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
      },
      dataList:[]
    };
  },
  methods: {
    initCallBack(mescroll) {
      this.meScroll = mescroll;
    },
    upCallBack() {
     try{
         this.getList(this.up.page, this.status);
         this.meScroll.endSuccess(15, true);
     }catch(err){
         this.meScroll.endSuccess(15, true);
     }
    },
    async getList(page,status) {
        const {data} = await checkOutPage({ status, pageSize: page.size, pageIndex: page.num})
        // console.log(data)
        this.dataList = [{id:'ddaara',studentName:'refuse',checkinTime:'2015-09-01',graduateTime:'2015-09-01',
          campusName:'数学与信息科学学院',roomName:'1栋104',parseTime:'2019-08-09',reason:'是'}]

    }
  },
  components: {
      MescrollVue,NoData
  },
  mounted() {
    // this.initCallBack()
  }
};
</script>

<style scoped>
ul {
  padding: 0 20px;
  padding-top: 15px;
}
ul li {
  border: 1px solid #ccc;
  padding: 0 15px;
  padding-top: 8px;
  box-shadow: 0 0 2px 2px #cef;
}
ul li:not(:last-child) {
  margin-bottom: 10px;
}
.title {
  padding-bottom: 5px;
  font-size: 15px;
  color: #4d4d4d;
}
.title .date {
  color: #979799;
  font-size: 12px;
  float: right;
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
</style>
