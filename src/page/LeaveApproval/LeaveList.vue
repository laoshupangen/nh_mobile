<template>
  <div style="height: 100%">
    <tab v-model="index" :animate="false">
      <tab-item @on-item-click="resetList" active-class="active-6-1" selected>待审批</tab-item>
      <tab-item @on-item-click="resetList" active-class="active-6-2">已审批</tab-item>
    </tab>
	<mescroll-vue id="mescroll" class="mescroll-container" @init="initCallBack" :up="up" :down="down">
	  <group>
	    <div v-for="(item, i) in list" :key="i">
	      <form-preview :name="item.ID" :header-label="item.headLabel" :footer-buttons="index + 1 === 2 ? false : buttons" :header-value="item.headValue" :body-items="item.options"></form-preview>
		  <br/>
	    </div>
	  </group>
	</mescroll-vue>
    
  </div>
</template>

<script>
import { FormPreview, Group, Tab, TabItem } from 'vux'
import { getLeaveListTeacher, approvalLeave } from '@/service'
import { mapGetters } from 'vuex'
import MescrollVue from 'mescroll.js/mescroll.vue'
import _ from 'lodash'
export default {
  data() {
    return {
	  list: [],
	  index: 0,
	  meScroll: {},
	  up: {
        use: true,
        callback: this.upCallBack,
        auto: true,
        isBounce: false,
        page: {
          num: 0,
          size: 15,
        }
      },
	  down: {
        use: false,
      },
	  buttons: [{
        style: 'primary',
        text: '通过',
		onButtonClick: (name) => {
		  let that = this
          this.$vux.confirm.prompt('请填写理由', {
		    title: '请填写理由',
            onCancel () {},
            onConfirm (msg) {
			  that.postLeave(name, msg, 2)
			}
          })
        }
      }, {
        style: 'primary',
        text: '不通过',
		onButtonClick: (name) => {
		  let that = this
          this.$vux.confirm.prompt('请填写理由', {
		    title: '请填写理由',
            onCancel () {},
            onConfirm (msg) {
			  that.postLeave(name, msg, 3)
			}
          })
        }
      }]
	}
  },
  mounted() {
    
  },
  methods: {
    resetList (index) {
      this.list = []
      this.meScroll.resetUpScroll()
    },
	async postLeave(id, approvalOpinion, status ) {
	  this.$vux.loading.show({
        text: '加载中1...'
      })
	  try {
	    let res = await approvalLeave({
		  id, 
		  approvalOpinion, 
		  status
		})
		this.$vux.loading.hide()
		this.index = 1
		this.resetList()
	  } catch(err) {
	    this.$vux.loading.hide()
	  }
	},
	initCallBack(mescroll) {
      this.meScroll = mescroll
    },
	async upCallBack(page, mescroll) {
      try {
         let data = await this.getList(page.num, page.size)
		 console.log(this.parseList(data.rows))
         this.list = _.concat(this.list, this.parseList(data.rows))
         this.meScroll.endSuccess(15, data.rows.length === 15)
      } catch(err) {
        console.log(err)
		this.meScroll.endSuccess(15, true)
      }
    },
    async getList(pageNum, pageSize) {
	  console.log(pageSize, pageNum)
	  try {
	    let data = await getLeaveListTeacher({
		  rows: pageSize, 
          page: pageNum,
		  status: this.index + 1,
		})
		return data.data
	  }catch(err) {
	  
	  }
	},
	parseList(data) {
	  let jMap = {
	    Applicant: '申请人',
		Student: '请假学生',
		LeaveType: '请假类型',
		ApprovalOpinion: '审批意见',
		CreatedTime: '申请时间',
		ApprovalTime: '审批时间',
		StartTime: '开始时间',
		EndTime: '结束时间',
		ReasonForLeave: '请假理由',
		LeaveDays: '请假天数',
		
	  }
	  let tMap = {
	    '1': '事假',
		'2': '病假'
	  }
	  let sMap = {
	    '1': '审批中',
		'2': '通过',
		'3': '不通过'
	  }
	  let output = []
	  _.forEach(data, function (item, i) {
	    output.push({
		  headLabel: '审核结果',
		  headValue: sMap[item.Status] || '无',
		  ID: item.ID,
		  options: _.map(item, function (n, j) {
		    if (j === 'LeaveType') {
			  return {
			    label: jMap[j],
			    value: tMap[n]
			  }
			} else if(j === 'ID') {
			  return {
			    label: '',
				value: ''
			  }
			} else if(j !== 'Status') {
			  return {
			    label: jMap[j],
			    value: n || '无'
			  }
			} else {
			  return {
			    label: '',
				value: ''
			  }
			}
		  })
		})
	  })
	  console.log(output)
	  return output
	}
  },
  components: {
    FormPreview, 
	Group,
	Tab, 
	TabItem,
	MescrollVue
  },
  computed: {
    ...mapGetters([
	  'userInfo'
	])
  }
}
</script>

<style>

</style>