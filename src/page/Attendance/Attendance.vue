<template>
  <div>
    <div class="calendar-wrapper">
      <div class="calendar-body">
        <v-date-picker @update:frompage="getDetail" @update:topage="getDetail" :value="selectDate" @dayclick='handleDayEvent' :is-inline="true" mode="single" :attributes="attributes" :theme-styles="calendar.themeStyles" is-expanded></v-date-picker>
      </div>
      <div class="calendar-footer">
        <div class="attendance-hint">
          <div class="">
            <div class="normal mark"></div>
            <span>正常</span>
          </div>
          <div class="">
            <div class="late mark"></div>
            <span>迟到早退</span>
          </div>
          <div class="">
            <div class="lack mark"></div>
            <span>缺勤</span>
          </div>
        </div>
      </div>
    </div>
    <div class="attendance-detail">
      <panel :header="`${ dateFormat(selectDate, 'YYYY-MM-DD') }打卡详情`" :list="list" type="1"></panel>
    </div>
  </div>
</template>

<script>
import { Panel, dateFormat } from 'vux'
import { mapGetters } from 'vuex'
import _ from 'lodash'
import moment from 'moment'

import { calendar } from '@/config'

import { getAttendanceById } from '@/service'


let colorMap = {
  '1': {
    color: '#7575F9',
    name: '正常',
  },
  '2': {
    color: '#FF3654',
    name: '缺勤'
  },
  '3': {
    color: '#FFC868',
    name: '迟到'
  },
  '4': {
    color: '#FF3654',
    name: '早退'
  },
  '5': {
    color: '#FF3654',
    name: '无效'
  },
  '6': {
    color: '#FF3654',
    name: '缺卡'
  },
}

export default {
  data () {
    return {
      calendar,
      selectDate: new Date(),
      list: [],
      attributes: [],
    }
  },
  components: {
    Panel
  },
  computed: {
    ...mapGetters([
      'currentOb'
    ])
  },
  methods: {
    handleDayEvent(day) {
      this.selectDate = day.date
      let d = _.find(this.attributes, (n) => {
        return dateFormat(n.dates, 'YYYY-MM-DD') === dateFormat(day.date, 'YYYY-MM-DD')
      })
      if (d) {
        if (d.data !== '[]') {
          this.list =  _.map(d.data, (item, i) => {
            return {
              title: item.F_CheckInfo,
              desc: item.F_CheckTime
            }
          })
          console.log(this.list)
        } else {
          this.list = []
        }
      }
    },
    getDetail(time) {
      let date = `${time.year}-${time.month}`
      this.$vux.loading.show({
        text: '加载中...'
      })
      getAttendanceById({
        time: date,
        classId: this.currentOb.classId,
        student: this.currentOb.studentNum
      }).then(data => {
        let d = JSON.parse(data.data.data)
        this.$vux.loading.hide()
        this.attributes = this.generateInfo(d)
      }).catch(err => {
        console.log(err)
        this.$vux.loading.hide()
      })
    },
    generateInfo(data) {
     let output =  _.map(data, (item, i) => {
       let index
       if (item.F_CheckType.indexOf('3') !== -1 || item.F_CheckType.indexOf('4') !== -1) {
         index = '3'
       } else if (item.F_CheckType.indexOf('1') !== -1) {
         index = '1'
       } else {
         index = '2'
       }
       return {
         highlight: {
           backgroundColor: colorMap[index].color
         },
         contentStyle: {
           color: 'white',
         },
         dot: {
           backgroundColor: colorMap[index].color,
         },
         data: item.F_CheckTime,
         dates: moment(item.F_CheckDate).toDate()
       }
     })
     return output
    },
    dateFormat
  }
}
</script>

<style lang="less">
.c-day-background {
  width: .8rem!important;
  height: .8rem!important
}
.c-day-popover-content {
  font-size: .38rem!important;
}
.calendar-wrapper {
  .calendar-body {
    text-align: center;
  }
  .calendar-footer {
    .attendance-hint {
      display: flex;
      padding: 15px;
      justify-content: flex-end;
      & > div {
        flex-direction: row;
        margin-left: 10px;
        .mark {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          display: inline-block;
          &.normal {
            background-color: #7575F9
          }
          &.late {
            background-color: #FFC868
          }
          &.lack {
            background-color: #FF3654
          }
        }
      }
    }
  }
}
</style>