<template>
  <div>
    <group gutter="0">
      <PopupPicker
        @on-change="gradeChange"
        :columns="1"
        :show-name="true"
        v-model="model.gradeValue"
        :data="gradeList "
      >
        <template slot="title" slot-scope="props">
          <span :class="props.labelClass" :style="props.labelStyle" style="height:24px;">
            <span style="color:red;font-size:20px;vertical-align:middle;">*</span>
            <span style="vertical-align:middle;">请选择年级</span>
          </span>
        </template>
      </PopupPicker>
      <PopupPicker
        @on-change="departmentChange"
        :columns="1"
        :show-name="true"
        v-model="model.departmentValue"
        :data="departmentList "
      >
        <template slot="title" slot-scope="props">
          <span :class="props.labelClass" :style="props.labelStyle" style="height:24px;">
            <span style="color:red;font-size:20px;vertical-align:middle;">*</span>
            <span style="vertical-align:middle;">请选择院系</span>
          </span>
        </template>
      </PopupPicker>
      <PopupPicker
        @on-change="classChange"
        :columns="1"
        :show-name="true"
        v-model="model.classValue"
        :data="classList "
      >
        <template slot="title" slot-scope="props">
          <span :class="props.labelClass" :style="props.labelStyle" style="height:24px;">
            <span style="color:red;font-size:20px;vertical-align:middle;">*</span>
            <span style="vertical-align:middle;">请选择班级</span>
          </span>
        </template>
      </PopupPicker>
      <PopupRadio
        title="选择日期"
        @on-change="deteChoose"
        v-model="model.quickDateValue"
        :options="quickDateList "
      ></PopupRadio>
      <datetime title="开始时间" v-model="model.startDate" :end-date="today"></datetime>
      <datetime title="结束时间" v-model="model.endDate" :end-date="today"></datetime>
    </group>
    <div class="btn-wrap">
      <x-button @click.native="submitForm" style="margin-top: 60px;">查询</x-button>
    </div>
  </div>
</template>

<script>
import {
  Group,
  PopupPicker,
  PopupRadio,
  XButton,
  Cell,
  Datetime,
  Alert
} from "vux";
import moment from "moment";
import { GetSelectJsonByCategoryId } from "@/service";

export default {
  data() {
    return {
      pickerIndex: 0,
      today: moment().format("YYYY-MM-DD"),
      getParams: {
        parentId: "8ce2cc5572e6294c9af0efa643c5c4ca"
      },
      gradeList: [],
      departmentList: [],
      classList: [],
      quickDateList: ["今天", "昨天", "本周", "本月", "上月"],

      model: {
        gradeValue: [""],
        departmentValue: [""],
        classValue: [""],

        quickDateValue: "",
        startDate: "",
        endDate: ""
      }
    };
  },
  components: {
    Group,
    PopupPicker,
    PopupRadio,
    XButton,
    Cell,
    Datetime,
    Alert
  },
  mounted() {
    this.getConcact();
  },
  methods: {
    getConcact() {
      GetSelectJsonByCategoryId({
        parentId: this.getParams.parentId
      }).then(data => {
        let list = [];
        for (let i = 0; i < data.data.length; i++) {
          let dic = {
            name: data.data[i].text,
            value: data.data[i].id
          };

          list.push(dic);
        }
        if (this.pickerIndex == 0) {
          this.gradeList = list;
        } else if (this.pickerIndex == 1) {
          this.departmentList = list;
        } else if (this.pickerIndex == 2) {
          this.classList = list;
        }
      });
    },

    gradeChange(val) {
      (this.departmentList = []),
        (this.claseeList = []),
        (this.pickerIndex = 1);
      this.getParams.parentId = val[0];
      this.getConcact();
    },
    departmentChange(val) {
      (this.claseeList = []), (this.pickerIndex = 2);
      this.getParams.parentId = val[0];
      this.getConcact();
    },
    classChange(val) {},
    submitForm() {
      if (this.model.gradeValue[0] == "") {
        this.alertText("请选择年级");
        return;
      }
      if (this.model.departmentValue[0] == "") {
        this.alertText("请选择院系");
        return;
      }
      if (this.model.classValue[0] == "") {
        this.alertText("请选择班级");
        return;
      }

      //通过班级查晚归
      this.$router.push({
        name: "NotInList",
        params: {
          id: this.model.classValue[0],
          startTime: this.model.startDate,
          endTime: this.model.endDate
        }
      });
    },
    deteChoose(val) {
      var today  = moment(new Date()).format("YYYY-MM-DD")
      if (val == "今天") {
        var startDate  = moment(new Date()).format("YYYY-MM-DD")

        this.model.startDate = startDate ;
        this.model.endDate = today ;
      } else if (val == "昨天") {
        var startDate  = moment().subtract(1,'days').format('YYYY-MM-DD')

        this.model.startDate = startDate ;
        this.model.endDate = startDate ;
      }else if(val == '本周'){
        var startDate = moment().week(moment().week()).startOf('week').format('YYYY-MM-DD');

        this.model.startDate = startDate ;
        this.model.endDate = today ;
      }else if(val == '本月'){
        var startDate = moment().subtract(0,'month').format('YYYY-MM') + '-01'

        this.model.startDate = startDate ;
        this.model.endDate = today ;
      }else if(val == '上月'){
        var startDate = moment().subtract(1,'month').format('YYYY-MM') + '-01'
        var endDate = moment().month(moment().month() - 1).endOf('month').format('YYYY-MM-DD')

        this.model.startDate = startDate ;
        this.model.endDate = endDate ;
      }
    },
    alertText(text) {
      this.$vux.toast.show({
        text: text,
        type: "warn"
      });
    }
  }
};
</script>


<style lang="less">
.btn-wrap {
  margin-left: 10%;
  width: 80%;
}
.btn-wrap button {
  color: #ffffff;
}
</style>
