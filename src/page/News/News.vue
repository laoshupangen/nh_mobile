<template>
  <div style="height: 100%;position:relative">
    <ul class="new-ul clearfix">
      <li class="new-public new-list" :class="{ active: index === 0 }" @click="resetList(0)">学校新闻</li>
      <li class="new-public new-list-c">|</li>
      <li class="new-public new-list" :class="{ active: index === 1 }" @click="resetList(1)">班级新闻</li>
    </ul>
    <!-- <tab v-model="index" :animate="false">
      <tab-item @on-item-click="resetList" active-class="active-6-1" selected>学校新闻</tab-item>
      <tab-item @on-item-click="resetList" active-class="active-6-2">班级新闻</tab-item>
    </tab> -->
    <mescroll-vue  id="mescroll" class="mescroll-container" @init="initCallBack" :up="up" :down="down">
        <ul v-if="dataList.length !== 0" class="noti-list">
          <li @click="jumpToDetail(item)" :key="i" v-for="(item, i) in dataList" class="clearfix">
            <div class="noti-box-l">
              <!-- http://www.pptbz.com/pptpic/UploadFiles_6909/201203/2012031220134655.jpg -->
              <!-- `${GLOBAL.API_HOST}${item.F_Cover}` -->
              <img class="noti-img-l" :src="`${GLOBAL.API_HOST}${item.F_Cover}`">
            </div>
            <div class="noti-box-r">
              <p class="noti-new">{{ newsTitle }}</p>
              <!-- {{item.F_Title}} -->
              <span class="noti-new-content">{{item.F_Title}}</span>
              <p class="noti-time">{{item.F_CreatorTime}}</p>
            </div>
          </li>
        </ul>
        <no-data :visible="dataList.length === 0"></no-data>
    </mescroll-vue>
  </div>
</template>

<script>
import _ from 'lodash'
import { Tab, TabItem } from 'vux'
import { getNews } from '@/service'
import { setTimeout } from 'timers'
import { mapGetters, mapMutations } from 'vuex'
import MescrollVue from 'mescroll.js/mescroll.vue'
import NoData from '@/components/NoData.vue'
export default {
  data() {
    return {
      meScroll: {},
      dataList: [],
      index: 0,
      newsTitle: '学校新闻',
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
    }
  },
  components: {
    Tab,
    TabItem,
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
        name: 'PublishNews'
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
        let data = await getNews({
          rows: pageSize,
          page: pageNum,
          F_Class: (this.index + 1 === 2) ? this.currentOb.classId : '',
          F_NewsType: this.index + 1
        })
        return data.data
      } catch(err) {

      }
    },
    resetList (index) {
      this.index = index;
      this.newsTitle = index === 0 ? '学校新闻' : '班级新闻';
      this.dataList = []
      this.meScroll.resetUpScroll()
    },
    jumpToDetail(item) {
      this.ADD_DETAILS({ type: 'news', content: item })
      this.$router.push({ name: 'Detail' })
    },
  }
}
</script>

<style lang="less" scoped>
  .noti-box-l {
    float: left;
  }

  .noti-img-l {
    width: 2.812rem;
    height: 100%;
    border-radius: 3px;
    overflow: hidden;
  }

  .noti-box-r {
     float: left;
     padding-left: 10px;
     width: 70%;
     display: flex;
     flex-direction: column;
   }

   .noti-new {
      font-size: 0.4375rem;
      color: #000;
      font-weight: 600;
      line-height: 0.4375rem;
      justify-content:center;
   }

   .noti-new-content {
     display: inline-block;
     height: 1.2rem;
     color: #666666;
     font-size: 0.375rem;
     line-height: 0.6rem;
     overflow: hidden !important;
     text-verflow: ellipsis !important;
     white-space: normal !important;
   }

  .clearfix::after{
    display: block;
    content: '';
    clear: both
  }
  .active {
    color:#7DBC50;
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

  .new-ul {
     height: 40px;
     border-bottom: 1px solid #ccc;
     .new-list-c {
       color:#7DBC50;
       font-weight: 900;
     }
  }
.mescroll-container {
  position: relative;
}
.noti-list {
  width: 100%;
  li {
    width: 100%;
    padding: 10px;
    border-bottom: 1px solid #dcdcdc;
    .thumb {
      img {
        width: 100%;
      }
    }
    .content {
      h4 {
        font-size: 16px;
        font-weight: 500;
        margin-bottom: 8px;
      }
      p {
        color: #909090
      }
    }
  }
}
</style>
