<template>
  <div>
    <!-- <div class="select" @click="leaveV2ListShow">
      <img class="more" src="../../assets/icon/more.png" alt>
    </div> -->

    <div class="leave-wrapper">
      <!-- <mescroll-vue id="mescroll" class="mescroll-scroll" :up="{use: false,isBounce:false}" :down="{use: false,isBounce:false}"> -->
        <group gutter="0" style="margin-bottom: 30px;">
          <popup-radio
            title="请假类型"
            :options="leaveType"
            v-model="model.LeaveType.value"
            class="mb-5"
            @on-change="leaveTypeChange"
          ></popup-radio>
          <popup-radio
            v-show="model.LeaveType.value == '3'"
            title="节假日选择"
            :options="holidayList"
            v-model="holidayIndex"
            class="mb-5"
            @on-change="holidayChange"
          ></popup-radio>
          <cell v-show="model.LeaveType.value == '3'||model.LeaveType.value == '4'" title="开始时间" v-model="startTime"></cell>
          <cell v-show="model.LeaveType.value == '3'||model.LeaveType.value == '4'" title="结束时间" v-model="endTime"></cell>
          <datetime
            v-show="model.LeaveType.value != '3'&&model.LeaveType.value != '4'"
            title="开始时间"
            format="YYYY-MM-DD"
            v-model="startTime"
            class="mb-5"
            :startDate="today"
            @on-change="handleTips"   
               
          ></datetime>
          <!--  :startDate="dateEnd"   -->

          <datetime
            v-show="model.LeaveType.value != '3'&&model.LeaveType.value != '4'"
            title="结束时间"
            format="YYYY-MM-DD"
            v-model="endTime"
            class="mb-5"
            :endDate="affairEnd"
            :startDate="startTime"></datetime>

          <x-input title="请假天数" :value="leaveDays" :disabled="true" class="mb-5"></x-input>

          <x-textarea
            title="请假事由"
            :max="100"
            placeholder="请输入请假事由"
            v-model="model.ReasonForLeave.value"
            :show-counter="true"
            :height="100"
            :rows="4"
            :cols="20"
          ></x-textarea>
          <div
            v-show="model.LeaveType.value == '2'"
            style="border-top: 1px solid #eee;border-bottom: 1px solid #eee;"
          >
            <!-- <uploader
              :upload-url="`${GLOBAL.API_HOST}/File/FileUpload`"
              v-model="model.AttachmentsPath.value"
              title="请假凭证"
              :maxFile="6"
            /> -->
            <image-uploader
              :action="`${GLOBAL.API_HOST}/File/FileUploadNew`"
              accept="image/*"
              wrapperId="file1"
              v-model="model.AttachmentsPath.value"
              title="请假凭证"
              :max="6"
            ></image-uploader>
          </div>
          <cell
            @click.native="handleListShow"
            :value="leaveV2.approvalNames"
            title="审批人"
            :height="100"
          ></cell>
        </group>
        <div class="btn-wrap">
          <x-button :show-loading="loading" @click.native="submitForm" >提交</x-button>
          <!-- <router link='/LeaveV2List'></router> -->
          
        </div>
        <!-- <div style="text-align:right;padding:10px 10%">
          <router-link to="/LeaveV2List">查看记录</router-link>
        </div> -->

      <!-- </mescroll-vue> -->
    </div>
  </div>
</template>

<script>
import {
  Group,
  Cell,
  PopupRadio,
  Datetime,
  XTextarea,
  XButton,
  XInput
} from "vux";
import Uploader from "@/components/Uploader/Uploader";
import { mapGetters, mapMutations } from "vuex";
import { applyLeaveV2, getTeacherPhoneBook, getHolidaList } from "@/service";
import { validator } from "@/utils";
import moment from "moment";
import { format } from "path";
import { dateFormat } from "vux";
// import MescrollVue from "mescroll.js/mescroll.vue";
import ImageUploader from "@/components/ImageUploader";
import {getWeekenDayByCurrent}  from '@/utils/date.js'



