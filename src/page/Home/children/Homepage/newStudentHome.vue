<template>
  <div class="wrap">
    <router-view style="height:100%"></router-view>
    <!-- -->
    <div class="check">
      <pullselect
        
        :dataSource="switchopt"
        
        v-model="checkDateIndex"
        
      ></pullselect>

      <!-- <button-tab v-model="checkDateIndex" :height="24">
        <button-tab-item>个人</button-tab-item>
        <button-tab-item>机构</button-tab-item>
      </button-tab>-->
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import { ButtonTab, ButtonTabItem } from "vux";
import Pullselect from "@/components/Pullselector";
import { IsClass } from "@/service";
export default {
  data() {
    return {
      
      checkDateIndex: 0,
      otherRole: false
    };
  },
  components: {
    ButtonTab,
    ButtonTabItem,
    Pullselect
  },
  created() {
    this.IsClass();
  },
  computed: {
    ...mapGetters(["userInfo"]),
    switchopt(){
      return [{
        key:0,
        value:'个人'
      },{
        key:1,
        value:'机构'
      }]
    }
  },

  methods: {
    async IsClass() {
      const res = await IsClass(this.userInfo.UserId);
      this.otherRole = res === "True" ? true : false;
      // console.log('res',res,this.otherRole)
    }
  },
  watch: {
    checkDateIndex(val) {
      // this.getInfo(val);
      console.log(val)
      switch (val) {
        case 0:
          this.$router.push("/individual");
          break;
        case 1:
          this.$router.push("/organization");
          break;
      }
    }
  }
};
</script>
<style lang="less" scoped>
.wrap {
  position: relative;
  .check {
    position: absolute;
    // width: 30%;
    top: 20px;
    right: 10px;
  }
}
</style>