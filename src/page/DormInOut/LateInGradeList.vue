<template>
  <div>
    <group gutter="0" v-for="(item,i) in data" :key="i">
      <cell
        class="cell-title"
        :title="item.divisName"
        @click.native="item.isShow = !item.isShow"
        is-link
        :border-intent="false"
        :arrow-direction="data.isShow ? 'up' : 'down'"
      ></cell>
      <div class="cell-child" v-show="item.isShow" v-for="(boxItem,i) in item.list" :key="i">
        <cell-box
          :border-intent="false"
          class="sub-item"
          is-link
          @click.native="ClassList(boxItem)"
        >
          <span>{{boxItem.className}}</span>
          <span class="count">{{boxItem.count+'人'}}</span>
        </cell-box>
      </div>
    </group>
  </div>
</template>

<script>
import { GetLateListByGrade } from "@/service";
import { Group, Cell, CellBox } from "vux";

export default {
  data() {
    return {
      data: [
        {
          divisName: "",
          divisId: "",
          list: [],
          isShow: false
        }
      ]
    };
  },
  components: {
    Group,
    Cell,
    CellBox
  },
  computed: {},
  mounted() {
    this.reloadData();
  },
  methods: {
    async reloadData() {
      this.$vux.loading.show({
        text: "Loading"
      });
      try {
        let data = await GetLateListByGrade({
            gradeId: this.$route.params.id,
            startTime: this.$route.params.startTime,
            endTime: this.$route.params.endTime
        //   gradeId: "23d422d6bfa4ae4983184b15041b9d7f",
        //   startTime: "2019-04-24",
        //   endTime: "2019-04-26"
        });
        this.data = data.data;
        for (var i = 0; i < this.data.length; i++) {
          var dic = this.data[i];
          this.$set(dic, "isShow", false);
        }
        this.$vux.loading.hide();
      } catch (err) {
        this.$vux.loading.hide();
      }
    },

    ClassList(item) {
      //通过班级查晚归
      console.log(item)
      this.$router.push({
        name: "LateInClassList",
        params: {
          id: item.classId,
          startTime: this.$route.params.startTime,
          endTime: this.$route.params.endTime
        }
      });
    }
  }
};
</script>


<style lang="less">
.cell-title {
  color: #1a1a1a;
  font-size: 15px;
}

.cell-child {
  border-bottom: 1px solid rgb(226, 223, 223);
  color: #4d4d4d;
  font-size: 13px;
  background-color: #f0f0f0;

  .count {
    padding-left: 72%;
  }
}
</style>
