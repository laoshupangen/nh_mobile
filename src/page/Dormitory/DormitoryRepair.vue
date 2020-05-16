<template>
  <div>
    <group v-if="approvalStatus==='0'" gutter="0">
      <cell v-model="name" title="姓名"></cell>
      <cell v-model="department" title="院系"></cell>
      <cell v-model="dormitory" title="宿舍"></cell>
      <datetime v-model="applicationTime" format="YYYY-MM-DD HH:mm" title="报修时间" :startDate="today"></datetime>
      <x-textarea v-model="repaire" title="报修内容" placeholder="请输入报修内容" style="display:block"></x-textarea>
      <cell v-model="toWho" title="审批人"></cell>
    </group>
    <x-button
      v-if="approvalStatus==='0'"
      style="marginTop:30px;width:80%;background:#2eb1fd"
      type="primary"
      :disabled="!repaire"
      :showLoading="loading"
      @click.native="submit"
    >提交</x-button>
    <transition name="fade">
      <div class="utilWrap" v-if="approvalStatus!=='0'">
        <div class="util" v-if="approvalStatus==='1'">
          <icon type="success" is-msg></icon>
        </div>
        <div class="util">报修申请已提交</div>
        <div class="utilcard">
            <div class="card">
                <div>类型:<span>报修申请</span></div>
                <div>申请时间:<span>{{applicationTime}}</span></div>
                <div>审批人:<span>{{toWho}}</span></div>
            </div>
        </div>
      </div>
    </transition>
  </div>
</template>
<script>
import { Group, Cell, XSwitch, XButton, Icon ,Datetime,XTextarea} from "vux";
import moment from "moment";
import {applyForRepair,getCurrentStudentInfo} from '@/service'
export default {
  data() {
    return {
      name: "",
      department: "",
      dormitory: "",
      today:moment().format('YYYY-MM-DD'),
      applicationTime: moment().format('YYYY-MM-DD HH:mm'),
      repaire:'',
      isHandOver: ["0", "1"],
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
    Datetime,
    XTextarea
  },
  computed:{
    
  },
  methods: {
    async submit() {
      this.loading = true;
      //description
      await applyForRepair({description:this.repaire})
      this.approvalStatus = "1";
      this.disabled = true;
      this.loading = false;
    }
  },
  mounted() {
    getCurrentStudentInfo().then(res=>{
      this.name = res.data.name
      this.department =res.data.collegeName +'/'+ res.data.className
      this.dormitory = res.data.roomName
      
    })
  }
};
</script>
<style scoped>
.utilWrap{
    padding: 10px 0;
    font-size: .5rem;
    color:#ccc;
}
.util {
  text-align: center;
  padding: 5px 0;
}
.utilcard{
    margin: auto;
    width: 80%;
    box-shadow: 0 0 5px 2px #ccc;
}
.utilcard .card{
    margin-top: 10px;
   padding: 0 10px;
   color: #666;
   font-size: initial;

}
.utilcard .card span{
    float: right;
}
</style>

