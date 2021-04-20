<template>
  <v-header/>
  <v-tab/>
  <router-view/>
</template>

<script lang="ts">
import { defineComponent, provide } from 'vue'
import { VHeader, VTab } from '@/components'
import images from '@/assets/images'

export default defineComponent({
  name: 'App',
  components: {
    VHeader,
    VTab
  },
  setup () {
    provide('images', images)
  }
})
</script>
