<template>
<div v-transfer-dom>
  <popup v-show="show" style="background:#fff;border:1px solid #ccc;">
     <div class="popup-header">{{title}}
       <span class="popup-close" @click="close"><x-icon type="ios-close-empty"></x-icon></span>
      </div> 
     <!-- <draw v-for="(data,i ) in dataSource" :data="data" :key="i"></draw> -->
     

  </popup>
</div>
</template>
<script>
import {Popup } from "vux";
import Draw from '@/components/PopupSelect/Draw'
export default {
  data() {
    return {};
  },
  components: {
    Popup,
    Draw
  },
  props: {
    dataSource: {
      type: Array,
      required: true
    },
    show:{
        type:Boolean,
        required:false,
        default:true
    },
    title:{
        type:String,
    }
  },
  methods:{
    close(){
      console.log('close',this.show)
      // this.show = false
      this.$emit('update',false)
    }
  }
};
</script>
<style scoped>
.popup-header{
  padding: 10px 0;
  text-align: center;
  border-top-right-radius: 5px;
  border-top-left-radius: 5px;
  border-bottom: 1px solid #ccc;
  font-size: initial;
}
.popup-close{
  float: right;
}
</style>


