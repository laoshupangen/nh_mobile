<template>
  <div style="height: 100%;" class="content-view" ref="contentView">

    <div ref="chatArea" id="chat-scroll-area" class="chat-area" @click="triggerEmoji('doc')">
      <div
        class="get-history-list"
        v-if="!messageList.getHistory"
        @click="getHistList"
      >获取历史消息</div>

      <div
        class="message-item"
        :key="i"
        :class="{ clearfix: true, me: item.from === userInfo.UserId, you: item.from !== userInfo.UserId, message: true }"
        v-for="(item, i) in messageList.msgList"
      >

        <!-- http://photo.l99.com/bigger/f69/1450144005770_thgd1i.jpg -->
        <!-- `${GLOBAL.API_HOST}${item.from === userInfo.UserId ? avatar : messageList.otherInfo.headicon}` -->
        <img class="avatar" :src="`${GLOBAL.API_HOST}${item.from === userInfo.UserId ? avatar : messageList.otherInfo.headicon}`" />
        <div class="content">

          <h4 v-if="item.from !== userInfo.UserId" class="nickname">
            {{
              item.from === userInfo.UserId ? userInfo.UserName : (messageList.otherInfo.nickname || messageList.otherInfo.id)
            }}
          </h4>

          <div
            :class="{
              bubble: true, primary: item.from === userInfo.UserId,
              default: item.from !== userInfo.UserId }"
          >
            <div class="bubble-cont">

              <div v-if="item.msgType === 0" class="plain">{{ item.content }} content </div>

              <div v-if="item.msgType === 1" class="picture">
                <img :src="`${item.isBase64 ? item.content : (API_HOST + item.content)}`" />
              </div>

              <div v-if="item.msgType === 2" class="video">
                <video
                  controls
                  preload='auto'
                  type="video/mp4"
                  :src="`${item.isLocal ? item.content : (API_HOST + item.content)}`"
                />
              </div>


              <div @click="playAudio(item)" v-if="item.msgType === 4" class="audio">
                <font-awesome-icon  icon="microphone-alt" />
                <span class="duration">{{ getVoiceLength(item.extras) }}''</span>
              </div>


              <div v-if="item.msgType === 8" class="map">
                <l-map :zoom="13" :center="getLocationObj(item.content)">
                  <l-tile-layer url="http://{s}.tile.osm.org/{z}/{x}/{y}.png" />
                  <l-marker :lat-lng="getLocationObj(item.content)" />
                </l-map>
              </div>

            </div>
          </div>
          <div class="post-date">{{ formatTime(item.createTime) }}</div>
        </div>
      </div>
    </div>

    <div class="chat-send" ref="sed">
  	  <!-- <div class="functions" style="display: none;"></div> -->
      <div class="chat">

        <div v-if="false" @click="toggleChatMode" class="chat-toggle">
          <font-awesome-icon v-if="chatMode === 'voice'"  icon="keyboard" />
          <font-awesome-icon v-if="chatMode === 'text'"  icon="microphone-alt" />
        </div>

        <!-- 输入消息开始 -->
        <div v-if="chatMode === 'text'" class="chat-input clearfix">
          <input @click.native="scrollToBottom" placeholder="请输入消息" v-focus="message" v-model="message" type="text" />
        </div>
        <!-- 输入消息结束 -->

        <!-- 表情开始 -->
        <div class="func-li-btn">
          <font-awesome-icon @click.stop.prevent="triggerEmoji('icon')" icon="smile" class="fa-2x" />
        </div>
        <!-- 表情结束 -->

        <!-- + 更多开始 -->
        <div class="msg-more-btn-click" v-show="!btnShow" @click.stop.prevent="moreShow">
          <font-awesome-icon icon="plus-circle" class="fa-2x" />
        </div>
        <!-- + 更多结束 -->

        <!-- testBtn -->
        <div @click="testData">
        </div>
        <!-- 发送按钮开始 -->
        <div v-if="chatMode === 'text'" class="send-btn" v-show="btnShow">
          <x-button @click.native="sendMessage" type="default">发送</x-button>
        </div>
        <!-- 发送按钮结束 -->

        <!-- 语音发送开始 -->
        <!-- <div
          @touchstart="voiceStart"
          @touchmove="voiceMove"
          @touchend="voiceEnd"
          v-show="chatMode === 'voice'"
          id="voice-btn"
          class="push-to-talk">
          {{ voiceChat.voiceBtnText }}
        </div> -->
        <!-- 语音发送结束 -->

      </div>
      <input @change="fileUpload" id="inputFile" name="inputFile" type="file" style="display: none;">
      <audio ref="audioPlayer" :src="voiceSrc" />

      <!-- 表情库开始 -->
      <!-- emojiShow -->
      <div class="emoji-content-btn" v-show="emojiShow" ref="emojiContent">
        <div class="emoji-tabs-btn">
          <div class="emoji-container-btn">
            <div class="emoji-block-btn" :style="{width: Math.ceil(emoji.people.length / 5) * 48+ 'px'}">
              <span @click.stop="setEmoji(item)" v-for="(item, index) in emoji.people" :key="index">{{item}}</span>
            </div>
            <div class="emoji-block-btn" :style="{width: Math.ceil(emoji.nature.length / 5) * 48 + 'px'}">
              <span @click.stop="setEmoji(item)" v-for="(item, index) in emoji.nature" :key="index">{{item}}</span>
            </div>
            <div class="emoji-block-btn" :style="{width: Math.ceil(emoji.items.length / 5) * 48 + 'px'}">
              <span @click.stop="setEmoji(item)" v-for="(item, index) in emoji.items" :key="index">{{item}}</span>
            </div>
            <div class="emoji-block-btn" :style="{width: Math.ceil(emoji.place.length / 5) * 48 + 'px'}">
              <span @click.stop="setEmoji(item)" v-for="(item, index) in emoji.place" :key="index">{{item}}</span>
            </div>
            <div class="emoji-block" :style="{width: Math.ceil(emoji.single.length / 5) * 48 + 'px'}">
              <span @click.stop="setEmoji(item)" v-for="(item, index) in emoji.single" :key="index">{{item}}</span>
            </div>
          </div>
        </div>
      </div>
      <!-- 表情库结束 -->

      <!-- 更多内容开始 -->
      <div class="msg-more-wrapper" ref="msgMore" v-show="moreOptions">

        <!-- 选择照片开始 -->
        <div class="more" >
          <img @click="triggerUpload('image')"  src="../../../../assets/icon/xiangce@2x.png" alt="" class="more-img" style="width: 34px;height: 28px;"/>
          <p class="text-wrapper" style="text-align: center;">
            <span class="text">相册</span>
          </p>
          <!-- <font-awesome-icon @click="triggerUpload('image')" icon="image" /> -->
        </div>
        <!-- 选择照片结束 -->

        <!-- 拍摄开始 -->
        <div class="more" >
          <img @click="triggerUpload('video')" src="../../../../assets/icon/shipinliaotian@2x.png" alt="" class="more-img" style="width: 35px;height: 30px;" />
          <p class="text-wrapper" style="text-align: center;">
            <span class="text">拍摄</span>
          </p>
          <!-- <font-awesome-icon @click="triggerUpload('video')" icon="video" /> -->
        </div>
        <!-- 拍摄结束 -->

       <!-- 位置开始 -->
       <div class="more">
          <img  @click="getLocation" src="../../../../assets/icon/weizhi@2x.png" alt="" class="more-img" style="width: 26px;height: 32px;" />
          <p class="text-wrapper" style="text-align: center;">
            <span class="text">位置</span>
          </p>
           <!-- <font-awesome-icon v-if="locationLoading === false" @click="getLocation" icon="map-marker-alt" />
          <font-awesome-icon v-if="locationLoading === true" icon="spinner" /> -->
        </div>
        <!-- 位置结束 -->

      </div>
      <!-- 更多内容结束 -->

    </div>
  </div>
