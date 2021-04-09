<template>
  <v-header/>
  <div id="nav">
    <router-link to="/">Home</router-link>
    |
    <router-link to="/about">About</router-link>
  </div>
  <router-view/>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { VHeader } from '@/components'

export default defineComponent({
  name: 'App',
  components: {
    VHeader
  }
})
</script>
