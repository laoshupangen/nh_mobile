<template>
  <div style="height: 100%">
    <!-- <tab v-model="index" :animate="false">
      <tab-item @on-item-click="resetList" active-class="active-6-1" selected>待审批</tab-item>
      <tab-item @on-item-click="resetList" active-class="active-6-2">已审批</tab-item>
    </tab>-->
    <mescroll-vue
      id="mescroll"
      class="mescroll-container"
      @init="initCallBack"
      :up="up"
      :down="down"
    >
      <group gutter="0">
        <div v-for="(item, i) in list" :key="i">
          <form-preview
            :name="item.ID"
            :header-label="item.headLabel"
            :header-value="item.headValue"
            :body-items="item.options"
          ></form-preview>
          <br />
        </div>
      </group>
    </mescroll-vue>
      <no-data :visible="list.length === 0"></no-data>
  </div>
</template>

<script>
import { FormPreview, Group, Tab, TabItem } from "vux";
import { getNoRecord, getNoOutList, showOut } from "@/service";
import { mapGetters } from "vuex";
import MescrollVue from "mescroll.js/mescroll.vue";
import _ from "lodash";
import NoData from "@/components/NoData.vue";
export default {
  data() {
    return {
      list: [],
      index: 0,
      title: "",
      meScroll: {},
      up: {
        use: true,
        callback: this.upCallBack,
        auto: true,
        isBounce: false,
        page: {
          num: 0,
          size: 15
        }
      },
      down: {
        use: false
      },
      jMap: {}
    };
  },
  mounted() {},
  methods: {
    resetList(index) {
      this.list = [];
      this.meScroll.resetUpScroll();
    },

    initCallBack(mescroll) {
      this.meScroll = mescroll;
    },
    async upCallBack(page, mescroll) {
      try {
        let data = await this.getList(page.num, page.size);
        // console.log(data);
        this.list = _.concat(this.list, this.parseList(data.rows));
        this.meScroll.endSuccess(15, data.rows.length === 15);
      } catch (err) {
        // console.log(err);
        this.meScroll.endSuccess(15, true);
      }
    },
    async getList(pageNum, pageSize) {
      let key = this.$route.params.type;
      switch (key) {
        case 1:
          try {
            let data = await getNoRecord({
              rows: pageSize,
              page: pageNum,
              orgId: this.$route.params.orgId
            });
            this.title = "姓名";
            this.jMap = {
              name: "姓名",
              studentNumber: "学号",
              yearNumber: "组织机构",
              subjectId: "宿舍楼栋",
              mobilePhone: "手机号码",
              credType: "证件类型",
              credNumber: "证件号码"
              // facePic:'头像'
            };

            return data.data;
          } catch (err) {}
          break;
        case 2:
          try {
            let data = await getNoOutList({
              rows: pageSize,
              page: pageNum,
              orgId: this.$route.params.orgId
            });
            this.title = "姓名";
            this.jMap = {
              account: "用户账号",
              dorm: "楼栋宿舍",
              inTime: "最后进入时间",
              name: "姓名",
              organName: "组织机构",
              time: "时间"
            };
            return data.data;
          } catch (err) {}
          break;
        case 3:
          try {
            let data = await showOut({
              rows: pageSize,
              page: pageNum,
              orgId: this.$route.params.orgId
            });
            this.title = "姓名";
            this.jMap = {
              studentNumber: "学号",
              credType: "证件类型",
              credNumber: "证件号吗",
              gender: "性别",
              mobilePhone: "手机"
            };

            return data.data;
          } catch (err) {
            // console.log("err", err);
            this.$vux.toast.show({
              text: err.message,
              type: "warn",
              width:'80%'
            });
          }
          break;
      }
    },
    parseList(data) {
      let output = [];
      let title = this.title;
      let jMap = this.jMap;
      let keys = Object.keys(jMap);
      _.forEach(data, function(item, i) {
        output.push({
          headLabel: title,
          headValue: item.name,
          ID: item.id,
          options: _.map(item, function(n, j) {
            // console.log(n,j)
            if (keys.indexOf(j) === -1) {
              return {
                label: "",
                value: ""
              };
            }
            if (j === "gender") {
              return {
                label: jMap[j],
                value: n === "1" ? "男" : "女"
              };
            }
            return {
              label: jMap[j],
              value: n
            };
          })
        });
      });

      return output;
    }
  },
  components: {
    FormPreview,
    Group,
    Tab,
    TabItem,
    MescrollVue,
    NoData
  },
  computed: {
    ...mapGetters(["userInfo"])
  }
};
</script>

<style scoped>
.weui-form-preview__value {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>