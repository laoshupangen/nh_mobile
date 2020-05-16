<template>
  <div>
    <router-view class="thome" ref="view"></router-view>
    <tabbar v-if="footerSHow">
      <!-- <tabbar-item :selected="$route.name === 'Message'" link="/message">
        <font-awesome-icon style="font-size: 27px" size="lg" :icon="['far', 'comments']" slot='icon' />
        <span slot="label" style="position: relative;">
          消息
            <div class="msgs-num" v-show="msgs">{{ msgs }}</div>
        </span>

      </tabbar-item>-->
      <tabbar-item :selected="$route.name === 'School'" link="/school">
        <img v-if="$route.name === 'School'" slot="icon" src="../../assets/tabbar/gn_s.png" />
        <img v-else slot="icon" src="../../assets/tabbar/gn_n.png" />
        <span slot="label">功能</span>
      </tabbar-item>
      <tabbar-item :selected="$route.name === homePage.routeName" :link="homePage.link">
        <img
          v-if="$route.name === homePage.routeName"
          slot="icon"
          src="../../assets/tabbar/home_s.png"
        />
        <img v-else slot="icon" src="../../assets/tabbar/home_n.png" />
        <span slot="label">首页</span>
      </tabbar-item>
      <tabbar-item :selected="$route.name === 'Profile'" link="/profile">
        <img v-if="$route.name === 'Profile'" slot="icon" src="../../assets/tabbar/my_s.png" />
        <img v-else slot="icon" src="../../assets/tabbar/my_n.png" />
        <span slot="label">我的</span>
      </tabbar-item>
    </tabbar>
  </div>
</template>

<script>
import { Tabbar, TabbarItem, Icon } from "vux";
import { mapGetters ,mapMutations} from "vuex";
import { IsClass } from "@/service";
export default {
  created() {
    this.getRole()
  },
  data() {
    return {
      homePage: {
        routeName: "",
        link: ""
      },
      msgs: 0,
      teacherRole: "",
      
    };
  },
  computed: {
    ...mapGetters(["chatList", "userInfo","footerSHow"])
  },
  methods: {
    ...mapMutations(["SET_FOOTER_DISPLAY"]),
    async getRole() {
      if (this.userInfo.Duty == "studentDuty") {
        this.homePage.routeName = "Homepage";
        this.homePage.link = "/Homepage";
      } else if (this.userInfo.Duty == "suguanDuty") {
        this.homePage.routeName = "HomepageDormitory";
        this.homePage.link = "/HomepageDormitory";
      } else if (this.userInfo.Duty == "teacherDuty") {
         this.homePage.routeName = "newHomepage";
          this.homePage.link = "/newHomepage";
        
       
      } else {
        this.homePage.routeName = "newHomepage";
        this.homePage.link = "/newHomepage";
      }

      this.randomTime = Math.random();
      
    },
    reducer(sum, item) {
      return sum + item;
    },
    getMassageList(newList) {
      let arr = [];
      for (let i = 0; i < newList.friends.length; i++) {
        arr.push(newList.friends[i].unRead);
      }
      this.msgs =
        arr.reduce(this.reducer, 0) >= 99 ? "99+" : arr.reduce(this.reducer, 0);
    },
    
  },
  
  watch: {
    chatList: {
      handler: function(newList, oldList) {
        this.getMassageList(newList);
      },
      deep: true
    },
    // $route(to, from) {
    //   this.SET_FOOTER_DISPLAY(true)
    // }
  },
  components: {
    Tabbar,
    TabbarItem,
    Icon
  },
  mounted(){
   
  }
};
</script>

<style lang="less">
.thome {
  // height: calc(~"100% - 54px");
   height: 100%;
}
.msgs-num {
  position: absolute;
  top: -38px;
  left: -15px;
  right: 0px;
  width: 20px;
  height: 20px;
  background: red;
  border-radius: 50%;
  color: #fff;
  text-align: center;
  line-height: 20px;
}
.tabbar-icon:before {
  margin-left: 0 !important;
  margin-right: 0 !important;
}
.weui-tabbar{
  height: 54px !important;
  box-shadow:0px 0px 10px 0px rgba(95,95,95,0.3);
}
.weui-tabbar::before{
  border: none !important;
}

</style>
