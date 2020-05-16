<template>
  <div class="details">
    <tab v-if="valueType">
      <tab-item
        :selected="index === i"
        v-for="(item,index) in tabItems"
        @on-item-click="handler"
        :key="index"
      >{{item}}</tab-item>
    </tab>
    <div v-if="loading" class="loadUtils">
      <inline-loading></inline-loading>
    </div>
    <div v-if="!loading&&data.length > 0">
      <h3>
        总计:共
        <i style="color:red">
          {{count
          }}
        </i>
        人{{tabItems[i]}}异常
      </h3>
      <div class="drawerWrap">
        <drawer v-for="(d,index) in data" :key="index" :data="d" :tabItems="tabItems[i]" @itemClick="getDetails"></drawer>
      </div>
    </div>
    <no-data :visible="!loading&&data.length === 0"></no-data>
     <x-dialog hide-on-blur v-model="showMember">
      <div class="content">
        <p style="color: #000;border-radius: 0 30px 0 0;">
          <span>{{modalHeader+tabItems[i].substr(0,tabItems[i].indexOf('人员'))}}信息</span>
        </p>
          
          
        <div class="innerContent">
          <div class="innerItem">
            <span class="t1">所属机构</span>
            <span class="t2">宿舍信息</span>
            <span class="t3">{{text[tabItems[i]]}}</span>
          </div>
            

          <div class="innerItem" v-for="(detail,i) in detailData" :key="i">
            <span class="t1">{{detail.organ.name}}</span>
            
            <span class="t2">{{detail.dorm.roomNumber}}</span>
            <span class="t3">{{detail.outTime||detail.inTime}}</span>
          </div>
        </div>
        
        <p style="border-radius: 0 0 0 30px;" @click="()=>showMember = false">关闭</p>
      </div>
    </x-dialog>
  </div>
</template>
<script>
import {
  organResultNoReturn,
  organResultLateReturn,
  organResultNoOut,
  organResultContiInOut,
  getNoreturnDetail,
  getNoLatereturnDetail
} from "@/service";
import { Tab, TabItem, InlineLoading ,XDialog} from "vux";
import Drawer from "@/components/Drawer.vue";
import NoData from "@/components/NoData.vue";
export default {
  data() {
    return {
      i: 0,
      orgId: this.$route.params.orgId,
      dateType: this.$route.params.dateType,
      valueType:true,
      data: [],
      count: null,
      loading: false,
      detailData:[],
      modalHeader:'',
      showMember:false,
      text:{
        '未归人员':'上次离开时间',
        '晚归人员':'最后进入时间'
      }
    };
  },
  components: {
    Drawer,
    Tab,
    TabItem,
    NoData,
    InlineLoading,
    XDialog
  },
  computed: {
    tabItems: () => {
      return ["未归人员", "晚归人员"];
    }
    
  },
  methods: {
    handler(index) {
      // console.log(index);
      this.i = index;
      this.loading = true;
      switch (index) {
        case 0:
          organResultNoReturn({
            orgId: this.orgId,
            dateType: this.dateType
          })
            .then(res => {
              // console.log("...", res);
              this.loading = false;
              this.data = res.data.data;
              let cmap = res.data.data.map(d => d.data.length);
              let s = cmap.reduce((pre, cur) => {
                return pre + cur;
              });
              this.count = s;
            })
            .catch(err => {
              this.loading = false;
            });

          break;
        case 1:
          organResultLateReturn({
            orgId: this.orgId,
            dateType: this.dateType
          })
            .then(res => {
              this.loading = false;
              this.data = res.data.data;
              let cmap = res.data.data.map(d => d.data.length);
              let s = cmap.reduce((pre, cur) => {
                return pre + cur;
              });
              this.count = s;
            })
            .catch(err => {
              this.loading = false;
            });
          break;
       
        case 2:
          organResultContiInOut({
            orgId: this.orgId,
            dateType: this.dateType
          })
            .then(res => {
              this.loading = false;
              this.data = res.data.data;
              let cmap = res.data.data.map(d => d.data.length);
              let s = cmap.reduce((pre, cur) => {
                return pre + cur;
              });
              this.count = s;
            })
            .catch(err => {
              this.loading = false;
            });
          break;
          
      }
    },
    async getNoReturnDetail(item){
      
      let {data} = await getNoreturnDetail({
        studentId:item.id,
        dateType:this.$route.params.dateType
      })
      this.detailData = data.data
    },
    async getNolatereturnDetail(item){
      let {data} = await getNoLatereturnDetail({
        studentId:item.id,
        dateType:this.$route.params.dateType
      })
      this.detailData = data.data
     
    },

    getDetails(item){
      // console.log('item',item)
      this.modalHeader = item.name
      switch(item.type){
        case 0:
          this.getNoReturnDetail(item)
          break;
        case 1:
          this.getNolatereturnDetail(item)
          break;
      }
      this.showMember = true
    }
  },
  mounted() {
    if(this.$route.params.valueType||this.$route.params.valueType === 0){
      console.log(this.$route.params)
      let valueType = this.$route.params.valueType
      this.valueType = false
      this.handler(valueType)
    }else{
      this.handler(0);
      this.valueType = true
    }
  }
};
</script>
<style scoped>
h3 {
  padding: 10px 20px;
  font-size: 14px;
}
.drawerWrap {
  padding: 0 20px;
}
.details .noDataState {
  top: 88px;
}
.loadUtils {
  padding: 100px 0;
  text-align: center;
}

.details .content{
  border-radius: 0 30px 0 30px;
  background: #fff;
  
}
.details .content p{
  height: 28px;
  line-height: 28px;
  background: #eee;
}
.details .content .innerContent{
  height: 200px;
  overflow: auto;

}
.innerItem{
  border-bottom: 1px solid #eee;
}
.details .content .innerContent span{
  display: inline-block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: left;
}
.t1{
width: 50px;
}
.t2{
width:50px;
}
.t3{
width:130px;
}
</style>
<style>
.details .weui-dialog {
  background: none !important;
}

</style>

