<template>
  <div class="majorcar_container1" v-if="JSON.stringify(HeadmasterList) !== '{}'">
    <!-- 第一张卡片 -->
    <div class="item" ref="item">
      <span :style="{background: color[0]}"></span>
      <p>
        <span>{{ HeadmasterList.totalArr[0].title }}</span>
        <span>共{{ HeadmasterList.totalArr[0].totalCount }}人</span>
      </p>
      <table>
        
        <tr v-if="HeadmasterList.totalArr[0].newArr[0]">
          <td
            v-for="(value, index) in HeadmasterList.totalArr[0].newArr[0]"
            :key="index"
          >{{ value.name }}: {{ value.count }}次</td>
        </tr>
        
        <tr v-if="HeadmasterList.totalArr[0].newArr[1]">
          <td
            v-for="(value, index) in HeadmasterList.totalArr[0].newArr[1]"
            :key="index"
            v-show="index!=2 || !boolean"
          >{{ value.name }}: {{ value.count }}次</td>
          <td @click="getMore(0)" v-show="boolean&&HeadmasterList.totalArr[0].newArr.length>0&&HeadmasterList.totalArr[0].newArr[0] && (HeadmasterList.totalArr[0].newArr[0].length +
             (HeadmasterList.totalArr[0].newArr[1]?(HeadmasterList.totalArr[0].newArr[1].length):0))>5">更多...</td>
        </tr>
        <tr v-for="(item, i) in HeadmasterList.totalArr[0].newArr" :key="i" v-show="i >= 2">
          <td v-for="(value, index) in item" :key="index">{{ value.name }}: {{ value.count }}次</td>
        </tr>
      </table>
      <span class="more" @click="shrink(0)" v-show="!boolean">收缩...</span>
    </div>
    <!-- 第二张卡片 -->
    <div class="item" ref="item1">
      <span :style="{background: color[1]}"></span>
      <p>
        <span>{{ HeadmasterList.totalArr[1].title }}</span>
        <span>共{{ HeadmasterList.totalArr[1].totalCount }}人</span>
      </p>
      <table>
        <tr>
          <td
            v-for="(value, index) in HeadmasterList.totalArr[1].newArr[0]"
            :key="index"
          >{{ value.name }}: {{ value.count }}次</td>
        </tr>
        <tr v-if="HeadmasterList.totalArr[1].newArr&&HeadmasterList.totalArr[1].newArr.length">
          <td
            v-for="(value, index) in HeadmasterList.totalArr[1].newArr[1]"
            :key="index"
            v-show="index!=2 || !boolean1"
          >{{ value.name }}: {{ value.count }}次</td>
          <td
            @click="getMore1(1)"
            v-if="boolean1&&HeadmasterList.totalArr[1].newArr.length>0&&HeadmasterList.totalArr[1].newArr[0] && (HeadmasterList.totalArr[1].newArr[0].length +
             (HeadmasterList.totalArr[1].newArr[1]?(HeadmasterList.totalArr[1].newArr[1].length):0))>5"
          >更多...</td>
        </tr>
        <tr v-for="(item, i) in HeadmasterList.totalArr[1].newArr" :key="i" v-show="i >= 2">
          <td v-for="(value, index) in item" :key="index">{{ value.name }}: {{ value.count }}次</td>
        </tr>
        <span class="more" @click="shrink1(1)" v-show="!boolean1">收缩...</span>
      </table>
    </div>
    <!-- 第三张卡片 -->
    <div class="item" ref="item2">
      <span :style="{background: color[2]}"></span>
      <p>
        <span>{{ HeadmasterList.totalArr[2].title }}</span>
        <span>共{{ HeadmasterList.totalArr[2].totalCount }}人</span>
      </p>
      <table>
        <tr>
          <td
            v-for="(value, index) in HeadmasterList.totalArr[2].newArr[0]"
            :key="index"
          >{{ value.name }}: {{ value.count }}次</td>
        </tr>
        <tr v-if="HeadmasterList.totalArr[2].newArr&&HeadmasterList.totalArr[2].newArr.length">
          <td
            v-for="(value, index) in HeadmasterList.totalArr[2].newArr[1]"
            :key="index"
            v-show="index!=2 || !boolean2"
          >{{ value.name }}: {{ value.count }}次</td>
          <td
            @click="getMore2(2)"
            v-show="boolean2&&HeadmasterList.totalArr[2].newArr.length>0 && (HeadmasterList.totalArr[2].newArr[0].length +
            (HeadmasterList.totalArr[2].newArr[1]?(HeadmasterList.totalArr[2].newArr[1].length):0) )>5"
          >更多...</td>
        </tr>
        <tr v-for="(item, i) in HeadmasterList.totalArr[2].newArr" :key="i" v-show="i >= 2">
          <td v-for="(value, index) in item" :key="index">{{ value.name }}: {{ value.count }}次</td>
        </tr>
        <span @click="shrink2(2)" v-show="!boolean2">收缩...</span>
      </table>
    </div>
    <!-- 第四张卡片 -->
    <div class="item" ref="item3">
      <span :style="{background: color[3]}"></span>
      <p>
        <span>{{ HeadmasterList.totalArr[3].title }}</span>
        <span>共{{ HeadmasterList.totalArr[3].totalCount }}人</span>
      </p>
      <table>
        <tr>
          <td
            v-for="(value, index) in HeadmasterList.totalArr[3].newArr[0]"
            :key="index"
          >{{ value.name }}: {{ value.count }}次</td>
        </tr>
        <tr v-if="HeadmasterList.totalArr[3].newArr">
          <td
            v-for="(value, index) in HeadmasterList.totalArr[3].newArr[1]"
            :key="index"
            v-show="index!=2 || !boolean3"
          >{{ value.name }}: {{ value.count }}次</td>
          <td
            @click="getMore3(3)"
            v-show="boolean3&& HeadmasterList.totalArr[3].newArr.length>1&& (HeadmasterList.totalArr[3].newArr[0].length +
            (HeadmasterList.totalArr[3].newArr[1]?(HeadmasterList.totalArr[3].newArr[1].length):0) )>5"
          >更多...</td>
        </tr>
        <tr v-for="(item, i) in HeadmasterList.totalArr[3].newArr" :key="i" v-show="i >= 2">
          <td v-for="(value, index) in item" :key="index">{{ value.name }}: {{ value.count }}次</td>
        </tr>
        <span @click="shrink3(3)" v-show="!boolean3">收缩...</span>
      </table>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
