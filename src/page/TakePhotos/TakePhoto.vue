<template>
    <div class="takephoto">
        <div class="photo-wrap">           
            <div class="photo-content"></div>
            <div style="width:4.5rem;color:#999;">请提供本人的正面人脸照片,避免出现多张人脸</div>
               
        </div>
        <div class="take-confirm">
            <x-button>拍照</x-button>
        </div>
        <div class="take-cancle">
            <x-button @click.native="()=>$router.go(-1)">取消</x-button>
        </div>
        

    </div>
</template>
<script>
import {XButton} from 'vux'
export default {
    data(){
        return{

     }
    },
    methods:{

    },
    components:{
        XButton
    }
    
}
</script>
<style scoped>
.takephoto{
    height: 100%;
    padding: 1rem 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    /* justify-content: space-around; */
}
.photo-wrap{
    flex: 1;
    padding-top: 1rem;
}

 .take-confirm, .take-cancle{
    width: 80%;
    padding: .2rem 0;
}
.photo-content{
    margin: auto;
    width: 160px;
    height:200px;
    border: 1px solid #ccc;
}
.take-confirm button{
    background: #5ccae6;
   
}

</style>


