<template>
  <div>
    <group>
      <x-input v-model="model.F_Title.value" placeholder="请输入标题"></x-input>
      <x-textarea v-model="model.F_Content.value" :max="200" name="description" placeholder="请输入内容"></x-textarea>
      <popup-radio title="选择班级" :options="classList" v-model="model.F_Class.value" />
      <popup-radio title="风采类型" :options="type" v-model="model.F_PresenceType.value" />
      <x-switch v-model="model.F_IsDisPlay.value" title="是否首页显示"></x-switch>
      <uploader :upload-url="`${GLOBAL.API_HOST}/File/FileUpload`" v-model="model.F_Cover.value" title="风采封面" :max="1" />
      <popup-radio title="文件格式" :options="pattern" v-model="model.F_Pattern.value" />
      <uploader :upload-url="`${GLOBAL.API_HOST}/File/FileUpload`" v-model="model.F_Files.value" title="风采文件" :max="1" />
    </group>
    <x-button style="margin-top: 15px; width: 90%;" :show-lodaing="loading" @click.native="submit">发布</x-button>
  </div>
</template>

<script>
import { XTextarea, XInput, Group, PopupRadio, XButton, XSwitch, Radio } from 'vux'
import Uploader from '@/components/Uploader/Uploader'
import { mapGetters } from 'vuex'
import _ from 'lodash'
import { validator } from '@/utils'
import { postPresence } from '@/service'
export default {
  data() {
    return {
      loading: false,
      type: [
        {
          value: '师生风采',
          key: '1'
        },
        {
          value: '班级荣誉',
          key: '2'
        },
        {
          value: '班级风采',
          key: '3'
        },
        {
          value: '作品展示',
          key: '4'
        }, {
          value: '学校风采',
          key: '5'
        }
      ],
      pattern: [
        {
          value: '视频',
          key: '1'
        },
        {
          value: '图片',
          key: '2'
        }
      ],
      model: {
       F_Pattern: {
         value: '2',
         rules: [{
          type: 'string',
          required: true,
          message: '请填写文件格式'
         }]
       },
       F_Title: {
          value: '',
          rules: [{
            type: 'string',
            required: true,
            message: '请填写班级'
          }]
        },
        F_PresenceType: {
          value: '2',
          rules: [{
            type: 'string',
            required: true,
            message: '请选择风采类型'
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
            message: '请选择风采封面'
          }],
          transform: (value) => {
            return value.map((item, i) => {
              return item.response.url
            }).join(',')
          }
        },
        F_Files: {
          value: [],
          rules: [{
            type: 'array',
            required: true,
            message: '请选择风采文件'
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
            message: '请填写风采内容'
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
    XSwitch,
    Radio
  },
  methods: {
    async submit() {
      try {
        let fields = await validator(this.model)
        let data = await postPresence(fields)
        this.$vux.toast.show({
          text: '发布成功',
          type: 'success'
        })
        this.$router.push({
          name: 'Presence'
        })
      } catch(err) {
	    console.log(err)
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