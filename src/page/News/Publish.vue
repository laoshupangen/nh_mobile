<template>
  <div>
    <group>
      <x-input v-model="model.F_Title.value" placeholder="请输入标题"></x-input>
      <x-textarea v-model="model.F_Content.value" :max="200" name="description" placeholder="请输入内容"></x-textarea>
      <popup-radio title="选择班级" :options="classList" v-model="model.F_Class.value" />
      <popup-radio title="新闻类型" :options="type" v-model="model.F_NewsType.value" />
      <x-switch v-model="model.F_IsDisPlay.value" title="是否首页显示"></x-switch>
      <uploader :upload-url="`${GLOBAL.API_HOST}/File/FileUpload`" v-model="model.F_Cover.value" title="封面" :max="1" />
    </group>
    <x-button style="margin-top: 15px; width: 90%;" :show-lodaing="loading" @click.native="submit">发布</x-button>
  </div>
</template>

<script>
import { XTextarea, XInput, Group, PopupRadio, XButton, XSwitch } from 'vux'
import Uploader from '@/components/Uploader/Uploader'
import { mapGetters } from 'vuex'
import _ from 'lodash'
import { validator } from '@/utils'
import { postNews } from '@/service'
export default {
  data() {
    return {
      loading: false,
      type: [
        {
          value: '学校新闻',
          key: '1'
        },
        {
          value: '班级新闻',
          key: '2'
        }
      ],
      model: {
       F_Title: {
          value: '',
          rules: [{
            type: 'string',
            required: true,
            message: '请填写班级'
          }]
        },
        F_NewsType: {
          value: '2',
          rules: [{
            type: 'string',
            required: true,
            message: '请选择新闻类型'
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
            message: '请选择新闻封面'
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
            message: '请填写新闻内容'
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
        let data = await postNews(fields)
        this.$vux.toast.show({
          text: '发布成功',
          type: 'success'
        })
        this.$router.push({
          name: 'News'
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