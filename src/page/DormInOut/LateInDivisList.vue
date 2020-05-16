<template>
  <div>
    <no-data :visible="dataList.length === 0"></no-data>
    <flexbox wrap="wrap" :gutter="0" style="width = 100%;">
      <flexbox-item :span=".5" v-for="(item, index) in dataList" :key="index" @click="ClassList(item)">
        <div class="flex-demo">
          <div class="className">{{item.className}}</div>
          <div class="count">{{'晚归人数：' +item.count +'人'}}</div>
          <div class="info">查看详情 》</div>
        </div>
      </flexbox-item>
    </flexbox>
  </div>
</template>

<script>
import { GetLateListByDivis } from "@/service";
import { Flexbox, FlexboxItem } from "vux";
import NoData from "@/components/NoData.vue";

export default {
  data() {
    return {
      dataList: [   
      ]
    };
  },
  components: {
    Flexbox,
    FlexboxItem,
    NoData
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
        let data = await GetLateListByDivis({
          divisId: this.$route.params.id,
          startTime: this.$route.params.startTime,
          endTime: this.$route.params.endTime
          //   gradeId: "23d422d6bfa4ae4983184b15041b9d7f",
          //   startTime: "2019-04-24",
          //   endTime: "2019-04-26"
        });
        this.dataList = data.data;
     
        this.$vux.loading.hide();
      } catch (err) {
        console.log(err);

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
.flex-demo {
  text-align: left;
  border-bottom: 1px solid #dcdcdc;
  border-right: 1px solid #dcdcdc;
  background-clip: padding-box;
  padding: 8px 15px;
  .className{
      color: #1a1a1a;
    font-size: 15px;
  }
  .count{
          color: #7f7f7f;
    font-size: 14px;

  }
  .info{
    color:#7CBC51;
    font-size: 13px;
  }
}
</style>
