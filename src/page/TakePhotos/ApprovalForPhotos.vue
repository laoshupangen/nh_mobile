<template>
  <div class="photoList">
    <!-- <div class="select" @click="toggleList">
      <div ref="box">{{status === 1?'已审批':'待审批'}}</div>

    </div> -->
    <tab>
      <tab-item
        :selected="index === i"
        v-for="(item,index) in tabItems"
        @on-item-click="toggleList"
        :key="index"
      >{{item}}</tab-item>
    </tab>
    <div class="search">
      <input type="search" placeholder="请输入姓名" v-model="keyword">
      <button @click="search">搜索</button>
    </div>

    <mescroll-vue id="mescroll" class="mescroll-scroll" @init="initCallBack" :up="up" :down="down">
      <ul v-if="photoList.length !== 0" class="noti-list">
        <li
          :key="i"
          v-for="(item, i) in photoList"
          class="clearfix"
          @click="()=>$router.push({name:'PhotoDetail',params:{id:item.id}})"
        >
          <div class="v_card_title">
            <span class="title">申请人:{{item.applierName}}</span>
            <span style="flex:1;color:#666;font-size:13px;text-align:right;">{{ item.createdTime}}</span>
          </div>

          <div>
            审核状态：
            <span v-if="item.approvalStatus === '0'" style="color:red;">待审批</span>
            <span v-else>已审批</span>
          </div>
        </li>
      </ul>
      <no-data :visible="photoList.length === 0"></no-data>
    </mescroll-vue>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import _ from "lodash";
import { Search, CellBox, FormPreview, Group ,Tab, TabItem } from "vux";
import MescrollVue from "mescroll.js/mescroll.vue";
import NoData from "@/components/NoData.vue";
import { getPhotosList } from "@/service";

export default {
  data() {
    return {
      i:0,
      meScroll: {},
      photoList: [],
      status: 0,
      keyword: "",
      up: {
        use: true,
        auto: true,
        isBounce: false,
        callback: this.upCallBack,
        page: {
          num: 0,
          size: 15
        }
      },
      down: {
        use: true,
        callback: this.downCallBack
      }
    };
  },
  components: {
    Search,
    CellBox,
    FormPreview,
    Group,
    NoData,
    MescrollVue,
    Tab, TabItem 
  },
  mounted() {
    //  this.up.page.num = 0;
  },
  computed: {
    ...mapGetters(["userInfo"]),
    tabItems: () => {
      return ["待审批","已审批" ];
    }
  },
  methods: {
    initCallBack(mescroll) {
      this.meScroll = mescroll;
    },
    async downCallBack() {
      this.photoList = [];
      this.meScroll.resetUpScroll();
    },
    async upCallBack(page, mescroll) {
      try {
        let data = await this.getList(page.num, page.size);
        this.photoList = _.concat(this.photoList, data.rows);
        this.meScroll.endSuccess(15, data.rows.length === 15);
      } catch (err) {
        console.log(err);
      }
    },
    search() {
      this.downCallBack({num:1,size:15},this.meScroll)
    },
    async getList(pageNum, pageSize) {
      try {
        let data = await getPhotosList({
          rows: pageSize,
          page: pageNum,
          CurrentUserId: this.userInfo.UserId, //宿管/老师id
          SearchPattern: this.status,
          Keyword: this.keyword
        });
        return data.data;
      } catch (err) {}
    },
    toggleList(index) {
      this.status = index;
      this.photoList = [];
      this.meScroll.resetUpScroll();
    }
  }
};
</script>
<style lang="less" scoped>
.photoList {
  background: #f0f0f0;
  position: relative;
  
  .search {
    // position: fixed;
    // top: 0;
    // left: 0;
    height: 50px;
    width: 100%;
    display: flex;
    padding: 10px 0;
    background: #fff;
    z-index: 10;

    justify-content: center;
    & input[type="search"] {
      width: 70%;
      padding-left: 5px;
      height: 30px;
      line-height: 30px;
      background: #eeeeee;
      border: 1px solid #ccc;
      border-radius: 5px;
    }
    & button {
      background: none;
      padding-left: 20px;
      border: none;
      height: 100%;
      line-height: 30px;
    }
  }
  .mescroll {
    position: fixed;
    top: 96px;
    bottom: 0;
    height: auto;
  }

  .noti-list {
    border-top: 1px solid #dcdcdc;
    width: 100%;
    li {
      color: #333;
      background: #fff;
      position: relative;
      width: 100%;
      padding: 15px 10px;
      border-bottom: 1px solid #dcdcdc;
      // margin-bottom: 1px;
    }
    div {
      padding: 1px;
      font-size: 13px;
      color: #666;
    }
    .v_card_title {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .title {
      flex: 1;
      font-size: 16px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      color: #1a1a1a;
    }
  }
  .content-pos {
    position: absolute;
    right: 20px;
    top: 80px;
    bottom: 0;
    text-align: center;
    vertical-align: middle;
    height: 100%;
    padding: 10px 20px 0px 20px;
    img {
      width: 0.4375rem;
      height: 0.625rem;
    }
  }
}
</style>

