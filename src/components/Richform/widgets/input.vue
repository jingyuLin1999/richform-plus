<template>
  <!-- 自定义组件 id 和 class 必须有，请原样保留 -->
  <ElInput :id="widgetId" :class="[
    'input-widget',
    'el-form-item',
    fieldErrors[field.name] ? 'is-error' : '',
  ]" v-model="value" :type="field.type" :placeholder="field.placeholder" :disabled="field.disabled"
    :clearable="field.clearable" :show-password="field.showPassword" :prefix-icon="ElementPlusIconsVue[field.prefixIcon]"
    :suffix-icon="field.suffixIcon" :rows="field.rows" :autosize="field.autosize" :size="field.size"
    :maxlength="field.maxLength" :minlength="field.minLength">
    <template v-if="field.append.length > 0" #append>
      {{ field.append }}
    </template>
    <template v-if="field.prepend.length > 0" #prepend>
      {{ field.prepend }}
    </template>
  </ElInput>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import baseMixin from "./baseMixin"; // 混入必须引入，一些公共逻辑放在该处
import { ElInput } from "element-plus";
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

export default defineComponent({
  mixins: [baseMixin],
  components: { ElInput },
  data() {
    return {
      ElementPlusIconsVue
    }
  },
  methods: {
    // 该组件的默认属性，下面字段可自行定义，且可根据this.field获取数据
    defaultFieldAttr() {
      return {
        type: "text", // text，textarea
        placeholder: "请输入内容",
        disabled: false, // 禁用状态
        clearable: true, // 可清空
        showPassword: false, // 密码框
        prefixIcon: "", // 当type等于text有效。前置图标 el-icon-search
        suffixIcon: "", // 当type等于text有效。后置图标 el-icon-date
        rows: 4, // 当type等于textarea有效
        autosize: false, // 当type等于textarea有效。根据内容自动设置高度，也可接受一个对象 { minRows: 2, maxRows: 4}
        prepend: "", // 当type等于text有效。
        append: "", // 当type等于text有效。
        size: "default", // 'large'| 'default'| 'small',
        maxLength: null,
        minLength: null,
        options: [], // {label: "",value: ""}
      };
    },
    friendValue() {
      let value = this.values[this.field.name];
      if (!value) value = null;
      else if (typeof value != "string" && value) value = value.toString();
      return value;
    },
    beforeChange(val) {
      if (this.schema.type == "number") {
        return val.indexOf(".") == val.length - 1
          ? val
          : val.indexOf("-") == 0 && val.length == 1
            ? val
            : parseFloat(val);
      } else if (val.length == 0 && this.field.forceType == "null") return null;
      return val;
    },
  },
});
</script>

<style lang="scss">
.input-widget {
  width: 100%;

  textarea {
    margin: 2px 0 !important;
  }
}
</style>