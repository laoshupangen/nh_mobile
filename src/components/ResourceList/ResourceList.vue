<template>
  <div class="weui-cell">
    <div class="weui-cell__bd">
      <div class="weui-uploader">
        <div v-show="showHeader" class="weui-uploader__hd">
          <p class="weui-uploader__title"> {{ title || '' }} </p>

        </div>
        <div class="weui-uploader__bd" :class="{small: size === 'small'}">
          <ul class="weui-uploader__files">
            <uploader-item :show-delete="showDelete" @removeFile="removeFile" v-for="image in fileList" :info="image" :key="image.F_Id"></uploader-item>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import UploaderItem from './uploader-item.vue'
export default {
  props: {
    fileList: {
      type: Array,
      required: true
    },
    title: {
      type: String
    },
	showDelete: {
	  type: Boolean
	}
  },
  components: {
    UploaderItem
  },
  mounted() {
    console.log(this.showDelete)
  },
  methods: {
    removeFile(id) {
      this.$emit('removeFile', id)
    }
  }
}
</script>

<style lang="less" scoped>
@import '~vux/src/styles/weui/widget/weui-uploader/index.less';
.remove:before {
  width: 0;
  height: 0;
}
.weui-uploader__input-box {
  .file-uploads {
    width: 100%;
    height: 100%;
  }
}
.weui-uploader__bd.small {
  .weui-uploader__input-box {
    margin-right: 5px;
    margin-bottom: 5px;
    width: 58px;
    height: 58px;
  }
  .weui-uploader__file {
    width: 60px;
    height: 60px;
    margin-right: 5px;
    margin-bottom: 5px;
  }
}
</style>