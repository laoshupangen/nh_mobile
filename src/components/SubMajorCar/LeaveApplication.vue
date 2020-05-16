<template>
  <div>
    <div class="list">
      <p>
        <span>待审核的请假单</span>
        <router-link to tag="span">更多</router-link>
      </p>
      <ul>
        <li>
          <p>
            <span>朱风启提交的请假</span>
            <span>2019-05-10</span>
          </p>
          <ul>
            <li>开始时间:2019-05-10</li>
            <li>结束时间:2019-05-11</li>
            <li>请假类型:事假</li>
            <li>
              <span>审批人:卢玉华</span>
              <span>审核中</span>
            </li>
          </ul>
        </li>
        <li>
          <p>
            <span>朱风启提交的请假</span>
            <span>2019-05-10</span>
          </p>
          <ul>
            <li>开始时间:2019-05-10</li>
            <li>结束时间:2019-05-11</li>
            <li>请假类型:事假</li>
            <li>
              <span>审批人:卢玉华</span>
              <span>审核中</span>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
export default {};
</script>
<style lang="less" scoped>
.list {
  margin-top: 20px;
  & > p {
    display: flex;
    justify-content: space-between;
    padding: 0 20px 10px;
    color: #000;
    border-bottom: 1px solid #aaa;
  }
  & > ul {
    & > li {
      border-bottom: 1px solid #aaa;
      p {
        display: flex;
        justify-content: space-between;
        padding: 0;
        margin: 0;
        padding: 0 20px;
        margin-top: 10px;
        color: #000;
      }
      ul {
        color: #666;
        margin-bottom: 10px;
        li {
          display: flex;
          justify-content: space-between;
          padding: 0 20px;
          span:nth-of-type(2) {
            display: inline-block;
            width: 60px;
            line-height: 20px;
            text-align: center;
            border-radius: 5px;
            background-color: #e2b35c;
          }
        }
      }
    }
  }
}
</style>