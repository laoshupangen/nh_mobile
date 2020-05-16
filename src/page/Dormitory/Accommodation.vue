<template>
  <div>
    <group v-if="approvalStatus==='0'" gutter="0">
      <cell v-model="name" title="姓名"></cell>
      <cell v-model="department" title="院系"></cell>
      <cell v-model="dormitory" title="宿舍"></cell>
      <cell v-model="startTime" title="入住时间"></cell>
      <cell v-model="endTime" title="毕业时间"></cell>
      <cell v-model="dormitory2" title="调入宿舍" @click.native="show=!show"></cell>

      <x-switch title="交换物品" v-model="isHandOver"></x-switch>
      <cell v-model="toWho" title="审批人"></cell>
    </group>
    <!-- <div v-transfer-dom> -->

    <!-- </div> -->

    <x-button
      v-if="approvalStatus==='0'"
      style="marginTop:30px;width:80%;background:#2eb1fd"
      type="primary"
      :showLoading="loading"
      @click.native="submit"
    >提交</x-button>

    <popup v-show="show">
      <div class="popup-header">
          选择宿舍
          <span class="popup-close" @click="close">
            <x-icon type="ios-close-empty"></x-icon>
          </span>
        </div>
      <draw :dataSource="testdata" v-model="value"></draw>
    </popup>
    <!-- <transition name="fade">
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
            <div>
              申请类型:
              <span>调宿申请</span>
            </div>
            <div>
              审批人:
              <span>{{toWho}}</span>
            </div>
          </div>
        </div>
      </div>
    </transition> -->
  </div>
</template>
<script>
import { Group, Cell, XSwitch, XButton, Icon, Popup } from "vux";

import Draw from "@/components/PopupSelect/Draw";
import {
  applyForDormExchange,
  getCurrentStudentInfo,
  getCampus
} from "@/service";
const data = [
  {
    value: "1栋",
    children: [
      {
        value: "一层",
        children: [
          { key: "174d323d-f84e-4374-a91b-2d24b8a1300e", value: "104" },
          { key: "2F06E2142F334D2C942686199E5C0366", value: "105" }
        ]
      },
      {
        value: "二层",
        children: [
          { key: "274d323d-f84e-4374-a91b-2d24b8a1300e", value: "201" },
          { key: "3F06E2142F334D2C942686199E5C0366", value: "202" }
        ]
      }
    ]
  },
  {
    value: "2栋",
    children: [
      {
        value: "二层",
        children: [
          { key: "3539D57E5C93420090B739060FA78FAC", value: "104" },
          { key: "4539D57E5C93420090B739060FA78FAC", value: "105" }
        ]
      }
    ]
  }
];
const idata = [{ value: "南湖校区", children: data },{ value: "后湖校区", children: data }];
export default {
  data() {
    return {
      testdata: idata,
      name: "",
      department: "",
      dormitory: "",
      startTime: "",
      endTime: "",
      dormitory2: "",
      isHandOver: false,
      toWho: "宿管",
      loading: false,
      approvalStatus: "0",
      disabled: false,
      value: {},
      show: false
    };
  },
  watch: {
    value(n, o) {
      console.log(n);
      if(n){
        this.show = false
      }
      this.dormitory2 =  n.value;
    }
    // isHandOver(n,o){
    //   if(n){
    //     this.show = false
    //   }
    // }
  },
  components: {
    Group,
    Cell,
    XButton,
    XSwitch,
    Icon,
    Popup,
    Draw
  },
  methods: {
    async submit() {
      this.loading = true;
      await applyForDormExchange({
        targetRoomId: "3539D57E5C93420090B739060FA78FAC"
      });
      this.approvalStatus = "1";
      this.disabled = true;
      this.loading = false;
    },
    close() {
      this.show = false;
    }
  },
  mounted() {
    // getCurrentStudentInfo().then(res => {
    //   this.name = res.data.name;
    //   this.department = res.data.collegeName + "/" + res.data.className;
    //   this.dormitory = res.data.roomName;
    //   this.startTime = res.data.startTime ? res.data.startTime : "无数据";
    //   this.endTime = res.data.graduationTime
    //     ? res.data.graduationTime
    //     : "无数据";
    // });
    // getCampus({ keyword: "" }).then(res => {
    //   console.log(res);
    // });
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
.popup-header {
  padding: 5px 0;
  text-align: center;
  border-top-right-radius: 5px;
  border-top-left-radius: 5px;
  border-bottom: 1px solid #ccc;
  font-size: initial;
}
.popup-close {
  float: right;
}
</style>

