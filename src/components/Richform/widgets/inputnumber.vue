<template>
  <div class="inputnumber-widget" :id="widgetId">
    <ElInputNumber v-model="value" style="width: 100%" :disabled="field.disabled" :step="field.step" :min="field.min"
      :max="field.max" :size="field.size" :step-strictly="field.stepStrictly" :precision="field.precision"
      :controls-position="field.controlsPosition"></ElInputNumber>
  </div>
</template>

<script lang="ts">
import baseMixin from "./baseMixin";
import { ElInputNumber } from "element-plus";
export default {
  mixins: [baseMixin],
  mounted() {
    if (this.value == null) this.value = this.field.initValue;
  },
  components: { ElInputNumber },
  methods: {
    defaultFieldAttr() {
      return {
        disabled: false,
        step: 1, // 步数
        min: 0,
        max: 10000,
        initValue: 0, // 初始化默认值,当value为null时有效
        stepStrictly: false, // 严格步数,只能输入 step 的倍数
        precision: undefined, // 精度,设置计数器最小值
        controlsPosition: "", // 按钮位置。计数器增减按钮的位置, 默认"", 可设置为 "right"
        size: "default",
      };
    },
  },
};
</script>
<style lang="scss">
.inputnumber-widget {
  width: 100%;
}
</style>
