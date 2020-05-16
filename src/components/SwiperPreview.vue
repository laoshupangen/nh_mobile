<template>
  <div>
    <swiper v-if="dataList.length !== 0 && dataList[0].type === 'image'">
      <swiper-item @click.native="show(item, i)" :key="i" v-for="(item, i) in dataList">
        <img class="swiper-image previewer-img" v-if="item.type === 'image'" :src="item.src">
      </swiper-item>
    </swiper>
    <previewer ref="previewer" :list="dataList" :options="options"/>
    <video-player
      v-if="dataList.length !== 0 && dataList[0].type === 'video'"
      v-for="(item, i) in dataList"
      :key="i"
      :options="{height: '360', autoplay: false, language: 'zh',
     playbackRates: [0.5, 1.0, 1.5, 4.0], sources: [{type: 'video/mp4', src: item.src}]}"
      class="video-player-box swiper-video"
    />
  </div>
</template>

<script>
import { Swiper, Previewer, SwiperItem } from "vux";
export default {
  data() {
    return {
      playerOptions: {
        height: "360",
        autoplay: false,
        language: "zh",
        playbackRates: [0.7, 1.0, 1.5, 2.0],
        sources: [
          {
            type: "video/mp4",
            src: "http://vjs.zencdn.net/v/oceans.mp4"
          }
        ]
      },
      options: {
        getThumbBoundsFn(index) {
          // find thumbnail element
          let thumbnail = document.querySelectorAll(".previewer-img")[index];
          // get window scroll Y
          let pageYScroll =
            window.pageYOffset || document.documentElement.scrollTop;
          // optionally get horizontal scroll
          // get position of element relative to viewport
          let rect = thumbnail.getBoundingClientRect();
          // w = width
          return { x: rect.left, y: rect.top + pageYScroll, w: rect.width };
          // Good guide on how to get element coordinates:
          // http://javascript.info/tutorial/coordinates
        }
      }
    };
  },
  props: {
    dataList: {
      type: Array,
      required: true
    }
  },
  methods: {
    show(item, i) {
      if (item.type === "image") {
        this.$refs.previewer.show(i);
      }
      if (item.type === "video") {
        this.playerOptions.sources[0].src = item.src;
      }
    }
  },
  mounted() {
    console.log(this.dataList);
  },
  components: {
    Swiper,
    Previewer,
    SwiperItem
  }
};
</script>

<style lang="less">
.swiper-image {
  width: 100%;
}
.swiper-video {
  width: 100%;
  > div {
    width: 100%;
  }
}
</style>