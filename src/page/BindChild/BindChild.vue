<template>
  <div>
    <div class="bind-wrapper">
      <div class="bind-header"></div>
      <div class="bind-form">
        <div class="form-item">
          <input v-model="studentname" placeholder="请输入学生姓名" />
        </div>
        <div class="form-item">
          <input v-model="cardno" placeholder="请输入学生身份证号" />
        </div>
        <div class="bind-button">
          <x-button :disabled="loading" :show-loading="loading" @click.native="bindStudent">绑定</x-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { XButton } from 'vux'
import { bindChild } from '@/service'
import { noty } from '@/utils'
import { mapMutations } from 'vuex'
export default {
  data () {
    return {
      studentname: '',
      cardno: '',
      loading: false,
    }
  },
  components: {
    XButton
  },
  methods: {
    ...mapMutations([
      'ADD_CHILDREN',
      'SET_CURRENTOBJECT'
    ]),
    async bindStudent () {
      if (!this.studentname) {
        this.$vux.toast.show({
          text: '请输入学生姓名',
          type: 'warning'
        })
        return
      }
      if (!this.cardno) {
        this.$vux.toast.show({
          text: '请输入学生证件号',
          type: 'warning'
        })
        return  
      }
      try {
        this.loading = true
        let data = await bindChild({ 
          F_StudentName: this.studentname,
          F_CardNo: this.cardno
        })
        if (!data.data.data.classId) {
          noty('warning', `${this.studentname}未绑定班级`)
          return
        }
        this.loading = false
        this.ADD_CHILDREN(data.data.data)
        this.SET_CURRENTOBJECT({
          id: data.data.data.F_Stu_Id,
          key: 'id'
        })
        noty('success', '绑定成功')
        
        this.$router.push({
          name: 'Profile'
        })
      } catch (err) {
        
      }
      
    }
  }
}
</script>

<style lang="less" scoped>
.bind-wrapper {
  .bind-header {
    background-repeat: no-repeat;
    background-image: url('./../../assets/login-bg.png');
    height: 5.6rem;
    background-size: cover;
    width: 100%;
    background-position: center center;
  }
  .bind-form {
    width: 80%;
    margin: 0 auto;
    .form-item {
      border-bottom: 1px solid #dcdcdc;
      input {
        appearance: none;
        border: none;
        margin-bottom: 2px;
        height: 1.5rem;
        width: calc(~"100% - 50px");
      }
    }
  }
  .bind-button {
      margin-top: 20px;
      button {
        background: #5CCAE6;
        color: #ffffff
      }
    }
}
</style>