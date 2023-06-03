
<template>
  <div class="timepicker-widget" :id="widgetId">
    <ElTimePicker class="el-time" v-if="field.isPicker" v-model="value" :readonly="field.readOnly"
      :placeholder="field.placeholder" :disabled="field.disabled" :clearable="field.clearable" :size="field.size"
      :editable="field.editable" :value-format="field.valueFormat" :is-range="field.isRange"
      :arrow-control="field.arrowControl" :range-separator="field.rangeSeparator"
      :start-placeholder="field.startPlaceholder" :end-placeholder="field.endPlaceholder"
      :disabled-hours="field.disabledHours" :disabled-minutes="field.disabledMinutes"
      :disabled-seconds="field.disabledSeconds"></ElTimePicker>
    <ElTimeSelect class="el-time" v-else v-model="value" :picker-options="field.pickerOptions" :readonly="field.readOnly"
      :placeholder="field.placeholder" :disabled="field.disabled" :clearable="field.clearable"
      :value-format="field.valueFormat" :size="field.size"></ElTimeSelect>
  </div>
</template>


<script lang="ts">
import baseMixin from "./baseMixin";
import { ElTimeSelect, ElTimePicker } from "element-plus";
export default {
  mixins: [baseMixin],
  components: { ElTimeSelect, ElTimePicker },
  methods: {
    defaultFieldAttr() {
      return {
        isPicker: true, // 是否为 timepicker 时间任意。timeselect固定时间，由pickerOptions设定
        readOnly: false, // 只看
        disabled: false, // 禁用
        clearable: true, // 是否显示清除按钮
        size: "default", // "default", "small", "large"
        editable: false, // 文本框可输入
        placeholder: "请选择", // 单个
        valueFormat: "HH:mm:ss",
        isRange: false, // isRange下面三个有效
        arrowControl: false,
        rangeSeparator: "至", // 选择范围时的分隔符
        startPlaceholder: "开始时间",
        endPlaceholder: "结束时间",
        disabledHours: null,
        disabledMinutes: null,
        disabledSeconds: null,
        pickerOptions: {
          // timeselect 有效
          start: "08:30",
          step: "00:15",
          end: "18:30",
        },
      };
    },
  },
};
</script>

<style lang="scss">
.timepicker-widget {
  width: 100%;

  >.el-time {
    width: 100%;
  }
}
</style>