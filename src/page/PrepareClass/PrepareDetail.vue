<template>
  <div>
    <group>
      <cell :inline-desc="courseTime" :title="courseName">
        <img class="teacher-avatar" slot="icon" width="20" style="display:block;margin-right:5px;" :src="`${GLOBAL.API_HOST}${avatar}`">
      </cell>
      <x-textarea @on-change="(e) => { setPrepareValue('knowledge', e) }" name="knowledge" :disabled="disabled" :value="prepareInfo.knowledge" title="知识点" placeholder="请填写知识点" :show-counter="true" :rows="2" autosize></x-textarea>
      <x-textarea @on-change="(e) => { setPrepareValue('homeWork', e) }" name="homeWork" :disabled="disabled" :value="prepareInfo.homeWork" title="家庭作业" placeholder="请填写家庭作业" :show-counter="true" :rows="2" autosize></x-textarea>
      <x-textarea @on-change="(e) => { setPrepareValue('prepare', e) }" name="prepare" :disabled="disabled" :value="prepareInfo.prepare" title="课堂寄语" placeholder="请填写课堂寄语" :show-counter="true" :rows="2" autosize></x-textarea>
      <x-textarea @on-change="(e) => { setPrepareValue('memo', e) }" name="memo" :disabled="disabled" :value="prepareInfo.memo" title="课堂备注" placeholder="请填写课堂备注" :show-counter="true" :rows="2" autosize></x-textarea>
      <cell title="文件库选择" is-link @click.native="showResource" v-if="!disabled" />
      <resource-list :show-delete="!disabled" @removeFile="removeFile" title="课件列表" :fileList="prepareInfo.resourceList"/>
    </group>
    <div style="margin: auto; width: 90%;" v-if="!disabled" class="submit-btn">
      <x-button type="default" @click.native="postForm" :show-loading="submitLoading">提交</x-button>
    </div>
    <div class="resource-select" v-if="resourceShow">
      <resource-library @closeLayer="closeLayer" :showDelete="disabled" @addFile="addFile" />
    </div>
  </div>
</template>

<script>
import { Cell, Group, XTextarea, XButton } from 'vux'
import { mapGetters, mapMutations } from 'vuex'
import { getCoursePrepareInfoById, submitCoursePrepareInfo } from '@/service'
import ResourceList from '@/components/ResourceList/ResourceList'
import ResourceLibrary from './ResourceLibrary'
import { validator } from '@/utils'
export default {
  data() {
    return {
      disabled: true,
      submitLoading: false,
      courseName: '',
      resourceShow: false,
      courseTime: '',
      model: {
        CoursePrepareId: {
          value: this.$route.query.id || '',
          rules: [{
            type: 'string',
            required: true,
            message: '缺少备课ID'
           }]
        },
        Time_Sect: {
          value: this.$route.query.time || '',
          rules: [{
            type: 'string',
            required: true,
            message: '缺少时间段'
          }]
        },
        F_Date: {
          value: this.$route.query.date || '',
          rules: [{
            type: 'string',
            required: true,
            message: '缺少日期'
          }]
        },
        TeacherId: {
          value: this.$route.query.TeacherId || '',
          rules: [{
            type: 'string',
            required: true,
            message: '缺少教师ID'
          }]
        },
        CourseId: {
          value: this.$route.query.courseId || '',
          rules: [{
            type: 'string',
            required: true,
            message: '缺少课程ID'
          }]
        }, 
        ClassID: {
          value: this.$route.query.ClassId || '',
          rules: [{
            type: 'string',
            required: true,
            message: '缺少教室ID'
          }]
        }, 
        Memo: {
          value: '',
          rules: [{
            type: 'string',
            required: true,
            message: '请填写备注'
          }]
        }, 
        Homework: {
          value: '',
          rules: [{
            type: 'string',
            required: true,
            message: '请填写家庭作业'
          }]
        }, 
        Prepare: {
          value: '',
          rules: [{
            type: 'string',
            required: true,
            message: '请填写课堂寄语'
          }]
        }, 
        Knowledge: {
          value: '',
          rules: [{
            type: 'string',
            required: true,
            message: '请填写知识点'
          }]
        }, 
        Attachments: {
          value: [],
          rules: [{
            type: 'array',
            required: true,
            message: '请选择课件'
          }],
          transform: (value) => {
            return value.map((item, i) => {
              return item.F_Id
            }).join(',')
          }
        }
      }
    }
  },
  computed: {
    ...mapGetters([
      'roles',
      'prepareInfo',
      'avatar'
    ])
  },
  methods: {
    ...mapMutations([
      'SET_PREPAREINFO',
      'CLEAR_PREPAREINFO',
      'SET_ICONFUNCTION',
      'SET_SINGLEPREPAREINFO',
      'ADD_FILES',
      'REMOVE_FILE'
    ]),
    closeLayer() {
      this.resourceShow = false
    },
    removeFile(id) {
      this.REMOVE_FILE(id)
    },
    setPrepareValue(name, value) {
      this.SET_SINGLEPREPAREINFO({ key: name, value })
    },
    async postForm() {
      this.submitLoading = true
      const { homeWork, knowledge, memo, prepare, resourceList } = this.prepareInfo
      try {
        this.model.Memo.value = memo
        this.model.Knowledge.value = knowledge
        this.model.Prepare.value = prepare
        this.model.Homework.value = homeWork
        this.model.Attachments.value = resourceList
        let fields = await validator(this.model)
        let data = await submitCoursePrepareInfo(fields)
        this.$vux.toast.show({
          text: '修改成功',
          type: 'success'
        })
        this.submitLoading = false
        this.$router.push({
          name: 'PrepareClass'
        })
      } catch (err) {
        console.log(err)
        this.submitLoading = false
        if (err.code === 'FIELDS_ERROR') {
          this.$vux.toast.show({
            text: err.message,
            type: 'warn'
          })
        }
      }

    },
    showResource() {
      this.resourceShow = true
    },
    addFile(file) {
     this.resourceShow = false
     this.ADD_FILES(file)
    }
  },
  mounted() {
    this.CLEAR_PREPAREINFO()
    if (this.roles[0] === 'teacherDuty' || this.roles[0] === 'admin') {
      this.SET_ICONFUNCTION(() => {
        this.disabled = !this.disabled
      })
    }
    let { id, date, time, ClassId, TeacherId, courseId } = this.$route.query
    if (id) {
      this.$vux.loading.show({
        text: '加载中...'
      })
      getCoursePrepareInfoById({ CourseId: courseId, CoursePrepareId: id, F_Date: date, Time_Sect: time, ClassId, TeacherId }).then(data => {
        this.$vux.loading.hide()
        this.courseName = data.data.F_CourseName
        this.courseTime = data.data.F_Time
        this.SET_PREPAREINFO({
          homeWork: data.data.F_HomeWork,
          prepare: data.data.F_Prepare,
          knowledge: data.data.F_knowledge,
          memo: data.data.F_Memo,
          resourceList: JSON.parse(data.data.F_attachments)
        })
      }).catch(err => {
        this.$vux.loading.hide()
      })
    }
  },
  components: {
    Cell,
    Group,
    XTextarea,
    ResourceList,
    XButton,
    ResourceLibrary
  }
}
</script>

<style lang="less" scoped>
.teacher-avatar {
  width: 50px;
  border-radius: 50%;
  height: 50px;
}
.submit-btn {
  padding: 15px;
}
.resource-select {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  right: 0;
  z-index: 9999;
  background: #ffffff;
}
</style>