export default {
  data() {
    return {
      mescroll:{},
      startTime:'',
      endTime:'',
      affairEnd:'',
      today: moment().format("YYYY-MM-DD"),
      loading: false,
      leaveType: [
        {
          key: 1,
          value: "事假"
        },
        {
          key: 2,
          value: "病假"
        },
        {
          key: 3,
          value: "节假日请假"
        },
        {
          key:4,
          value:'周末请假'
        }
      ],
      holidayList: [],
      holidayIndex: "",
      seletedUsers: [],
      model: {
        LeaveerId: {
          value: "",
          rules: [
            {
              type: "string",
              required: true,
              message: "申请人参数为空"
            }
          ]
        },
        LeaveType: {
          value: "",
          rules: [
            {
              type: "number",
              required: true,
              message: "请选择请假类型"
            }
          ]
        },
        AttachmentsPath: {
          value: [],
          rules: [
            {
              type: "array",
              required: false,
              message: "请上传请假凭证"
            }
          ],
          transform: value => {
            return value
              .map((item, i) => {
                return item.response;
              })
              .join(",");
          }
        },
        StartTime: {
          value: moment().format("YYYY-MM-DD"),
          rules: [
            {
              type: "string",
              required: true,
              message: "请选择开始时间"
            }
          ]
        },
        EndTime: {
          value: "",
          rules: [
            {
              type: "string",
              required: true,
              message: "请选择结束时间"
            }
          ]
        },
        LeaveDays: {
          value: "",
          rules: [
            {
              type: "number",
              required: true,
              message: "请假天数不能为空"
            }
          ]
        },
        ReasonForLeave: {
          value: "",
          rules: [
            {
              type: "string",
              required: true,
              message:'请假事由不能为空'
            }
          ]
        },
        Approvers: {
          value: "",
          rules: [
            {
              type: "array",
              required: true,
              message: "请选择审批人"
            }
          ]
        }
      }
    };
  },
  components: {
    Group,
    PopupRadio,
    Datetime,
    XTextarea,
    XButton,
    XInput,
    Cell,
    Uploader,
    // MescrollVue,
    ImageUploader
  },
  watch: {},
  mounted() {
    getHolidaList().then(data => {
      let list = JSON.parse(data.data.message);
      this.holidayList = _.map(list, (item, i) => {
        return {
          key: i,
          value: item.name,
          startTime: dateFormat(item.startTime, "YYYY-MM-DD"),
          endTime: dateFormat(item.endTime, "YYYY-MM-DD")
        };
      });
    });
  },
  methods: {
    ...mapMutations(["SET_APPROVALUSER"]),    
    
    leaveV2ListShow() {
      this.$router.push({ name: "LeaveV2List" });
    },
    handleListShow() {
      this.$router.push({ name: "TeacherSelect" ,params:{
        userId:this.userInfo.UserId
      }});
    },
    leaveTypeChange(val) {
      console.log(val,typeof(val))
      if (val != 2){
        this.model.AttachmentsPath.value = [];
      }
      if(val === 1){

        this.startTime = moment().format('YYYY-MM-DD')
        this.endTime = ''
        this.affairEnd = moment(this.startTime).add(13,'days').format('YYYY-MM-DD')
        console.log('leaveType',this.affairEnd,this.startTime)
        return
      }
      
      if (val === 3) {
        this.affairEnd = ""
        if(!this.holidayIndex){
          this.startTime = "";
          this.endTime = "";
          this.model.LeaveDays.value = "";

        }
        if(this.holidayIndex){
          let tem = this.holidayList.find((h,i)=>i===this.holidayIndex)
          // console.log(tem,this.holidayIndex)
          this.startTime = tem.startTime
          this.endTime = tem.endTime
        }
        return
      }
      if(val === 2){
        this.affairEnd = ''
      }
      
      if(val == 4){
        // console.log(getWeekenDayByCurrent(new Date('2019-07-21')))
        let satday = getWeekenDayByCurrent(new Date(), 5)
        let sunday = getWeekenDayByCurrent(new Date(), 6)
        this.startTime = moment(satday).format("YYYY-MM-DD")
        this.endTime = moment(sunday).format("YYYY-MM-DD")
        return
      }
      // this.affairEnd = ""
      // this.endTime = ""
    },
    holidayChange(val) {
      let obj = this.holidayList[parseInt(val)];
      this.startTime = obj.startTime;
      this.endTime = obj.endTime;
    },
    async submitForm() {
      this.loading = true;
      try {
        if(this.model.LeaveType.value == '4'){
          let ssdd = getWeekenDayByCurrent(new Date(),5)
          let edd = getWeekenDayByCurrent(new Date(), 6)
          this.model.StartTime.value = moment(ssdd).format("YYYY-MM-DD")
          this.model.EndTime.value = moment(edd).format("YYYY-MM-DD" + ' 23:59:59')
         
          
        } else {
          this.model.StartTime.value = this.startTime
          this.model.EndTime.value = this.endTime + ' ' +'23:59:59'
        }
       
        this.model.LeaveerId.value = this.userInfo.UserId;
        this.model.Approvers.value = this.leaveV2.approvalUserIds;
        this.model.LeaveDays.value = parseFloat(
          this.leaveDays.replace("天", "")
        );
        let fields = await validator(this.model);
        let response = await applyLeaveV2(fields);
        this.loading = false;
        this.$vux.toast.show({
          text: "申请成功",
          type: "success"
        });
        //申请成功审批人数据初始化
        // this.$router.go(0)
        this.SET_APPROVALUSER({ userids: [], names: "" });
        this.$router.replace({ name: "LeaveV2List" });
        // this.$router.go(-1)
      } catch (err) {
        this.loading = false;
        if (err.code === 'NETWORK_ERROR') {
          this.$vux.toast.show({
            width: '60%',
            text: err.message,
            type: "warn"
          });
        }
        if (err.code === "FIELDS_ERROR") {

          this.$vux.toast.show({
            text: err.message,
            type: "warn"
          });
        }
      }
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    handleTips(val){
      // console.log(val,this.model.LeaveType.value)
     let ld = parseInt(this.leaveDays)
      if(this.model.LeaveType.value === 1){
        this.affairEnd = moment(val).add(13,'days').format('YYYY-MM-DD')
        // console.log('affairEnd',this.affairEnd)  
      }
     if(typeof(ld)==='number'&&ld<1){ 
       this.endTime = ''      
      //  this.$vux.toast.show({type:'warn',text:'结束时间不能少于开始时间',width:'60%'})
     } 
    }
  },
  computed: {
    ...mapGetters(["leaveV2", "children", "userInfo"]),
    
    childList() {
      return _.map(this.children, (item, i) => {
        return {
          key: item.userId,
          value: item.studentName
        };
      });
    },
    leaveDays() {
      if (this.startTime == "" || this.endTime == "") {
        return "";
      }
      return (
        parseInt(
          moment(this.endTime).diff(
            moment(this.startTime),
            "days"
          )
        ) +
        1 + '天' 
      );
    }
  }
};
</script>

<style scoped lang="less">
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
  background: #f5f5f5;
  z-index: 9999;
  .option-list {
    padding: 0 5px;
    .option-text {
      width: 2.5rem;
      height: 40px;
      text-align: center;
      line-height: 40px;
      font-size: 0.375rem;
      box-sizing: border-box;
      border-bottom: 1px solid #eee;
    }
  }
}

.leave-wrapper {
  height: 100%;
  background: #f0f0f0;
}
.leave-wrapper .weui-cells .weui-cell {
  color: #1a1a1a;
  font-size: 16px;
}
.btn-wrap {
  margin-top:60px;
  margin-left: 10%;
  width: 80%;
}
.btn-wrap button {
  color: #ffffff;
}
</style>
