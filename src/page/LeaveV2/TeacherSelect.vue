<template>
  <div>
    <search @on-change="getResult" :results="results" @result-click="resultClick" top="0"></search>
    <div v-if="selTeachers.length>0" class="sellist">
      <div class="selTitle">
        <span>已选择项</span>
        <span class="btn" style="float:right" @click="submitClick">确认</span>
        <span class="btn" style="float:right" @click="cancelClick">取消</span>
      </div>
      <div class="selContent">
        <div v-for="(teacher,i) in selTeachers" class="selItem" :key="i">{{teacher.name}}</div>
      </div>
    </div>
    <mescroll-vue id="mescroll" class="mescroll-scroll" @init="initCallBack" :up="up" :down="down">
      <div class="selTitle" style="background:#fff;">
        <span>历史记录</span>
      </div>
      <div class="selContent">
        <div v-for="(item,i) in historyList" class="selItem" :key="i">
          <div class="selBtn" @click="cellClick(item,1)">
            <img style="float:left;" v-show="item.ischecked" src="@/assets/icon/xuanzhong.png" />
            {{item.name}}
          </div>
        </div>
      </div>

      <!-- <grid :cols="3" :show-lr-borders="false">
        <grid-item class="grid-item" v-for="(item,i) in historyList" :key="i">
          <div @click="cellClick(item)" class="grid-center">
            <img style="float:left;" v-show="item.ischecked" src="@/assets/icon/xuanzhong.png" />
            {{item.name}}
          </div>
        </grid-item>
      </grid>-->
      <div :key="i" v-for="(item, i) in dataList" :id="item.groupName">
        <h1 class="cell-title">{{item.groupName}}</h1>
        <ul v-if="dataList.length !== 0" class="noti-list">
          <li
            class="noti"
            v-for="(boxItem,i) in item.items"
            :key="i"
            :id="boxItem.id"
            @click="cellClick(boxItem,2)"
          >
            <span class="moreF" v-show="boxItem.ischecked">
              <img class="more" src="@/assets/icon/xuanzhong.png" />
            </span>
            <span>{{boxItem.name}}</span>
          </li>
        </ul>
      </div>
    </mescroll-vue>

    <div class="alphabet">
      <ul>
        <li v-for="(item,i) in dataList" :key="i" @click="jumper(item.groupName)">{{item.groupName}}</li>
      </ul>
    </div>

    <div class="showLetter" v-show="showLetter">
      <h1>{{letter}}</h1>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import $ from "jquery";
import { getTeacherPhoneBook, getTeacherHistory } from "@/service";
import MescrollVue from "mescroll.js/mescroll.vue";
import { Search, Grid, GridItem } from "vux";
import { mapMutations } from "vuex";

