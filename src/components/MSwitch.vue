<template>
    <div class="switch">
      <div class="switchWrap">
        <span :class="index === i?(i===0?'switch-item-1-active':'switch-item-2-active'):''" v-for="(opt,index) in options" :key="index" @click="change(index)">
            {{opt}}
        </span>

      </div>
    </div>
</template>
<script>
export default {
    data(){
        return{
           i:0
        }
    },
    props:{
        options:{
            type:Array,
            default:()=>['选项1','选项2'],
            required:false
        }
    },
    methods:{
        change(index){
            // console.log(index)
            this.i = index
            this.$emit('item-click',index)
        }
    }
    
}
</script>
<style scoped>
.switch{
    display: inline-block;
    position: relative;
    min-width: 50px;
    color: #666;
    /* height: ; */
    /* padding: 3px 0; */
    border: 1px solid #eee;
    border-radius: 5px;
}
.switchWrap{
    display: flex;
    align-items: center;
}
.switchWrap span{
    box-sizing: content-box;
    /* width: 50%; */
    padding: 3px 10px;
    
    text-align: center;
    /* margin-top: 1px; */
}

    
   
.switch-item-1-active{
    border: 1px solid #2CB1FD;
    border-radius: 5px 0 0 5px;
    color: #2CB1FD;
}
.switch-item-2-active{
    border: 1px solid #2CB1FD;
    border-radius: 0 5px 5px 0;
    color: #2CB1FD;

}
</style>