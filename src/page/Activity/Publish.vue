<template>
  <div>
    <group>
      <x-input v-model="model.F_Title.value" placeholder="请输入标题"></x-input>
      <x-textarea v-model="model.F_Content.value" :max="200" name="description" placeholder="请输入内容"></x-textarea>
      <popup-radio title="选择班级" :options="classList" v-model="model.F_Class.value" />
      <popup-radio title="活动类型" :options="type" v-model="model.F_EventType.value" />
      <x-switch v-model="model.F_IsDisPlay.value" title="是否首页显示"></x-switch>
      <uploader :upload-url="`${GLOBAL.API_HOST}/File/FileUpload`" v-model="model.F_Cover.value" title="活动简图" :maxFile="1" />
      <uploader :upload-url="`${GLOBAL.API_HOST}/File/FileUpload`" v-model="model.F_Imgs.value" title="活动图集" :maxFile="6" />
    </group>
    <x-button :show-lodaing="loading" @click.native="submit">发布</x-button>
  </div>
</template>

<script>
import { XTextarea, XInput, Group, PopupRadio, XButton, XSwitch } from 'vux'
import Uploader from '@/components/Uploader/Uploader'
import { mapGetters } from 'vuex'
import _ from 'lodash'
import { validator } from '@/utils'
import { postActivity } from '@/service'
export default {
  data() {
    return {
      loading: false,
      type: [
        {
          value: '校园活动',
          key: '1'
        },
        {
          value: '班级活动',
          key: '2'
        }
      ],
      model: {
       F_Title: {
          value: '',
          rules: [{
            type: 'string',
            required: true,
            message: '请填写标题'
          }]
        },
        F_EventType: {
          value: '1',
          rules: [{
            type: 'string',
            required: true,
            message: '请选择活动类型'
          }]
        },
        F_IsDisPlay: {
          value: false,
          rules: [{
            type: 'boolean',
          }]
        },
        F_Cover: {
          value: [],
          rules: [{
            type: 'array',
            required: true,
            message: '请选择活动封面'
          }],
          transform: (value) => {
            return value.map((item, i) => {
              return item.response.url
            }).join(',')
          }
        },
        F_Imgs: {
          value: [],
          rules: [{
            type: 'array',
            required: true,
            message: '请选择活动图集'
          }],
          transform: (value) => {
            return value.map((item, i) => {
              return item.response.url
            }).join(',')
          }
        },
        F_Content: {
          value: '',
          rules: [{
            type: 'string',
            required: true,
            message: '请填写活动内容'
          }]
        },
        F_Class: {
          value: '',
          rules: [{
            type: 'string',
            required: true,
            message: '请选择班级'
          }]
        }
      }
    }
  },
  components: {
    XTextarea,
    Group,
    XInput,
    Uploader,
    PopupRadio,
    XButton,
    XSwitch
  },
  methods: {
    async submit() {
      try {
        let fields = await validator(this.model)
        let data = await postActivity(fields)
        this.$vux.toast.show({
          text: '发布成功',
          type: 'success'
        })
        this.$router.push({
          name: 'Activity'
        })
      } catch(err) {
        if (err.code === 'FIELDS_ERROR') {
          this.$vux.toast.show({
            text: err.message,
            type: 'warn'
          })
        }
      } 
    }
  },
  computed: {
    ...mapGetters([
      'children'
    ]),
    classList() {
      return _.map(this.children, (item, i) => {
        return { 
          value: item.className, 
          key: item.id
        }
      })
    }
  }
}
</script>

<style>

</style>