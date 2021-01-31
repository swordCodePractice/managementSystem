<template>
  <div>
    <template v-if="item.meta.single">
      <a-menu-item :key="menuIndex">
        <component :is="item.meta.icon" />
        <span>{{ item.meta.title }}</span>
      </a-menu-item>
    </template>
    <template v-else>
      <a-sub-menu :key="'sub' + menuIndex">
        <template #title>
          <span>
            <component :is="item.meta.icon" /><span>{{
              item.meta.title
            }}</span></span
          >
        </template>
        <a-menu-item
          v-for="(subChild, index) in item.children"
          :key="menuIndex + '-' + index"
        >
          <component :is="subChild.meta.icon" />
          <span>{{ subChild.meta.title }}</span>
        </a-menu-item>
      </a-sub-menu>
    </template>
  </div>
</template>
<script lang='ts'>
import { defineComponent } from "vue";
export default defineComponent({
  props: {
    item: {
      type: Object,
    },
    menuIndex: {
      type: Number,
    },
  }
});
</script>
<style scoped>
</style>