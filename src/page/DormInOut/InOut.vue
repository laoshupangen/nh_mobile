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
      <PopupPicker
       
        :columns="1"
        :show-name="true"
        v-model="model.studentValue"
        :data="studentList "
      >
        <template slot="title" slot-scope="props">
          <span :class="props.labelClass" :style="props.labelStyle" style="height:24px;">
            <span style="color:red;font-size:20px;vertical-align:middle;">*</span>
            <span style="vertical-align:middle;">请选择学生</span>
          </span>
        </template>
      </PopupPicker>
    </group>
    
    <div class="btn-wrap">
      <x-button @click.native="submitForm" style="margin-top: 60px;"></x-button>
    </div>
  </div>
</template>

<script>
import { Group, PopupPicker, XButton, Cell, Alert, Search } from "vux";
import moment from "moment";
import {
  GetSelectJsonByCategoryId,
  GetGridSelectByClassId,
  searchStudentByNameOrNum
} from "@/service";
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      searchText: "",
      result: [],
      pickerIndex: 0,
      today: moment().format("YYYY-MM-DD"),
      getParams: {
        parentId: ""
      },
      gradeList: [],
      departmentList: [],
      classList: [],
      studentList: [],
      currentClassId: "",
      model: {
        gradeValue: [""],
        departmentValue: [""],
        classValue: [""],
        studentValue: [""]
      }
    };
  },
  computed: {
    ...mapGetters(["bindClass", "currentClass"])
  },
  components: {
    Group,
    PopupPicker,
    XButton,
    Cell,
    Alert,
    Search
  },
  mounted() {
    if (this.bindClass.length > 0) {
      this.currentClassId = this.currentClass.key;
    }
    if (this.currentClassId) {
      this.classChange([this.currentClassId]);
    } else {
      this.getConcact();
    }
  },
  activated() {
    if (this.bindClass.length > 0) {
      this.currentClassId = this.currentClass.key;
    }
    if (this.currentClassId) {
      this.classChange([this.currentClassId]);
    }
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
    classChange(val) {
      GetGridSelectByClassId(val[0]).then(data => {
        let list = [];
        for (let i = 0; i < data.data.length; i++) {
          let dic = {
            name: data.data[i].Name,
            value: data.data[i].UserId
          };

          list.push(dic);
        }
        this.studentList = list;
      });
    },
    resultClick(item) {
      // console.log(item)
      this.$refs.search.cancel();
      this.$router.push({
        name: "inOutStudent",
        params: {
          id: item.id
        }
      });
      // this.searchText = item
    },
    async getResult(val) {
      // console.log("on-change", val, this.searchText);
      // this.result = val ? getResult(this.searchText) : []
      if (!val) {
        return;
      }
      let char = /^[\u4e00-\u9fa5]+$/;
      if (char.test(val)) {
        if (val.length < 2) {
          return;
        }
      } else {
        if (val.length < 6) {
          return;
        }
      }
      let data = await searchStudentByNameOrNum(this.searchText);
      // console.log(this.userInfo)
      this.result = data.data.map(d => ({
          ...d,
          title: `${d.Grade}/${d.Class}-${d.text}`
        }));
      // console.log(this.result);
    },
    onFocus() {
      console.log("on focus");
    },
    onCancel() {
      console.log("on cancel");
      this.result = [];
    },

    submitForm() {
      if (this.model.gradeValue[0] == "" && this.bindClass.length == 0) {
        this.alertText("请选择年级");
        return;
      }
      if (this.model.departmentValue[0] == "" && this.bindClass.length == 0) {
        this.alertText("请选择院系");
        return;
      }
      if (this.model.classValue[0] == "" && this.bindClass.length == 0) {
        this.alertText("请选择班级");
        return;
      }
      if (this.model.studentValue[0] == "") {
        this.alertText("请选择学生");
        return;
      }
      this.$router.push({
        name: "inOutStudent",
        params: {
          id: this.model.studentValue[0]
        }
      });
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