export default {
  data() {
    return {
      up: {
        use: false
      },
      down: {
        use: false
      },
      dataList: [],
      historyList: [],
      meScroll: {},
      letter: "",
      showLetter: false,

      results: [], //筛选的结果
      selTeachers: [] //选中的老师
    };
  },
  components: {
    MescrollVue,
    Search,
    Grid,
    GridItem
  },
  // computed: {
  //    ...mapGetters(['userInfo'])
  // },

  methods: {
    ...mapMutations(["SET_APPROVALUSER"]),
    initCallBack(mescroll) {
      this.meScroll = mescroll;
    },
    //字母索引锚点定位
    jumper(key) {
      this.letter = key;
      var _this = this;
      //点击侧边字母后屏幕中间的字母也显示,500毫秒隐藏
      if (this.showLetter == false) {
        this.showLetter = true;
        setTimeout(function() {
          _this.showLetter = false;
        }, 500);
      } else {
        this.showLetter = false;
      }

      var el = document.getElementById(key);

      if (el) {
        //减去搜索框的高度
        var scrollPosition = el.offsetTop - 44;
        $("#mescroll").animate(
          {
            scrollTop: scrollPosition
          },
          100
        );
      }
    },
    filterPhoneData(data) {
      let dataArray = data.data;
      for (var i = 0; i < dataArray.length; i++) {
        let dicArray = dataArray[i].items;
        for (var j = 0; j < dicArray.length; j++) {
          let dataDic = dicArray[j];
          this.$set(dataDic, "ischecked", false);
          this.$set(dataDic, "avatar", `${this.GLOBAL.API_HOST}${j.headPic}`);
        }
      }
      return data;
    },
    getConcact() {
      let userId = this.$route.params.userId
      getTeacherPhoneBook(userId).then(data => {
        let phoneBook = this.filterPhoneData(data.data);
        this.dataList = phoneBook.data;
      });
    },
    getResult(val) {
      const result = [];
      for (let i = 0; i < this.dataList.length; i++) {
        let data = this.dataList[i];
        for (let j = 0; j < data.items.length; j++) {
          let item = data.items[j];
          if (item.name.indexOf(val) > -1) {
            let newData = {};
            newData.title = item.name;
            newData.other = item.id;
            result.push(newData);
          }
        }
      }
      this.results = result;
    },
    resultClick(item) {
      var el = document.getElementById(item.other);
      if (el) {
        var scrollPosition = el.offsetTop;
        $("#mescroll").animate(
          {
            scrollTop: scrollPosition
          },
          100
        );
      }
    },
    //取消确定按钮
    cancelClick() {
      this.selTeachers = [];
      this.historyList = this.historyList.map(his => ({
        ...his,
        ischecked: false
      }));
      // console.log(this.historyList)
      this.SET_APPROVALUSER({ userids: [], names: "" });
      this.$router.go(-1);
    },
    submitClick() {
      var data = this.selTeachers;
      var ids = new Array();
      var names = "";
      for (var i = 0; i < data.length; i++) {
        ids[i] = data[i].id;
        names += data[i].name + ",";
      }
      this.SET_APPROVALUSER({ userids: ids, names: names });
      this.$router.go(-1);
    },
    cellClick(item,type) {
      item.ischecked = !item.ischecked;
      let hasItem =
        this.selTeachers.findIndex(t => t.id === item.id) > -1 ? true : false;
      if (item.ischecked) {
        if (!hasItem) {
          this.selTeachers.push(item);
        }
      } else {
        this.selTeachers = this.selTeachers.filter(t=>t.id!==item.id)
      }
      if(type === 2){
        this.historyList = this.historyList.map(h=>{
          if(h.id === item.id){
            h.ischecked = item.ischecked
            return h
          }
          return h
        })

      }
      if(type === 1){
        this.dataList = this.dataList.map(d=>{
          let items = d.items
          // let oitem  = items.find(i=>i.id === item.id)
          items = items.map(i=>{
            if(i.id === item.id){
              i.ischecked = item.ischecked
              return i
            }
            return i
          })
          d.items = items
          return d
        })
      }
     
      
    },
    getHistory() {
      getTeacherHistory().then(data => {
        this.historyList = data.data.data
          ? _.map(data.data.data, (item, i) => {
              return {
                id: item.id,
                name: item.name,
                ischecked: false
              };
            })
          : [];
      });
    }
  },
  mounted() {
    this.getConcact();
    this.getHistory();
  },

  watch: {
    $route(to, from) {
      if (to.path === "/TeacherSelect") {
        this.selTeachers = [];
        this.getConcact();
        this.getHistory();
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.sellist {
  position: relative;
  // top: 44px;

  background: #fff;
  height: auto;
}
.selTitle {
  padding: 5px 10px;
  font-size: 16px;
  border-bottom: 1px solid #e6e6e6;
}
.selContent {
  padding: 0 10px;
  // position: relative;
}
.selItem {
  padding: 5px;
  color: #2eb1fd;
  display: inline-block;
  font-size: 14px;
}
.btn {
  color: #2eb1fd;
  margin-left: 5px;
}
.selBtn {
  background: #f0f0f0;
  padding: 5px;
  border-radius: 5px;
  color: #666;
  // background: #2eb1fd;
}

.mescroll-scroll .grid-item {
  text-align: center;
  color: #333;
  .grid-center {
    background: #f0f0f0;
    padding: 5px 0;
    border-radius: 5px;
  }
}

.mescroll-scroll div .cell-title {
  padding: 3px 8px;
  font-size: 17px;
  background: rgb(226, 226, 228);
}

.mescroll-scroll .noti-list .noti {
  font-size: 15px;
  padding: 8px 8px;
  border-bottom: 1px solid rgb(226, 226, 228);
}

.alphabet ul {
  display: flex;
  flex-direction: column;
  position: fixed;
  right: 5px;
  top: 18%;
  background: #2eb1fd;
  border-radius: 10px;

  li {
    font-size: 12px;
    padding: 2px 5px;
  }
}

div .showLetter {
  display: flex;
  position: fixed;
  top: 42%;
  left: 37%;
  width: 120px;
  height: 100px;
  z-index: 99;
  font-size: 40px;
  background: rgb(226, 226, 228);
  justify-content: center;
  align-items: center;
}
</style>
