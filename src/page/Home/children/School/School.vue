<template>
  <div class="home" ref="home">
   
    <div class="navgridWrap">
      
      <!-- :key="i" v-for="(item, i) in newhomeMenu"-->
      <grid class="nav-grid" v-if="newhomeMenu.length>0" :cols="4">
        <!-- <h3>{{i}}</h3> -->
        <grid-item @click.native="navigate(_item)" v-for="(_item, _i) in newhomeMenu" :key="_i">
          <div class="nav-content">
            <div class="nav-pill">
              <img class="nav-img" :src="imagesUrl( _item.meta.background.icon )" alt />
              <!-- <img src=`../../../../assets/icon/${_src}.png` alt=""/> -->
              <!-- <font-awesome-icon size="lg" :icon="_item.meta.background.icon" /> -->
            </div>
          </div>
          <p class="nav-title">{{ _item.meta.title }}</p>
        </grid-item>
      </grid>
      <div style="padding:0 15px" v-else>
        <modal-inline type="warn" title="提示" text="未设置菜单,请联系管理员"></modal-inline>
        <!-- <icon type="warn" is-msg></icon>未设置菜单，请联系管理员 -->
      </div>
      <!-- v-if="userInfo.Duty === 'studentDuty'&&warnText" -->
      <div v-if="userInfo.Duty === 'studentDuty'&&warnText" class="noOutWarnWRap">
        <div class="noOutWarn1">
          <div style="padding-right:10px">
            <icon type="warn" style="color:#ffc212"></icon>
          </div>

          <div style="text-align:left">
            <p style="font-size:.4rem;">您已超过{{warnText}}小时未离开寝室</p>
            <p style="padding:5px 0;color:#999">最后一次刷脸进入时间为{{lastTime}}</p>
          </div>
        </div>
      </div>
      <!-- <div class="cardUtil">
             
             <div class="cardContent">
                
             </div>
      </div>-->
    </div>
  </div>
</template>
<script>
import { Grid, GridItem, Icon, AlertModule } from "vux";
import { mapGetters, mapMutations } from "vuex";
import { GetNoOutList } from "@/service";
import ModalInline from "@/components/ModalInline.vue";
import moment from "moment";
export default {
  data() {
    return {
      warnText: "",
      lastTime: "",
      newhomeMenu: []
    };
  },
  computed: {
    ...mapGetters(["userInfo", "homeMenu", "currentClass", "bindClass"])
  },
  mounted() {
    // console.log(this.homeMenu)
    if (this.userInfo.Duty === "studentDuty") {
      this.getNoOutList();
    }
    let keys = Object.keys(this.homeMenu);
    if (keys.length === 0) {
      return;
    }
    keys.forEach(key => {
      this.homeMenu[key].forEach(obj => {
        this.newhomeMenu.push(obj);
      });
    });
    // this.newhomeMenu = this.homeMenu
  },
  methods: {
    ...mapMutations(["SET_FOOTER_DISPLAY"]),
    navigate(item) {
      if (item.subSystem) {
        window.location.href = item.path;
      } else {
        this.$router.push({ name: item.name });
      }
    },

       
      
    imagesUrl(imageName) {
      return require("../../../../assets/icon/" + imageName + ".png");
    },
    
    async getNoOutList() {
      let data = await GetNoOutList({
        studentId: this.userInfo.UserId,
        startTime: moment()
          .startOf("week")
          .format("YYYY-MM-DD"),
        endTime: moment().format("YYYY-MM-DD")
      });
      if (data.data.data.length === 0) {
        return;
      }
      let time = data.data.data[0].count;
      let lastTime = data.data.data[0].inTime;
      // this.dataList = data.data.data
      this.warnText = time;
      this.lastTime = lastTime;
    }
  },
  components: {
    Grid,
    GridItem,
    Icon,
    AlertModule,
    ModalInline
  }
};
</script>

<style lang="less" scoped>
// background-image: url("./../../../../assets/icon/home_bg.png");
.home {
  background: #fff;
  height: calc(~"100% - 54px");

  // margin-bottom: 70px;
  .navgridWrap {
    height: 100%;
    overflow: auto;
    // background-repeat: no-repeat;
    // background-image: url("./../../../../assets/icon/home_bg.png");
    // background-size: 100%;
    // width: 100%;
    // background-position: top center;
    // padding-top:50px;
    & .navgridHeader {
      padding: 20px 0;
      & > span {
        padding: 0 20px;
        font-size: 16px;
      }
    }
  }
  .nav-grid {
    h3 {
      font-size: 0.4rem;
      margin: 15px 8px 10px;
      color: #000;
    }
    padding: 0 10px;
  }
  .weui-grids:before {
    border-top: none;
  }
  .weui-grid {
    color: #ffffff;
    padding: 0.25rem 0.2rem;
    h3 {
      font-size: 0.4rem;
    }
    &:after,
    &:before {
      border: none;
    }
    .nav-title {
      font-size: 0.38rem;
      text-align: center;
      color: #989898;
      margin-top: 3.3px;
    }
  }
  .nav-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    border-radius: 5px;
  }
  .nav-pill {
    img {
      display: inline-block;
      width: 1rem;
      height: 1rem;
    }
  }
  .noOutWarnWRap {
    padding: 0 15px;
  }
  // #ffae00
  .noOutWarn1 {
    display: flex;
    justify-content: center;
    padding: 15px 0;
    text-align: center;
    color: #333;
    border-radius: 5px;
    box-shadow: 0 1px 8px rgba(0, 0, 0, 0.32);
    background: #fffce4;
  }
}
</style>


