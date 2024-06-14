<template>
  <v-header />
  <v-tab />
  <router-view v-slot="{ Component }" :style="viewStyle">
    <keep-alive>
      <component :is="Component" />
    </keep-alive>
  </router-view>
  <router-view v-slot="{ Component }" :style="viewStyle" name="user">
    <transition appear name="slide">
      <keep-alive>
        <component :is="Component" />
      </keep-alive>
    </transition>
  </router-view>
  <player />
</template>

<script>
import { computed, defineComponent, provide } from 'vue';
import { useStore } from 'vuex';
import { Player, VHeader, VTab } from '@/components';
import images from '@/assets/images';

export default defineComponent({
  name: 'App',
  components: {
    VHeader,
    VTab,
    Player,
  },
  setup() {
    const store = useStore();
    provide('images', images);

    const playList = computed(() => store.state.playList);
    const viewStyle = computed(() => {
      const bottom = playList.value.length ? '60px' : '0';
      return {
        bottom,
      };
    });

    return {
      viewStyle,
    };
  },
});
</script>
