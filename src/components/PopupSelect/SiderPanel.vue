<template>
    <div class="container">
        <div class="sider">
            <div v-for="(d,index) in data" :class="i===index?'active':''" :key="index" @click="select(d,index)" class="sider-item">
                {{d.value}}
            </div>
        </div>
        <div class="leftPanel">
            <Pulldown :dataSource="temdata" @onSelect="choose"></Pulldown>
            
        </div>

    </div>
</template>
<script>
import Pulldown from '@/components/PopupSelect/Pulldown'

export default {
    data(){
       return{
           temCls:'',
           temdata:[],
           i:0,
           temvalue:'',
           show:true,
           value:{}
       }
       
    },
    props:{
        data:{
            type:Array,
            required:true
        },
        
        
    },
    components:{Pulldown},
    mounted(){
        this.temvalue = this.data[0].value
        
        this.temdata =this.data[0].children
    },
    methods:{
        select(data,index){
            console.log('siderSelect',data)
            this.i = index
            this.temvalue = data.value
            this.temdata = data.children

        },
        choose(val){
            let v = {
                key:val.key,
                value:this.temvalue+'/'+val.value
            }
            console.log('a',v)
            this.$emit('onSelect',v)

        }
    }

    
}
</script>
<style scoped>
.container{
    position: relative;
    width: 100%;
    display: flex;
}
.sider{
    /* width: 20%; */
    border-width: 0 1px 0 1px;
    border-color: #ccc;
    border-style: solid;
}
.leftPanel{
    flex: 1;
}
.sider-item{
    background: #fff;
    padding: 5px 20px;  
    font-size: initial;
    
}
.active{
    background: rgb(124,189,81);
}
</style>

