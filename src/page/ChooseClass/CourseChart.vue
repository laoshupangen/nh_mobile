<template>
  <div>
    
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getCourseReport } from '@/service'
import { XTable } from 'vux'
import _ from 'lodash'
export default {
  data() {
    return {
      formatter: function (val) {
        return `${(val * 100).toFixed(0)}%`
      },
      data: {
        data: [{ courseName: '', name: '', value: 0 , percent: 0 }]
      }
    }
  },
  computed: {
    ...mapGetters([
      'dictionary'
    ]),
  },
  mounted() {
    this.getReport()
  },
  methods: {
    getReport() {
      getCourseReport(this.$route.query.id).then(data => {
        let chartSeries = this.getChartSeries(data.data)
        this.data = chartSeries
      })
    },
    getChartSeries(data) {
      let result = _.reduce(data, (result, value, key) => {
        let courseName = _.map(value.F_CourseNames.split(','), (n) => {
          return this.dictionary.course[n].F_Name
        }).join('+')
        result.data.push({ courseName, name: '已选', value: value.F_StudentCount, percent: (value.F_StudentCount / value.F_StudentScale) })
        result.data.push({ courseName, name: '未选', value: (value.F_StudentScale - value.F_StudentCount), percent: ((value.F_StudentScale - value.F_StudentCount) / value.F_StudentScale) })
        return result
      }, { data: [], legend: [] })
      console.log(result)
      return result
    }
  },
  components: {
    XTable
  },
}
</script>

<style>

</style>