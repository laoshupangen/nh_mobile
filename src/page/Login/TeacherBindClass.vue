<template>
  <div>
    <div class="login-wrapper">
      <div class="login-header"></div>
    </div>
    <div class="login-group">
      <group gutter="0">
        <PopupPicker
          @on-change="gradeChange"
          :columns="1"
          :show-name="true"
          v-model="model.gradeValue"
          :data="gradeList "
        >
          <template slot="title" slot-scope="props">
            <span class="pop-label" :style="props.labelStyle" style="height:24px;">
              <img id="img-icon" class="icon" src="@/assets/icon/grade.png">
              <span style="vertical-align:middle;color:#666;font-size:16px">请选择年级</span>
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
            <span class="pop-label" :style="props.labelStyle" style="height:24px;">
              <img id="img-icon" class="icon" src="@/assets/icon/yonghu.png">
              <span style="vertical-align:middle;color:#666;font-size:16px">请选择院系</span>
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
            <span class="pop-label" :style="props.labelStyle" style="height:24px;">
              <img id="img-icon" class="icon" src="@/assets/icon/class-gray.png">
              <span style="vertical-align:middle;color:#666;font-size:16px">请选择班级</span>
            </span>
          </template>
        </PopupPicker>
      </group>
    </div>
    <div class="login-button">
      <x-button @click.native="submit">绑定</x-button>
    </div>
  </div>
</template>
          
<script>
import { GetSelectJsonByCategoryId, TeacherBindClass } from "@/service";
import { Group, PopupPicker, XButton } from "vux";
import { mapGetters, mapMutations } from "vuex";

export default {
  data() {
    return {
      parentId: "8ce2cc5572e6294c9af0efa643c5c4ca",
      pickerIndex: 0,
      gradeList: [],
      departmentList: [],
      classList: [],
      className: "",
      model: {
        gradeValue: [""],
        departmentValue: [""],
        classValue: [""]
      }
    };
  },
  components: {
    Group,
    PopupPicker,
    XButton
  },
  mounted() {
    this.getConcact();
  },
  computed: {
    ...mapGetters(["userInfo", "bindClass"])
  },
  methods: {
    ...mapMutations(["ADD_BindClass"]),
    getConcact() {
      GetSelectJsonByCategoryId({
        parentId: this.parentId
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
      this.departmentList = [];
      this.classList = [];
      this.pickerIndex = 1;
      this.parentId = val[0];
      this.getConcact();
    },
    departmentChange(val) {
      this.classList = [];
      this.pickerIndex = 2;
      this.parentId = val[0];
      this.getConcact();
    },
    classChange(val) {
    },
    async submit() {
      try {
        if (this.model.gradeValue[0] == "") {
          this.alertText("请选择年级");
          return;
        }
        let classId = "";
        let className = '';
        if (this.model.departmentValue[0] == "") {
          classId = this.model.gradeValue[0];

          let filterArray = this.gradeList.filter(
            item => item.value === classId
          );
          className = filterArray[0].name;
        } else if (this.model.classValue[0] == "") {
          classId = this.model.departmentValue[0];

          let filterArray = this.departmentList.filter(
            item => item.value === classId
          );
          className = filterArray[0].name;
        } else {
          classId = this.model.classValue[0];

          let filterArray = this.classList.filter(
            item => item.value === classId
          );
          className = filterArray[0].name;
        }
        let data = await TeacherBindClass({
          classID: classId,
          teacherId: this.userInfo.UserId
        });
        this.ADD_BindClass({
          Id: classId,
          Name: className
        });
        this.$vux.toast.show({
          text: "绑定成功",
          type: "success"
        });
        this.$router.go(-1);
      } catch (err) {}
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

 <style lang="less" scoped>
.login-wrapper {
  margin-top: 0px;
  .login-header {
    background-repeat: no-repeat;
    background-image: url("./../../assets/login-bg.png");
    height: 5.6rem;
    background-size: cover;
    width: 100%;
    background-position: top center;
  }
}

.login-group {
  margin: 30px 10px;
}

#img-icon {
  width: 0.45rem;
  vertical-align: middle;
  margin-right: 15px;
}

.login-button {
  width: 80%;
  margin: 80px auto;
  button {
    background: #2eb1fd;
    color: #ffffff;
  }
}
</style>

