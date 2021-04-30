<template>
  <v-header/>
  <v-tab/>
  <router-view/>
  <player/>
</template>

<script lang="ts">
import { defineComponent, provide } from 'vue'
import { Player, VHeader, VTab } from '@/components'
import images from '@/assets/images'

export default defineComponent({
  name: 'App',
  components: {
    VHeader,
    VTab,
    Player
  },
  setup () {
    provide('images', images)
  }
})
</script>
