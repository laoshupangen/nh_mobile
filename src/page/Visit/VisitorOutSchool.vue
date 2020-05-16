<template>
  <div class="visitorOutSchool">
    <!-- <div class="select" @click="$router.push('/visitlist')">
      <img class="more" src="../../assets/icon/more.png" alt>
    </div> -->
    <mescroll-vue id="mescroll" class="mescroll-scroll" :up="up" :down="down">
      <group gutter="0">
        <x-input text-align="right" :disabled="true" v-model="visitor.user">
          <span slot="label" style="color:#333;" class="weui-label">被访问人</span>
        </x-input>
        <x-input text-align="right" value="校外访客" :disabled="true">
          <span slot="label" class="weui-label">
            <span style="color:red;padding:0 5px;">*</span>访客类型
          </span>
        </x-input>
        <!-- @on-click-clear-icon="visitor.visitorName = ''" -->
        <x-input text-align="right" @on-change="(value)=>visitor.visitorName = value">
          <span slot="label" class="weui-label">
            <span style="color:red;padding:0 5px;">*</span>访客姓名
          </span>
        </x-input>
        <x-input text-align="right" @on-blur="checkID">
          <span slot="label" class="weui-label">
            <span style="color:red;padding:0 5px;">*</span>身份证号
          </span>
        </x-input>
        <cell v-model="visitor.gender">
          <span slot="title">
            <span style="color:red;padding:0 5px;">*</span>访客性别
          </span>
        </cell>
        <datetime format="YYYY-MM-DD HH:mm" v-model="beginTime1">
          <span slot="title">
            <span style="color:red;padding:0 5px;">*</span>开始时间
          </span>
        </datetime>

      <popup-picker :data="times" v-model="endTime1" popup-title="结束时间" :display-format="format" :columns="2">
        <span slot="title">
          <span style="color:red;padding:0 5px;">*</span>结束时间
        </span>
      </popup-picker>

      <popup-radio title="关系" :options="relationOptions" v-model="visitor.relationship" >
        <span slot="title">
          <span style="color:red;padding:0 5px;">*</span>关系
        </span>
      </popup-radio>
       

     

        <x-textarea
          placeholder="来访原因"
          style="display:block;"
          @on-change="(value)=>visitor.reason = value"
        >
          <div slot="label" style="color:#333">事由</div>
        </x-textarea>

      </group>
       <div class="btn-wrap">
          <x-button :show-loading="loading" @click.native="handeSubmit">提交</x-button>
        </div>
        <!-- <div style="text-align:right;padding:10px 10%">
          <router-link to="/visitlist">查看记录</router-link>
        </div> -->
    </mescroll-vue>
  </div>
</template>

<style lang="less">
.visitorOutSchool {
  background: #f0f0f0;
  .select {
    position: fixed;
    top: 0;
    height: 46px;
    right: 0;
    padding: 16px 10px 0 0;
    color: #fff;
    z-index: 100;
    .more {
      width: 19px;
      height: 11px;
    }
  }
  & .weui-cells ::before {
    left: 0;
  }
  & .vux-cell-box:not(:first-child):before {
    left: 0;
  }
  & .imagewrap {
    border-top: 1px solid #eee;
    padding: 5px 15px;
    & .image {
      position: relative;
      width: 80px;
      height: 80px;
      border: 1px solid #ccc;
      & .tiptext {
        font-size: 12px;
        color: #ccc;
        text-align: center;
        line-height: 80px;
      }
      & img {
        width: 80px;
        height: 80px;
      }
      & .file {
        position: absolute;
        top: 0;
        width: 100%;
        height: 100%;
        background: #fff;
        opacity: 0;
        z-index: 499;
      }
    }
  }

  & .btn-wrap {
    padding: 30px 30px;
    & button {
      color: #ffffff;
    }
  }
}
</style>
<script>
import {
  Group,
  PopupPicker,
  PopupRadio,
  Datetime,
  XTextarea,
  XButton,
  XInput,
  Cell
} from "vux";
import { mapGetters, mapActions, mapMutations } from "vuex";
import { getVisitInfo, uploadFile, VisitorInfoSubmit } from "@/service";
import moment, { min } from "moment";
import MescrollVue from "mescroll.js/mescroll.vue";
var gtimes = moment().format('YYYY-MM-DD')