export default {
  data() {
    return {};
  },
  props: ["HeadmasterList"],
  computed: {},
  methods: {
    getMore(index) {
      let item = this.$refs.item
      let h = item.querySelector('table').offsetHeight + item.querySelector('p').offsetHeight
      this.$refs.item.style.height = h+20+'px';
      this.boolean = false;
    },
    shrink(index) {
      this.$refs.item.style.height = "105px";
      this.boolean = true;
    },
    getMore1(index) {
      let item = this.$refs.item1
      let h = item.querySelector('table').offsetHeight + item.querySelector('p').offsetHeight
      this.$refs.item1.style.height = h + 20 + 'px';
      this.boolean1 = false;
    },
    shrink1(index) {
      this.$refs.item1.style.height = "105px";
      this.boolean1 = true;
    },
    getMore2(index) {
      let item = this.$refs.item2
      let h = item.querySelector('table').offsetHeight + item.querySelector('p').offsetHeight
      this.$refs.item2.style.height = h + 20 +'px';
      this.boolean2 = false;
    },
    shrink2(index) {
      this.$refs.item2.style.height = "105px";
      this.boolean2 = true;
    },
    getMore3(index) {
      let item = this.$refs.item3
      let h = item.querySelector('table').offsetHeight + item.querySelector('p').offsetHeight
      this.$refs.item3.style.height = h+20+'px';
      this.boolean3 = false;
    },
    shrink3(index) {
      this.$refs.item3.style.height = "105px";
      this.boolean3 = true;
    }
  },
  watch: {},
  created() {},

  mounted() {
      console.log(this.HeadmasterList)
  },
  data() {
    return {
      data: [],
      color: ["#0094ff", "#bbeb38", "#520aaa", "#f00"],
      boolean: true,
      boolean1: true,
      boolean2: true,
      boolean3: true
    };
  }
};
</script>
<style lang="scoped" lang='less'>
.majorcar_container1 {
  padding: 0 10px;
  .item {
    margin-bottom: 10px;
    background-color: #f8f8f8;
    position: relative;
    padding: 0 10px;
    // min-height: 105px;
    height: 105px;
    overflow: hidden;
    &:last-child{
      margin-bottom: 20px;
    }
    p {
      display: flex;
      justify-content: space-between;
      margin: 0;
      padding: 0;
      padding: 10px 0;
      span:nth-child(1) {
        font-size: .35rem;
        font-weight: bold; 
        //color: rgba(255, 0, 0, 0.5);
      }
    }
    table {
      width: 100%;
      tr {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        line-height: 30px;
      }
      span {
        position: absolute;
        right: 5px;
        bottom: 5px;
      }
    }
    &>span{
      position: absolute;
      left: 0;
      top: 0;
      display: inline-block;
      border-radius: 2px;
      width: 4px;
      height: 40px;
    }
  }
}
</style>