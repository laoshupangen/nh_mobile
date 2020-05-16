<template>
  <div>
    <group v-if="approvalStatus==='0'" gutter="0">
      <cell v-model="data.studentName" title="姓名"></cell>
      <cell v-model="data.campusName" title="院系"></cell>
      <cell v-if="data.originRoomName" v-model="data.originRoomName" title="宿舍"></cell>
      <cell v-model="data.roomName" title="宿舍"></cell>
      <cell v-if="data.checkinTime" v-model="data.checkinTime" title="入住时间"></cell>
      <cell v-if="data.graduateTime" v-model="data.graduateTime" title="毕业时间"></cell>
      <!-- <cell title="入住通知单"></cell> -->
      <cell v-model="parseTime" :title="applyTypeTitle"></cell>
      <cell v-if="data.targetRoomName" v-model="data.targetRoomName" :title="applyTypeDor"></cell>
      <cell v-if="data.reason" v-model="reason" :title="applyTypeWupin"></cell>
      <x-textarea v-if="data.restoreMessage" title="报修信息" v-model="opinions" style="display:block"></x-textarea>
      <popup-radio title="审批意见" v-model="status" :options="options"></popup-radio>
      <x-textarea title="备注" v-model="opinions" style="display:block"></x-textarea>
    </group>
    <x-button
      v-if="approvalStatus==='0'"
      style="marginTop:20px;width:80%;background:#2eb1fd"
      type="primary"
      :showLoading="loading"
      @click.native="submit"
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
        <div class="util">调宿申请已提交</div>
        <div class="utilcard">
            <div class="card">
                <div>申请类型:<span>调宿申请</span></div>
                <div>申请时间:<span>{{applicationTime}}</span></div>
                <div>审批人:<span>{{toWho}}</span></div>
            </div>
        </div>
      </div>
    </transition>
  </div>
</template>
<script>
import moment from "moment";
import { Group, Cell, XSwitch, XButton, Icon ,PopupRadio,XTextarea} from "vux";
import {approvalForCheckOut,approvalForRepair,approvalForCheckin,approvalForDormExchange} from '@/service'
export default {
  data() {
    return {
     parseTime:'',
      loading: false,
      approvalStatus: "0",
      disabled: false,
      applyTypeDor:'宿舍',
      applyTypeTitle:'申请时间',
      applyTypeWupin:'领取物品',
      status:1,
      options:[{key:1,value:'同意'},{key:2,value:'不同意'}],
      opinions:'',
      data:'',
      reason:'是'
    };
  },
  components: {
    Group,
    Cell,
    XButton,
    XSwitch,
    Icon,
    PopupRadio,
    XTextarea
  },
  methods: {
    async submit() {
      this.loading = true;
      let type = this.$route.params.applyType
      let id = this.$route.params.data.id
      let status = this.status
      let approvalOpinions = this.opinions
      try{
          switch(type){
              case '1':
                  await approvalForCheckOut({applyId:id,status,approvalOpinions})
                  
                  break;
              case '2':
                  await approvalForRepair({id:id,message})
                  break;
              case '3':
                  await approvalForCheckin({applyId:id,status,approvalOpinions})
                  break;
              case '4':
                  await approvalForDormExchange({applyId:id,status,approvalOpinions})
                  break;
    
          }
          this.loading = false;
          
          this.$vux.toast.show({text:'处理成功!'})
          this.$router.push('/School')

      }catch(err){
        this.loading = false;
          this.$vux.toast.show({text:'处理成功!'})
          this.$router.push('/School')
      }

    //   this.approvalStatus = "1";
    //   this.disabled = true;
      
    },
    init(){
        let type = this.$route.params.applyType
        switch(type){
            case '1':this.applyTypeTitle = '退宿时间'
               this.applyTypeWupin = '是否移交物品'
                break;
            case '4':
               this.applyTypeDor = '目标宿舍'
               
               this.applyTypeWupin = '是否移交物品'
                break;
        }
    }
  },
  mounted() {
    this.init()
    console.log(this.$route)
    this.data = this.$route.params.data
    this.parseTime =moment(this.data.createOn).format('YYYY-MM-DD HH:mm')
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

