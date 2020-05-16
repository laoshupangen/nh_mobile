<template>
  <div id="choose-class">
    <timeline>
      <timeline-item>
        <div class="card">
          <div class="img">
            <img src="@/assets/chooseClass1.png" />
          </div>
          <div class="info">
            <p class="title">预选科</p>
            <p class="time">截止时间: 2018-01-01</p>
            <p class="indicator">开始预选</p>
          </div>
          <x-icon class="icon" type="ios-arrow-thin-right" size="30"></x-icon>
        </div>
      </timeline-item>
      <timeline-item>
        <div class="card">
          <div class="img">
            <img src="@/assets/chooseClass2.png" />
          </div>
          <div class="info">
            <p class="title">正式选科</p>
            <p class="time">截止时间: 2018-01-01</p>
            <p class="indicator">开始选科</p>
          </div>
          <x-icon class="icon" type="ios-arrow-thin-right" size="30"></x-icon>
        </div>
      </timeline-item>
      <timeline-item>
        <router-link tag="div" :to="{ name: 'CourseChart' }">
          <div class="card">
           <div class="img">
              <img src="@/assets/chooseClass3.png" />
            </div>
            <div class="info">
              <p class="title">选科分析</p>
              <p class="time">截止时间: 2018-01-01</p>
              <p class="indicator">查看详情</p>
            </div>
            <x-icon class="icon" type="ios-arrow-thin-right" size="30"></x-icon>
          </div>
        </router-link>
      </timeline-item>
      <timeline-item>
        <div class="card">
          <div class="img">
            <img src="@/assets/chooseClass4.png" />
          </div>
          <div class="info">
            <p class="title">职业评测</p>
            <p class="time">截止时间: 2018-01-01</p>
            <p class="indicator">开始评测</p>
          </div>
          <x-icon class="icon" type="ios-arrow-thin-right" size="30"></x-icon>
        </div>
      </timeline-item>
      <timeline-item>

      </timeline-item>
    </timeline>
  </div>
</template>

<script>
import { getWishCourseTask } from '@/service'
import { mapGetters } from 'vuex'
import { Group, Cell, Timeline, TimelineItem } from 'vux'
export default {
  data() {
    return {
      title: '',
      iTitle: '',
      id: ''
    }
  },
  mounted() {
    this.getCourseList()
  },
  methods: {
    getCourseList() {
      this.$vux.loading.show({
        text: '加载中...'
      })
      getWishCourseTask(this.currentOb.id).then(data => {
        this.title = data.data.F_TaskName
        this.iTitle = data.data.F_StartTime
        this.id = data.data.F_Id
        this.$vux.loading.hide()
      }).catch(err => {
        this.$vux.loading.hide()
      })
    }
  },
  computed: {
    ...mapGetters([
      'currentOb',
    ]),
  },
  components: {
    Group,
    Cell,
    Timeline,
    TimelineItem
  },
}
</script>
<style lang="less">
#choose-class {
  .vux-timeline-item-content {
    padding: .3rem 0 .3rem .7rem;
  }
  .vux-timeline-item-tail {
    background-color: #1EC1FF;
  }
  .vux-timeline-item-color {
    background-color: #1EC1FF;
  }
  .vux-timeline-item-head-first {
    width: 10px;
    height: 10px;
    left: 1px;
    top: 4px;
  }
  .vux-timeline-item-checked {
    display: none;
  }
  .card {
    position: relative;
    display: flex;
    flex-direction: row;
    align-items: center;
    box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
    border-radius: 6px;
    .img {
      width: 3rem;
      display: flex;
      height: 105px;
      img {
        width: 100%;
      }
    }
    .info {
      flex: 1;
      padding: 7px;
      .title {
        font-size: .4rem;
      }
      .time {
        margin-top: 5px;
        font-size: .35rem;
      }
      .indicator {
        color: #1EC1FF;
        margin-top: 20px;
        font-size: .35rem;
      }
    }
    .icon {
      position: absolute;
      right: 10px;
      bottom: 3px;
      fill: #1EC1FF;
    }
  }
}

</style>