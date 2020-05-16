<template>
  <div class="schedule">
    <div class="date-picker"><el-date-picker
      v-model="dateValue"
      type="week"
      size="mini"
      @change="change"
      :picker-options="{
        firstDayOfWeek: 1
      }"
      format="yyyy 第 WW 周"
      placeholder="选择周" /></div>
    <time-table class="table" :time-list="timeList" :start-date="dateValue" :list="lessonList" @courseClick="courseClick"></time-table>
  </div>
</template>

<script>
import TimeTable from '@/components/TimeTable'
import { mapGetters } from 'vuex'
import _ from 'lodash'
import moment from 'moment'
import { getStudentCourse, geTeacherCourse, getCourseTime } from '@/service'
export default {
  data() {
    return {
      lessonList: [],
      dateValue: new Date(),
      timeList: {}
    }
  },
  computed: {
    ...mapGetters([
      'roles',
      'currentOb',
      'userInfo'
    ])
  },
  mounted() {
    this.getLessonList(null, null, true)
    console.log(this.startDate)
  },
  components: {
    TimeTable
  },
  methods: {
    change(e) {
      console.log(e)
    },
    async getLessonList(startDate, endDate, init) {
      let role = this.roles[0]
      let listData
      if (init) {
        let classTable = await getCourseTime(this.currentOb.classId)
        this.timeList = classTable.data
      }
      try {
        if (role === 'teacherDuty') {
          listData = await geTeacherCourse(this.userInfo.UserId)
        } else if (role === 'parentDuty') {
          listData = await getStudentCourse(this.currentOb.userId)
        }
        this.lessonList = this.processData(listData.data)
      } catch(err) {
        console.log(err)
      } 
    },
    processData (data) {
      let output = []
      _.forEach(data, function (item, i) {
        output.push({
          ...item,
          course: item.F_CourseName,
          day: Number(item.F_Week) - 1,
          start: item.F_LessonNo
        })
      })
      return output
    },
    courseClick(course) {
      if(this.userInfo.Duty === 'teacherDuty') {
	    this.$router.push({ name: 'PrepareDetail', query: { id: course.F_Course_PrepareID, courseId: course.F_CourseId, date: course.F_Date, time: course.F_TimeSect, ClassId: this.currentOb.classId , TeacherId: course.F_Teacher_ID } })
	  }
    }
  }
}
</script>

<style lang="less">
.schedule {
  display: flex;
  flex-direction: column;
  height: calc(~"100% + 96px");
  .date-picker {
    height: 1rem;
    text-align: center;
    padding: 5px;
  }
  .table {
    height: calc(~"100% - 1rem")
  }
}
</style>