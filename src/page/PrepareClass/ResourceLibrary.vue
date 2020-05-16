<template>
  <div>
    <div>
      <search
        v-model="searchValue"
      ></search>
      <div class="close-layer" @click="closeLayer">
        X
      </div>
    </div>
    <mescroll-vue @init="initCallBack" :up="up" :down="down">
      <ul class="library-list">
        <li v-for="(item, i) in _dataList" :key="i">
          <div class="icon">
            <font-awesome-icon size="lg" prefix="far" icon="file-alt" />
          </div>
          <div class="file-info">
            <p class="name">{{ item.F_Name }}{{ `${item.F_Type ? `.${item.F_Type}` : '' }` }}</p>
            <p class="size">{{ item.F_File_Size }}</p>
          </div>
          <div class="add-resource">
            <x-button :disabled="item.has" @click.native="addFile(item)" :mini=true type="default">选择</x-button>
          </div>
        </li>
      </ul>
    </mescroll-vue>

  </div>
</template>

<script>
import { Search, XButton } from 'vux'
import { getResource } from '@/service'
import { mapGetters } from 'vuex'
import MescrollVue from 'mescroll.js/mescroll.vue'
export default {
  data() {
    return {
      searchValue: '',
      meScroll: {},
      dataList: [],
      up: {
        use: true,
        auto: true,
        isBounce: false,
        callback: this.upCallBack,
        page: {
          num: 0,
          size: 15,
        }
      },
      down: {
        use: false,
      },
    }
  },
  computed: {
    ...mapGetters([
      'prepareInfo'
    ]),
    _dataList() {
      return _.map(this.dataList, (item, i) => {
        let index = _.findIndex(this.prepareInfo.resourceList, (n) => {
          return n.F_Id === item.F_Id
        })
        console.log(index)
        return _.assign({}, item, {
          has: index !== -1
        })
      })
    }
  },
  components: {
    Search,
    XButton,
    MescrollVue
  },
  methods: {
    addFile(file) {
      this.$emit('addFile', file)
    },
    initCallBack(mescroll) {
      this.meScroll = mescroll
    },
    closeLayer() {
      this.$emit('closeLayer')
    },
    async upCallBack(page, mescroll) {
      try {
        let data = await this.getList(page.num, page.size)
        this.dataList = _.concat(this.dataList, data.rows)
        this.meScroll.endSuccess(15, data.rows.length === 15)
        // console.log(this._dataList)
      } catch(err) {
        console.log(err)
      }
    },
    async getList(pageNum, pageSize) {
      try {
        let data = await getResource({
          rows: pageSize,
          page: pageNum,
          F_Name: this.searchValue,
        })
        return data.data
      } catch(err) {

      }
    }
  }
}
</script>

<style lang="less" scoped>
.library-list {
  width: 100%;
  li {
    display: flex;
    flex-direction: row;
    width: 100%;
    border-bottom: 1px solid #DDDDDD;
    padding: 10px;
    & > div {
      &.icon {
        margin-right: 20px;
        svg {
          font-size: 35px;
        }
      }
      &.file-info {
        flex: 3
      }
      &.add-resource {
        flex: 1
      }
    }
  }
}
.close-layer {
  text-align: center;
  width: 35px;
  height: 35px;
  line-height: 35px;
  margin: auto;
  border-radius: 50%;
  border: 1px solid #bbbbbb;
  color: #bbbbbb;
  margin-top: 10px;
}
</style>
