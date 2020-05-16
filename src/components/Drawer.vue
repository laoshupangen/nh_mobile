<template>
  <div class="panelWrap" >
    <div class="panelHeader" :class="collapse?'active':''" @click="collapse = false">
      <div class="panelLeft">
        <span class="dot" :class="collapse?'activeDot':'unactiveDot'"></span>
        <span>{{data.organName}}</span>
      </div>
      <div v-if="collapse" class="panelRight">
        <span>{{data.data.length}}人</span>
        <x-icon
          v-if="collapse"
          style="fill:#fff"
          type="ios-arrow-down"
          size="13"
          
        ></x-icon>
      </div>
    </div>
    <div v-if="!collapse" class="panelCollapse">
      <span>{{tabItems}}:{{data.data.length}}人</span>
      <span class="panelFloat" @click="collapse = true">
        <x-icon v-if="!collapse" style="fill:#999" type="ios-arrow-right" size="30"></x-icon>
      </span>
    </div>

    <div v-if="collapse" class="panelContent">
      <!-- v-for="(item,index) in data.content" :key="index" -->
      <div class="panelItemWrap">
        <div class="panelItem" v-for="(item,index) in data.data" :key="index" @click="setClick(item)">
          <div style="flex:0.8" :title="item.name">
            <img class="icon" src="@/assets/icon/icon1.png" />
            {{item.name}}
          </div>
          <div style="flex:0.8" :title="item.count">
            <img class="icon" src="@/assets/icon/icon2.png" />
            {{item.count}}次
          </div>
          <div style="flex:1" :title="item.dormInfo">
            <img class="icon" src="@/assets/icon/icon2.png" />
            {{item.dormInfo}}
          </div>
          <div style="flex:2" :title="item.phone">
            <img class="icon" src="@/assets/icon/icon2.png" />
            {{item.phone}}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      collapse: false
    };
  },
  props: {
    data: {
      type: Object,
      required: false
    },
    tabItems:''
  },
  methods:{
    setClick(item){
      // console.log(this.tabItems) 
      let tem = {
        id:item.id,
        name:item.name,
        type:this.tabItems === '未归人员'?0:(this.tabItems==='晚归人员'?1:2)
      }

      this.$emit('itemClick',tem)
    }
  }
};
</script>
<style scoped>
.panelWrap {
  border-radius: 5px;
  background: #fff;
  /* padding: 0 10px; */
  box-shadow: 0px 2px 18px 0px rgba(220, 220, 220, 1);
  padding-bottom: 10px;
  position: relative;
  margin-bottom: 10px;
}

.active {
  background: #2fb2fd;
  color: #fff;
}
.activeDot {
  background: #185f88;
}
.unactiveDot {
  background: #ff5331;
}
.panelHeader {
  display: flex;
  align-items: center;
  justify-content: space-between;

  border-radius: 5px 5px 0 0;
  padding: 10px;
}

.panelHeader .panelLeft {
  /* align-self: center; */
  font-size: .4rem;
}
.panelCollapse {
  color: #4a4a4a;
  padding: 0 15px;
  font-size: 13px;
}
.panelFloat {
  position: absolute;
  top: 30%;
  right: 10px;
}
.panelHeader .dot {
  display: inline-block;
  border-radius: 50%;
  margin-bottom: 1px;
  width: 5px;
  height: 5px;
  vertical-align: middle;
}
.panelContent {
  /* max-height: 100px; */
  color: #4a4a4a;
  overflow: hidden;
}
.panelContent .panelItemWrap {
  height: auto;
  overflow: auto;
  max-height: 300px;
  
}
.panelContent .panelItem {
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  border-bottom: 1px solid #e6e6e6;
  font-size: .3rem;
  padding: 10px 0;
}
.panelContent .panelItem div{
  /* flex:1; */
  padding: 0 2px;
  text-align: center;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.panelContent .panelItem img {
  width: 8px;
  height: 8px;
}
</style>
