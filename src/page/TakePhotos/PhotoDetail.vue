<template>
  <div class="photoDetails">
  <mescroll-vue id="mescroll" class="mescroll-scroll" :up="up" :down="down">
    <div class="list">
      <div class="item-title">学生姓名</div>
      <div class="item-after">{{student.applierName}}</div>
    </div>
    <div class="list">
      <div class="item-title">申请时间</div>
      <div class="item-after">{{student.createdTime}}</div>
    </div>
    <div class="list">
      <div class="item-title">
        <div>原照片</div>
        <div style="width:100px;height:150px;overflow:hidden;">
          <img :src="fnGetImage(student.submitImg)" alt="old" style="display:;block">
        </div>
      </div>
      <div class="item-after">
        <div>新照片</div>
        <div style="width:100px;height:150px;overflow:hidden;">
          <img :src="fnGetImage(student.approveImg)" alt="new">
        </div>
      </div>
    </div>

    <div v-if="userInfo.Duty === 'studentDuty'">
      <div class="list">
        <div class="item-title">审批状态</div>
        <div class="item-after">{{student.result !== '1'?'通过':'不通过'}}</div>
      </div>
      <group gutter="0" v-show="student.opinion">
        <x-textarea :max="50" style="display:block;" v-model="student.opinion" readonly>
          <div slot="label" style="color:#333">理由或原因</div>
        </x-textarea>
      </group>
    </div>

    <div v-else>
      <group gutter="0" v-if="student.approvalStatus === '0'">
        <popup-radio title="审批意见" :option="option" :options="options" v-model="option"></popup-radio>
        <x-textarea
          v-show="option === 1"
          placeholder="请简要说明原因。示例:新照片与原照片明显不是同一个人"
          :height="50"
          :max="200"
          style="display:block;"
          v-model="reason"
        >
          <div slot="label" style="color:#333">理由或原因</div>
        </x-textarea>
      </group>
      <div v-else>
        <div class="list">
          <div class="item-title">审批状态</div>
          <div class="item-after">{{student.result !== '-1'?'通过':'不通过'}}</div>
        </div>
        <group gutter="0" v-show="student.opinion">
          <x-textarea
            :height="50"
            :max="200"
            style="display:block;"
            v-model="student.opinion"
            readonly
          >
            <div slot="label" style="color:#333">理由或原因</div>
          </x-textarea>
        </group>
      </div>
    
    </div>

    <!--  -->
    <div
      class="btn"
      v-show="fnCanShow()&&student.approvalStatus === '0'||student.approvalStatus === null"
    >
      <x-button :show-loading="showLoading" @click.native="fnSubmit">确认</x-button>
    </div>
  </mescroll-vue>
  </div>
</template>
<script>
import { Group, XButton, Cell, CellBox, XTextarea, PopupRadio } from "vux";
import { mapGetters, mapActions, mapMutations } from "vuex";
import { getPhotoDetails, setApprovalInfo } from "@/service";
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
      student: {},
      showLoading: false,
      reason: "",
      option: 0,
      options: [
        {
          key: 0,
          value: "通过"
        },
        {
          key: 1,
          value: "不通过"
        }
      ],
      isSubmit: false
    };
  },
  computed: {
    ...mapGetters(["userInfo"])
  },
  methods: {
    fnSubmit() {
      if (!this.reason && this.option === 1) {
        this.$vux.toast.show({
          text: "请简单说明原因",
          type: "warn"
        });
        return;
      }
      //
      this.showLoading = true;
      setTimeout(this.setSubmit(),3000)      
    },
    setSubmit() {
      let k = this.option === 0 ? true : false;
      setApprovalInfo({
        CurrentUserId: this.userInfo.UserId,
        OrderId: this.student.id,
        IsAgreed: k,
        Opinion: this.reason
      }).then(res => {
         if (!res) {
              this.$vux.toast.show({
                text: "无响应",
                type: "warn"
              });
              return;
            }
            if (res.data.state === "success") {
              this.$vux.toast.show({
                text: "已提交",
                type: "success"
              });
              this.$router.replace("/PhotosList");
              this.$router.go(-1);
            } else {
              this.$vux.toast.show({
                text: "提交失败",
                type: "warn"
              });
              
            }
            this.showLoading = false;
        }).catch(err => {
          console.log(err);
          this.showLoading = false;
          this.$vux.toast.show({
            text: "提交失败",
            type: "warn"
          });
        });
    },
    fnGetImage(src) {
      if (process.env.NODE_ENV === "development") {
        return src;
      } else {
        return `${this.GLOBAL.API_HOST}/SystemManage/CurrentUser/GetImg?Url=${
          src
        }&time=${Math.random()}`;
      }
    },
    fnCanShow(){
      const {Duty} = this.userInfo
      return Duty === 'teacherDuty'||'suguanDuty'
    }
  },
  beforeRouteLeave(to, from, next) {
    
    if (!this.isSubmit) {
      to.meta.keepAlive = true;
    }else{
      to.meta.keepAlive = false;
    }
    next();
  },
  mounted() {
    // console.log(this.$route);
    getPhotoDetails({
      appId: this.$route.params.id,
      currentUserId: this.userInfo.UserId //待更改
    }).then(res => {
      console.log(res);
      this.student = res.data.data;
    });
  },
  components: {
    Cell,
    XButton,
    CellBox,
    Group,
    XTextarea,
    PopupRadio,
    MescrollVue
  }
};
</script>
<style lang="less" scoped>
.photoDetails {
  img {
    width: 100px;
    height: 150px;
    border: 1px solid #ccc;
  }
  .list {
    font-size: 17px;
    padding: 10px 15px;
    border-bottom: 1px solid #eee;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .item-after {
    color: #999;
  }
  .btn {
    padding: 0.2rem 0.75rem;
    width: 100%;
  }
  .btn button {
    /* background: -o; */
    background: -webkit-linear-gradient(
      to right,
      rgb(107, 190, 248),
      rgb(73, 131, 254)
    );
    background: linear-gradient(
      to right,
      rgb(107, 190, 248),
      rgb(73, 131, 254)
    );
    color: #fff;
  }
}
</style>


