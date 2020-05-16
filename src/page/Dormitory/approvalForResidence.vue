<template>
  <div>
    <group v-if="approvalStatus==='0'" gutter="0">
      <cell v-model="name" title="姓名"></cell>
      <cell v-model="department" title="院系"></cell>
      <cell v-model="dormitory" title="宿舍"></cell>
      <cell v-model="startTime" title="入住时间"></cell>
      <cell v-model="endTime" title="毕业时间"></cell>
      <cell v-model="applicationTime" title="退宿时间"></cell>
      <cell v-model="isHandOver" title="上交物品"></cell>
      <cell v-model="toWho" title="审批人"></cell>
      <popup-radio title="审批意见" v-model="isOk" :options="options"></popup-radio>
      <x-textarea title="备注" :max="20"  v-model="others"></x-textarea>
    </group>
    <x-button
      v-if="approvalStatus==='0'"
      style="marginTop:30px;width:80%"
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
        <div class="util">退宿申请{{approvalStatus}},当前处于{{approvalStatus}}状态</div>
        <div class="utilcard">
            <div class="card">
                <div>申请类型:<span>退宿申请</span></div>
                <div>申请时间:<span>{{applicationTime}}</span></div>
                <div>审批人:<span>{{toWho}}</span></div>
            </div>
        </div>
      </div>
    </transition>
  </div>
</template>
<script>
import { Group, Cell, XSwitch, XButton, Icon ,PopupRadio,XTextarea } from "vux";

export default {
  data() {
    return {
      name: "",
      department: "经济管理学院/会记专业/2019203",
      dormitory: "",
      startTime: "",
      endTime: "",
      applicationTime: "",
      isHandOver: '是',
      toWho: "",
      loading: false,
      approvalStatus: "0",
      disabled: false,
      isOk:'',
      options:['同意','不同意'],
      others:''
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

      this.approvalStatus = "1";
      this.disabled = true;
      this.loading = false;
    }
  },
  mounted() {}
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

