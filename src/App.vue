<template>
  <div id="app" @touchmove.prevent>
    <!-- 头部 -->
    <m-header></m-header>
    <!-- 选项卡 -->
    <tab></tab>
    <!-- 显示内容区域 -->
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
    <!-- 播放器 -->
    <player></player>
  </div>
</template>

<script type="text/ecmascript-6">
  import MHeader from 'components/m-header/m-header'
  import Tab from 'components/tab/tab'
  import Player from 'components/player/player'

  export default {
    components: {
      MHeader,
      Tab,
      Player
    }
  }

</script>

<style scoped lang="stylus" rel="stylesheet/stylus">

</style>
