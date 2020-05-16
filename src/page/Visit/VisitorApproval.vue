<template>
  <div class="visitorapproval">
   <mescroll-vue id="mescroll" class="mescroll-scroll" :up="up" :down="down">
    <group gutter="0">
      <cell title="被访问人" v-model="visitor.applicantName"></cell>      
      <cell title="访客类型" :value="visitor.visitType === '0'?'校内访客':'校外访客'"></cell>
      <cell title="访客姓名" v-model="visitor.visitorName"></cell>
      <cell title="申请时间" v-model="visitor.createdTime"></cell>
      <cell title="开始时间" v-model="visitor.visitStartTime"></cell>
      <cell title="结束时间"  v-model="visitor.visitEndTime"></cell>
      <cell title="身份证" v-show="visitor.visitorIDCard && visitor.visitType === '1'" v-model="visitor.visitorIDCard"></cell>
      <cell title="关系" v-show="visitor.relationship && visitor.visitType === '1'" v-model="visitor.relationship"></cell>
      <!-- <div style="padding:5px 10px;">        
        <img :src="visitor.imgUrl" alt="" style="width:80px;height:100px;">
      </div> -->
      <!-- v-show="visitor.visitReason" -->
      <x-textarea v-show="visitor.visitType === '1'" :height=40 style="display:block;" v-model="visitor.visitReason" readonly>
        <div slot="label" style="color:#333;">事由</div>
      </x-textarea>
    
      <div style="height:5px;background:#f0f0f0;"></div>

      <div v-if="userInfo.Duty === 'studentDuty'">
        <cell v-if="visitor.approvalStatus ==='1'" title="审核结果" :value="visitor.result === '1'?'通过':'不通过'"></cell>
        <cell v-else title="审核状态" :value="visitor.approvalStatus === '0'?'待审批':'已审核'"></cell>
        <x-textarea v-show="visitor.approvalStatus ==='1'&&visitor.result !== '1'" readonly style="display:block;" v-model="visitor.opinion">
        <div slot="label" style="color:#333;">审批意见</div>
       </x-textarea>
      </div>
      <div v-else>
        <popup-radio v-if="visitor.approvalStatus ==='0'" title="访客审核"  :options="check_options"  v-model="option" ></popup-radio>
        <cell v-if="visitor.approvalStatus ==='1'" title="审核结果" :value="visitor.result === '1'?'通过':'不通过'"></cell>

        <x-textarea v-show="option === '1'" placeholder="请输入您的审批意见" style="display:block;" v-model="visitor.opinion">
          <div slot="label" style="color:#333;">审批意见</div>
        </x-textarea>
       <!--  -->
        <x-textarea v-show="visitor.approvalStatus === '1'&&visitor.result!=='1'" readonly style="display:block;" v-model="visitor.opinion">
          <div slot="label" style="color:#333;">审批意见</div>
        </x-textarea>
        
      </div>
    </group> 
    <!--  -->
    <div v-show="userInfo.Duty==='teacherDuty'||userInfo.Duty === 'suguanDuty'&& visitor.approvalStatus ==='0'" class="btn-wrap">
      <x-button :showLoading="isSubmit" @click.native="submit">提交</x-button>
    </div>
   </mescroll-vue>
  </div>
</template>
<style lang="less" >
.visitorapproval {
  background: #f0f0f0;  

  & .weui-cell:before {
    left: 0 !important;
  }

  & .btn-wrap {
    margin-top: 20px;
    padding: 0 10px;
    & button {
      color: #ffffff;
    }
  }
}
</style>
<script>
import { mapGetters } from "vuex";
import { Group, PopupRadio ,XButton, XInput, XTextarea, Cell } from "vux";
import {ApprovalStatus,getVisitorDetail} from "@/service"
import MescrollVue from "mescroll.js/mescroll.vue";

export default {
  data() {
    return {
      up: {
        use: false,        
        isBounce: false,
       
      },
      down: {
        use: false
      },
      visitor:{},
      option:'0',
      check_options:[{key:'0',value:'通过'},{key:'1',value:'不通过'}],
      isSubmit:false
      
    };
  },
  components: {
    XTextarea,
    XInput,
    XButton,
    Group,
    Cell,
    PopupRadio,
    MescrollVue
  },
  methods: {
    submit(){
      this.isSubmit = true;
      let ty = this.option === '0'?true:false;
      ApprovalStatus({
        visitId:this.visitor.id,
        IsAgreed:ty,
        Opinion:this.visitor.opinion
      }).then(res=>{
        if(res.data.state === 'success'){
          setTimeout(()=>{
                this.isSubmit = false;
                this.$router.go(-1);
              },1000)
          
        }
        
      })
    }   

  },
  computed:{
    ...mapGetters(['userInfo'])
  },
  beforeRouteLeave(to,from,next){
    console.log(this.isSubmit)
    if(this.isSubmit){
      to.meta.keepAlive = false;
    }else{
      to.meta.keepAlive = true;
    }
    next()
  },
  mounted(){    
    getVisitorDetail(this.$route.params.id).then(res=>{
      console.log(res.data)
      this.visitor = res.data.data      
      this.visitor.visitStartTime = res.data.data.visitStartTime.substr(0,16)
      this.visitor.visitEndTime = res.data.data.visitEndTime.substr(0,16)     
            
    })


  }
};
</script>

