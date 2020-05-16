<template>
  <div class="visitorinfo">
    <!-- <div class="select" @click="$router.push('/visitlist')">
      <img class="more" src="../../assets/icon/more.png" alt />
    </div>-->
    <!-- @on-submit="onSubmit"  position="absolute"-->
    <search
      v-model="searchText"
      position="relative"
      placeholder="输入学生姓名/学号"
      @result-click="resultClick"
      @on-change="getResult"
      :results="result"
      @on-focus="onFocus"
      @on-cancel="onCancel"
      ref="search"
    ></search>
    <group gutter="0">
      <!-- <div class="j_search">
        <div class="search_11">
          <input type="text" placeholder="姓名/学号" v-model="searchText" @input="search" @focus="toggleMenu2">
          <div class="search_icon" @click="search">
            <x-icon type="ios-search" size="16"></x-icon>
          </div>
          
          <div class="menu2" style="max-height:160px">
            <div v-show="!nodata" class="list" v-for="(item,k) in result" :key="k">
              <div
                class="item-title"
                @click="fnGetValue(item)"
              >{{item.Grade + ' / ' + item.Class + ' / ' + item.text}}</div>
            </div>
            <div v-show="nodata" style="background:#fff;color:#ccc;textAlign:center;">无数据</div>
          </div>
        </div>
      </div>-->
      <x-input class="mb-5" text-align="right" value="校内访客" :disabled="true">
        <span slot="label" class="weui-label">
          <span style="color:red;padding:0 5px;">*</span>访客类型
        </span>
      </x-input>
      <cell v-model="visitor.visitorName">
        <span slot="title" class="weui-label">
          <span style="color:red;padding:0 5px;">*</span>访客姓名
        </span>
      </cell>

      <datetime format="YYYY-MM-DD HH:mm" class="mb-5" v-model="beginTime1">
        <span slot="title">
          <span style="color:red;padding:0 5px;">*</span>开始时间
        </span>
      </datetime>

      <popup-picker
        :data="times"
        v-model="endTime1"
        popup-title="结束时间"
        :display-format="format"
        :columns="2"
      >
        <span slot="title">
          <span style="color:red;padding:0 5px;">*</span>结束时间
        </span>
      </popup-picker>
      <div style="background: #f0f0f0;height:20px"></div>
      <x-input text-align="right" :disabled="true" class="mb-5" v-model="userInfo.UserName">
        <span slot="label" style="color:#000;" class="weui-label">授权人</span>
        <span slot="right" style="padding-left:10px;">{{', ' + limitData.title}}</span>
      </x-input>
      <div id="limit">{{'本月剩余授权额度'+ limitData.usableLimit +'人次'}}</div>
      <!-- <cell-box>
        <div class="avatar">
          <div v-show="!visitor.avatar" class="no-avatar">选择学生可以预览图片</div>
          <img v-show="visitor.avatar" :src="visitor.avatar" alt="图片不见了">
        </div>
      </cell-box>-->
    </group>

    <div class="btn-wrap">
      <x-button :show-loading="loading" @click.native="handeSubmit" style="margin-top: 50px;">提交</x-button>
    </div>
    <!-- <div style="text-align:right;padding:10px 10%">
      <router-link to="/visitlist">查看记录</router-link>
    </div> -->
  </div>
</template>

<style lang="less">
#limit {
  color: #555;
  font-size: 14px;
  padding-left: 15px;
  padding-bottom: 10px;
}
.visitorinfo {
  & .weui-search-bar {
    padding: 10px;
    align-items: center;
  }
  & .weui-search-bar__box .weui-search-bar__input {
    height: 28px;
    line-height: 28px;
  }
  & .weui-search-bar__label {
    top: 7px;
  }
  & .weui-search-bar__box .weui-icon-search {
    top: 4px;
  }
  & & .weui-cells.vux-search_show {
    background: #efeff4;

    max-height: 200px;
  }
  & .weui-cells ::before {
    left: 0;
  }
  .menu_wrapper {
    position: absolute;
    top: 50px;
    height: 100%;
    width: 100%;
    overflow: auto;
  }
  .menu2_title {
    padding: 0.25rem 0.75rem;
    border-bottom: 1px solid #eee;
  }
  .list {
    padding: 0.1rem 0.35rem;
    border-bottom: 1px solid #eee;
    display: flex;
    color: #666;
    font-size: 15px;
    align-items: center;
    justify-content: space-between;
  }
}
</style>
<style lang="less" scoped>
.visitorinfo {
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
  .j_search {
    padding: 10px 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .search_11 {
      position: relative;
      width: 100%;
      border: 1px solid #ccc;
      border-radius: 5px;
      .search_icon {
        position: absolute;
        top: 0;
        right: 0.2em;
        top: 15%;
      }
      input[type="text"] {
        margin: 1px;
        width: 90%;
        padding: 0 0.8em;
        height: 2em;
        border: none;
        font-size: 14px;
        -webkit-appearance: none;
      }
      .menu2 {
        position: absolute;
        top: 100%;
        -webkit-overflow-scrolling: touch;
        border: 1px solid #eee;
        width: 100%;
        background: #fff;
        z-index: 99;
        overflow: auto;
        transition: all 2s ease;
      }
      .menu2::-webkit-scrollbar {
        display: none;
      }
    }
  }

  .avatar {
    width: 80px;
    height: 80px;
    border: 1px solid #ccc;
    display: flex;
    align-items: center;
    justify-content: center;
    img {
      vertical-align: middle;
      width: 100%;
      height: 100%;
      padding: 0.08rem;
      overflow: hidden;
      border: 1px solid #2eb1fd;
    }
    .no-avatar {
      text-align: center;
      font-size: 12px;
      color: #666;
    }
  }

  & .btn-wrap {
    padding: 0 10px;
    & button {
      color: #ffffff;
    }
  }

  .footer {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    background: #fff;
    z-index: 999;
    transition: all 1s ease-in-out;
  }
}
</style>
<script>
import {
  Group,
  PopupPicker,
  Datetime,
  XTextarea,
  XButton,
  PopupRadio,
  XInput,
  Cell,
  CellBox,
  Search
} from "vux";

