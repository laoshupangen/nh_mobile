<template>
  <div style="height: 100%;position: relative;">
    <div class="select" @click="handleListShow">
      <img class="more" src="../../assets/icon/more.png" alt="">
    </div>
    <ul class="select-option" v-show="optionShow">
      <li class="option-list"
        v-for="( item, index ) of presenceData"
        :key="index"
        :class="{ active: activeIndex === ( index + 1 ) }"
        @click="handleOver( index )">
        <div class="option-text">{{ item }}</div>
      </li>
    </ul>
    <!-- <sticky>
      <tab :scroll-threshold="5" v-model="index">
        <tab-item @on-item-click="resetList">师生风采</tab-item>
        <tab-item @on-item-click="resetList">班级荣誉</tab-item>
        <tab-item @on-item-click="resetList">班级风采</tab-item>
        <tab-item @on-item-click="resetList">作品展示</tab-item>
        <tab-item @on-item-click="resetList">学校风采</tab-item>
      </tab>
    </sticky> -->
    <mescroll-vue id="mescroll" class="presence-scroll" @init="initCallBack" :up="up" :down="down">
        <ul v-if="dataList.length !== 0" class="presence-list">
          <li @click="jumpToDetail(item)" :key="i" v-for="(item, i) in dataList">
            <div class="class-wrap clearfix">
              <div class="class-content">
                <p class="class-name">{{ item.F_Title }}</p>
              </div>
            </div>
            <div class="content"><p></p></div>
            <div class="thumb">
              <flexbox v-if="item.F_Pattern === '2'" :gutter="5" :key="_i" v-for="(_item, _i) in (chunkString(item.F_Files))">
                <flexbox-item v-for="(__item, __i) in _item" :key="__i" :span="1/3">
                  <!-- http://pic30.photophoto.cn/20140211/0005018335222016_b.png `${GLOBAL.API_HOST}${__item}`-->
                  <img v-if="item.F_Pattern === '2'" src="http://pic30.photophoto.cn/20140211/0005018335222016_b.png" />
                  <video v-if="item.F_Pattern === '1'" type="video/mp4" :src="`${GLOBAL.API_HOST}${__item}`"></video>
                </flexbox-item>
              </flexbox>
              <flexbox v-if="item.F_Pattern === '1'" :gutter="5">
                <flexbox-item :span="1/3">
                  <img :src="`${GLOBAL.API_HOST}${item.F_Cover}`" />
                </flexbox-item>
              </flexbox>
            </div>
            <div class="date"><p>{{item.F_CreatorTime}}</p></div>
          </li>
        </ul>
        <no-data :visible="dataList.length === 0"></no-data>
    </mescroll-vue>
  </div>
</template>

<script>
import _ from 'lodash'
import { setTimeout } from 'timers'
import { Flexbox, FlexboxItem, Tab, TabItem, Sticky } from 'vux'
import { mapGetters, mapMutations } from 'vuex'
import { getPresence } from '@/service'
import MescrollVue from 'mescroll.js/mescroll.vue'
import NoData from '@/components/NoData.vue'
export default {
  components: {
    Flexbox,
    FlexboxItem,
    Tab,
    TabItem,
    Sticky,
    MescrollVue,
    NoData
  },
  data() {
    return {
      presenceData: [
        '师生风采',
        '班级荣誉',
        '班级风采',
        '作品展示',
        '学校风采'
      ],
      meScroll: {},
      dataList: [],
      index: 0,
      activeIndex: 1,
      optionShow: false,
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
  computed: {
    ...mapGetters([
      'currentOb'
    ])
  },
  mounted() {
    this.SET_ICONFUNCTION(() => {
      this.$router.push({
        name: 'PublishPresence'
      })
    })
  },
  methods: {
    ...mapMutations([
      'SET_ICONFUNCTION',
      'ADD_DETAILS'
    ]),
    handleOver( index ){
      if( index > -1 ){
        this.activeIndex = ( index + 1 );
        this.index = index;
        this.resetList();
      }else if( index === -1 && this.optionShow ){
        this.optionShow = !this.optionShow;
      }
    },
    handleListShow(){
      this.optionShow = !this.optionShow;
    },
    initCallBack(mescroll) {
      this.meScroll = mescroll
    },
    chunkString(string) {
      return _.chain(string.split(',')).chunk(3).value()
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
        let data = await getPresence({
          rows: pageSize,
          page: pageNum,
          F_Class: (this.index + 1 === 5) ? '' : this.currentOb.classId,
          F_PresenceType: this.index + 1
        })
        return data.data
      } catch(err) {

      }
    },
    jumpToDetail(item) {
      this.ADD_DETAILS({ type: 'presence', content: item })
      this.$router.push({ name: 'Detail' })
    },
    resetList() {
      this.dataList = []
      this.meScroll.resetUpScroll()
    }
  }
}
</script>

<style lang="less" scoped>
  .active {
    background: #7EC76B;
    color: #fff;
  }
.select {
    position: fixed;
    top: 0;
    right: 0;
    z-index: 999;
    height: 46px;
    padding: 16px 10px 0 0;
    .more {
       width: 19px;
       height: 11px;
    }
  }
  .select-option {
    position: fixed;
    top: 45px;
    right: 10px;
    background: #F5F5F5;
    z-index: 9999;
    .option-list {
      padding: 0 5px;
      .option-text {
        width: 2.5rem;
        height: 40px;
        text-align:
        center;
        line-height: 40px;
        font-size: 0.375rem;
        box-sizing: border-box;
        border-bottom: 1px solid #eee;
      }
    }
  }
.presence-scroll {
  position: relative;
}
.presence-list {
  width: 100%;
  li {
    width: 100%;
    padding: 10px;
    border-bottom: 1px solid #dcdcdc;
    .class-wrap {
      .class-img {
        width: 50px;
        float: left;
        img {
          width: 100%;
          border-radius: 50%;
        }
      }
      .class-content {
        float: left;
        height: 50px;
        line-height: 25px;
        padding-left: 5px;
        .class-name {
          font-size: 16px;
        }
        .class-motor {
          font-size: 14px;
          color: #A1A1A1
        }
      }
    }
    .thumb {
      img, video {
        width: 100%;
      }
    }
    .content {
      margin-bottom: 5px;
      h4 {
        font-size: 16px;
        font-weight: 500;
        margin-bottom: 8px;
      }
      p {
        color: #909090;
        font-size: 14px;
      }
    }
    .date {
      p {
        color: #909090
      }
    }
  }
}
</style>
