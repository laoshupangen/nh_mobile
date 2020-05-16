<template>
  <div id="app">
    <!-- body-padding-top="46px" -->
    <view-box  ref="viewBox">
      <!-- <x-header ref="xheader" v-if="!this.$route.meta.isNoXHeader" class="app-header" @on-click-more="iconFunction" :left-options="{backText: ''}">
        {{ browserHeaderTitle }}
        <font-awesome-icon @click="iconFunction" v-if="iconShow" slot="right" style="color:#efefef;position:relative;top:0px;left:-3px;" size="lg" :icon="iconClass" />
      </x-header> -->
      <!-- style="height: 100%" -->
      <keep-alive>
          <router-view v-if="$route.meta.keepAlive" style="height: 100%"></router-view>
      </keep-alive>
      <router-view v-if="!$route.meta.keepAlive" style="height: 100%"></router-view>
    </view-box>
    <div v-if="appLoading" class="loading-page">
      <div class="stage">
        <div class="dot-floating"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { ViewBox, XHeader } from 'vux'
import { mapGetters, mapMutations } from 'vuex'
export default {
  data () {
    return {
      transitionName: 'slide-left'
    }
  },
  name: 'app',
  components: {
    ViewBox,
    XHeader
  },
  computed: {
    ...mapGetters([
      'browserHeaderTitle',
      'iconClass',
      'iconShow',
      'appLoading',
      'iconFunction',
      'headerHeight'
    ]),
  },
  methods: {
    ...mapMutations([
    ])
  },
  mounted() {
    
  },
  watch: {
    '$route' (to, from) {
      const toDepth = to.path.split('/').length
      const fromDepth = from.path.split('/').length
      this.transitionName = toDepth < fromDepth ? 'slide-right' : 'slide-left'
    },
  },
}
</script>

<style lang="less">
@import '~vux/src/styles/1px.less';
@import '~vux/src/styles/reset.less';
#app {
  height: 100%;
}
html, body {
  height: 100%;
  width: 100%;
  font-family: "Microsoft YaHei", "微软雅黑";
  
  overflow: hidden !important;
}
a:hover,a:active,a:visited,a:link{
  text-decoration: none!important;
}
a:-webkit-any-link{
  text-decoration: none!important;
}
.app-header {
  position: absolute!important;
  width: 100%;
  left: 0;
  top: 0;
  z-index: 100;
}
.loading-page {
  position: absolute;
  background: #fff;
  padding: 2rem 5%;
  border-radius: .25rem;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  .stage {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 2rem 0;
    margin: 0 -5%;
    overflow: hidden;
    .dot-floating {
      position: relative;
      width: 10px;
      height: 10px;
      border-radius: 5px;
      background-color: #9880ff;
      color: #9880ff;
      animation: dotFloating 3s infinite cubic-bezier(0.15, 0.6, 0.9, 0.1);
      &:after, &:before {
        content: '';
        display: inline-block;
        position: absolute;
        top: 0;
        width: 10px;
        height: 10px;
        border-radius: 5px;
        background-color: #9880ff;
        color: #9880ff
      }
      &:before {
        left: -12px;
        animation: dotFloatingBefore 3s infinite ease-in-out
      }
      &:after {
        left: -24px;
        animation: dotFloatingAfter 3s infinite cubic-bezier(0.4, 0, 1, 1)
      }
    }
  }
}
@keyframes dotFloating {
    0% {
        left: calc(-50% - 5px)
    }

    75% {
        left: calc(50% + 105px)
    }

    100% {
        left: calc(50% + 105px)
    }
}

@keyframes dotFloatingBefore {
    0% {
        left: -50px
    }

    50% {
        left: -12px
    }

    75% {
        left: -50px
    }

    100% {
        left: -50px
    }
}

@keyframes dotFloatingAfter {
    0% {
        left: -100px
    }

    50% {
        left: -24px
    }

    75% {
        left: -100px
    }

    100% {
        left: -100px
    }
}
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
