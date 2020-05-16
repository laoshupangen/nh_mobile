<template>
  <div>
    <div class="extra">
      <p>备注: {{ memo || '无' }}</p>
      <p>选课截止时间: {{ endTime }}</p>
    </div>
    <group v-for="(item) in courseGroups" :title="item.CourseGroupTypeName" :key="item.CourseGroupId">
      <radio v-model="radioValue" :options="item.Options"></radio>
    </group>
    <div style="padding: 10px;">
      <x-button :show-loading="loading" @click.native="submit">提交</x-button>
    </div>
  </div>
</template>
    
<script>
import { Radio, Group, XButton } from 'vux'
import { mapGetters, mapMutations } from 'vuex'
import { getCourseGroup, setCourseGroup } from '@/service'
import _ from 'lodash'
export default {
  data() {
    return {
      courseGroup: [],
      memo: '',
      id: '',
      endTime: '',
      radioValue: '',
      loading: false
    }
  },
  mounted() {
    this.getCourse()
    this.SET_ICONFUNCTION(() => {
      this.$router.push({
        name: 'CourseChart',
        query: {
          id: this.$route.query.id
        }
      })
    })
  },
  components: {
    Radio,
    Group,
    XButton
  },
  methods: {
    ...mapMutations([
      'SET_ICONFUNCTION',
    ]),
    getCourse() {
      this.$vux.loading.show({
        text: '加载中...'
      })
      getCourseGroup(this.$route.query.id).then(data => {
        this.courseGroup = data.data.CourseGroups
        this.memo = data.data.F_Memo
        this.endTime = data.data.EndTime
        this.$vux.loading.hide()
      })
      
    },
    submit() {
      this.loading = true
      setCourseGroup({
        StudentId: this.currentOb.id, 
        TaskId: this.$route.query.id, 
        CourseGroupId: this.radioValue
      }).then(data => {
        this.loading = false
        this.$vux.toast.show({
          text: '选课成功',
          type: 'success'
        })
        this.$router.push({
          name: 'CourseChart',
          query: {
            id: this.$route.query.id
          }
        })
      })
    }
  },
  computed: {
    ...mapGetters([
      'currentOb',
      'dictionary'
    ]),
    courseGroups() {
      let index = 1
      return _.map(this.courseGroup, (item, i) => {
        return {
          CourseGroupId: item.CourseGroupId,
          CourseGroupType: item.CourseGroupType,
          CourseGroupTypeName: this.dictionary.dataItems.CourseGroupType[item.CourseGroupType],
          Options: _.map(item.Courses.split(','), (n, j) => {
            index += 1
            return {
              value: this.dictionary.course[n].F_Name,
              key: `${item.CourseGroupId}`
            }
          })
        }
      })
    }
  },
}
</script>
<style scoped>
.extra {
  padding: 10px;
  font-size: 16px;
}
</style>