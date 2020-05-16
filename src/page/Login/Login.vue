<template>
  <div>
    <div class="login-wrapper">
      <div class="login-header"></div>
      <div class="login-form">
        <!-- <div class="form-item">
          <img class="icon" src="@/assets/icon/yonghu.png" />
          <select v-model="loginInfo.belongSchool">
            <option v-for="(item, i) in schoolList" :key="i" :value="item.schoolCode" selected="">{{item.schoolName}}</option>
          </select>
        </div>-->
        <div class="form-item">
          <img class="icon" src="@/assets/icon/user.png">
          <input
            type="text"
            v-model="loginInfo.username"
            @change="changeCode"
            placeholder="请输入登陆账号"
          >
        </div>
        <div class="form-item">
          <img class="icon" src="@/assets/icon/password.png">
          <input type="password" v-model="loginInfo.password" placeholder="请输入密码">
        </div>
        <!--<div class="form-item code">
          <img class="icon" src="@/assets/icon/mima.png">
          <input v-model="loginInfo.code" placeholder="请输入验证码">
          <img @click="changeCode" class="code" :src="codeSrc">
        </div>-->
        <div class="forget-password">忘记密码</div>
        <div class="login-button">
          <x-button :show-loading="loginLoading" @click.native="login">登录</x-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { XButton, AlertModule } from "vux";
import { mapActions, mapGetters } from "vuex";
import { getSchoolList ,IsClass} from "@/service";
export default {
  data() {
    return {
      loading: false,
      loginInfo: {
        username: "",
        password: "",
        code: "",
        belongSchool: "NanHangAccept"
      },
      schoolList: [],
      codeSrc: `${this.GLOBAL.API_HOST}/Login/GetAuthCode`
    };
  },
  computed: {
    ...mapGetters(["loginLoading"])
  },
  mounted() {
    this.changeCode();
    // this.getSchool()
    // if(navigator.userAgent.indexOf("Android") > -1 || navigator.userAgent.indexOf("iOS") > -1){
    //   this.showMessage();
    // }
  },
  components: {
    XButton,
    AlertModule 
  },
  methods: {
    ...mapActions(["Login"]),
    showMessage() {
      // 显示
      AlertModule .show({
        title: "提示",
        content: "登陆信息超时，请关闭页面后重新进入！",
       
      });
    },
    getSchool() {
      getSchoolList().then(res => {
        this.schoolList = res.data;
        this.schoolList.unshift({
          schoolName: "请选择所属学校",
          schoolCode: ""
        });

        /* mock */
        //        this.schoolList = res.data.data
      });
    },
    changeCode() {
      this.codeSrc = `${
        this.GLOBAL.API_HOST
      }/Login/GetAuthCode?time=${Math.random()}`;
    },
    login() {
      const { username, password, code, belongSchool } = this.loginInfo;
      if (!username) {
        this.$vux.toast.show({
          text: "请输入用户名",
          type: "warn"
        });
        return;
      }
      if (!password) {
        this.$vux.toast.show({
          text: "请输入密码",
          type: "warn"
        });
        return;
      }
      /**if (!code) {
        this.$vux.toast.show({
          text: "请输入验证码",
          type: "warn"
        });
        return;
      }*/
      if (!belongSchool) {
        this.$vux.toast.show({
          text: "请选择所属学校",
          type: "warn"
        });
        return;
      }
      this.loginInfo.username = username.trim()
      this.loading = true;
      this.Login(this.loginInfo)
        .then((res) => {
          switch (res.data.data){
            case 'studentDuty':this.$router.push({ name: "Homepage" });break;
            case 'suguanDuty':this.$router.push({ name: "HomepageDormitory" });break;
            case 'teacherDuty':
              this.$router.push({ name: "newHomepage" });
              break;
           
            default:
              this.$router.push({name:'newHomepage'}) 
              break;
          }
          this.loading = false;
        }).catch(err => {
          // console.log(err)
          this.$vux.toast.show({
            text:err.message,
            type:'text',
            width:'80%'
          })
          this.loading = false;
        });
    },

  }
};
</script>

<style lang="less" scoped>
.login-wrapper {
  margin-top: -46px;
  .login-header {
    background-repeat: no-repeat;
    background-image: url("./../../assets/login-bg.png");
    height: 5.6rem;
    background-size: cover;
    width: 100%;
    background-position: top center;
  }
  .login-form {
    width: 80%;
    margin: 0 auto;
    .form-item {
      border-bottom: 1px solid #dcdcdc;
      input,
      select {
        border: none;
        margin-bottom: 2px;
        height: 1.5rem;
        width: calc(~"100% - 50px");
        background: #ffffff;
      }
      &.code {
        input {
          width: calc(~"100% - 150px");
        }
      }
      img.code {
        float: right;
        margin-top: 0.45rem;
      }
      img.icon {
        width: 0.45rem;
        vertical-align: middle;
        margin-right: 15px;
      }
    }
    .forget-password {
      text-align: right;
      color: #969696;
    }
    .login-button {
      margin-top: 20px;
      button {
        background: #5ccae6;
        color: #ffffff;
      }
    }
  }
}
</style>
