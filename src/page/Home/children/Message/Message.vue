 <template>
  <div id="message-box">
    <div class="instance-message">
      <div class="message-content" v-if="socketStatus.status !== 'error'">

        <p style="text-align: center;padding: 10px;" v-if="socketStatus.status === 'connecting'">
          <inline-loading ></inline-loading>
          <span>连接中</span>
        </p>

        <p
          style="text-align: center;padding: 10px;"
          @click="reconnect" v-if="socketStatus.status === 'loginError'">
          <span>登录失败，点击重试</span>
        </p>

        <ul v-if="chatList.friends.length !== 0">
          <router-link :to="{ path: '/sendMessage', query: { sessionId: item.sessionId || '', chatWith: item.otherInfo.id }}" tag="li" :key="i" v-for="(item, i) in chatList.friends">
            <div>

              <div class="avatar" @click="test(item.unRead)">
                <img :src="`${GLOBAL.API_HOST}${item.otherInfo.headicon}`" alt="avatar" />
                <badge class="avatar-badge" :text="item.unRead" v-if="(item.unRead !== 0)" />
              </div>

              <div class="message-wrapper">

                <div class="name">
                  {{ item.otherInfo.nickname ? item.otherInfo.nickname : item.otherInfo.id }}
                </div>

                <div class="message">
                  {{ getLastMessage(item.msgList) }}
                </div>

              </div>

              <div class="message-timestamp">
                {{
                  formatTime(item.msgList.length ? (item.msgList[item.msgList.length - 1].createTime) : item.createTime)
                }}
              </div>

            </div>
          </router-link>
        </ul>

        <div style="text-align:center;padding: 10px;" v-else>没有消息</div>

      </div>

      <div style="text-align: center;padding: 10px;" @click="reOpen" v-else>出现错误,点击重新连接</div>

    </div>
  </div>
</template>

<script>
import MeScroll from 'mescroll.js'
import { Panel, Badge, InlineLoading } from 'vux'
import { getHistMsg } from '@/service'
import { mapGetters, mapMutations, mapActions } from 'vuex'

import { noty } from '@/utils'
import _ from 'lodash'
import moment from 'moment'

export default {
  data() {
    return {
      listData: [],
      statusCode: {
        'pending': '待机中',
        'connecting': '连接中...',
        'connected': '连接成功'
      }
    }
  },
  components: {
    Panel,
    Badge,
    InlineLoading
  },
  computed: {
    ...mapGetters([
      'userInfo',
      'chatList',
      'socketStatus',
      'socket'
    ])
  },
  methods: {
    test( item ){
      console.log( "item", item )
      console.log( "chatList", this.chatList.friends[0].unRead)
    },
    ...mapMutations([
      'SET_ICONFUNCTION',
      'UPDATE_SOCKETSTATUS',
    ]),
    ...mapActions([
      'INIT_CHATLIST'
    ]),
    reconnect() {
      this.UPDATE_SOCKETSTATUS( 'connecting' );
      this.socket.open( true );
    },
    reOpen() {
      this.INIT_CHATLIST();
    },
    toggleShow(key) {
      this[key] = !this[key]
    },
    getLastMessage(messageList) {
      if (!messageList.length) {
        return ''
      }
      let lastMessage = messageList[messageList.length - 1]
      let msgType = lastMessage.msgType
      switch (msgType) {
        case 0:
          return lastMessage.content
          break
        case 1:
          return '[图片]'
          break
        case 2:
          return '[视频]'
          break
        case 4:
          return '[语音]'
          break
        case 8:
          return '[位置]'
          break
      }
    },
    formatTime(date) {
      return moment(date).fromNow() || ''
    }
  },
  mounted() {
    this.SET_ICONFUNCTION(() => {
      this.$router.push({
        name: 'PhoneBook'
      })
    })
  },
}
</script>

<style lang="less" scoped>
#message-box {
  .instance-message {
    .title {
      height: 40px;
      width: 100%;
      line-height: 40px;
      text-align: center;
      background: #e6e6e6;
      color: #AFAFAF;
      border-bottom: 1px solid #B8B8B8;
    }
    .message-content {
      li {
        padding: 10px;
        border-top: 1px solid #CCCCCC;
        & > div {
          display: flex;
          flex-direction: row;
          .avatar {
            flex: 1;
            align-self: center;
            position: relative;
            .avatar-badge {
              position: absolute;
              top: -10px;
              right: -5px;
            }
            img {
              width: 50px;
              height: 50px;
              border-radius: 50%;
              vertical-align: middle;
            }
          }
          .message-wrapper {
            flex: 5;
            display: flex;
            flex-direction: column;
            align-self: center;
            padding-left: 10px;
            & > div {
              height: 20px;
              line-height: 20px;
              &.name {
                font-size: .48rem;
              }
              &.message {
                color: #999999;
                text-overflow: ellipsis;
                overflow: hidden;
              }
            }
          }
          .message-timestamp {
            flex: 1.5;
            align-self: center;
            color: #999999;
            text-align: right;
          }
        }
        &:last-child {
          border-bottom: 1px solid #CCCCCC;
        }
      }
    }
  }
}
</style>