function initTimes(hour, minute) {
  let t = [];
  for (let k = hour; k < 24; k++) {
    let mk = {};
    if (k === hour) {
      k = k < 10 ? "0" + k : k + "";
      mk = {
        name: k,
        value: "fhour",
        parent: 0
      };
    } else {
      k = k < 10 ? "0" + k : k;
      mk = {
        name: k,
        value: "hour" + k,
        parent: 0
      };
      for (let m = 0; m < 60; m++) {
        m = m < 10 ? "0" + m : m + "";
        let sk = {
          name: m,
          value: m,
          parent: "hour" + k
        };
        t.push(sk);
      }
    }
    t.push(mk);
  }
  for (let m = minute + 1; m < 60; m++) {
    m = m < 10 ? "0" + m : m + "";
    let bk = {
      name: m,
      value: m,
      parent: "fhour"
    };
    t.push(bk);
  }
  //  for (let m = 0; m < 60; m++) {
  //     m = m < 10 ? "0" + m : m + "";
  //     let sk = {
  //       name: m,
  //       value: m,
  //       parent: ['hour13','hour12']
  //     };
  //     t.push(sk);
  //   }
  return t;
}

// const times = initTimes(h, tm);

export default {
  
  data() {
    return {
      relationOptions:['直系亲属','父母','非直系亲属','朋友'],
      
      loading: false,
      currentDisplay: true,
      endTime1: [],
      times: [],
      beginTime1: moment().format("YYYY-MM-DD HH:mm"),
      format: function(value, name) {
        
        // console.log(value,name)     
         gtimes = `${moment(gtimes).format('YYYY-MM-DD')} ${name.substring(0,2)}:${name.substring(3)}`        
        return gtimes
      },
      
      visitor: {
        user: "",
        visitorType: 1,
        visitorName: "",        
        endTime: "",
        avator: "",
        identity: "",
        gender: "输入身份证号自动识别",
        relationship: "",
        reason: ""
      },
      up: {
        use: false,
        isBounce: false
      },
      down: {
        use: false
      },
      file: null
    };
  },
  components: {
    Group,
    PopupPicker,
    Datetime,
    XTextarea,
    XButton,
    XInput,
    Cell,
    MescrollVue,
    PopupRadio 
  },
  computed: {
    ...mapGetters(["userInfo"])
  },
  
  methods: {
    checkID(value, event) {
      if (value) {
        let reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
        if (!reg.test(value) && value.length > 1) {
          this.$vux.toast.show({
            text: "身份证号有误",
            type: "warn"
          });
          return;
        }
        let sex =
          value.length === 18
            ? value.charAt(value.length - 2)
            : value.charAt(value.length - 1);
        sex = sex % 2 === 0 ? "女性" : "男性";
        this.visitor.gender = sex;
        this.visitor.identity = value;
      }
    },
    

    handeSubmit() {
      this.visitor.endTime = gtimes
      const {
        visitorName,        
        endTime,
        identity,
        relationship,
        visitorType
      } = this.visitor;
      if (!visitorName) {
        this.$vux.toast.show({
          text: "请输入访客名",
          type: "warn"
        });
        return;
      }
      if (!identity) {
        this.$vux.toast.show({
          text: "请输入身份证",
          type: "warn"
        });
        return;
      }

      if (!this.beginTime1) {
        this.$vux.toast.show({
          text: "请输入开始时间",
          type: "warn"
        });
        return;
      }
      if (!endTime) {
        this.$vux.toast.show({
          text: "请输入结束时间",
          type: "warn"
        });
        return;
      }
      if(!relationship){
        this.$vux.toast.show({
          text:'请选择关系',
          type:'warn'
        })
        return; 
      }
      this.loading = true;
      // 性别0女，1男
      console.log(this.visitor.gender)
      let genderlll = this.visitor.gender === "女性" ? 0 : 1;      
      VisitorInfoSubmit({
        VisitorName: this.visitor.visitorName,
        VisitType: this.visitor.visitorType,
        VisitorIDCard: this.visitor.identity,
        VisitorGender: genderlll, 
        VisitStartTime: this.beginTime1,
        VisitEndTime: this.visitor.endTime,
        Relationship: this.visitor.relationship,
        VisitReason: this.visitor.reason,
      }).then(res => {
        console.log(res);
        //
        setTimeout(() => {
          this.loading = false;
          this.$router.push("/visitlist");
        }, 2000);
        //
      }).catch(err=>{
        this.$vux.toast.show({
          text:err.message,
          type:'text'
        })
        this.loading = false
      });;
    }
  },
  mounted() {
    this.visitor.user = this.userInfo.UserName;
    let h = new Date().getHours();
    let tm = new Date().getMinutes();  
    this.times = initTimes(h,tm)
  },
  beforeRouteLeave(to, from, next) {
    to.meta.keepAlive = false;
    next();
  },
  watch: {
    beginTime1(n, o) {
      let temhour = Number(n.substring(11, 13));
      let temminute = Number(n.substring(14));
      gtimes = moment(n).format('YYYY-MM-DD')
      this.times = initTimes(temhour,temminute)      
    }
  }
};
</script>