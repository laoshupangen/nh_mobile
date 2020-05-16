<template>
  <div style="height: 100%;position: relative;">
    <no-data :visible="dataList.length === 0"></no-data>
    <mescroll-vue id="mescroll" class="mescroll-scroll" @init="initCallBack" :up="up" :down="down">
      <ul v-if="dataList.length !== 0" class="noti-list">
        <li
          @click.native="LeaveDetail(item)"
          :key="i"
          v-for="(item, i) in dataList"
          class="clearfix"
        >
          <div class="title">
            {{ item.Name }}
            <span style="color:#74B04C;">进宿舍</span>
          </div>
          <div>班级：{{ item.Organ.Name }}</div>
          <div>宿舍号：<span  v-if="item.Dorm">{{ item.Dorm.Title }}</span></div>
          <div>进宿舍记录：{{ item.InTime }}</div>
          <div style="color:#E61E1E">晚归时长：{{ item.F_Time + '小时' }}</div>
        </li>
      </ul>
    </mescroll-vue>
  </div>
</template>

<script>
import _ from "lodash";
import { Tab, TabItem, Sticky } from "vux";
import { GetLateReturnReport } from "@/service";
import MescrollVue from "mescroll.js/mescroll.vue";
import NoData from "@/components/NoData.vue";
import moment from "moment";
export default {
  components: {
    Tab,
    TabItem,
    Sticky,
    MescrollVue,
    NoData
  },
  data() {
    return {
      meScroll: {},
      dataList: [],
      up: {
        use: true,
        auto: true,
        isBounce: false,
        callback: this.upCallBack,
        page: {
          num: 0,
          size: 15
        }
      },
      down: {
        use: false
      },
      model: {
        keyboard: ""
      }
    };
  },
  computed: {},
  mounted() {
    //this.getdataList();
 
  },
  methods: {
    initCallBack(mescroll) {
      this.meScroll = mescroll;
    },
    async upCallBack(page, mescroll) {
      try {
        let data = await this.getList();
        this.dataList = data || [];

        this.meScroll.endSuccess(1);
      } catch (err) {
        console.log(err);
      }
    },
    async getList() {
      var Request = this.getUrlParam();
      try {
        let data = await GetLateReturnReport({
        //   OrgId: "6a969c9776f49142a30cfd5995e745a2"
             ReportDate:Request.ReportDate,
             OrgId:Request.OrgId
        });
        return data.data;
      } catch (err) {}
    },
    getUrlParam: function() {
      var name, value;
      var str = location.href; //取得整个地址栏
      var num = str.indexOf("?");
      str = str.substr(num + 1); //取得所有参数   stringvar.substr(start [, length ]

      var arr = str.split("&"); //各个参数放到数组里
      var param = {}
      for (var i = 0; i < arr.length; i++) {
        num = arr[i].indexOf("=");
        if (num > 0) {
          name = arr[i].substring(0, num);
          value = arr[i].substr(num + 1);
          this.$set(param, name, value)
        }
      }
      return param
    }
  }
};
</script>

<style lang="less" scoped>
.flex-div {
  padding: 0 20px;
  border-bottom: 1px solid #dcdcdc;
}
.flex-item {
  text-align: center;
  .item-btn {
    margin: 10px auto;
    font-size: 14px;
    color: #333;
  }
}
.select {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 999;
  height: 46px;
  padding: 16px 10px 0 0;
  color: rgba(255, 255, 255, 1);
}
.mescroll-container {
  position: relative;
}
.noti-list {
  width: 100%;
  li {
    color: #999999;
    position: relative;
    width: 100%;
    padding: 20px;
    border-bottom: 1px solid #dcdcdc;
  }
  div {
    padding: 1px;
  }
  .title {
    display: flex;
    align-items: Center;
    justify-content: space-between;
    font-size: 16px;
    color: #1a1a1a;
  }
}
.content-pos {
  position: absolute;
  right: 20px;
  top: 80px;
  bottom: 0;
  text-align: center;
  vertical-align: middle;
  height: 100%;
  padding: 10px 20px 0px 20px;
  img {
    width: 0.3375rem;
    height: 0.625rem;
  }
}
</style>