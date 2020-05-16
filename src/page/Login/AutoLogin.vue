<template></template>

<script>
import { mapActions, mapGetters } from "vuex";
export default {
  data() {
    return {
      loginInfo: {
        uid: "",
        time: "",
        signtext: "",
      }
    };
  },
  computed: {
    ...mapGetters(["loginLoading"])
  },
  mounted() {
    var Request = this.getUrlParam();
    var account = Request.uid;
    if (account) {
      this.loginInfo.uid = account.indexOf("%40")
        ? account.replace("%40", "@")
        : account;
    }
    this.loginInfo.time =  Request.time;
    this.loginInfo.signtext = Request.signtext

    this.login();
  },
  components: {},
  methods: {
    ...mapActions(["AutoLogin"]),
    login() {
      this.AutoLogin(this.loginInfo)
        .then((res) => {
          switch (res.data.data){
            case 'studentDuty':this.$router.push({ name: "Homepage" });break;
            case 'suguanDuty':this.$router.push({ name: "HomepageDormitory" });break;
            case 'teacherDuty':
              this.$router.push({ name: "newHomepage" });
              
              break;
            default:this.$router.push({ name: "newHomepage" });break;
          }
          // this.$router.push({ name: "School" });
        })
        .catch(err => {
          this.$router.push({ path: "/login?expired=1" });
        });
    },
    getUrlParam: function() {
      var name, value;
      var str = location.href; //取得整个地址栏
      var num = str.indexOf("?");
      str = str.substr(num + 1); //取得所有参数   stringvar.substr(start [, length ]

      var arr = str.split("&"); //各个参数放到数组里
      var param = {};
      for (var i = 0; i < arr.length; i++) {
        num = arr[i].indexOf("=");
        if (num > 0) {
          name = arr[i].substring(0, num);
          value = arr[i].substr(num + 1);
          this.$set(param, name, value);
        }
      }
      return param;
    }
  }
};
</script>

<style lang="less" scoped>
</style>
