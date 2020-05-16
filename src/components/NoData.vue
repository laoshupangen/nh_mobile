<template>
  <div v-if="visible" class="noDataState">
    <p class="chartSpan">没有数据</p>
  </div>
</template>

<script>
export default {
  props: {
  	visible: {
  	  default: false,
      type: Boolean
  	}
  }
}
</script>

<style scoped>
.noDataState {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url("./../assets/nodata.svg") no-repeat center center;
}
.chartSpan {
  position: absolute;
  font-size: 24px;
  color: #b5b5b6;
  font-weight: 100;
  letter-spacing: 4px;
  text-align: center;
  display: block;
  width: 100%;
  padding-left: 10px;
  left: 0;
  top: 66%;
}
</style>