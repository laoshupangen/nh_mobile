<template>
  <div class="teacher-wrapper">

    <!-- 基本信息开始 -->
    <div class="main-info">
      <ul class="info-list clearfix">
        <li class="info-msg public-info">
          <div class="teacher-info" style="border-bottom: 1px solid #EEEEEE;">
            <i>|</i>
            <span @click="handle">基本信息</span>
          </div>
        </li>
        <li class="info-img public-info clearfix">
          <div class="clearfix" style="border-bottom: 1px solid #EEEEEE;">
            <div class="img-l">
              <!-- `${GLOBAL.API_HOST}${avatar}` -->
              <img :src="`${GLOBAL.API_HOST}${avatar}`" alt="avatar" />
            </div>
            <div class="info-name">{{ name }}</div>
          </div>
        </li>
        <li class="info-title public-info clearfix">
            <span>所属班级</span>
            <span style="text-align: right;">{{ gradeTitle }}</span>
        </li>
      </ul>
    </div>
    <!-- 基本信息结束 -->

    <!-- 个人介绍开始 -->
    <div class="intro-text">
      <ul class="text-wrapper">
        <li class="title">
          <div style="box-sizing: border-box;border-bottom: 1px solid #eeeeee;">
            <i>|</i>
            <span>个人介绍</span>
          </div>
        </li>
        <li class="textarea">
          <div class="text-box">
            <p></p>
          </div>
        </li>
      </ul>
    </div>
    <!-- 个人介绍结束 -->

    <!-- 个人荣誉开始 -->
    <div class="intro-honor">
      <ul class="img-list">
        <li class="get-list">
          <div class="list-box" style="box-sizing: border-box;border-bottom: 1px solid #eeeeee;">
            <i>|</i>
            <span>个人荣誉</span>
          </div>
        </li>
        <li class="clearfix">
          <ul class="teacher-wrapper clearfix" style="background: #fff;">
            <li class="teacher-box" v-for="( item, index ) of honor" :key="index">
              <!-- ${GLOBAL.API_HOST}${item.F_Covers} -->
              <img class="teacher-img" :src="`${GLOBAL.API_HOST}${item.F_Covers}`" alt="">
              <p class="teacher-text" style="text-align: center;">{{ item.F_Title }}</p>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <!-- 个人荣誉结束 -->

  </div>
</template>

<script>
import { getStudentDetailInfo } from '@/service'
import { Grid, GridItem } from 'vux';
import { mapGetters } from 'vuex';
export default {
  data() {
    return {
      honor: [],
      intro: '',
      name: '',
      avatar: ''
    }
  },
  mounted() {
    this.getTeacherInfo()
  },
  computed: {
    gradeTitle(){
      return this.$route.params.title
    }
  },
  components: {
    Grid,
    GridItem
  },
  methods: {
    handle(){
      console.log( this.$route)
    },
    getTeacherInfo() {
      let { id } = this.$route.params
      this.$vux.loading.show({
        text: '加载中...'
      })
      getStudentDetailInfo(id).then(data => {
        this.$vux.loading.hide()
        this.name = data.data.F_Name
        this.intro = data.data.F_Introduction
        this.honor = data.data.F_honorInfo
        this.avatar = data.data.F_HeadPic
      }).catch(err => {
        this.$vux.loading.hide()
      })
    }
  }
}
</script>

<style lang="less">
  i {
    font-style: normal;
  }
  .clearfix::after {
    content: ".";
    clear: both;
    display: block;
  }
  .public-info{
    height: 50px;
    box-sizing: border-box;
    padding: 0px 10px;
  }
  .teacher-wrapper{
    padding: 12px;
    background: #F0F0F0;
    height: 100%;
    .main-info {
      display: flex;
      padding: 10px;
      flex-direction: row;
      .info-list{
        width: 100%;
        background: #fff;
        border-radius: 5px;
        .info-msg{
          height: 30px;
          i {
            font-style: normal;
            color: #7DBC50;
            font-weight: bold;
            line-height: 30px;
            font-size: 0.4375rem;
          }
          span{
            font-size: 0.375rem;
            line-height: 28px;
            color: #4D4D4D;
          }
        }
        .info-img {
          height: 50px;
          .img-l {
            float: left;
            padding-top: 5px;
            text-align: center;
            vertical-align: middle;
            img{
              width: 40px;
              height: 40px;
              border-radius: 50%;
            }
          }
          .info-name {
            float: right;
            font-size: 0.375rem;
            color: #4D4D4D;
            line-height: 50px;
          }
        }
        .info-title{
          height: 30px;
          span {
            float: left;
            width: 50%;
            line-height: 30px;
            font-size: 0.375rem;
          }
        }
      }
    }

    .intro-text {
      padding: 10px;
      .text-wrapper{
        background: #fff;
        box-sizing: border-box;
        border-radius: 5px;
        .title {
          padding: 0px 10px;
          height: 30px;
          i {
            font-style: normal;
            color: #7DBC50;
            font-weight: bold;
            line-height: 30px;
            font-size: 0.4375rem;
          }
          span{
            font-size: 0.375rem;
            line-height: 28px;
            color: #4D4D4D;
          }
        }
        .textarea {
          padding: 0px 10px;
          .text-box {
            width: 100%;
            height: 100%;
            padding: 10px;
            P {
                word-wrap:break-word;
                text-overflow:ellipsis;
                overflow:hidden;
                font-size: 0.3755rem;
            }
          }
        }
      }
    }

    .intro-honor {
      padding: 10px;
      .img-list {
        background: #fff;
        border-radius: 5px;
        .get-list {
          padding: 0px 10px;
          .list-box {
            height: 30px;
            i {
              font-style: normal;
              color: #7DBC50;
              font-weight: bold;
              line-height: 30px;
              font-size: 0.4375rem;
            }
            span{
              font-size: 0.375rem;
              line-height: 28px;
              color: #4D4D4D;
            }
          }
        }
        .teacher-wrapper {

          .teacher-box {
             float: left;
             width: 33%;
             text-align: center;
             .teacher-img {
                width: 2rem;
                height: 2rem;
                border-radius: 5px;
             }
             .teacher-text {
               text-align: center;
               font-size: 0.375rem
             }
          }
        }
      }

    }
  }
</style>