import { mapGetters, mapActions, mapMutations } from "vuex";
import moment from "moment";
import {
  getVisitInfo,
  VisitorInfoSubmit,
  searchStudentByNameOrNum,
  GetBuildLimit
} from "@/service";

import FileUpload from "vue-upload-component";
var gtimes = moment().format("YYYY-MM-DD");

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
      show: false,
      loading: false,
      endTime1: [],
      times: [],
      beginTime1: moment().format("YYYY-MM-DD HH:mm"),
      format: function(value, name) {
        // console.log(beginTime1)
        gtimes = `${moment(gtimes).format("YYYY-MM-DD")} ${name.substring(
          0,
          2
        )}:${name.substring(3)}`;
        return gtimes;
      },
      visitor: {
        user: "",
        visitorType: 0,
        visitorName: "输入学号或姓名搜索",
        avatar: "",
        endTime: "",
        visitorId: ""
      },
      result: [],
      searchText: "",
      nodata: false,
      limitData: {
        title: "楼栋",
        usableLimit: ""
      }
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
    CellBox,
    FileUpload,
    PopupRadio,
    Search
  },
  computed: {
    ...mapGetters(["userInfo", "avatar"])
  },
  methods: {
    setFocus() {
      this.$refs.search.setFocus();
    },
    resultClick(item) {
      this.visitor.visitorId = item.id;
      this.visitor.visitorName = item.text;
      this.visitor.avatar = item.ImgUri;

      this.$refs.search.cancel();
      this.result = [];
      // window.alert('you click the result item: ' + JSON.stringify(item))
    },
    async getResult(val) {
      // console.log("on-change", val, this.searchText);
      // this.result = val ? getResult(this.searchText) : []
      if (!val) {
        return;
      }
      let char = /^[\u4e00-\u9fa5]+$/;
      if (char.test(val)) {
        if (val.length < 2) {
          return;
        }
      } else {
        if (val.length < 6) {
          return;
        }
      }
      let data = await searchStudentByNameOrNum(this.searchText);
      // console.log(this.userInfo)
      this.result = data.data
        .filter(r => r.id !== this.userInfo.UserId)
        .map(d => ({
          ...d,
          title: `${d.Grade}/${d.Class}-${d.text}`
        }));
      // console.log(this.result);
    },
    onFocus() {
      console.log("on focus");
    },
    onCancel() {
      console.log("on cancel");
      this.result = [];
    },
    //获取访问额度
    getLimit() {
      GetBuildLimit().then(data => {
        if (Array.isArray(data.data.data)) {
          if (data.data.data.length > 0) {
            this.limitData = data.data.data[0];
          }
        }
      });
    },

    handeSubmit() {
      this.visitor.endTime = gtimes;
      const { visitorName, endTime } = this.visitor;
      if (visitorName === "输入学号或姓名搜索") {
        this.$vux.toast.show({
          text: "请选择访客",
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

      this.loading = true;
      VisitorInfoSubmit({
        VisitorName: this.visitor.visitorName,
        VisitType: this.visitor.visitorType,
        VisitStartTime: this.beginTime1,
        VisitEndTime: this.visitor.endTime,
        VisitorId: this.visitor.visitorId
      })
        .then(res => {
          this.$vux.toast.show({
            text: "提交成功",
            type: "success",
            width: "80%"
          });
          this.loading = false;
          this.$router.push("/visitlist");
        })
        .catch(err => {
          this.$vux.toast.show({
            text: err.message,
            type: "warn",
            width: "80%"
          });
          this.loading = false;
        });
    }
  },
  watch: {
    beginTime1(n, o) {
      let temhour = Number(n.substring(11, 13));
      let temminute = Number(n.substring(14));
      gtimes = moment(n).format("YYYY-MM-DD");
      this.times = initTimes(temhour, temminute);
    },
    searchText(val) {
      if (val != "") {
        // this.search();
      }
    }
  },
  mounted() {
    let h = new Date().getHours();
    let tm = new Date().getMinutes();
    console.log(h, tm);
    this.times = initTimes(h, tm);
    this.getLimit();
  }
};
</script>