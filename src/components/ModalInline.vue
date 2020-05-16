<template>
  <div class="noOutWarn" :class="type">
    <div class="loading" v-if="loading">
      <inline-loading ></inline-loading>
    </div>

    <div style="padding-right:10px" v-if="!loading">
      <icon :type="type" :class="type==='warn'?'warnIconColor':''"></icon>
    </div>

    <div style="text-align:left" v-if="!loading">
      <p style="font-size:.4rem;">{{title}}</p>
      <p style="padding:5px 0;color:#999">{{text}}</p>
    </div>
  </div>
</template>
<script>
import { Icon, InlineLoading } from "vux";
export default {
  data() {
    return {};
  },
  props: {
    // ['warn','info','cancel']
    type: {
      type: String,
      default: "warn",
      required: false
    },
    title: String,
    text: String,
    position: {
      type: String,
      default: "top",
      required: false
    },
    loading: {
      type: Boolean,
      default: false,
      required: false
    }
  },
  components: {
    Icon,
    InlineLoading
  }
};
</script>
<style scoped>
.noOutWarn {
  display: flex;
  /* justify-content: center; */
  padding: 10px;
  text-align: center;
  color: #333;
  border-radius: 5px;
  margin: 10px 0;
  /* box-shadow: 0 1px 8px rgba(0, 0, 0, 0.32); */
}
.loading{
  flex: 1;
  
}
.info {
  border: 1px solid #91d5ff;
  background: #e6f7ff;
}
.warn {
  background-color: #fffbe6;
  border: 1px solid #ffe58f;
}

.warnIconColor {
  color: #ffc212;
}

.cancel {
  background-color: #fff1f0;
  border: 1px solid #ffa39e;
}
</style>