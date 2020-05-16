<template>
  <div>

    <!-- tab 切换开始 -->
    <div class="title-router" style="background: #fff">
      <span
        :class="{ 'title-tab': titleColor === 0 }"
        @click.stop="titleTab('teacher')">任课老师</span>
      <i>|</i>
      <span
        :class="{ 'title-tab': titleColor === 1 }"
        @click.stop="titleTab('curriculum')">班级详情</span>
    </div>
    <!-- tab 切换结束 -->

    <!-- 老师详情开始 -->
    <transition name="fade" mode="out-in">
      <div class="teacher-list" v-show="titleColor===0" ref="teachers">
        <router-link class="teacher-wrapper clearfix"
          tag="div"
          v-for="( item, index ) in teacherList"
          :key="index"
          :to="{ path: `/teacher/${item.F_Id}` , query: { title: gradeTitle}}">
          <div class="teacher-l clearfix">
            <!-- `${GLOBAL.API_HOST}${item.F_HeadPic}` -->
            <img class="cell-avatar" slot="icon" width="50" style="display:block;margin-right:15px;"
            :src="`${GLOBAL.API_HOST}${item.F_HeadPic}`"/>
          </div>

          <!-- 老师科目开始 -->
           <div class="teacher-name"><p>{{ `${item.F_Name}(${item.F_Subject}老师)` }}</p></div>
           <!-- 老师科目结束 -->

           <!-- 老师电话开始 -->
          <div class="teacher-phone">
            <div class="title" style="float: left">
              <i></i>
              <span>一级老师</span>
            </div>
            <div class="phone" style="float: left">
              <i></i>
              <span>12345678900</span>
            </div>
          </div>
          <!-- 老师电话结束 -->

        </router-link>
        <!-- <cell
          v-show="((i < 3) ? true : showMore)"
          v-for="(item, i) in teacherList"
          :key="i"
          :link="`/teacher/${item.F_Id}`" is-link :title="`${item.F_Name}(${item.F_Subject}老师)`"> -->
          <!-- `${GLOBAL.API_HOST}${item.F_HeadPic}` -->
          <!-- <img class="cell-avatar" slot="icon" width="50" style="display:block;margin-right:15px;"
          :src="`${GLOBAL.API_HOST}${item.F_HeadPic}`"/> -->
        <!-- </cell> -->
      </div>
    </transition>
    <!-- 老师详情结束 -->
    <transition name="fade" mode="out-in">
      <div v-show="titleColor===1">
        <!-- 班级详情、考勤开始 -->
        <cell-box class="class-status" style="background: #F0F0F0;">
          <div><i>|</i>学生 / {{ studentCount }}人</div>
        </cell-box>
        <!-- 班级详情、考勤结束 -->

        <!-- 学生列表开始 -->
        <div class="student-list">
          <flexbox style="margin-bottom: 4px;" :key="`${colIndex}-col`" v-for="(col, colIndex) in studentList">
            <flexbox-item :span="1/4" :key="`${index}-item`" v-for="(item, index) in col">
              <router-link style="text-align: center" tag="div" :to="{ name: 'Student', params: { id: item.F_Id, title: gradeTitle } }">
                <!-- `${GLOBAL.API_HOST}${item.F_HeadPic}` -->
                <img :src="`${GLOBAL.API_HOST}${item.F_HeadPic}`" alt="avatar" />
                <p class="name">{{ item.F_Name }}</p>
              </router-link>
            </flexbox-item>
          </flexbox>
        </div>
        <!-- 学生列表结束 -->

        <!-- 签到情况开始 -->
        <div class="attendance-status">
          <group title="今日签到情况" :gutter="0" title-color="#4D4D4D">
            <cell-box>
              <div class="icon active-text-l">正常签到：{{ noCheckCount }}人</div>
              <div class="icon active-text-r">异常签到：{{ delayCount }}人</div>
            </cell-box>
          </group>
        </div>
        <!-- 签到情况结束 -->
      </div>
     </transition>
  </div>
</template>

