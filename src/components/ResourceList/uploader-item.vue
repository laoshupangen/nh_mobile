<template>
  <li class="weui-uploader__file">
      <font-awesome-icon size="lg" icon="file" />
      <div class="file-name">{{ info.F_Name }}</div>
      <x-button v-if="showDelete" @click.native="removeFile(info.F_Id)" :mini="true" type="default">删除</x-button>
  </li>
</template>

<script>
import { XButton } from 'vux'
export default {
  props: {
    info: {
      type: Object,
    },
  	showDelete: {
  	  type: Boolean
  	}
  },
  components: {
    XButton
  },
  methods: {
    removeFile(id) {
      this.$emit('removeFile', id)
    }
  },
  computed: {
  }
}
</script>
<style lang="less" scoped>
.weui-uploader__file {
  text-align: center;
  height: auto;
  img {
    width: 100%;
  }
  .file-name {
    width: 100%;
    text-align: center;
    font-size: 14px;
    margin-top: 5px;
  }
}
</style>
