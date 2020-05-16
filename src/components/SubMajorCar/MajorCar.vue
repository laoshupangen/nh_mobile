<template>
  <div :style="{'margin-top': '30px', 'margin-bottom': '80px'}">
    <div
      class="majorcar_container"
      v-for="(item, index) in carDataList"
      :key="index"
      v-show="carDataList.length!=0"
    >
      <div class="majorcar_item">
        <span :style="{'background-color': color[index%4]}"></span>
        <p class="majorcar_title">
          <span>{{ item.orgId.name }}</span>
          <span>总人数{{ item.orgId.shortName }}人, 异常总计<i style="color:red;">{{item.noReturnCount+item.lateReturnCount+item.noOutCount}}</i>人</span>
        </p>
        <div class="majorcar_table">
          <table>
            <tr style="color:#989898;">
              <td>未归：</td>
              <td>晚归：</td>
              <td>未出：</td>
            </tr>
            <tr style="font-size:14px;color:#666;">
              <td>{{ item.noReturnCount }}人</td>
              <td>{{ item.lateReturnCount }}人</td>
              <td>{{ item.noOutCount }}人</td>
            </tr>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
export default {
  props: ["flag", "carDataList"],
  computed: {},
  methods: {
    
  },

  mounted() {
   
  },
  data() {
    return {
      color: [
        "#0094ff",
        "#f38232",
        "#10B7EE",
        "#ff0000"
      ]
    };
  }
};
</script>
<style lang="scoped" lang='less'>
.majorcar_container {
  width: 90%;
  min-height: 100px;
  margin: 0 auto 10px;
  background: #f8f8f8;
  padding: 6px 10px;
  border-radius: 4px;
  position: relative;
  .majorcar_item {
    height: 100%;
    & > span {
      content: "";
      display: inline-block;
      width: 4px;
      border-radius: 2px;
      height: 30%;
      position: absolute;
      left: 0;
      top: 0;
    }
    .majorcar_title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      & > span:nth-child(1){
        font-size: .35rem;
        font-weight: bold;
        max-width: 4rem;
        white-space: nowrap;
        overflow: hidden;
        text-overflow:ellipsis;
      }
      & > span:nth-child(2) {
        max-width: 50%;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
    .majorcar_table {
      padding-left: 10px;
      padding-top: 10px;
      table {
        width: 100%;
        tr {
          width:33.33333%;
          td{
            padding-left: 10px;
          }
        }
        
      }
    }
  }
  .chart-wrapper{
    text-align: center;
  }
}
</style>