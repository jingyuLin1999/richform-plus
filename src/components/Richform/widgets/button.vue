<template>
  <div class="button-widget" :id="widgetId">
    <!-- 单按钮 -->
    <ElButton v-if="!field.isGroup" :type="field.type ? field.type : 'default'" :style="field.style" :size="field.size"
      :loading="field.loading" :round="field.round" :plain="field.plain" :circle="field.circle" :icon="field.leftIcon"
      :disabled="field.disabled" @click="emitAction(field)">
      {{ schema.title || field.title }}
      <i :class="field.rightIcon"></i>
    </ElButton>
    <!-- 按钮组 -->
    <ElButtonGroup v-if="field.isGroup">
      <ElButton v-for="(button, index) in field.options" :key="button.name || index" :type="button.type"
        :icon="button.leftIcon" :loading="button.loading" :size="button.size" :style="button.style" :plain="button.plain"
        :round="button.round" :circle="button.circle" :disabled="button.disabled" @click="emitAction(button)">
        {{ button.title }}
        <i :class="button.rightIcon"></i>
      </ElButton>
    </ElButtonGroup>
  </div>
</template>

<script lang="ts">
import baseMixin from "./baseMixin"; // 混入必须引入，一些公共逻辑放在该处
import { ElButton, ElButtonGroup } from "element-plus";
export default {
  mixins: [baseMixin],
  components: { ElButton, ElButtonGroup },
  methods: {
    // 该组件的默认属性，下面字段可自行定义，且可根据this.field获取数据
    defaultFieldAttr() {
      return {
        type: "default", // primary / success / warning / danger / info / text
        disabled: false,
        loading: false,
        style: {},
        isGroup: false,
        size: "default",
        round: false,
        plain: false,
        circle: false,
        leftIcon: "",
        rightIcon: "",
        options: [], // 按钮组，当isGroup为true有效
      };
    },
    emitAction(button) {
      this.$emit("buttonEvent", button);
    },
  },
};
</script>

<style lang="scss">
.input-widget {
  width: 100%;

  textarea {
    margin: 2px 0 !important;
  }
}
</style>