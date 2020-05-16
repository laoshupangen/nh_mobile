<template>
  <div class="_page_wrap">
    <div class="_page_title">未归人员信息</div>
    <div class="cardRadius">
      <group gutter="0">
        <!-- class="mb-5" -->
        <cell :value="form.organNameAll">
          <span slot="title">
            <img class="_img" src="@/assets/icon/bj@2x.png" />
            <span class="_title">班级</span>
          </span>
        </cell>
        <cell :value="form.name">
          <span slot="title">
            <img class="_img" src="@/assets/icon/xm@2x.png" />
            <span class="_title">姓名</span>
          </span>
        </cell>
        <cell :value="form.studentNumber">
          <span slot="title">
            <img class="_img" src="@/assets/icon/xh@2x.png" />
            <span class="_title">学号</span>
          </span>
        </cell>
        <cell :value="form.dormName">
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
          :disabled="form.noReturnReason?true:false"
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
          :disabled="form.currentLocation?true:false"
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

    <div class="btn-wrap" v-if="form.checkStatus!==1">
      <x-button :show-loading="loading" @click.native="submitForm" style="margin-top: 15px;">上报</x-button>
    </div>
  </div>
</template>
<script>
import { Group, XTextarea, XButton, Cell } from "vux";
import { validator } from "@/utils";

import { CheckStudent, GetSafeDormStudentById } from "@/service";
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
              message: "理由不能为空!"
            }
          ]
        },
        location: {
          value: "",
          rules: [
            {
              type: "string",
              required: true,
              message: "地址不能为空!"
            }
          ]
        }
      },
      form: {},
      loading: false
    };
  },
  components: {
    Group,
    XTextarea,
    XButton,
    Cell
  },
  methods: {
    async submitForm() {
      this.loading = true;
      try {
        let fields = await validator(this.model);
        // console.log("ffields", fields);
        let { data } = await CheckStudent({
          id: this.$route.params.id,
          noReturnReason: fields.reason,
          currentLocation: fields.location
        });
        // console.log("ddd", data);
        this.$vux.toast.show({
          text:data.message,
          width:'80%'
        })
      } catch (err) {
        console.log("err", err);
        this.$vux.toast.show({
          text: err.message,
          width: "80%",
          type:'warn'
        });
      }
      this.loading = false
    },

    async setForm() {
      let id = this.$route.params.id;
      let { data } = await GetSafeDormStudentById(id);
      // console.log('data',data)
      
      this.form = data.data;
      let tem = this.form.organNameAll.split('/')
      this.form.organNameAll = tem[0]+'/'+tem[2]
      if(this.form.checkStatus===1){
        this.model.reason.value = this.form.noReturnReason
        this.model.location.value = this.form.currentLocation
      }
    }
  },
  mounted() {
    this.setForm();
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
</style>