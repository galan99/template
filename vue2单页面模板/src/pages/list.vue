<template>
  <div class="list-page">
    这是其他页面
    <button @click="router">返回首页</button>
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
      this.$router.push('/index')
    }
  }
}
</script>

<style lang="less" scoped>

</style>
