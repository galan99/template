<template>
  <div class="index-page">
    这是首页
    <div class="icon"></div>
    <button @click="router">其他页面</button>
  </div>
</template>

<script>
export default {
  data () {
    return {

    }
  },
  methods: {
    router () {
      this.$router.push('/list')
    }
  }
}
</script>

<style lang="less">
.icon{
  width:1.67rem;
  height:.57rem;
  background: url('@{url}hyheng/button.png') no-repeat;
  background-size: 100% auto;
}
</style>