<script>
import { Cell, Group, CellBox, Flexbox, FlexboxItem, Scroller } from 'vux'
import { getClassDetailInfo } from '@/service'
import { mapGetters, mapActions, mapMutations } from 'vuex'
import _ from 'lodash'
export default {
  created(){
    this.touch = {}
  },
  data () {
    return {
      showMore: false,
      studentList: [
      ],
      teacherList: [],
      studentCount: '',
      noCheckCount: '',
      delayCount: '',
      titleColor: 0,
      teacherWrapper: 0,
      gradeTitle: ''
    }
  },
  components: {
    Cell,
    Group,
    CellBox,
    Flexbox,
    FlexboxItem,
    Scroller
  },
  computed: {
    ...mapGetters([
      'currentOb'
    ])
  },
  methods: {
    ...mapMutations([
      'SET_BROWSERHEADERTITLE'
    ]),
    titleTab( arg ){
      if( arg === 'teacher'){
        this.titleColor = 0;
      }else{
        this.titleColor = 1;
      }
    },
    getClassInfo() {
      this.$vux.loading.show({
        text: '加载中...'
      })
      getClassDetailInfo(this.currentOb.classId).then(data => {

        let leadTeacher = data.data.F_Leader_Tea
        if (leadTeacher[0]) {
          leadTeacher[0].lead = true
        }
        if (leadTeacher[1]) {
          leadTeacher[1].subLead = true
        }
        this.$vux.loading.hide()
        this.teacherList = _.concat(leadTeacher, data.data.teachers)
        this.studentCount = data.data.F_studentCount
        this.studentList = _.chunk(data.data.students, 4)
        this.noCheckCount = data.data.F_NoCheckCount
        this.delayCount = data.data.F_DelayCount;
        this.gradeTitle = data.data.F_Name;
        this.SET_BROWSERHEADERTITLE( { browserHeaderTitle: data.data.F_Name } )

      }).catch(err => {
        this.$vux.loading.hide()
      })
    }
  },
  mounted() {
    this.getClassInfo();
  },
  watch: {

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
.fade-enter-active, .fade-leave-active {
  transition: all .5s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
.title-tab{
  color: #7CBC51;
}
.title-router {
  width: 100%;
  height: 39px;
  border-bottom: 1px solid #F0F0F0;
  position: fixed;
  top: 46px;
  left: 0;
  background: #fff;
  z-index: 99;
  i {
    font-style:normal;
    line-height: 39px;
    float: left;
    color: #7DBC50;
    font-weight: bold;
  }
  span{
    float: left;
    line-height: 39px;
    text-align: center;
    width: 49%;
    font-size: 0.5rem;
  }
}
.teacher-list {
  margin-top: 39px;
  transition: all 300ms;
  .teacher-wrapper {
    width: 100%;
    height: 70px;
    padding: 6px 20px 6px 20px;
    .teacher-l{
      float: left;
      padding: 5px 0;
      .cell-avatar {
        height: 50px;
        border-radius: 50%;
      }
    }
    .teacher-name {
      width: 75%;
      float: left;
      height: 25px;
      font-size: 0.444rem;
      line-height: 25px;
      color: #666666;
    }
    .teacher-phone{
      width: 75%;
      float: left;
      height: 25px;
      font-size: 0.444rem;
      line-height: 25px;
      .title{
        margin-right: 10px;
        i {
          display: inline-block;
          width: 0.333rem;
          height: 0.35rem;
          background-repeat: no-repeat;
          background-position: center;
          background-size: cover;
          background-image: url('../../assets/icon/icon1.png');
        }
        span {
          font-size: 0.388rem;
          color: #999999;
        }
      }
      .phone {
        i {
          display: inline-block;
          width: 0.333rem;
          height: 0.35rem;
          background-repeat: no-repeat;
          background-position: center;
          background-size: cover;
          background-image: url('../../assets/icon/icon2.png');
        }
        span {
          font-size: 0.388rem;
          color: #999999;
        }
      }

    }
  }

}

.show-more {
  height: 30px;
  width: 100%;
  line-height: 30px;
  text-align: center;
  background: #e6e6e6;
  color: #AFAFAF
}
.class-status {
  & > div {
    flex: 1;
    font-size: 0.444rem;
    margin-top: 35px;
    i {
        color: #7DBC50;
        font-size: 0.38rem;
        font-weight: bold;
        padding-right: 5px;
    }
  }
}
.student-list {
  background:#F6F6F6;
  padding: 10px 35px 10px 9px;
  height: 400px;
  overflow: auto;
  img {
    width: 50px;
    border-radius: 50%;
    height: 50px;
  }
  .name {
    text-align: center
  }
}
.attendance-status {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  .icon {
    text-align: center;
    line-height: 40px;
    width: 50%;
  }
  .active-text-l{
    color: #7DBC50
  }
  .active-text-r {
    color: red;
  }
}
</style>
