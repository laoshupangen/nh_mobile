<template>
  <div class="leave-wrapper">
    <!-- <mescroll-vue id="mescroll" class="mescroll-scroll" :up="{use: false}" :down="{use: false}"> -->
      <group gutter="0">
        <Cell title="请假类型" value class="isNotEdit">
          <span slot="title">请假类型</span>
          <span>{{this.type}}</span>
        </Cell>
        <Cell title="申请人" class="isNotEdit">
          <span slot="title">申请人</span>
          <span>{{this.data.leaveerName}}</span>
        </Cell>
        <Cell title="开始时间" class="isNotEdit">
          <span slot="title">开始时间</span>
          <span>{{this.data.startTime}}</span>
        </Cell>
        <Cell title="结束时间" class="isNotEdit">
          <span slot="title">结束时间</span>
          <span>{{this.data.endOfTime}}</span>
        </Cell>
        <Cell title="请假天数" class="isNotEdit">
          <span slot="title">请假天数</span>
          <span>{{this.data.leaveDays + '天'}}</span>
        </Cell>
        <Cell title="请假事由" :inline-desc="this.data.reasonForLeave" class="isNotEdit">
          <span slot="title">
            请假事由
            <br>
            <br>
          </span>
        </Cell>
        <cell v-if="this.data.attachmentsPath" title="病假凭证"></cell>
        <div v-if="this.data.attachmentsPath">
          <swiper-preview :dataList="imgList"/>
        </div>
        <Cell v-show="data.isFinal && data.leaveDays  > 3" class="isNotEdit">
          <span slot="title" class="span-title">一级审批人</span>
          <span>{{approveData.approverName}}</span>
        </Cell>
        <Cell v-show="data.isFinal && data.leaveDays  > 3" class="isNotEdit" :inline-desc="this.approveData.opinion">
          <span v-show="approveData.result == 1" style="color: #0EADFF;">已通过</span>
          <span v-show="approveData.result == -1" style="color: #EC525D;">未通过</span>
          <span slot="title" class="span-title">
            一级审批意见
            <br>
            <br>
          </span>
        </Cell>
        <popup-radio
          
          title="审批状态"
          v-model="model.approvalStatus.value"
          is-link
          :options="approvalArray"
        ></popup-radio>
        <x-textarea title="审批意见" v-model="model.opinion.value" placeholder="请输入审批意见" :max="100"></x-textarea>
        <Cell
          
          @click.native="chooseLeader"
          v-model="leaveV2.approvalNames"
          title="上级审批人"
          v-if="data.leaveDays  > 3  && !data.isFinal && model.approvalStatus.value !== '3'"
          is-link
        ></Cell>
      </group>
      <div class="submit">
        <x-button class="submit-btn" :show-lodaing="loading" @click.native="submit">提交</x-button>
      </div>
    <!-- </mescroll-vue> -->
  </div>
</template>

<script>
import {
  XTextarea,
  XInput,
  Group,
  PopupRadio,
  XButton,
  Cell,
  Selector
} from "vux";
import { mapGetters, mapMutations } from "vuex";
import _ from "lodash";
import { validator } from "@/utils";
import {
  postLeaveV2Approval,
  getLeaveV2FromDetail,
  // AddApprover
} from "@/service";
import SwiperPreview from "@/components/SwiperPreview";
// import MescrollVue from "mescroll.js/mescroll.vue";

