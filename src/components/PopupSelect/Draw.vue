<template>
  <div>
    <div v-for="(data,i) in dataSource" :key="i" :class="activeIndex===i&&show?'active':''">
      <div class="draw-header" @click="showDraw(i,data.value)">
        <span>
          <span v-if="i===activeIndex" class="dot"></span>
          {{data.value}}
        </span>
        <x-icon v-if="i===activeIndex&&show" type="ios-arrow-right"></x-icon>
        <x-icon v-if="i!==activeIndex||(i===activeIndex&&!show)" type="ios-arrow-down"></x-icon>
      </div>
      <div class="draw-content" v-if="i==activeIndex&&show">
        <sider-panel @onSelect="getVal" v-model="value" :data="data.children"></sider-panel>
      </div>
    </div>
  </div>
</template>
<script>
import SiderPanel from "@/components/PopupSelect/SiderPanel";
export default {
  data() {
    return {
      activeIndex:0,
      show:false,
      value1:''
    };
  },
  components: {
    SiderPanel
  },
  props: {
    value: {
      type: Object,
      required: false
    },
    dataSource: {
      type: Array,
      required: true
    },
    
  },
  methods: {
    getVal(val) {
      console.log("sider", val);
      let temval = {key:val.key,value:this.value1+'/'+val.value}
      this.$emit("input", temval);
    },
    showDraw(i,value) {
      if(this.activeIndex === i){
        this.show = !this.show
        if(this.show){
          this.value1 = value
        }
      }
      if(this.activeIndex !== i){
        this.activeIndex = i
        this.show = true
        this.value1 = value

      }
      
      
    }
  }
};
</script>
<style scoped>
.draw-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 5px 15px;
  font-size: initial;
  border-bottom: 1px solid #ccc;
}
.dot {
  display: inline-block;
  width: 10px;
  height: 10px;
  vertical-align: middle;
  margin-bottom: 1px;
  border-radius: 50%;
  background: rgb(124, 189, 81);
  margin-right: 8px;
}
.active {
  border-bottom: 1px solid #ccc;
}
</style>


