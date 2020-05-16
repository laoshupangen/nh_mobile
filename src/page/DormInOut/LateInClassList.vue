<template>
  <div style="height: 100%;position: relative;">
    <no-data :visible="dataList.length === 0"></no-data>
    <mescroll-vue id="mescroll" class="mescroll-scroll" @init="initCallBack" :up="up" :down="down">
      <div class="flex-div">
        <flexbox justify="center" align="center">
          <flexbox-item class="flex-item" :span="0.4">
            <x-button class="item-btn" @click.native="showDateTime(true)">{{model.startTime}}</x-button>
          </flexbox-item>
          <flexbox-item class="flex-item" :span="0.4">
            <x-button class="item-btn" @click.native="showDateTime(false)">{{model.endTime}}</x-button>
          </flexbox-item>
          <flexbox-item class="flex-item" :span="0.2">
            <x-button style="color:#fff;background-color:#2eb1fd;" class="item-btn" @click.native="searchRecord">搜索</x-button>
          </flexbox-item>
        </flexbox>
      </div>
      <ul v-if="dataList.length !== 0" class="noti-list">
        <li
          @click.native="LeaveDetail(item)"
          :key="i"
          v-for="(item, i) in dataList"
          class="clearfix"
        >
          <div class="title">
            {{ item.name }}
            <span style="color:#74B04C;">进宿舍</span>
          </div>
          <div>班级：{{ item.className }}</div>
          <div>宿舍号：{{ item.address }}</div>
          <div>进宿舍记录：{{ item.date }}</div>
          <div style="color:#E61E1E">晚归时长：{{ item.record + '分钟' }}</div>
        </li>
      </ul>
    </mescroll-vue>
  </div>
</template>

<script>
import _ from "lodash";
import {
  XButton,
  Datetime,
  Flexbox,
  FlexboxItem,
  Tab,
  TabItem,
  Sticky
} from "vux";
import { GetLateListByClass } from "@/service";
import MescrollVue from "mescroll.js/mescroll.vue";
import NoData from "@/components/NoData.vue";
import moment from "moment";
export default {
  components: {
    XButton,
    Datetime,
    Flexbox,
    FlexboxItem,
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
        startTime: "请选择开始时间",
        endTime: "请选择结束时间",
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
      this.model.startTime = this.$route.params.startTime
        ? this.$route.params.startTime
        : this.model.startTime;
      this.model.endTime = this.$route.params.endTime
        ? this.$route.params.endTime
        : this.model.endTime;
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
      try {
        let data = await GetLateListByClass({
          classId: this.$route.params.id,
          startTime:
            this.model.startTime == "请选择开始时间"
              ? ""
              : this.model.startTime,
          endTime:
            this.model.endTime == "请选择结束时间" ? "" : this.model.endTime
        });
        return data.data.data;
      } catch (err) {}
    },
    searchRecord() {
      this.meScroll.resetUpScroll();
    },
    showDateTime(isStart) {
      var _this = this;
      this.$vux.datetime.show({
        cancelText: "取消",
        confirmText: "确定",
        format: "YYYY-MM-DD",
        endDate: moment(new Date()).format("YYYY-MM-DD"),
        value: isStart ? _this.model.startTime : _this.model.endTime,
        onConfirm(val) {
          if (isStart) {
            _this.model.startTime = val;
          } else {
            _this.model.endTime = val;
          }
        }
      });
    },
    LeaveDetail(item) {
      this.$router.push({
        name: "InOut",
        params: {
          id: item.Id
        }
      });
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
    color: #666;
    background-color: #f0f0f0;
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