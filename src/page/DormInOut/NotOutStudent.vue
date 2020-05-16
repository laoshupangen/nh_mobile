<template>
  <div>
    <no-data :visible="dataList.length === 0" style></no-data>
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
      <div :key="i" v-for="(item, i) in dataList">
        <ul v-if="dataList.length !== 0" class="noti-list">
          <li>
            <div>
              <span>{{'进宿舍记录：' + item.inTime}}</span>
              <span class="info-label">{{ '未出时长：' + item.count +'小时'}}</span>
            </div>
          </li>
        </ul>
      </div>
    </mescroll-vue>
  </div>
</template>

<script>
import { XButton, Flexbox, FlexboxItem, Datetime, Loading } from "vux";
import MescrollVue from "mescroll.js/mescroll.vue";
import NoData from "@/components/NoData.vue";
import { GetNoOutList } from "@/service";
import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      up: {
        use: false
      },
      down: {
        use: false
      },
      dataList: [],
      meScroll: {},
      model: {
        startTime: "请选择开始时间",
        endTime: "请选择结束时间",
        keyboard: ""
      }
    };
  },
  components: {
    Flexbox,
    FlexboxItem,
    XButton,
    MescrollVue,
    Datetime,
    NoData,
    Loading
  },
  computed: {
        ...mapGetters(["userInfo"])
  },
  mounted() {
    this.GetNoOutList()
  },
  methods: {
    initCallBack(mescroll) {
      this.meScroll = mescroll;
    },
    showDateTime(isStart) {
      var _this = this;
      this.$vux.datetime.show({
        cancelText: "取消",
        confirmText: "确定",
        format: "YYYY-MM-DD",
        onConfirm(val) {
          if (isStart) {
            _this.model.startTime = val;
          } else {
            _this.model.endTime = val;
          }
        }
      });
    },
    searchRecord() {
      this.GetNoOutList();
    },
    async GetNoOutList() {
      this.$vux.loading.show({
        text: "Loading"
      });
      try {
        let data = await GetNoOutList({
          studentId: this.userInfo.UserId,
          startTime:  this.model.startTime == '请选择开始时间'?'':this.model.startTime,
          endTime: this.model.endTime  == '请选择结束时间'?'':this.model.endTime,
        });
        this.dataList = data.data.data
        this.$vux.loading.hide();
      } catch (err) {
        this.$vux.loading.hide();
      }
    }
  }
};
</script>


<style lang="less">
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
.noti-list li {
  padding: 8px 10px;
  border-bottom: 1px solid #dcdcdc;
  font-size: 13px;
  color: #222;

  .info-label {
    float: right;
    color: #e61e1e;
  }
}
</style>
