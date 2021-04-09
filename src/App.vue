<template>
  <v-header/>
  <v-tab/>
  <router-view/>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { VHeader, VTab } from '@/components'

export default defineComponent({
  name: 'App',
  components: {
    VHeader,
    VTab
  }
})
</script>
