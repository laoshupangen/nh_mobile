<template>
    <div class="selectUtil">
        <div class="selected" :class="show?'active':''" @click="()=>show=!show">
            <span >{{selected.value}}</span>
            <span class="arrow">
               <i :class="show?'el-icon-caret-top':'el-icon-caret-bottom'"></i>
            </span>
        </div>
        <div class="selectorWrap" v-show="show">
            <div class="selectorOptions" v-for="(data,i) in dataSource" :key="i" 
            @click="select(data)">
                {{data.value}}
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return{
            show:false,
            selected:{},
            expand:true,
        }
    },
    props:{
        dataSource:{
            type:Array,
            required:true
        },
        value:[Number,String]
    },
    methods:{
        select(data){
            this.selected = data
            this.show = false;
            this.$emit('input',data.key)
            this.$emit('on-change',data.key)
        },
        touch(){

        }
    },
    watch:{
        // value(o){
        //     this.$emit('input',o)
        // }
    },
    mounted(){
        // document.body.addEventListener('touchstart', function(){ });
        // console.log('pullselector',this.value)
        if(this.value){
            this.selected= this.dataSource.find(d=>d.key === this.value)
        }else{
            this.selected = this.dataSource[0]
        }
        // this.selected =this.value || this.dataSource[0]
        // this.$emit('input',this.selected.key)
    }
    
}
</script>
<style scoped>
.selectUtil{
    min-width: 50px;
    position: relative;
    font-size: .3rem;
    color:#fff;
}
.selected{
    /* min-height: 1rem; */
    position: relative;
    padding: 3px 10px;
    background: #2CB1FD;
    border-radius: 3px;
}

.active{
  border-radius: 3px 3px 0 0;
}
.selectorWrap{
    width: 100%;
    position: absolute;
    /* max-height: 120px; */
    overflow: auto;
    background: #2CB1FD;
    border-radius: 0 0 3px 3px;
    z-index: 1000;
}
.selectorOptions{
    padding: 3px 10px;
}
.selectorOptions:hover{
    /* opacity:0.5; */
    -webkit-tap-highlight-color:transparent;
    background: #ccc;
}
</style>