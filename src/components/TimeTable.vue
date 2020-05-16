<template>
  <div>
    <div class="tab-top">
      <div class="cur-month">{{ curMonth }}月</div>
      <div class="week-list">
        <div :class="`${ todayIndex === index ? 'active' : '' } day-text`" v-for="(item, index) in weekDates" :key="index">
          <span class="text">{{ weekLabels[index] }}</span>
          <span class="text">{{ item }}</span>
        </div>
      </div>
    </div>
    <div class="tab-scroll">
      <div class="tab-container">
        <div class="tab-divide">
          <div class="tab-divide-item" :style="{flex: item.length}" v-for="(item, index) in courseTime.course" :key="index">
            <span class="text">{{ index }}</span>
          </div>
        </div>
        <div class="tab-section">
          <div class="tab-section-divide" :style="{flex: item.length}" v-for="(item, index, i) in courseTime.course">
            <div class="tab-section-item" v-for="(item1, index1) in item">
              <span>{{ item1.ClassHour }}</span>
            </div>
          </div>
        </div>
        <div class="tab-line-container">
          <div class="week-group" :style="{flex: item.length}" v-for="(item, index, i) in courseTime.course">
            <div class="course-container" v-for="(day, index1) in item">
			        <div class="week-container" v-for="(n, j) in 7">
                <div :data-index="index1" class="course-item" @click="handleCourseClick(course)" v-for="(course) in tasklist" v-if="j === course.day && day.ClassHour === course.start">
                    <div class="course-item-inner" v-if="course.course !== null">
                      {{course.course}}
                    </div>
                </div>
			        </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { dateUtil } from '@/utils'

import _ from 'lodash'

let formatWeekDate = function (date) {
  return date.getDate() + '日'
}

let today = new Date()
let curFirstWeekDate
let weekCourseList

export default {
  data() {
    return {
      todayIndex: -1, // 当天索引0-6，-1表示不在当前周
      curMonth: '', // 当前月份
      curWeek: '', // 当前周数
      curTitle: '', // 当前周标题
      courseColors: ['#ffca7f', '#91d7fd', '#96a4f9'],
      weekLabels: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
      weekDates: [], // 周日期列表
      tasklist: []  // 课程列表
    }
  },
  props: {
    list: {
      type: Array,
    },
    courseClick: {
      type: Function
    },
    startDate: {
      required: true
    },
    timeList: {
      type: Object,
      required: true
    }
  },
  mounted () {
    this.formatCourseTime()
    this.updateWeeks(this.startDate)
  },
  methods: {
    formatCourseTime() {
      
    },
    updateWeeks(date) {
      console.log(date)
      let todayIndex = -1
      if (date.getFullYear() == today.getFullYear() && date.getMonth() == today.getMonth() && dateUtil.getMonthWeekth(date) == dateUtil.getMonthWeekth(today)) {
        todayIndex = dateUtil.formatWeekOrder(today.getDay())
      }
      // 获取当前周日期
      curFirstWeekDate = dateUtil.getWeekFirstDate(date)
      let curMonth = curFirstWeekDate.getMonth() + 1
      let weekDates = []
      let tmpFirstDate = new Date(curFirstWeekDate)
      for (var i = 0; i < 7; i++) {
        if (i == 0) {
          weekDates.push(formatWeekDate(curFirstWeekDate))
        } else {
          weekDates.push(formatWeekDate(dateUtil.getDiffDate(tmpFirstDate, 1)))
        }
      }
      console.log(weekDates)

      let curWeek = '第' + dateUtil.getMonthWeekth(date) + '周'
      let curTitle = '17-18学年春季'

      let tasklist = weekCourseList = this.list
      this.todayIndex = todayIndex
      this.curMonth = curMonth
      this.curWeek = curWeek
      this.weekDates = weekDates
      this.tasklist = tasklist
    },
    handleCourseClick(course) {
      this.$emit('courseClick', course)
    },
  },
  computed: {
    courseTime() {
      let dateMap = {
        'MN': '早晨',
        'AM': '上午',
        'CM': '中午',
        'PM': '下午',
        'EN': '晚上'
      }
      let output = {
        course: {},
        list: []
      }
      let newTimeList = {}
      let index = 0
      _.forEach(dateMap, (item, i) => {
        _.forEach(this.timeList, (_item, _i) => {
         if (i === _i) {
           newTimeList[i] = _item
         }
        })
      })
      _.forEach(dateMap, (item, i) => {
        _.forEach(newTimeList, (n, j) => {
          if (n.length !== 0) {
              output.course[dateMap[j]] = n
          }
        })
      })
      return output
    }
  },
  watch: {
    list() {
      console.log('list', this.startDate)
      this.updateWeeks(this.startDate)
    },
    startDate() {
      console.log('startDate', this.startDate)
      this.updateWeeks(this.startDate)
    }
  }
}
</script>

