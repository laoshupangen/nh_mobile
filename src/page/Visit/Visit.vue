<template>
  <div>
    <canvas id="myChart" ></canvas>
  </div>
</template>
<script>
// require("@antv/f2/lib/interaction/pan");
// require('@antv/f2/lib/interaction/');
const F2 = require('@antv/f2/lib/index');
require('@antv/f2/lib/interaction/pan');
// console.log(F2)
export default {
  mounted() {
    const data = [
      { genre: "Sports", sold: 275 },
      { genre: "Strategy", sold: 115 },
      { genre: "Action", sold: 120 },
      { genre: "Shooter", sold: 350 },
      { genre: "Other", sold: 150 }
    ];

    // Step 1: 创建 Chart 对象
    const chart = new F2.Chart({
      id: "myChart",
      pixelRatio: window.devicePixelRatio ,// 指定分辨率
      
    });

    // Step 2: 载入数据源
    chart.source(data,{
       genre:{
           tickCount:2,
           values:['Sports','Strategy']
       } 
    });

    // Step 3：创建图形语法，绘制柱状图，由 genre 和 sold 两个属性决定图形位置，genre 映射至 x 轴，sold 映射至 y 轴
    chart
      .interval()
      .position("genre*sold")
      .color("genre");

    // Step 4: 渲染图表
    chart.render();
    console.log(chart)
    chart.interaction('pan')
  }
};
</script>
<style>
canvas {
  display: block;
  width: 100vw;
  height: 69.33333333vw;
}
</style>