</template>

<script>
import { getHistMsg, sendMsg, readMsg } from '@/service'
import { mapGetters, mapMutations, mapActions } from 'vuex'
import { XButton, Icon, InlineLoading } from 'vux'
import { API_HOST, emoji } from '@/config'
import axios from 'axios'
import uuidv4 from 'uuid/v4'
import _ from 'lodash'
import moment from 'moment'
import { LMap, LTileLayer, LMarker } from 'vue2-leaflet'
import MediaStreamRecorder from '@/utils/mediaRecorder.js'
import noty from '@/utils/noty.js'
export default {
  data() {
    return {
      API_HOST,
      message: '',
      listData: {},
      loading: false,
      emoji,
      chatMode: 'text',
      emojiShow: false,
      locationLoading: false,
      voiceChat: {
        posStart: 0,
        posEnd: 0,
        posMove: 0,
        voiceBtnText: '按住说话',
        startTime: null,
        endTime: null
      },
      mediaRecorder: null,
      microphone: null,
      voiceSrc: null,
      moreOptions: false

    }
  },
  computed: {
    ...mapGetters([
      'avatar',
      'name',
      'userInfo',
      'chatList',
      'socket',
      'socketStatus'
    ]),
    messageList () {
      let { query } = this.$route
      let messageList
      if (query.sessionId) {
        messageList = _.find(this.chatList.friends, ele => ele.sessionId === query.sessionId)
      }
      return messageList
    },
    btnShow(){
      return this.message ? 1 : 0
    }
  },
  components: {
    XButton,
    Icon,
    InlineLoading,
    LMap,
    LTileLayer,
    LMarker,
  },
  mounted() {
    this.acceptName = this.$route.query.name
    let { query } = this.$route
    if (query.sessionId) {
      this.RESET_UNREAD({ type: 2, sessionId: query.sessionId })
    }
    this.$nextTick(() => {
      this.scrollToBottom()
    })
  },
  methods: {
    testData(){
      console.log(  )
    },
    moreShow(){
      this.moreOptions = !this.moreOptions;
      if( this.emojiShow ){
        this.emojiShow = !this.emojiShow;
      }
    },
    ...mapMutations([
      'SET_BROWSERHEADERTITLE',
      'UPDATE_LIST',
      'RESET_UNREAD'
    ]),
    ...mapActions([
      'SEND_MESSAGE',
      'GET_HISTORY'
    ]),
    playAudio(item) {
      let audioPlayer = this.$refs.audioPlayer
      if (item.isLocal) {
        this.voiceSrc = item.content
      } else {
        this.voiceSrc = `${API_HOST}${item.content}`
      }
      let audio = new Audio(this.voiceSrc)
      audio.play()

    },
    getVoiceLength(sec) {
      return sec.voiceLength ? Math.ceil((sec.voiceLength/1000).toFixed(2)) : '未知'
    },
    async voiceStart(event) {
      try {
        this.voiceCompatibility()
        event.preventDefault()//阻止浏览器默认行为
        this.voiceChat.posStart = 0
        this.voiceChat.startTime = 0
        this.voiceChat.posStart = event.touches[0].pageY//获取起点坐标
        this.voiceChat.startTime = moment()
        this.voiceChat.voiceBtnText = '松开 结束'
        let stream = await navigator.mediaDevices.getUserMedia({ audio: true })
        this.mediaRecorder = new MediaStreamRecorder(stream)
        this.mediaRecorder.stream = stream
        this.mediaRecorder.mimeType = 'audio/wav'
        this.mediaRecorder.start()
      } catch(err) {
        noty('info', '设备或环境不支持语音录制')
      }
    },
    voiceMove(event) {
      event.preventDefault()//阻止浏览器默认行为
      this.voiceChat.posMove = 0
      this.voiceChat.posMove = event.targetTouches[0].pageY//获取滑动实时坐标
      if(this.voiceChat.posStart - this.voiceChat.posMove < 100) {
        this.voiceChat.voiceBtnText = '松开 结束'
      } else {
        this.voiceChat.voiceBtnText = '松开手指，取消发送'
      }
      /*console.log(posStart+'---------')
      console.log(posMove+'+++++++++');*/
    },
    // voiceEnd(event) {
    //   event.preventDefault()
    //   this.voiceChat.posEnd = 0
    //   this.voiceChat.endTime = 0
    //   this.voiceChat.posEnd = event.changedTouches[0].pageY//获取终点坐标
    //   this.voiceChat.endTime = moment()
    //   this.voiceChat.voiceBtnText = '按住 说话'
    //   this.mediaRecorder.stop(() => {
    //     this.mediaRecorder.stream.stop()
    //     if(this.voiceChat.posStart - this.voiceChat.posEnd < 200 ){
    //       this.mediaRecorder.getBlob((res) => {
    //         let blob  = new File([res], this.getFileName('wav'), {
    //           type: 'audio/wav'
    //         })
    //         this.fileUpload({
    //           target: {
    //             files: [blob]
    //           }
    //         })
    //       })
    //     } else {
    //       console.log('取消发送')
    //       console.log('Cancel')
    //     }
    //   })
    // },
    // voiceCompatibility() {
    //   const promisifiedOldGUM = (constraints) => {
    //     const getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia
    //     // Some browsers just don't implement it - return a rejected promise with an error
    //     // to keep a consistent interface
    //     if (!getUserMedia) {
    //       MediaRecorderClass.checkAndExecFn(this.props.errorCallback)
    //       return Promise.reject(
    //         new Error('getUserMedia is not implemented in this browser')
    //       )
    //     }
    //     // Otherwise, wrap the call to the old navigator.getUserMedia with a Promise
    //     return new Promise(function (resolve, reject) {
    //       getUserMedia.call(navigator, constraints, resolve, reject)
    //     })
    //   }
    //
    //   // Older browsers might not implement mediaDevices at all, so we set an empty object first
    //   if (navigator.mediaDevices === undefined) {
    //     navigator.mediaDevices = {}
    //   }
    //   // Some browsers partially implement mediaDevices. We can't just assign an object
    //   // with getUserMedia as it would overwrite existing properties.
    //   // Here, we will just add the getUserMedia property if it's missing.
    //   if (navigator.mediaDevices.getUserMedia === undefined) {
    //     navigator.mediaDevices.getUserMedia = promisifiedOldGUM;
    //   }
    // },
    getFileName(fileExtension) {
      var d = new Date()
      var year = d.getUTCFullYear()
      var month = d.getUTCMonth()
      var date = d.getUTCDate()
      return `RecordRTC-${d}-${year}-${month}-${date}.${fileExtension}`
    },
    toggleChatMode() {
      this.chatMode = this.chatMode === 'text' ? 'voice' : 'text'
    },
    getLocation() {
      let { query } = this.$route
      this.locationLoading = true
      let options = {
        enableHighAccuracy: true,
        maximumAge: 1000
      }
      if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition((position) => {
          this.locationLoading = false
          let latitude = position.coords.latitude
          let longitude = position.coords.longitude
          this.SEND_MESSAGE({ mode: 'both', type: 8, from: this.userInfo.UserId, to: this.messageList.otherInfo.id, content: `${latitude},${longitude}`, sessionId: query.sessionId })
        }, (err) => {
          this.locationLoading = false
          console.log(err)
        }, options)
      }
    },
    getFileType(file) {
      let type
      if (file.type.indexOf('video') !== -1) {
        type = 'video'
      } else if(file.type.indexOf('image') !== -1) {
        type = 'image'
      } else if(file.type.indexOf('audio') !== -1) {
        type = 'audio'
      } else {
        type = 'file'
      }
      return type
    },
    fileUpload(e) {

      let file = e.target.files[0]
      let fileMap = {
        'image': 1,
        'video': 2,
        'file': 3,
        'audio': 4
      }
      if (!file) {
        return
      }
      let type = this.getFileType(file)
      let { query } = this.$route

      const formData = new FormData()

      formData.append('file', file)
      axios.post(`${API_HOST}/File/FileUpload`, formData).then(res => {
        if (type === 'audio') {
          this.SEND_MESSAGE({ mode: 'remote', type: fileMap[type], content: res.data.url, from: this.userInfo.UserId, to: this.messageList.otherInfo.id, sessionId: query.sessionId, extras: { voiceLength: this.voiceChat.endTime.diff(this.voiceChat.startTime)}})
        } else {
          this.SEND_MESSAGE({ mode: 'remote', type: fileMap[type], content: res.data.url, from: this.userInfo.UserId, to: this.messageList.otherInfo.id, sessionId: query.sessionId})
        }

      })
      if (type === 'image') {
        const fr = new FileReader()
        fr.onload = (e) => {
          this.SEND_MESSAGE({ mode: 'local', content: e.target.result, type: fileMap[type], from: this.userInfo.UserId, to: this.messageList.otherInfo.id, sessionId: query.sessionId, isBase64: true})
        }
        fr.readAsDataURL(file)
      } else if (type === 'video') {
        let url = URL.createObjectURL(file)
        this.SEND_MESSAGE({ mode: 'local', content: url, type: fileMap[type], from: this.userInfo.UserId, to: this.messageList.otherInfo.id, sessionId: query.sessionId, isLocal: true})
      } else if (type === 'audio') {
        let url = URL.createObjectURL(file)
        this.SEND_MESSAGE({ mode: 'local', content: url, type: fileMap[type], from: this.userInfo.UserId, to: this.messageList.otherInfo.id, sessionId: query.sessionId, isLocal: true, extras: { voiceLength: this.voiceChat.endTime.diff(this.voiceChat.startTime)}})
      }
      this.scrollToBottom()
    },
    getLocationObj(string) {
      let latitude = string.split(',')[0]
      let longitude = string.split(',')[1]
      return L.latLng(latitude, longitude)
    },
    triggerUpload(type) {

      let file = document.getElementById('inputFile')
      switch (type) {
        case 'image':
          console.log( "image" );
          file.setAttribute('accept', 'image/*')
          break;
        case 'video':
          console.log( "video" );
          file.setAttribute('accept', 'video/mp4')
          break;
      }
      file.click()
    },
    triggerEmoji( el ) {
      if( el === 'doc' && this.emojiShow ){
        this.emojiShow = !this.emojiShow;
      }
      if( el === 'doc' && this.moreOptions ){
        this.moreOptions = !this.moreOptions;
      }
      if( el === 'icon'){
        this.emojiShow = !this.emojiShow;

        if( !this.emojiShow && this.moreOptions ){
          this.moreOptions = !this.moreOptions;
        }
      }

    },
    listenerSize( refEl ){
      this.$nextTick( () => {
        // let diff = window.innerHeight - this.$refs.contentView.offsetHeight;
        let contentHeight = refEl.offsetHeight;
        let sendHeight = this.$refs.sed.offsetHeight;

        if( contentHeight > 0 ){
          let slateY = contentHeight + sendHeight;

          this.$refs.contentView.style.transition = `all 100ms`;
          this.$refs.sed.style.transition = `all 300ms`;

          this.$refs.contentView.style.paddingBottom = `${slateY}px`;
          this.$refs.sed.style.transform = `translate3d(0px,${-slateY}px,0px)`;

        }else if( contentHeight === 0 ){

          this.$refs.contentView.style.transition = `all 100ms`;
          this.$refs.sed.style.transition = `all 300ms`;

          this.$refs.contentView.style.paddingBottom = 0;
          this.$refs.sed.style.transform = `translate3d(0px,0px,0px)`;
        }
      } );
    },
    setEmoji(e) {
      this.message = this.message + e
    },
    formatTime(date) {
      return moment(date).fromNow() || ''
    },
    scrollToBottom() {
      this.$nextTick(() => {
        this.$refs.chatArea.scrollTop = this.$refs.chatArea.scrollHeight
      })
    },
    getHistList() {
      this.GET_HISTORY({ friendId: this.messageList.otherInfo.id,  userId:  this.userInfo.UserId})
    },
    sendMessage() {
      let { query } = this.$route;
      if ( this.message === '') {
        this.$vux.toast.show({
          text: '请输入消息内容',
          type: 'warn'
        })
        return
      }
      this.SEND_MESSAGE(
        {
          mode: 'both',
          type: 0,
          content: this.message,
          from: this.userInfo.UserId,
          to: this.messageList.otherInfo.id,
          sessionId: query.sessionId
        }
      )

      this.message = ''
      this.scrollToBottom()
      if( this.emojiShow ){
        this.emojiShow = !this.emojiShow;
      }
    },
    formatTime(date) {
      return moment(date).calendar()
    }
  },
  directives: {
    focus: {
      update(el, binding ){
        if( binding.value ){
          el.focus();
        }
      }
    }
  },
  watch: {
    emojiShow( newBl, oldBl ){
      if( newBl || !newBl ){
        const refEl = this.$refs.emojiContent;
        this.listenerSize( refEl );
      }
    },
    moreOptions( newBl, oldBl ){
      if( newBl || !newBl ){
        const refEl = this.$refs.msgMore;
        this.listenerSize( refEl );
      }
    }
  }
}
</script>

