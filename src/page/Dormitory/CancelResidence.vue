<template>
  <div>
    <group v-if="approvalStatus==='0'" gutter="0">
      <cell v-model="name" title="姓名"></cell>
      <cell v-model="department" title="院系"></cell>
      <cell v-model="dormitory" title="宿舍"></cell>
      <cell v-model="startTime" title="入住时间"></cell>
      <cell v-model="endTime" title="毕业时间"></cell>
      <datetime v-model="applicationTime" format="YYYY-MM-DD HH:mm" title="退宿时间"></datetime>
      <x-switch title="上交物品" :disabled="approvalStatus!=='0'" v-model="reason" :value-map="isHandOver"></x-switch>
      <cell v-model="toWho" title="审批人"></cell>
    </group>
    <x-button
      v-if="approvalStatus==='0'"
      style="marginTop:30px;width:80%;background:#2eb1fd;"
      type="primary"
      :showLoading="loading"
      @click.native="submit"
      :disabled="reason==='未上交'"  
    >提交</x-button>
    <transition name="fade">
      <div class="utilWrap" v-if="approvalStatus!=='0'">
        <div class="util" v-if="approvalStatus==='1'">
          <icon type="waiting" is-msg></icon>
        </div>
        <div class="util" v-if="approvalStatus==='2'">
          <icon type="success" is-msg></icon>
        </div>
        <div class="util" v-if="approvalStatus==='3'">
          <icon type="warn" is-msg></icon>
        </div>
        <div class="util">当前处于{{curState}}状态</div>
        <div class="utilcard">
          <div class="card">
            <div>
              申请类型:
              <span>退宿申请</span>
            </div>
            <div>
              申请时间:
              <span>{{applicationTime}}</span>
            </div>
            <div>
              审批人:
              <span>{{toWho}}</span>
            </div>
          </div>
        </div>
        <div class="utilLink"><a @click="approvalStatus='0'">回到申请页</a></div>
      </div>
    </transition>
  </div>
</template>
<script>
import { Group, Cell, XSwitch, XButton, Icon, Datetime } from "vux";
import {applyForCheckOut,getCurrentStudentInfo} from '@/service'
import moment from "moment";
export default {
  data() {
    return {
      isHandOver:['未上交','上交'],
      name: "",
      department: "",
      dormitory: "",
      startTime: "",
      endTime: "",
      applicationTime: moment().format("YYYY-MM-DD HH:mm"),
      
      reason:'未上交',
      toWho: "宿管",
      loading: false,
      approvalStatus: "0",
      disabled: false
    };
  },
  components: {
    Group,
    Cell,
    XButton,
    XSwitch,
    Icon,
    Datetime
  },
  computed:{
    curState:function(){
      switch(this.approvalStatus){
        case '1':return '正在审批';
        case '2':return '通过';
        case '3':return '未通过'
      }
    }
  },
  created() {
   
    
  },
  methods: {
   
    async submit() {
      this.loading = true;
      console.log(this.reason)
      await applyForCheckOut({reason:this.reason})


      this.approvalStatus = "1";  
     
      this.loading = false;
    },
    getCheckoutApply() {
      applyForCheckOut({reason:'false'}).then(res=>{
        console.log(res)
      })
    }
  },
  mounted() {
    getCurrentStudentInfo().then(res=>{
      this.name = res.data.name
      this.department =res.data.collegeName +'/'+ res.data.className
      this.dormitory = res.data.roomName
      this.startTime = res.data.startTime?res.data.startTime:'无数据'
      this.endTime = res.data.graduationTime?res.data.graduationTime:'无数据'
      
    })
  }
};
</script>
<style scoped>
.utilWrap {
  padding: 10px 0;
  font-size: 0.5rem;
  color: #ccc;
}
.util {
  text-align: center;
  padding: 5px 0;
}
.utilcard {
  margin: auto;
  width: 80%;
  box-shadow: 0 0 5px 2px #ccc;
}
.utilcard .card {
  margin-top: 10px;
  padding: 0 10px;
  color: #666;
  font-size: initial;
}
.utilcard .card span {
  float: right;
}
.utilLink{
  color: initial;
  font-size: initial;
  text-align: right;
  padding: 10px;

}
</style>