export default {
  activated() {
    if (this.model.orderId.value != this.$route.params.id) {
      
    }
    if (this.$route.params.id) {
        this.getLeaveData();
      }
  },
  data() {
    return {
      leaderName: "",
      loading: false,
      type: "",
      typeMap: {
        '1': '事假',
        '2': '病假',
        '3': '节假日请假',
        '4': '周末请假'
      },
      approveData: {},
      approvalArray: [
        { key: "2", value: "同意" },
        { key: "3", value: "不同意" }
      ],
      data: {},
      // presenceSet:"/UpLoad/20190515/201905151828506299.jpeg,/UpLoad/20190515/201905151828506299.jpeg",
      model: {
        orderId: {
          value: "",
          rules: [
            {
              type: "string",
              required: true,
              message: "请假id为空"
            }
          ]
        },
        approverList:{
          value:'',
          rules:{
            type:'string',
            required:false,
            
          }
        },
        approvalStatus: {
          value: "",
          rules: [
            {
              type: "string",
              required: true,
              message: "请选择审批状态"
            }
          ]
        },
        isAgreed: {
          value: false,
          rules: [
            {
              type: "boolean"
            }
          ]
        },
        opinion: {
          value: "",
          rules: [
            {
              type: "string",
              required: true,
              message: "请输入审批意见"
            }
          ]
        }
      }
    };
  },
  components: {
    XTextarea,
    Group,
    XInput,
    PopupRadio,
    XButton,
    Cell,
    Selector,
    SwiperPreview,
    // MescrollVue
  },
  mounted() {

    this.getLeaveData();
  },
  methods: {
    ...mapMutations(["SET_BROWSERHEADERTITLE", "SET_APPROVALUSER"]),

    getLeaveData() {
      this.model.orderId.value = this.$route.params.id;
      getLeaveV2FromDetail(this.$route.params.id).then(obj => {
        this.data = obj.data.data;
        this.type = this.typeMap[this.data.leaveType]
        if (this.data.approves && this.data.approves.length) {
          for (let i = 0; i < this.data.approves.length; i++) {
            let dic = this.data.approves[i];
            if (dic.level == 1 && dic.result != 0) {
              this.approveData = this.data.approves[i];
            }
          }
        }

      }).catch(err=>{
        console.log('err1',err)
        if(err){
          this.$vux.toast.show({type:'warn',text:err.message.message,width:'80%'})
        }
        
        // this.$vux.toast.show({type:'warn',text:err.message})
      });
    },
    async submit() {
      // console.log('submit',this.model)
      this.model.approverList.value = this.leaveV2.approvalUserIds.join(',')
      try {
        let fields = await validator(this.model);
        console.log('submit',fields)
        //由文本信息判断是否选择同意 
        fields.isAgreed = fields.approvalStatus == "2";

        // if (!this.data.isFinal) {
          
        //   AddApprover({
        //     orderId: this.model.orderId.value,
        //     approverId: this.leaveV2.approvalUserIds[0]
        //   }).then(data => {});
        // }

        let data = await postLeaveV2Approval(fields);
        this.$vux.toast.show({
          text: "提交成功!",
          type: "success"
        });
        //申请成功审批人数据初始化
        this.SET_APPROVALUSER({ userids: [], names: "" });
        this.$router.replace({
          name: "ApprovalV2"
        });
        this.$router.go(-1)
      } catch (err) {
        if (err.code === "FIELDS_ERROR") {
          this.$vux.toast.show({
            text: err.message,
            type: "warn"
          });
        }
      }
    },
    chooseLeader() {
      this.$router.push({ name: "TeacherSelect",params:{
        userId:this.data.leaveerId
      } });
    },

    filterPhoneData(data) {
      let dataArray = data.data;
      for (var i = 0; i < dataArray.length; i++) {
        let dicArray = dataArray[i].items;
        for (var j = 0; j < dicArray.length; j++) {
          let dataDic = dicArray[j];
          this.$set(dataDic, "ischecked", false);
          this.$set(dataDic, "avatar", `${this.GLOBAL.API_HOST}${j.headPic}`);
        }
      }
      return data;
    },
    fnGetImage(src) {
      if (process.env.NODE_ENV === "development") {
        return `${src}`;
      } else {
        return `${this.GLOBAL.API_HOST}/SystemManage/CurrentUser/GetImg?Url=${src}&time=${Math.random()}`;
      }
    },
  },
  computed: {
    ...mapGetters(["children", "leaveV2"]),
    classList() {
      return _.map(this.children, (item, i) => {
        return {
          value: item.className,
          key: item.id
        };
      });
    },
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
.submit {
  width: 80%;
  margin-left: 1rem;
}
div .submit-btn {
  margin: 60px 0;
  color: #ffffff;
}
.isNotEdit span {
  color: #666;
}
</style>