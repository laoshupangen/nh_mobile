<template>
  <div class="leave-wrapper">
    <mescroll-vue id="mescroll" class="mescroll-scroll" :up="{use: false}" :down="{use: false}">
      <group gutter="0" style="margin-bottom: 30px;">
        <Cell value class="isNotEdit">
          <span slot="title" class="span-title">请假类型</span>
          <span>{{this.type}}</span>
        </Cell>
        <Cell class="isNotEdit">
          <span slot="title" class="span-title">申请人</span>
          <span>{{this.data.leaveerName}}</span>
        </Cell>
        <Cell class="isNotEdit">
          <span slot="title" class="span-title">开始时间</span>
          <span>{{this.data.startTime}}</span>
        </Cell>
        <Cell class="isNotEdit">
          <span slot="title" class="span-title">结束时间</span>
          <span>{{this.data.endOfTime}}</span>
        </Cell>
        <Cell class="isNotEdit">
          <span slot="title" class="span-title">请假天数</span>
          <span>{{this.data.leaveDays + '天'}}</span>
        </Cell>
        <Cell :inline-desc="this.data.reasonForLeave" class="isNotEdit">
          <span slot="title" class="span-title">
            请假事由
            <br>
            <br>
          </span>
        </Cell>
        <cell v-if="this.data.attachmentsPath" title="病假凭证"></cell>
        <div v-if="this.data.attachmentsPath">
          <swiper-preview :dataList="imgList"/>
        </div>
        <Cell class="isNotEdit">
          <span slot="title" class="span-title">审批人</span>
          <span>{{approveData.approverName}}</span>
          <span
            v-show="!approveData.approverName"
            v-for="(teacherName,i) in data.approvers"
            :key="i"
          >{{teacherName+','}}</span>
        </Cell>
        <Cell
          class="isNotEdit"
          :inline-desc="this.approveData.opinion"
        >
          <span v-show="!approveData.approverName" style="color: #E18D43;">待审批</span>
          <span v-show="approveData.result == 1" style="color: #0EADFF;">已通过</span>
          <span v-show="approveData.result == 0" style="color: #E18D43;">待审批</span>
          <span v-show="approveData.result == -1" style="color: #EC525D;">未通过</span>
          <span slot="title" class="span-title">
            审批意见
            <br v-show="approveData.result != 0">
            <br v-show="approveData.result != 0">
          </span>
        </Cell>
        <Cell v-if="approveDataL&&approveDataL.approverName" class="isNotEdit">
          <span slot="title" class="span-title">上级审批人</span>
          <span>{{approveDataL.approverName}}</span>
        </Cell>
        <Cell
          v-if="approveDataL&&approveDataL.approverName"
          class="isNotEdit"
          :inline-desc="approveDataL.opinion"
        >
          <span v-show="approveDataL.result == 1" style="color: #0EADFF;">已通过</span>
          <span v-show="approveDataL.result == 0" style="color: #E18D43;">待审批</span>
          <span v-show="approveDataL.result == -1" style="color: #EC525D;">未通过</span>
          <span slot="title" class="span-title">
            上级审批意见
            <br v-show="approveDataL.result != 0">
            <br v-show="approveDataL.result != 0">
          </span>
        </Cell>
      </group>
    </mescroll-vue>
  </div>
</template>

<script>
import { Group, Cell } from "vux";
import _ from "lodash";
import { getLeaveV2Detail } from "@/service";
import SwiperPreview from "@/components/SwiperPreview";
import MescrollVue from "mescroll.js/mescroll.vue";

export default {
  data() {
    return {
      type: "",
      data: {
        approves: []
      },
      typeMap: {
        '1': '事假',
        '2': '病假',
        '3': '节假日请假',
        '4': '周末请假'
      },
      // presenceSet:"/UpLoad/20190515/201905151828506299.jpeg,/UpLoad/20190515/201905151828506299.jpeg",

      //暂时只有一个审批人 手动获取Approvesarray[0]
      approveData: {},
      //上级审批人
      approveDataL: {}
    };
  },
  components: {
    Group,
    Cell,
    SwiperPreview,
    MescrollVue
  },
  mounted() {
    getLeaveV2Detail(this.$route.params.id).then(obj => {
      this.data = obj.data.data;
      this.type = this.typeMap[this.data.leaveType];
      if(obj.data.data.approves && obj.data.data.approves.length) {
        // this.approveData = obj.data.data.approves.filter(d=>d.level===1)
        this.approveData = {
          approverName:obj.data.data.approves.filter(d=>d.level===1).map(dd=>dd.approverName).join(','),
          opinion:obj.data.data.approves.find(d=>d.level===1&&d.opinion).opinion
        }
        this.approveDataL = obj.data.data.approves.find(d=>d.level === 2)
        // console.log('ggg',this.approveData )
        // for (let i = 0; i < this.data.approves.length; i++) {
        //   let dic = this.data.approves[i];
        //   if (dic.level == 1 && dic.result != 0) {
        //     this.approveData = this.data.approves[i];
        //   }
        //   if (dic.level == 2) {
        //     this.approveDataL = this.data.approves[i];
        //   }
        // }
      }
    });
  },
  methods: {
    fnGetImage(src) {
      if (process.env.NODE_ENV === "development") {
        return `${src}`;
      } else {
        return `${this.GLOBAL.API_HOST}/SystemManage/CurrentUser/GetImg?Url=${src}&time=${Math.random()}`;
      }
    },
  },
  computed: {
    imgList() {
      return this.data.attachmentsPath
        ? _.map(_.split(this.data.attachmentsPath, ","), item => {
            return {
              url: "javascript:",
              src: this.fnGetImage(item),
              img: `${item}`,
              type: "image"
            };
          })
        : [];
    }
  }
};
</script>

<style>
.leave-wrapper {
  background: #f0f0f0;
}
.isNotEdit span {
  color: #5a5a5a;
  font-size: 15px;
}
.isNotEdit .span-title {
  color: #1a1a1a;
  font-size: 16px;
}
</style>