<template>
  <div id="in-out-student">
  <mescroll-vue id="mescroll" class="mescroll-scroll" :up="{use: false}" :down="{use: false}">
    <div>
      <div class="stuInfoCon">
        <div class="stuInfo">
          <span class="stuName">{{this.data.name}}</span>
          <span class="theTime">{{moment(this.value).format("YYYY-MM-DD ddd")}}</span>
        </div>
        <div class="stuClass">{{'机构:' + userInfo.OrgName}}</div>
      </div>

      <div class="calendar-bg">
        <inline-calendar
          ref="calendar"
          @on-change="onChange"
          @on-view-change="onViewChange"
          class="inline-calendar"
          :show.sync="show"
          v-model="value"
          :range="range"
          :show-last-month="showLastMonth"
          :show-next-month="showNextMonth"
          :highlight-weekend="highlightWeekend"
          :return-six-rows="return6Rows"
          :hide-header="hideHeader"
          :hide-week-list="hideWeekList"
          :replace-text-list="replaceTextList"
          :weeks-list="weeksList"
          :render-function="buildSlotFn"
          :disable-past="disablePast"
          :disable-future="disableFuture"
          :disable-weekend="disableWeekend"
        ></inline-calendar>
      </div>

      <div class="record">
        <ul>
          <li class="record-num">{{'出入记录 ( ' + data.records.length +'次 ) '}}</li>
        </ul>
        <light-timeline :items='data.records'>
          <template slot='symbol' slot-scope='{ item }'>
            <div v-bind:class="{greenColor: item.inOut == '1'}" class="icon">{{item.inOut === '0' ? '进' : '出'}}</div>
          </template>
        </light-timeline>
      </div>
    </div>
  </mescroll-vue>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import { dateFormat, InlineCalendar, Loading } from "vux";
import moment from "moment";
import { GetDormRecords } from "@/service";
import MescrollVue from "mescroll.js/mescroll.vue";

export default {
  data() {
    return {
      data: {
        classname: "",
        name: "",
        records: []
      },
      moment,
      show: true,
      value: moment().format("YYYY-MM-DD"),
      listValue: "",
      range: false,
      showLastMonth: true,
      showNextMonth: true,
      highlightWeekend: false,
      return6Rows: true,
      hideHeader: false,
      hideWeekList: false,
      replaceTextList: {},
      replace: false,
      changeWeeksList: false,
      weeksList: [],
      useCustomFn: false,
      buildSlotFn: () => "",
      disablePast: false,
      disableFuture: true,
      disableWeekend: false
    };
  },
  components: {
    InlineCalendar,
    Loading,
    MescrollVue
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  mounted() {},
  methods: {
    onChange(val) {
      this.value = val;
      this.reloadData();
    },
    onViewChange(val) {
      console.log(val);
    },
    async reloadData() {
      this.$vux.loading.show({
        text: "Loading"
      });
      try {
        let data = await GetDormRecords({
          studentId: this.userInfo.UserId, //'64b28ba6aa879d4fb8977edb8721993e'
          date: this.value
        });
        if (data.data.data.records) {
          data.data.data.records.forEach(n => {
            n.tag = moment(n.date).format('HH:mm:ss')
            n.content = n.channelName
          })
        }
        
        this.data = data.data.data;

        this.$vux.loading.hide();
      } catch (err) {
        this.$vux.loading.hide();
      }
    }
  }
};
</script>


<style lang="less">
#in-out-student {
  .stuInfoCon {
    border-bottom: 1px solid #dedede;
  }
  .stuInfo {
    margin: 10px 15px 5px;
    .stuName {
      font-size: 16px;
      color: #333333;
    }
    .theTime {
      float: right;
      font-size: 14px;
      color: #808080;
    }
  }
  .stuClass {
    font-size: 13px;
    color: #808080;
    margin: 0px 15px 5px;
  }

  .calendar-bg {
    margin: 10px 10px 0px;
    .inline-calendar {

      table thead tr th {
        text-align: center;
        color: #cacaca;
        font-size: 15px;
      } 
    }
  }
  .line-container {
    padding-left: 2.2rem;
    &:after {
      left: 1.6rem
    }
    .line-item {
      padding: 0.45rem;
    }
    .item-tag {
      left: -3rem;
    }
    .item-symbol{
      left: -0.91rem;
    }
    .icon {
      border-radius: 50%;
      padding: 1.5px 4px;
      margin-right: 5px;
      font-size: 12px;
      text-align: center;
      color: #fff;
      background: #e18d43;
      width: 25px;
      height: 25px;
      line-height: 20px;
    }
  }
  .record {
    border-top: 8px solid #f0f0f0;
    padding: 0 15px;
    margin-top: 10px;
  }
  .record ul .record-num {
    border-top: 1px solid #f0f0f0;
    border-bottom: 1px solid #f0f0f0;
    padding: 8px 0;
    font-size: 14px;
    color: #333333;
  } 
  .record ul li {
    font-size: 13px;
    color: #333333;
    padding: 3px 0;

    div .cell-title {
      border-radius: 50%;
      padding: 1.5px 4px;
      margin-right: 5px;
      font-size: 12px;
      text-align: center;
      color: #fff;
      background: #e18d43;
    }

    div .greenColor {
      background: #7ebd52;
    }

    div .adress-icon {
      margin-left: 10px;
      width: 0.215rem;
    }
  }
}
</style>
