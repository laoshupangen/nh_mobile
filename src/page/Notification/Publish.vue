<template>
  <div>
    <group>
      <x-input v-model="model.Title.value" placeholder="请输入标题"></x-input>
      <x-textarea v-model="model.Detail.value" :max="200" name="description" placeholder="请输入内容"></x-textarea>
      <popup-radio title="选择班级" :options="classList" v-model="model.F_Class.value" />
      <popup-radio title="通知类型" :options="type" v-model="model.F_Type.value" />
      <uploader :upload-url="`${GLOBAL.API_HOST}/File/FileUpload`" v-model="model.Banner.value" title="封面" :max="1" />
    </group>
    <x-button style="margin-top: 15px; width: 90%;" :show-lodaing="loading" @click.native="submit">发布</x-button>
  </div>
</template>

<script>
import { XTextarea, XInput, Group, PopupRadio, XButton } from 'vux'
import Uploader from '@/components/Uploader/Uploader'
import { mapGetters } from 'vuex'
import _ from 'lodash'
import { validator } from '@/utils'
import { postNoti } from '@/service'
export default {
  data() {
    return {
      loading: false,
      type: [
        {
          value: '学校通知',
          key: '1'
        },
        {
          value: '班级通知',
          key: '2'
        },
        {
          value: '紧急通知',
          key: '3'
        }
      ],
      model: {
        Title: {
          value: '',
          rules: [{
            type: 'string',
            required: true,
            message: '请填写班级'
          }]
        },
        F_Type: {
          value: '2',
          rules: [{
            type: 'string',
            required: true,
            message: '请选择通知类型'
          }]
        },
        Banner: {
          value: [],
          rules: [{
            type: 'array',
            required: true,
            message: '请选择通知封面'
          }],
          transform: (value) => {
            return value.map((item, i) => {
              return item.response.url
            }).join(',')
          }
        },
        Detail: {
          value: '',
          rules: [{
            type: 'string',
            required: true,
            message: '请填写通知内容'
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
    XButton
  },
  methods: {
    async submit() {
      try {
        let fields = await validator(this.model)
        let data = await postNoti(fields)
        this.$vux.toast.show({
          text: '发布成功',
          type: 'success'
        })
        this.$router.push({
          name: 'Notification'
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