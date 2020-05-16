<template>
  <li class="weui-uploader__file uploader-component">
      <div class="delect-button" @click="removeFile">x</div>
      <img :src="`${GLOBAL.API_HOST}${info.response.url}`" />
      <div v-if="showNames" class="file-name">{{info.name}}</div>
  </li>
</template>

<script>
export default {
  props: {
    info: {
      type: Object,
    },
    showNames:{
      type:Boolean
    }
  },
  mounted() {
    console.log(this)
  },
  methods: {
    removeFile() {
      this.$emit('removeFile', this.info)
    }
  },
  computed: {
  }
}
</script>
<style lang="less" scoped>
.uploader-component {
  height: auto;
  position: relative;
  width: 50px;
  .delect-button {
    position: absolute;
    right: 0px;
    top: -5px;
    font-size: 18px;
  }
  img {
    width: 50px;
    height: 50px;
    border-radius: 50%;
  }
  .file-name {
    width: 100%;
    font-size: 15px;
    text-overflow: ellipsis;
    overflow: hidden;
  }
}
</style>
