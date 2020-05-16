<template>
  <div style="height: 100%">
    <ul class="noti-click-box">
      <li class="clearfix" >
        <div class="noti-btn"
          v-for="( item, index ) of notiData"
          :class="{ active: activeIndex === index }"
          :key="index"
          @click="resetList( index )">
          <span class="noti-msg" :class="{ last: index === 2 }">{{ item }}</span>
        </div>
      </li>
    </ul>
    <!-- 班级 0 学校 1 紧急 2 -->
    <!-- <tab v-model="index" :animate="false">
      <tab-item @on-item-click="resetList" active-class="active-6-1" selected>学校通知 0</tab-item>
      <tab-item @on-item-click="resetList" active-class="active-6-2">班级通知 1 </tab-item>
      <tab-item @on-item-click="resetList" active-class="active-6-3">紧急通知 2</tab-item>
    </tab> -->
    <mescroll-vue id="mescroll" class="mescroll-container" @init="initCallBack" :up="up" :down="down">
        <ul v-if="dataList.length !== 0" class="noti-list">
          <li :key="i" v-for="(item, i) in dataList">
            <!-- <div class="thumb"> -->
              <!-- `${GLOBAL.API_HOST}${item.Banner}` -->
              <!-- <img src="http://h.hiphotos.baidu.com/zhidao/pic/item/37d3d539b6003af3ed126a4b372ac65c1038b675.jpg"> -->
            <!-- </div> -->
            <div class="content">
              <div class="cleatfix content-box">
                <div class="content-title">
                  <span>{{ title }}</span>
                </div>
                <div class="content-click" @click="jumpToDetail(item)">
                  <!-- <img style="width: 15px; height: 15px;vertical-align: middle" src="http://h.hiphotos.baidu.com/zhidao/pic/item/37d3d539b6003af3ed126a4b372ac65c1038b675.jpg" alt="">  -->
                  <span>></span>
                </div>
              </div>
              <p>{{item.F_CreatorTime}}</p>
              <h4>{{item.Title}}</h4>
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
import { getNoti } from '@/service'
import { setTimeout } from 'timers'
import { mapGetters, mapMutations } from 'vuex'
import MescrollVue from 'mescroll.js/mescroll.vue'
import NoData from '@/components/NoData.vue'
export default {
  data() {
    return {
      meScroll: {},
      dataList: [],
      index: 1,
      activeIndex: 0,
      notiData:[
        "班级通知",
        "学校通知",
        "紧急通知"
      ],
      title: '班级通知',
      up: {
        use: true,
        callback: this.upCallBack,
        auto: true,
        isBounce: false,
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
        name: 'PublishNoti'
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
        let data = await getNoti({
          rows: pageSize,
          page: pageNum,
          F_Class: (this.index + 1 === 2) ? this.currentOb.classId : '',
          F_Type: this.index + 1
        })
        return data.data
      } catch(err) {

      }
    },
    jumpToDetail(item) {
      this.ADD_DETAILS({ type: 'notification', content: item })
      this.$router.push({ name: 'Detail' })
    },
    resetList (index) {
      if( index === 0 ){
        this.index = 1;
        this.title = "班级通知";
      }else if( index === 1 ){
        this.index = 0;
        this.title = "学校通知";
      }else if( index === 2 ){
        this.index =  index;
        this.title = "紧急通知";
      }
      this.activeIndex = index;
      this.dataList = []
      this.meScroll.resetUpScroll()
    }
  },
  watch: {
    '$route'( to, from ){
      console.log( "aaa", from )
    }
  }
}
</script>

<style lang="less" scoped>
  .active {
    color: #7CBC51;
  }
  .last {
    border: none !important;
  }
.cleatfix::after {
  display: block;
  content: '';
  clear: both;
}
.mescroll-container {
  position: relative;
}
.noti-click-box {
  .noti-btn {
     float: left;
     width: 33%;
     text-align: center;
     padding: 5px 0;
     font-size: 0.375rem;
    .noti-msg{
       border-right: 2px solid #7DBC50;
       width: 100%;
       display: inline-block;
    }
  }
}
.noti-list {
  width: 100%;
  padding: 10px;
  background: #f0f0f0;
  li {
    width: 100%;
    padding: 10px;
    border-radius: 10px;
    margin-bottom: 10px;
    background: #fff;
    .thumb {
      img {
        width: 100%;
      }
    }
    .content {
      .content-box {
        height: 20px;
        .content-title {
          float: left;
          span {
             font-size: 0.375rem;
             color: #00000;
             font-weight: 900;
             line-height: 16px;
          }
        }
        .content-click {
           float: right;
           width: 30%;
           line-height: 20px;
           text-align: right;
           span {
              font-size: 0.375rem;
           }
        }
      }
      h4 {
        font-size: 16px;
        font-weight: 500;
        margin-bottom: 8px;
      }
      p {
        color: #666666;
        text-align: left;
      }
    }
  }
}
</style>