<style lang="less" scoped>
.content-view {
  background-color: #eee;
  .chat-area {
    position: relative;
    background-color: #f5f5f5;
    height: calc(~'100% - 10px');
    overflow: auto;
    padding-top: 10px;
    padding-right: 5px;
    margin-bottom: 70px;
    .get-history-list {
      text-align: center;
      padding: 0 10px 20px;
      color: #bbbbbb;
    }
  }
  .message {
    margin-bottom: 16px;
    float: left;
    width: 100%;
    &.me {
      float: right;
      text-align: right;
      clear: right;
      .post-date {
        margin-right: 10px;
      }
      .avatar {
        float: right;
        margin-right: 10px;
      }
      .duration {
        left: -60px;
      }
    }
    &.you {
      .icon-fail {
        left: 100%;
      }
      .avatar {
        margin-left: 10px;
      }
      .post-date {
        margin-left: 10px;
      }
    }
    .avatar {
      width: 40px;
      height: 40px;
      float: left;
      border-radius: 50%;
      cursor: pointer;
    }
    .content {
      overflow: hidden;
      .nickname {
        font-weight: 400;
        padding-left: 10px;
        font-size: 12px;
        height: 22px;
        line-height: 24px;
        color: #4f4f4f;
        width: 350px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        word-wrap: normal;
      }
      .post-date {
        color: #bbbbbb;
        margin-top: 3px;
      }
      .bubble {
        max-width: 500px;
        min-height: 1em;
        display: inline-block;
        vertical-align: top;
        position: relative;
        text-align: left;
        font-size: 14px;
        border-radius: 3px;
        margin: 0 10px;
        &:after {
          position: absolute;
          top: 14px;
          border: 6px solid transparent;
          content: " ";
          border-right-color: #fff;
          border-right-width: 4px;
          right: 100%;
        }
        &.default {
          background: #ffffff;
        }
        &.primary {
          background: #6EB5E2;
          color: #Ffffff;
          &:after {
            left: 100%;
            border-left-color: #6EB5E2;
            border-left-width: 4px;
            border-right-width: 0
          }
        }
        .bubble-cont {
          word-wrap: break-word;
          word-break: break-all;
          min-height: 25px;
          .plain {
            padding: 9px 13px;
            .icon-fail {
              position: absolute;
              right: 100%;
              top: 50%;
              margin-top: -11px;
              margin-right: 9px;
              cursor: pointer;
            }
            pre {
              display: block;
              margin: 0;
              font-family: inherit;
              font-size: inherit;
              white-space: pre-wrap;
              word-break: normal;
            }
          }
          .picture {
            border-radius: 4px;
            -moz-border-radius: 4px;
            -webkit-border-radius: 4px;
            overflow: hidden;
            position: relative;
            img {
              display: block;
              cursor: pointer;
              max-width: 350px;
              max-height: 240px;
            }
          }
          .map {
            height: 4rem;
            width: 5rem;
          }
          .video {
            video {
              width: 5rem;
            }
          }
          .audio {
            padding: 7px 13px;
            width: 115px;
            max-width: 250px;
            cursor: pointer;
            position: relative;
            .duration {
              position: absolute;
              text-align: right;
              right: -40px;
              width: 55px;
              color: #888;
              cursor: default;
            }
            &:after {
              display: block;
              content: "";
              clear: both;
            }
            svg {
              float: right;
              font-size: 23px;
            }
          }
        }
      }
    }
  }
  .chat-send {
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0;
    padding: 7.5px;
    background: #fff;
    height: 50px;
    z-index: 99999;
    .chat {
      //height: 50px;
      position: relative;
      &:after {
	      content: ".";
        clear: both;
        display: block;
        overflow: hidden;
        font-size: 0;
        height: 0;
	    }
      // height: 50px;
      .chat-toggle {
        float: left;
        height: 40px;
        width: 40px;
        margin-right: 5px;
        line-height: 42px;
        text-align: center;
        border-radius: 50%;
        border: 1px solid #A2A2A2;
        svg {
          font-size: 19px;
          color: #828187;
        }
      }
      .chat-input {
        float: left;
        width: 6.5rem;

       input {
          height: 32px;
          width: 6.5rem;
          border-radius: 25px;
          box-sizing: border-box;
          border: 1px solid #D2D2D2;
          padding-left: 15px;
        }
      }
      .func-li-btn{
        // width: 40px;
        padding: 0 6px;
        display: inline-block;
        color: #828187;
        text-align: center;
        padding-top: 3px;
        float: left;
      }
      .msg-more-btn-click{
        //padding: 0 10px 0 0;
        display: inline-block;
        color: #828187;
        text-align: center;
        padding-top: 3px;
        margin-left: 10px;
      }

      .send-btn {
        float: left;
        button {
         height: 32px;
         line-height: 32px;
         width: 1.9rem;
         font-size: .4rem;
         background: #7DBB4E;
         color: #ffffff;
        }
      }
      .push-to-talk {
        float: left;
        width: 6.5rem;
        height: 40px;
        line-height: 40px;
        text-align: center;
        border: 1px solid #ACACAC;
        border-radius: 5px;
        z-index: 99999;
      }
    }
    .emoji-content-btn{
      position: absolute;
      top: 60px;
      left: 0;
      width: 10rem;
      height: 200px;
      border-top: 1px solid #f3f3f3;
      overflow: hidden;
      background-color: #fff;
      z-index: 99999;
      .emoji-tabs-btn {
          overflow: auto;
          .emoji-container-btn {
            width: 10000px;
            padding-bottom: 5px;
            .emoji-block-btn {
              width: 1170px;
              height: 200px;
              float: left;
              span {
                display: inline-block;
                cursor: pointer;
                font-size: 26px;
                min-width: 48px;
                line-height: 39px;
                text-align: center;
                list-style: none;
              }
            }
          }
        }
    }
    .msg-more-wrapper {
      position: absolute;
      top: 60px;
      left: 0;
      background: #fff;
      width: 100%;
      height: 80px;
      .more{
        width: 33.33%;
        float: left;
        text-align: center;
        height: 80px;
        .more-img{
          display: inline-block;
          margin-top: 20px;
        }
        .text-wrapper{
          text-align: center;
          margin-top: 5px;
          .text{
            font-size: 14px;
            color: #999;
          }
        }
      }
    }

  }
}
</style>
