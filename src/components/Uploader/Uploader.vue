<template>
  <div class="weui-cell">
    <div class="weui-cell__bd">
      <div class="weui-uploader">
        <div v-show="showHeader" class="weui-uploader__hd">
          <p class="weui-uploader__title">{{ title }}</p>
          <div v-show="showHeader" class="weui-uploader__info">{{ value.length }} / {{ maxFile }}</div>
        </div>

        <div class="weui-uploader__bd" :class="{small: size === 'small'}">
          <ul class="weui-uploader__files">
            <uploader-item
              @removeFile="remove"
              v-for="image in value"
              :info="image"
              :key="image.url"
              :showNames="showNames"
            ></uploader-item>
          </ul>

          <div v-show="!readonly && value.length < maxFile" class="weui-uploader__input-box">
            <file-upload
              ref="upload"
              @input-file="inputFile"
              :post-action="uploadUrl"
              v-model="fileLists"
              :accept="accept"
              :multiple="true"
              :extensions="extensions"
              :size="size"
              :maximum="maxFile"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import UploaderItem from "./uploader-item.vue";
import FileUpload from "vue-upload-component";
import ImageCompressor from "image-compressor.js";
import axios from "axios";
export default {
  data() {
    return {
      fileLists: this.value
    };
  },
  props: {
    uploadUrl: {
      type: String,
      required: true
    },
    showNames:{
      type:Boolean,
    },
    accept: {
      type: String,
      default: "image/*"
    },
    extensions: {
      type: String,
      default: "gif,jpg,jpeg,png,webp"
    },
    size: {
      type: Number,
      default: 1024 * 1024 * 2
    },
    value: {
      type: Array,
      required: true
    },
    readonly: {
      type: Boolean,
      default: false
    },
    maxFile: {
      type: Number,
      default: 1
    },
    showHeader: {
      type: Boolean,
      default: true
    },
    title: {
      type: String,
      default: "图片上传"
    },
    size: {
      type: String
    }
  },
  methods: {
    remove(info) {
      this.$refs.upload.remove(info);
    },  
    inputFile(newFile, oldFile) {
      if (newFile && !oldFile) {
        // Add file
      }

      if (newFile && oldFile) {
        // Update file

        // Start upload
        if (newFile.active !== oldFile.active) {
          console.log("Start upload", newFile.active, newFile);
          if (newFile.size >= 0 && newFile.size < this.size) {
            newFile = this.$refs.upload.update(newFile, { error: "size" });
          }
        }

        // Upload progress
        if (newFile.progress !== oldFile.progress) {
          console.log("progress", newFile.progress, newFile);
        }

        // Upload error
        if (newFile.error !== oldFile.error) {
          console.log("error", newFile.error, newFile);
        }

        // Uploaded successfully
        if (newFile.success !== oldFile.success) {
          console.log("success", newFile.success, newFile);
        }
      }
      if (!newFile && oldFile) {
        // Remove file
      }
      // Automatic upload
      if (
        Boolean(newFile) !== Boolean(oldFile) ||
        oldFile.error !== newFile.error
      ) {
        if (!this.$refs.upload.active) {
          this.$refs.upload.active = true;
        }
      }
       this.$emit("input", this.fileLists);
    }
  },
  components: {
    FileUpload,
    UploaderItem
  }
};
</script>
<style scoped lang="less">
@import "~vux/src/styles/weui/widget/weui-uploader/index.less";
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
