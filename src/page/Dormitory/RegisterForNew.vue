<template>
  <div>
    <group v-if="approvalStatus==='0'" gutter="0">
      <cell v-model="name" title="姓名"></cell>
      <cell v-model="department" title="院系"></cell>
      <cell v-model="dormitory" title="宿舍"></cell>
      <cell v-model="startTime" title="入住时间"></cell>
      <cell v-model="endTime" title="毕业时间"></cell>
      <uploader
        :upload-url="`${GLOBAL.API_HOST}/File/FileUpload`"
        :showNames="false"
        v-model="pic"
        title="入住通知单"
        :max="1"
      />
      <x-switch title="领取物品" :disabled="approvalStatus!=='0'" v-model="reason"></x-switch>
      <cell v-model="toWho" title="审批人"></cell>
    </group>
    <x-button
      v-if="approvalStatus==='0'"
      style="marginTop:30px;width:80%;background:#2eb1fd"
      type="primary"
      :disabled="reason===false||pic.length===0"
      :showLoading="loading"
      @click.native="submit"
    >提交</x-button>
    <transition name="fade">
      <div class="utilWrap" v-if="approvalStatus!=='0'">
        <div class="util" v-if="approvalStatus==='1'">
          <icon type="success" is-msg></icon>
        </div>

        <div class="util">入住已登记</div>
        <div class="utilcard">
          <div class="card">
            <div>
              类型:
              <span>入住登记</span>
            </div>
            <div>
              审批人:
              <span>{{toWho}}</span>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>
<script>
import { Group, Cell, XSwitch, XButton, Icon } from "vux";
import { applyForCheckin, getCurrentStudentInfo } from "@/service";
import Uploader from "@/components/Uploader/Uploader";
export default {
  data() {
    return {
      name: "",
      department: "",
      dormitory: "",
      startTime: "",
      endTime: "",
      toWho: "宿管",
      loading: false,
      approvalStatus: "0",
      disabled: false,
      pic: [],
      reason: false
    };
  },
  components: {
    Group,
    Cell,
    XButton,
    XSwitch,
    Icon,
    Uploader
  },
  methods: {
    async submit() {
      let filePath = this.pic[0].response.url;
      this.loading = true;
      await applyForCheckin({
        noticeFilePath: filePath,
        goodsReceived: this.reason
      });
      this.approvalStatus = "1";
      this.disabled = true;
      this.loading = false;
    },
    async getCurrentStudentInfo() {
      try {
        let res = await getCurrentStudentInfo();
        this.name = res.data.name;
        this.department = res.data.collegeName + "/" + res.data.className;
        this.dormitory = res.data.roomName;
        this.startTime = res.data.startTime ? res.data.startTime : "无数据";
        this.endTime = res.data.graduationTime
          ? res.data.graduationTime
          : "无数据";
      } catch (err) {}
    }
  },
  mounted() {
    this.getCurrentStudentInfo();
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
</style>

