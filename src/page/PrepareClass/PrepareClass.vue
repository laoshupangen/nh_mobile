<template>
  <div class="">
    <tab v-model="index" :animate="false">
      <tab-item @on-item-click="toggleList">今日</tab-item>
      <tab-item @on-item-click="toggleList">明日</tab-item>
      <tab-item @on-item-click="toggleList">昨日</tab-item>
      <tab-item @on-item-click="toggleCalendar">筛选</tab-item>
    </tab>
    <ul v-if="dataList.length !== 0" class="prepare-list">
      <router-link tag="li" :to="{ name: 'PrepareDetail', query: { id: item.CoursePrepareID, courseId: item.CourseID, date: item.Date, time: item.TimeSection, ClassId: item.ClassID , TeacherId: item.TeacherUserID } }" v-for="(item, i) in dataList" :key="i">
        <div class="prepare-info">
          <p>{{ item.TimeSection }}</p>
          <p>{{ item.CourseName }}/{{ item.ClassName }}</p>
        </div>
        <div class="prepare-detail">
          <p>{{ item.HasPrepare ? '已备课' : '未备课' }}</p>
          <p>{{ item.HasHomework ? '已布置作业' : '未布置作业' }}</p>
        </div>
        <div>

        </div>
      </router-link>
    </ul>
  </div>
</template>

<script>
import { Tab, TabItem, Group, Cell } from 'vux'
import { mapGetters } from 'vuex'
import { getCoursePrepareList } from '@/service'
import moment from 'moment'
export default {
  data() {
    return {
      index: 0,
      dataList: [],
      date: '',
      dateMap: {
        0: moment().format('YYYY-MM-DD'),
        1: moment().add(1, 'days').format('YYYY-MM-DD'),
        2: moment().subtract(1, 'days').format('YYYY-MM-DD')
      }
    }
  },
  components: {
    Tab,
    TabItem,
  },
  computed: {
    ...mapGetters([
      'userInfo',
      'currentOb'
    ])
  },
  mounted() {
    this.getList(this.dateMap[0])
  },
  methods: {
    toggleList() {
      let date = this.dateMap[this.index]
      this.getList(date)
    },
    getList(date) {
      this.$vux.loading.show({
        text: '加载中...'
      })
	  this.dataList = []
      getCoursePrepareList({ UserId: this.userInfo.UserId, Time: date }).then(data => {
        this.$vux.loading.hide()
        if (data.data.data.length) {
          this.dataList = data.data.data
        }
      }).catch(err => {

      })
    },
    toggleCalendar() {
      const that = this
      this.$vux.datetime.show({
        value: this.dateMap[0],
        confirmText: '确认',
        cancelText: '取消',
        onHide (value) {
          that.getList(this.value)
        },
        onShow () {
          const _this = this
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.prepare-list {
  li {
    width: 100%;
    display: flex;
    flex-direction: row;
    padding: 8px;
    border-bottom: 1px solid #D7D7D7;
    .prepare-info {
      flex: 1
    }
  }
}
</style>
