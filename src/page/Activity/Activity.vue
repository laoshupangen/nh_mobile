<template>
  <div style="height: 100%">
    <ul class="new-ul clearfix">
      <li class="new-public new-list" :class="{ active: index === 0 }" @click="resetList(0)">校园活动</li>
      <li class="new-public new-list-c">|</li>
      <li class="new-public new-list" :class="{ active: index === 1 }" @click="resetList(1)">班级活动</li>
    </ul>
    <!-- <sticky>
      <tab v-model="index" :animate="false">
        <tab-item @on-item-click="resetList">校园活动</tab-item>
        <tab-item @on-item-click="resetList">班级活动</tab-item>
      </tab>
    </sticky> -->
    <mescroll-vue id="mescroll" class="activity-list" @init="initCallBack" :up="up" :down="down">
      <ul v-if="dataList.length !== 0" class="noti-list">
        <li @click="jumpToDetail(item)" :key="i" v-for="(item, i) in dataList" class="">
          <div class="thumb">
            <!-- http://www.pptbz.com/pptpic/UploadFiles_6909/201203/2012031220134655.jpg -->
            <!-- `${GLOBAL.API_HOST}${item.F_Cover}` -->
            <img src="http://www.pptbz.com/pptpic/UploadFiles_6909/201203/2012031220134655.jpg">
          </div>
          <div class="content">
            <h4>{{item.F_Title}}</h4>
            <p>{{item.F_CreatorTime}}</p>
            <div class="content-pos">
              <img src="../../assets/icon/left.png" alt="">

            </div>
          </div>
        </li>
      </ul>
      <no-data :visible="dataList.length === 0"></no-data>
    </mescroll-vue>
  </div>
</template>

<script>
import { Tab, TabItem, Sticky } from 'vux'
import { getActivity } from '@/service'
import { mapGetters, mapMutations } from 'vuex'
import NoData from '@/components/NoData.vue'
import MescrollVue from 'mescroll.js/mescroll.vue'
import _ from 'lodash'
export default {
  data() {
    return {
      meScroll: {},
      dataList: [],
      up: {
        use: true,
        auto: true,
        isBounce: false,
        callback: this.upCallBack,
        page: {
          num: 0,
          size: 15,
        }
      },
      down: {
        use: false,
      },
      index: 0
    }
  },
  components: {
    Tab,
    TabItem,
    Sticky,
    MescrollVue,
    NoData
  },
  computed: {
    ...mapGetters([
      'currentOb'
    ])
  },
  mounted() {
    this.SET_ICONFUNCTION(() => {
      this.$router.push({
        name: 'PublishActivity'
      })
    })
  },
  methods: {
    ...mapMutations([
      'SET_ICONFUNCTION',
      'ADD_DETAILS'
    ]),
    initCallBack(mescroll) {
      this.meScroll = mescroll
    },
    async upCallBack(page, mescroll) {
      try {
         let data = await this.getList(page.num, page.size)
         this.dataList = _.concat(this.dataList, data.rows)
         this.meScroll.endSuccess(15, data.rows.length === 15)
      } catch(err) {
        console.log(err)
      }
    },
    async getList(pageNum, pageSize) {
      try {
        let data = await getActivity({
          rows: pageSize,
          page: pageNum,
          F_Class: (this.index + 1 === 2) ? this.currentOb.classId : '',
          F_EventType: this.index + 1
        })
        return data.data
      } catch(err) {
      }
    },
    resetList (index) {
      this.index = index;
      this.dataList = []
      this.meScroll.resetUpScroll()
    },
    jumpToDetail(item) {
      this.ADD_DETAILS({ type: 'activity', content: item })
      this.$router.push({ name: 'Detail' })
    },
  }
}
</script>

<style lang="less" scoped>

.clearfix::after{
  display: block;
  content: '';
  clear: both
}
.active {
  color:#7DBC50;
}
.new-ul {
  position: fixed;
  top: 46px;
  left: 0;
  right: 0;
  z-index: 999;
  background: #fff;
  border-bottom: 1px solid #ccc;
}
.new-public {
  float: left;
  line-height: 40px;
  font-size: 0.4375rem;
}
.new-list {
  width: 49%;
  text-align:center;
}
.new-list-c {
  color:#7DBC50;
  font-weight: 900;
}
.activity-list {
  position: relative;
  margin-top: 40px;
}
.noti-list {
  width: 100%;
  position: relative;
  padding: 10px;
  background: #F0F0F0;
  li {
    width: 100%;
    padding: 10px;
    border-bottom: 1px solid #dcdcdc;
    background: #fff;
    border-radius: 10px;
    margin-bottom: 10px;
    padding: 0 0 10px 0;
    .thumb {
      img {
        width: 100%;
        width: 100%;
        height: 4.531rem;
        border-top-right-radius: 10px;
        border-top-left-radius: 10px;
      }
    }
    .content {
        position: relative;
      h4 {
        font-size: 0.4375rem;
        font-weight: 500;
        padding-left: 10px;
      }
      p {
        color: #909090;
        padding-left: 10px;
        font-size: 0.375rem;
      }
      .content-pos {
        position: absolute;
        right: 0;
        top: 0;
        bottom: 0;
        text-align: center;
        vertical-align: middle;
        height: 100%;
        padding: 10px 20px 0px 20px;
        img {
           width: 0.4375rem;
           height: 0.625rem;
        }
      }
    }
  }
}
</style>
