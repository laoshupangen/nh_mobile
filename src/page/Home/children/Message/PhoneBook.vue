<template>
  <div class="wrap">
    <index-list @choose="navigateToChat" :data="phoneBook" />
  </div>
</template>

<script>
import IndexList from '@/components/IndexList'
import { getPhoneBook, getChatSession } from '@/service'
import { mapGetters, mapMutations } from 'vuex'
import _ from 'lodash'
export default {
  data() {
    return {
      phoneBook: []
    }
  },
  components: {
    IndexList
  },
  methods: {
    ...mapMutations(['UPDATE_LIST']),
    navigateToChat(item) {
      let haveThisEl = _.find(this.chatList.friends, n => n.otherInfo.id === item.id)
      if (haveThisEl) {
        this.$router.push({
          name: 'SendMessage',
          query: { sessionId: haveThisEl.sessionId }
        })
      } else {
        getChatSession({ url: this.messageUrl, fromId: this.userInfo.UserId, to: item.id }).then(res => {
          let sessionId = res.data.data
          this.UPDATE_LIST({
            type: 'add',
            data: {
              data: {
                sessionId,
                chatType: 2,
                isChildren: item.isChildren,
                from: {
                  id: this.userInfo.UserId,
                  nickname: this.userInfo.UserName,
                  headicon: this.userInfo.avatar
                },
                to: {
                  id: item.id,
                  nickname: item.name,
                  headicon: item.avatar
                },
                otherInfo: {
                  id: item.id,
                  nickname: item.name,
                  headicon: item.avatar
                }
              }
            }
          })
          this.$router.push({
            name: 'SendMessage',
            query: { sessionId }
          })
        })
      }

    },
    filterPhoneData(data) {
      let map = {
        'Parents': '家长',
        'Childs': '学生',
        'Teachers': '老师'
      }
      return _.map(data, (item, i) => {
        return {
          title: map[i],
          items: _.map(item, (n) => {
            return {
              id: n.id,
              name: `${n.name}`,
              avatar: `${this.GLOBAL.API_HOST}${n.headPic}`,
              isChildren: i === 'Childs'
            }
          })
        }
      })
    },
    getConcact() {
      getPhoneBook().then(data => {
        let phoneBook = this.filterPhoneData(data.data)
        console.log(phoneBook)
        this.phoneBook = phoneBook
      })
    }
  },
  computed: {
    ...mapGetters([
      'userInfo',
      'chatList',
      'messageUrl'
    ])
  },
  mounted() {
    this.getConcact()
  }
}
</script>

<style scoped>
.wrap {
  position: fixed;
  top: 46px;
  bottom: 0;
  width: 100%;
}
</style>
