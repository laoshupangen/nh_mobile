<template>
  <div class="wrap">
    <div v-for="(data,i) in dataSource" :key="i">
      <div class="header-item" @click="select(i,data)">
        <span>{{data.value}}</span>
        <x-icon v-if="!show||(show&&i!==activeIndex)" type="ios-arrow-right"></x-icon>
        <x-icon v-if="activeIndex===i&&show" type="ios-arrow-down"></x-icon>
      </div>
      <group v-if="activeIndex===i&&show" gutter="0">
        <radio :options="data.children" v-model="temvalue"></radio>
      </group>
    </div>
  </div>
</template>
<script>
import { Group, Radio } from "vux";
export default {
  data() {
    return {
      temdata:{},
      temvalue: "",
      show: false,
      activeIndex:0,
    };
  },
  components: {
    Group,
    Radio
  },
  props: {
    dataSource: {
      type: Array,
      required: true
    }
    // value: {
    //   type: String
    // }
  },
  watch: {
    temvalue(n, o) {
      console.log(n)
      let d = this.temdata.children.find(dc => dc.key === n);
      let temd = {
        key:d.key,
        value:this.temdata.value+'/'+d.value
      }
      this.$emit("onSelect", temd);
    }
  },
  methods:{
    select(i,data){
      if(i===this.activeIndex){
        this.show = !this.show
        if(this.show){
          this.temdata = data
        }
      }else{
        this.activeIndex = i
        this.show = true
        this.temdata = data

      }

    }
  },
  mounted(){  
    console.log(this.dataSource)
  }
};
</script>
<style scoped>
.wrap {
  width: 100%;
  font-size: initial;
}
.header-item {
  padding: 5px 15px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: initial;
  border-bottom: 1px solid #ccc;
 
}
.wrap>div:last-child .header-item{
  border-bottom: none;
}
</style>
<style>
.weui-cell_radio {
  padding: 5px 15px !important;
}
</style>