<style scoped lang="less">
.tab-top {
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 1.2rem;
  .cur-month {
    width: 1.23rem;
    height: .63rem;
    background-color: #fe5700;
    text-align: center;
    line-height: .63rem;
    color: #fff;
    font-size: .35rem;
    border-top-right-radius: 30px;
    border-bottom-right-radius: 30px;
  }
  .week-list {
    display: flex;
    flex-direction: row;
    max-width: 100%;
    width: 100%;
    height: 100%;
    .day-text {
      height: 100%;
      font-size: .35rem;
      justify-content: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      flex: 1;
	  border-right: 1px solid #CACBCC;
	  &:first-child {
	    border-left: 1px solid #CACBCC;
	  }
	  &:last-child {
	    border-right: none;
	  }
      .text {
        &:first-child {
          color: #18191A;
        }
        &:last-child {
          color: #7A7D80;
        }
      }
      &.active {
        background-color: #fe5700;
        .text {
          color: #ffffff
        }
      }
    }
  }
}
.tab-scroll {
  height: 100%;
  z-index: 10;
  position: relative;
  border-top: 1px solid #cacbcc;
  background-color: #fff;
  width: 100%;
  .tab-container {
    width: 100%;
    height: calc(~'100% - 1.2rem - 46px');
    display: flex;
    .tab-divide {
      display: flex;
      flex-direction: column;
      background-color:#f6f6f6;
      color:#7A7D80;
      height: 100%;
      .tab-divide-item {
        width: .5565rem;
        font-size: .35rem;
        text-align: center;
        justify-content: center;
        display: flex;
        flex: 1;
        align-items: center;
        border-bottom: 1px solid #cacbcc;
        border-right: 1px solid #cacbcc;
        box-sizing: border-box;
        .text {
          width: 24px;
          line-height: 1.5;
        }
      }
    }
    .tab-section {
      display: flex;
      flex-direction: column;
      background-color:#f6f6f6;
      color:#18191A;
      height: 100%;
      .tab-section-divide {
        width: .5565rem;
        flex: 1;
        text-align: center;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        border-bottom: 1rpx solid #cacbcc;
        box-sizing: border-box;
        .tab-section-item {
          width: 100%;
          flex: 1;
          font-size: .35rem;
          justify-content: center;
          display: flex;
          align-items: center;
		  border-bottom: 1px solid #cacbcc;
        }
      }
    }
    .tab-line-container {
      display: flex;
      flex: 1;
      flex-direction: column;
      height: 100%;
      .week-group {
        display: flex;
        flex-direction: column;
        flex: 1;
        border-bottom: 1px solid #cacbcc;
		height: 100%;
        .course-container {
          display: flex;
          flex: 1;
		  flex-direction: row;
		  border-bottom: 1px solid #CACBCC;
		  &:last-child {
		    border-bottom: none;
		  }
		  .week-container {
		    display: flex;
		    flex: 1;
			border-left: 1px solid #cacbcc;
			&:first-child {
			  border-left: none;
			}
		  }
          .course-item {
            display: flex;
            flex: 1;
            justify-content: center;
            align-items: center;
            .course-item-inner {
              width: 75%;
              border-radius: 3px;
              padding: .2rem 0;
              background: #ffca7f;
              color: #fff;
              display: flex;
              flex-flow: column wrap;
              justify-content: center;
              align-items: center;
              overflow: hidden;
              text-overflow: ellipsis;
              text-align: center;
              height: .95rem;
            }
          }
        }
      }
      .tab-line {
        position: absolute;
        width: 100%;
      }
    }
  }
}
</style>