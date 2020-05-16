<template>
  <div style="background: #F0F0F0;height: 100%;padding: 15px;">
    <div class="detail-wrapper">
      <div class="detail-title">
        <h1>{{ detail.content.Title || detail.content.F_Title }}</h1>
      </div>
      <div class="detail-post-meta">
        <span class="detail-date meta-item">{{ detail.content.F_CreatorTime }}</span>
        <span class="detail-date meta-item" style="float: right;">编写者：作者</span>
      </div>
      <div v-show="detail.type === 'news' || detail.type === 'notification'" class="detail-cover">
        <scroller lock-x scrollbar-y height="300px" ref="scroller">
          <div class="box2" style="padding: 10px 0px;">
            <p class="scr-text">
              sdfsdfsadfaasdsdfsdfsadfaasdsdfsdfsadfaasdsdfsdfsadfaasdsdfsdfsadfaasdsdfsdfsadfaasdsdfsdfsadfaasdsdfsdfsadfaasdsdfsdfsadfaasdsdfsdfsadfaasdsdfsdfsadfaasdsdfsdfsadfaasdsdfsdfsadfaasdsdfsdfsadfaasdsdfsdfsadfaasdsdfsdfsadfaasdsdfsdfsadfaasdsdfsdfsadfaasdsdfsdfsadfaasdsdfsdfsadfaasdsdfsdfsadfaasdsdfsdfsadfaasdsdfsdfsadfaasdsdfsdfsadfaasdsdfsdfsadfaasdsdfsdfsadfaasdsdfsdfsadfaasdsdfsdfsadfaasdsdfsdfsadfaasdsdfsdfsadfaasdsdfsdfsadfaasdsdfsdfsadfaasdsdfsdfsadfaasdsdfsdfsadfaasdsdfsdfsadfaasdsdfsdfsadfaasdsdfsdfsadfaasdsdfsdfsadfaasdsdfsdfsadfaasdsdfsdfsadfaasdsdfsdfsadfaasdsdfsdfsadfaasdsdfsdfsadfaasdsdfsdfsadfaasdsdfsdfsadfaasdsdfsdfsadfaasdsdfsdfsadfaasdsdfsdfsadfaasdsdfsdfsadfaasdsdfsdfsadfaasdsdfsdfsadfaasdsdfsdfsadfaasdsdfsdfsadfaasdsdfsdfsadfaasdsdfsdfsadfaasdsdfsdfsadfaasdsdfsdfsadfaasdsdfsdfsadfaasdsdfsdfsadfaasdsdfsdfsadfaasdsdfsdfsadfaasdsdfsdfsadfaasdsdfsdfsadfaasdsdfsdfsadfaasdsdfsdfsadfaasdsdfsdfsadfaasdsdfsdfsadfaasdsdfsdfsadfaasdsdfsdfsadfaasdsdfsdfsadfaasdsdfsdfsadfaasdsdfsdfsadfaasdsdfsdfsadfaasdsdfsdfsadfaasdsdfsdfsadfaasdsdfsdfsadfaasdsdfsdfsadfaasdsdfsdfsadfaasdsdfsdfsadfaasdsdfsdfsadfaasdsdfsdfsadfaasdsdfsdfsadfaasdsdfsdfsadfaasdsdfsdfsadfaasdsdfsdfsadfaasdsdfsdfsadfaasdsdfsdfsadfaasdsdfsdfsadfaasdsdfsdfsadfaasdsdfsdfsadfaasdsdfsdfsadfaasdsdfsdfsadfaasdsdfsdfsadfaasdsdfsdfsadfaasdsdfsdfsadfaasdsdfsdfsadfaasdsdfsdfsadfaasdsdfsdfsadfaasdsdfsdfsadfaasdsdfsdfsadfaasdsdfsdfsadfaasdsdfsdfsadfaasdsdfsdfsadfaasd
            </p>
          </div>
        </scroller>
        <!-- http://www.pptbz.com/pptpic/UploadFiles_6909/201203/2012031220134655.jpg -->
        <!-- `${ GLOBAL.API_HOST }${ detail.content.F_Cover || detail.content.Banner }` -->
        <!-- <img src="http://www.pptbz.com/pptpic/UploadFiles_6909/201203/2012031220134655.jpg" alt="news" /> -->
      </div>
      <div v-if="detail.type === 'activity' && detail.content.F_Imgs.length">
        <swiper-preview :dataList="imgSet" />
      </div>
      <div v-if="detail.type === 'presence' && detail.content.F_Files.length">
        <swiper-preview :dataList="presenceSet" />
      </div>
      <!-- <div v-html="detail.content.Detail || detail.content.F_Content" class="detail-content"></div> -->
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import SwiperPreview from '@/components/SwiperPreview'
import { Swiper, Previewer, Scroller } from 'vux'
import _ from 'lodash'
export default {
  created(){
    let browserHeaderTitle = '通知详情';
    this.SET_BROWSERHEADERTITLE( { browserHeaderTitle } )
  },
  data() {
    return {
      options: {
        getThumbBoundsFn (index) {
          // find thumbnail element
          let thumbnail = document.querySelectorAll('.previewer-demo-img')[index]
          // get window scroll Y
          let pageYScroll = window.pageYOffset || document.documentElement.scrollTop
          // optionally get horizontal scroll
          // get position of element relative to viewport
          let rect = thumbnail.getBoundingClientRect()
          // w = width
          return {x: rect.left, y: rect.top + pageYScroll, w: rect.width}
          // Good guide on how to get element coordinates:
          // http://javascript.info/tutorial/coordinates
        }
      }
    }
  },
  computed: {
    ...mapGetters([
      'detail'
    ]),

    imgSet() {
      return this.detail.content.F_Imgs ?  _.map(_.split(this.detail.content.F_Imgs, ','), (item) => {
        return {
          url: 'javascript:',
          img: `${this.GLOBAL.API_HOST}${item}`,
          src: `${this.GLOBAL.API_HOST}${item}`,
          title: '',
          type: 'image'
        }
      }) : []
    },
    presenceSet() {
      return this.detail.content.F_Files ?  _.map(_.split(this.detail.content.F_Files, ','), (item) => {
        return {
          url: 'javascript:',
          src: `${this.GLOBAL.API_HOST}${item}`,
          img: `${this.GLOBAL.API_HOST}${item}`,
          type: this.detail.content.F_Pattern === '2' ? 'image' : 'video',
        }
      }) : []
    }
  },
  methods: {
    ...mapMutations([
      'SET_BROWSERHEADERTITLE'
    ]),
    openPreview(index) {
    }
  },
  watch: {
    '$route'( to, from ){
      console.log( "to", to )
    }
  },
  components: {
    Swiper,
    Previewer,
    SwiperPreview,
    Scroller
  },
}
</script>

<style lang="less">
.scr-text {
  width: 100%;
  word-wrap: break-word;
  word-break: break-all;
  overflow: hidden;
  text-indent: 0.4375rem;
}
.detail-wrapper{
  padding: 15px;
  background: #fff;
  border-radius: 10px;
  height: 100%;
  .detail-title {
    h1 {
      text-align: center;
      font-size: .6rem;
      margin-bottom: 12px;
    }
  }
  .detail-post-meta {
    margin-bottom: 12px;
    .meta-item {
      color: #999999
    }
  }
  .detail-cover {
    img {
      width: 100%;
    }
  }
  .detail-content {
    margin-top: 10px;
    p {
      span {
        font-size: 14px!important;
      }
    }
    img {
      width: 100%;
    }
  }
}
</style>
