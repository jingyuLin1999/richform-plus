<template>
  <div class="widget-slider" :id="widgetId">
    <ElSlider v-model="value" :disabled="field.disabled" :show-tooltip="field.showTooltip" :min="field.minimum"
      :max="field.maximum" :step="field.step" :height="field.height" :vertical="field.vertical"
      :show-stops="field.showStop" :show-input="field.showInput" :input-size="field.inputSize"
      :show-input-controls="field.showInputControls" :range="field.showRange" :marks="field.marks"></ElSlider>
  </div>
</template>

<script lang="ts">
import baseMixin from "./baseMixin";
import { ElSlider } from "element-plus";
export default {
  mixins: [baseMixin],
  components: { ElSlider },
  methods: {
    defaultFieldAttr() {
      return {
        disabled: false,
        showTooltip: true,
        step: 1, // 步长
        minimum: 1, // 最小值
        maximum: 10, // 最大值
        showStop: false, // 显示间断点
        showInput: false, // 是否显示输入框，仅在非范围选择时有效
        inputSize: "default", // "default", "small", "large"
        showInputControls: false, // 在显示输入框的情况下，是否显示输入框的控制按钮
        showRange: false, // 是否为范围选择,此时value必须为 [2,58]
        vertical: false,
        marks: {},
        height: "200px", // vertical 为true时，必须设置高度
      };
    },
  },
};
</script>

<style lang="scss">
.widget-slider {
  width: 100%;
  padding: 0 8px;

  >.select-widget {
    width: 100%;
  }
}
</style>