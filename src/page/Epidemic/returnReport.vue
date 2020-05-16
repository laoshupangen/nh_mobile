<template>
  <div class="_page_wrap">
    <div class="_page_title">未归人员信息</div>
    <div class="cardRadius">
      <group gutter="0">
        <!-- class="mb-5" -->
        <popup-picker
          :data="organList"
          :columns="3"
          :display-format="formatterOrg"
          @on-hide="GetSafeDormStudent"
          v-model="organId"
          placeholder="选择班级"
        >
          <span slot="title">
            <img class="_img" src="@/assets/icon/bj@2x.png" />
            <span class="_title">班级</span>
          </span>
        </popup-picker>
        <cell v-show="studentList.length>0||visible" v-model="form.name" @click.native="visible=true">
          <span slot="title">
            <img class="_img" src="@/assets/icon/xm@2x.png" />
            <span class="_title">姓名</span>
          </span>
        </cell>

        <cell v-model="form.studentNumber">
          <span slot="title">
            <img class="_img" src="@/assets/icon/xh@2x.png" />
            <span class="_title">学号</span>
          </span>
        </cell>
        <cell v-model="form.dormName">
          <span slot="title">
            <img class="_img" src="@/assets/icon/ss@2x.png" />
            <span class="_title">宿舍</span>
          </span>
        </cell>
      </group>
    </div>
    <div class="_page_title">核查原因</div>
    <div class="cardRadius">
      <group gutter="0">
        <x-textarea
          style="display:block"
          :max="100"
          placeholder="请输入未归原因"
          v-model="model.reason.value"
          :show-counter="true"
          :height="100"
          :rows="8"
          :cols="40"
        >
          <span slot="label">
            <img class="_img" src="@/assets/icon/ly@2x.png" />
            <span class="_title">未归原因</span>
          </span>
        </x-textarea>

        <x-textarea
          style="display:block"
          :max="20"
          placeholder="请输入当前位置"
          v-model="model.location.value"
          :show-counter="false"
          :height="30"
          :rows="2"
          :cols="40"
        >
          <span slot="label">
            <img class="_img" src="@/assets/icon/dz@2x.png" />
            <span class="_title">当前所在位置</span>
          </span>
        </x-textarea>
      </group>
    </div>

    <div class="btn-wrap">
      <x-button :show-loading="loading" @click.native="submitForm" style="margin-top: 15px;">上报</x-button>
    </div>

    <div v-transfer-dom>
      <popup v-model="visible" position="bottom" should-scroll-top-on-show>
        <popup-header right-text="取消" @on-click-right="visible=false" title="学生未归信息"></popup-header>
        
        <group :gutter="0">
          <!-- <radio title="title" :options="studentList" ></radio> -->
          <cell v-for="(stu,i) in studentList" @click.native="selectStu(stu)" :key="i" :title="stu.name" ></cell>
        </group>
      </popup>
    </div>
  </div>
</template>
<script>
import { Group, XTextarea, XButton, Cell, PopupPicker, Popup, Icon ,PopupHeader,Radio} from "vux";
import {
  UpdateStudentInOutStatus,
  GetSafeDormStudent,
  GetStudentOrgAll
} from "@/service";
import { validator } from "@/utils";
export default {
  data() {
    return {
      model: {
        reason: {
          value: "",
          rules: [
            {
              type: "string",
              required: true,
              message: "未归原因不能为空"
            }
          ]
        },
        location: {
          value: "",
          rules: [
            {
              type: "string",
              required: true,
              message: "当前位置不能为空!"
            }
          ]
        },
        id: {
          value: "",
          rules: [
            {
              type: "number",
              required: true,
              message: "学生不能为空!"
            }
          ]
        }
      },
      form:{
        name:'',
        studentNumber:'',
        dormName:''
      },
      organId: [],
      student: "",
      loading: false,
      organList: [],
      studentList: [],
      visible: false,
      keyword:''
    };
  },
  components: {
    Group,
    XTextarea,
    XButton,
    Cell,
    PopupPicker,
    Icon,
    Popup,
    PopupHeader,
    Radio
  },
  methods: {
    async submitForm() {
      this.loading = true;
      try {
        let fields = await validator(this.model);
        let { data } = await UpdateStudentInOutStatus({
          id: fields.id,
          noReturnReason: fields.reason,
          currentLocation: fields.location
        });
        this.$vux.toast.show({
          text: data.message,
          width: "80%"
        });
      } catch (err) {
        // console.log("err", err);
        this.$vux.toast.show({
          text: err.message,
          width: "80%",
          type: "warn"
        });
      }
      this.loading = false;
    },
    async GetStudentOrgAll() {
      let { data } = await GetStudentOrgAll();
      this.organList = data.data
        .filter(l => l.parentId !== "root")
        .map(item => ({
          name: item.name,
          value: item.id,
          parent: item.parentId === "2" ? 0 : item.parentId
        }));
      // console.log("getStudentOrg", this.organList);
    },
    async GetSafeDormStudent() {
      if(this.organId.length===0)return
      let { data } = await GetSafeDormStudent({
        organId: this.organId[2],
        page: 1,
        rows: 200,
        sord:'desc',
        sidx:'id'
      });
      // console.log("GetSafeDormStudent", data);
      this.studentList = data.rows
    },
    formatterOrg(val, name) {
      // console.log(val,name)
      let tn = name.split(" ");
      return tn[0] + tn[2];
    },
    cancelPopup(){
      this.visible = false
    },
    getResult(val){
      //  this.studentList = this.studentList.filter(stu=>stu.name.indexOf(val)>-1)
    },
    selectStu(item){
       this.model.id.value = item.id
       this.form = item
       this.visible = false
    }
  },
  watch:{
    organId(val){
      this.form.name = ''
      this.form.studentNumber = ''
      this.form.dormName = ''
      this.model.id.value = ''
    }
  },
  mounted() {
    this.GetStudentOrgAll();
  }
};
</script>
<style scoped>
._page_wrap {
  background: #fafafa;
}
.cardRadius {
  padding: 0 15px;
  border-radius: 10px 10px 0 0;
}
._img {
  width: 20px;
  height: 20px;
  vertical-align: middle;
}
._title {
  vertical-align: middle;
}
._page_title {
  color: grey;
  font-size: 14px;
  padding: 5px 20px;
}
.btn-wrap {
  padding: 10px 20px;
}
.btn-wrap button {
  color: #ffffff;
}
._slot_right{
  margin-left: 10px;
}
</style>