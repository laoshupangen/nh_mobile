<template>
  <div class="leave-wrapper">
    <group>
      <popup-radio title="请假孩子" :options="childList" v-model="model.F_StudentID.value" class="mb-5"></popup-radio>

      <popup-radio title="请假类型" :options="leaveType" v-model="model.F_LeaveType.value" class="mb-5"></popup-radio>

      <datetime title="开始时间" :start-date="today" format="YYYY-MM-DD A" v-model="model.F_StartTime.value" class="mb-5"></datetime>

      <datetime title="结束时间" :start-date="dateEnd" format="YYYY-MM-DD A" v-model="model.F_EndTime.value" class="mb-5"></datetime>

      <x-input title="请假天数" :value="leaveDays" :disabled="true" class="mb-5"></x-input>

      <x-textarea title="请假事由" :max="200" placeholder="请输入请假事由" v-model="model.F_ReasonForLeave.value" :show-counter="true" :height="200" :rows="8" :cols="40"></x-textarea>

    </group>
    <div class="btn-wrap">
      <x-button :show-loading="loading" @click.native="submitForm" style="margin-top: 15px;">提交</x-button>
    </div>
  </div>
</template>

<script>
import { Group, PopupRadio, Datetime, XTextarea, XButton, XInput } from 'vux'
import { mapGetters, mapMutations } from 'vuex'
import { applyLeave } from '@/service'
import { validator } from '@/utils'
import moment from 'moment'
export default {
  data() {
    return {
      today: moment().format('YYYY-MM-DD'),
	  loading: false,
      leaveType: [{
        key: 1,
        value: '事假'
      }, {
        key: 2,
        value: '病假'
      }],
      model: {
        F_Applicant: {
          value: '',
          rules: [{
            type: 'string',
            required: true,
            message: '申请人参数为空'
          }]
        },
        F_StudentID: {
          value: '',
          rules: [{
            type: 'string',
            required: true,
            message: '请选择孩子'
          }]
        },
        F_LeaveType: {
          value: '',
          rules: [{
            type: 'number',
            required: true,
            message: '请选择请假类型'
          }]
        },
        F_StartTime: {
          value: '',
          rules: [{
            type: 'string',
            required: true,
            message: '请选择开始时间'
          }]
        },
        F_EndTime: {
          value: '',
          rules: [{
            type: 'string',
            required: true,
            message: '请选择结束时间'
          }]
        },
        F_LeaveDays: {
          value: '',
          rules: [{
            type: 'number',
            required: true,
            message: '请假天数不能为空'
          }]
        },
        F_ReasonForLeave: {
          value: '',
          rules: [{
            type: 'string',
            required: false
          }]
        }
      }
    }
  },
  components: {
    Group,
    PopupRadio,
    Datetime,
    XTextarea,
    XButton,
    XInput
  },
  mounted() {
    this.SET_ICONFUNCTION(() => {
      this.$router.push({
        name: 'LeaveList'
      })
    })
  },
  methods: {
    ...mapMutations([
      'SET_ICONFUNCTION',
    ]),
    async submitForm() {
	   this.loading = true
       try {
         this.model.F_Applicant.value = this.userInfo.UserId
         this.model.F_LeaveDays.value = this.leaveDays
         let fields = await validator(this.model)
		 let response = await applyLeave(fields)
		 this.loading = false
		 this.$vux.toast.show({
		   text: '申请成功',
		   type: 'success'
		 })
		 this.$router.push({name: 'LeaveList'})
       } catch(err) {
         if (err.code === 'FIELDS_ERROR') {
		   this.loading = false
           this.$vux.toast.show({
             text: err.message,
             type: 'warn'
           })
         }
       }
    }
  },
  computed: {
    ...mapGetters([
      'children',
      'userInfo'
    ]),
    dateEnd() {
      return this.model.F_StartTime.value.substring(0, this.model.F_StartTime.value.length - 3)
    },
    childList() {
      return _.map(this.children, (item, i) => {
        return {
          key: item.userId,
          value: item.studentName
        }
      })
    },
    leaveDays() {
      let startSection = this.model.F_StartTime.value.indexOf('PM') !== -1 ? 'PM' : 'AM'
      let startDate = this.model.F_StartTime.value.substring(0, this.model.F_StartTime.value.length - 3)
      let endSection = this.model.F_EndTime.value.indexOf('PM') !== -1 ? 'PM' : 'AM'
      let endDate = this.model.F_EndTime.value.substring(0, this.model.F_EndTime.value.length - 3)
      if (!startDate || !endDate) {
        return ''
      } else {
        let output
        let diff = moment(endDate).diff(moment(startDate), 'days')
        if (diff === 0) {
          if (startSection === endSection) {
            output = 0.5
          } else {
            output = 1
          }
        } else {
          if (startSection === endSection) {
            output = diff + 0.5
          } else {
            output = diff + 1
          }
        }
        return output + '天'
      }
    }
  }
}
</script>

<style scoped lang="less">
  .leave-wrapper{
    background: #f0f0f0;
    padding: 15px;
  }
  .weui-cells.vux-no-group-title{
    margin-top: 0 !important;
  }
  .btn-wrap button{
    color: #ffffff;
  }

</style>
