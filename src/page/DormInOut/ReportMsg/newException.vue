<template>
  <div style="height:100%">
    <div class="total_abnormal">
      <h1>
        {{currentClass.value?currentClass.value:'未绑定机构'}}:
       
      </h1>
      <pullselect :dataSource="options" v-model="value" @on-change="toggle"></pullselect>
    </div>
    <div v-if="loading" class="loadUtils">
      <inline-loading></inline-loading>
    </div>
    <v-chart
      style="marginTop:-20px;"
      v-show="!loading"
      ref="chart"
      prevent-render
      @on-render="renderChart"
    ></v-chart>
    <Major-car :flag="false" :carDataList="carDataList" />
  </div>
</template>
<script>
import _ from "lodash";
import { mapGetters, mapActions } from "vuex";
import Pullselect from "@/components/Pullselector";
import MajorCar from "@/components/SubMajorCar/MajorCar";
import { VChart, InlineLoading } from "vux";
import moment from "moment";
export default {
  data() {
    return {
      value: {},
      flag: true,
      data: [],
      startTime: moment().format("YYYY-MM-DD"),
      EndTime: moment()
        .add(1, "days")
        .format("YYYY-MM-DD"),
      loading: true,
      dateType: "1"
    };
  },
  created() {
    // this.setCarData({
    //   orgId: this.userInfo.Classes.map(c => c.Id),
    //   StartTime: this.startTime,
    //   EndTime: this.EndTime
    // });
  },
  computed: {
    ...mapGetters(["barData", "userInfo", "carDataList", "currentClass"]),
    options: function() {
      return [
        { key: "1", value: "昨日" },
        { key: "2", value: "本周" },
        { key: "3", value: "本月" },
        { key: "4", value: "本学期" },
        { key: "5", value: "本学年" }
      ];
    }
  },
  components: {
    MajorCar,
    VChart,
    Pullselect,
    InlineLoading
  },
  methods: {
    ...mapActions(["setCarData"]),
    toggle() {
      this.dateType = this.value.key;
      let chart = this.$refs.chart;
      this.loading = true;
      chart.rerender();
    },

    async renderChart({ chart }) {
      this.loading = true;

      await this.setCarData({
        orgId: this.userInfo.Classes.map(c => c.Id),
        dateType: this.dateType
      });
      // console.log('barData',barData)

      this.loading = false;
      // chart.tooltip({
      //   custom: true, // 自定义 tooltip 内容框
      //   onChange: function onChange(obj) {
      //     var legend = chart.get("legendController").legends.bottom[0];
      //     var tooltipItems = obj.items;
      //     var legendItems = legend.items;
      //     var map = {};
      //     legendItems.map(function(item) {
      //       map[item.name] = _.clone(item);
      //     });
      //     tooltipItems.map(function(item) {
      //       var name = item.name;
      //       var value = item.value;
      //       if (map[name]) {
      //         map[name].value = value;
      //       }
      //     });
      //     legend.setItems(_.values(map));
      //   },
      //   onHide: function onHide() {
      //     var legend = chart.get("legendController").legends.bottom[0];
      //     legend.setItems(chart.getLegendItems().country);
      //   }
      // });
      chart.legend("type", {
        position: "bottom",
        align: "center",
        offsetY: 0,
        wordSpace: 10,
        marker: (x, y, r, ctx) => {
          ctx.lineWidth = 1;
          const L = 6,
            W = 2,
            R = 2;
          ctx.strokeStyle = ctx.fillStyle;
          ctx.arc(x - L, y - W, R, -Math.PI, -Math.PI / 2, false);
          ctx.lineTo(x + L, y - W - R);
          ctx.arc(x + L, y - W, R, -Math.PI / 2, 0, false);
          ctx.lineTo(x + L + R, y + W);
          ctx.arc(x + L, y + W, R, 0, Math.PI / 2, false);
          ctx.lineTo(x - L, y + W + R);
          ctx.arc(x - L, y + W, R, Math.PI / 2, -Math.PI, false);
          ctx.lineTo(x - L - R, y - W);
          ctx.stroke();
          ctx.fill();
        }
      });
      chart.axis("year", {
        label: text => {
          let l = text.length,
            temstr = text;
          if (l > 5) {
            let str1 = text.substring(0, 5);
            let str2 = text.substring(5);
            temstr = str1 + "\n" + str2;
          }
          return {
            text: temstr
          };
        }
      });
      // chart.coord({
      //   transposed: true
      // });
      const LIMIT_LENGTH = 5;
      let length = this.barData.length;
      if (length > LIMIT_LENGTH * 3) {
        const topData = this.barData
          .filter((b, index) => index % 3 === 0 && index / 3 < LIMIT_LENGTH)
          .map(c => c.year);

        chart.source(this.barData, {
          year: {
            tickCount: 5,
            values: topData
          }
        });
      } else {
        chart.source(this.barData);
      }
      // this.barData.map(function(obj, index) {
      //   let textAlign =
      //     obj.type === "未归"
      //       ? "right"
      //       : obj.type === "晚归"
      //       ? "center"
      //       : "left";
      //   let offsetX = obj.type === "未归" ? -2 : obj.type === "晚归" ? 0 : 2;
      //   chart.guide().text({
      //     position: [obj.year, obj.value],
      //     content: obj.value,
      //     style: {
      //       textBaseline: "bottom",
      //       textAlign: textAlign,
      //       fontSize: "12px"
      //     },
      //     offsetY: -2,
      //     offsetX: offsetX
      //   });
      // });

      chart
        .interval()
        .position("year*value")
        .color("type")
        .adjust({
          type: "dodge",
          marginRatio: 0.05
        });
      chart.render();
      chart.interaction("pan");
      // 点击柱图显示值
      chart.interaction("interval-select", {
        onEnd: e => {
          console.log(e.data);
          if (!e.data) {
            return;
          }
          let dateType = this.dateType;
          let valueType = null;
          if (e.data.type === "未归") {
            valueType = 0;
          }
          if (e.data.type === "晚归") {
            valueType = 1;
          }
          if (e.data.type === "未出") {
            valueType = 2;
          }

          this.$router.push({
            name: "Details",
            params: {
              orgId: e.data.orgId,
              dateType,
              valueType: valueType
            }
          });
          // var legend = chart.get("legendController").legends.bottom[0];
          // var legendItems = legend.items;
          // var map = {};
          // legendItems.map(function(item) {
          //   map[item.name] = _.clone(item);
          // });
          // map[e.data.type].value = e.data.value;

          // legend.setItems(_.values(map));
        }
      });
    }
  },
  mounted() {}
};
</script>
<style lang="less" scoped>
.total_abnormal {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 20px auto;

  padding: 0 20px;

  div {
    position: relative;
    .total_abnormal_list {
      padding-left: 20px;
      width: 100px;

      color: #fff;
    }

    .vux-x-icon {
      fill: #fff;
      position: absolute;
      right: 0;
      top: -2px;
    }
  }

  h1 {
    font-size: 16px;
    font-weight: bold;
    margin: 0;
    padding: 0;
    position: relative;
    padding-left: 10px;
    &::before {
      content: "";
      display: inline-block;
      width: 4px;
      height: 25px;
      border-radius: 2px;
      background-color: #0094ff;
      position: absolute;
      left: 0;
    }
  }
}
.loadUtils {
  padding: 30px 0;
  text-align: center;
}
.chart-wrapper {
  text-align: center;
}
select {
  border: none;
  background-color: #0094ff;
  color: #fff;
  padding: 5px 10px;
}
</style>