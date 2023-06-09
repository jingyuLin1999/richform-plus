<template>
  <div class="select-widget-wrapper" :id="widgetId">
    <ElSelect v-model="value" :class="[
      'select-widget',
      'el-form-item',
      fieldErrors[field.name] ? 'is-error' : '',
      widgetId,
    ]" :placeholder="field.placeholder" :disabled="field.disabled" :clearable="field.clearable"
      :multiple="field.multiple" :collapse-tags="field.collapseTags" :allow-create="field.allowCreate"
      :filterable="field.filterable" :size="field.size" @clear="clearOptions">
      <!-- 不分组 -->
      <div v-if="!field.isGroup">
        <template v-for="(option, index) in friendOptions">
          <ElOption v-if="isFilter(option)" :key="index" :label="option[field.defaultProp.label]"
            :value="option[field.defaultProp.value]" :disabled="option.disabled">
          </ElOption>
        </template>
      </div>
      <!-- 分组 -->
      <div v-else>
        <ElOptionGroup v-for="(group, index) in friendOptions" :key="index" :label="group.label">
          <template v-for="option in group.options">
            <ElOption v-if="isFilter(option)" :key="option[field.defaultProp.value]"
              :label="option[field.defaultProp.label]" :value="option[field.defaultProp.value]"></ElOption>
          </template>
        </ElOptionGroup>
      </div>
    </ElSelect>
  </div>
</template>

<script lang="ts">
import { type } from "ramda";
import baseMixin from "./baseMixin";
import { strToObj } from "../utils";
import { ElSelect, ElOption, ElOptionGroup } from "element-plus";

export default {
  mixins: [baseMixin],
  components: { ElSelect, ElOption, ElOptionGroup },
  computed: {
    // 有可能是直接给个数组字符串格式，需要转化一下
    friendOptions() {
      let { options, defaultProp } = this.field;
      if (typeof options[0] == "object") return options;
      let friendOptions = [];
      options.map((item) => {
        let option =
          typeof item == "string"
            ? {
              [defaultProp.value]: item,
              [defaultProp.label]: item,
            }
            : item;
        friendOptions.push(option);
      });
      return friendOptions;
    },
  },
  methods: {
    defaultFieldAttr() {
      return {
        isGroup: false, // 是否分组
        placeholder: "请选择",
        size: "default",
        disabled: false, // 说明：当该属性在字典中，则禁用对应的选项。若在field.disable则禁用整个选择器
        clearable: false, // 说明：可清空选项  注意：仅单选有效
        multiple: false, // 说明：是否支持多选
        collapseTags: false, // 多选用tags显示
        filterable: false, // 说明：搜索label
        allowCreate: false, // 说明：是否允许创建条目,谨慎使用  注意：filterable为true时有效
        defaultOption: -1, // 当字典从服务器加载后默认选中的选项下标
        forceType: null, // 重置数据类型
        join: "", // 说明： 当mutiple为true时，若设置了join,则会转换成字符串
        dictConfig: {
          // 字典配置
          method: "post",
          respProp: "",
          params: {}, // 一些固定的过滤参数
          pickValues: [], // 获取values的数据做请求参数
        },
        defaultProp: {
          label: "label",
          value: "value",
        },
        filter: { key: null, value: null }, // 过滤掉符合条件的
      };
    },
    // 清空的时候为"",后端要求最好是null,故强制转换一下
    clearOptions() {
      let friendType =
        this.field.forceType ||
        this.schema.type ||
        type(this.values[this.field.name]).toLowerCase();
      this.values[this.field.name] = this.friendDefaultValue(friendType);
    },
    // 过滤出符合条件的
    isFilter(option) {
      let { key, value } = this.field.filter;
      return !(key && value != null && option[key] == value);
    },
    friendValue() {
      let value = this.values[this.field.name];
      let { multiple, join } = this.field;
      // vaue是string且配有join，则需根据join打散
      if (
        multiple &&
        join.length > 0 &&
        typeof value == "string" &&
        value.length > 0
      ) { // 如： "1.36"
        value = value.split(join);
      } else if (multiple && typeof value == "string" && value.length > 0) { // 如： "[2]"
        value = strToObj(value); // 友好转换一下
        if (!Array.isArray(value)) value = [value]; 
      } else if (multiple && !Array.isArray(value)) {
        value = [];
      } else if (value == null) {
        value = "";
      }
      return value;
    },
    beforeChange(value) {
      let { multiple, join, forceType } = this.field;
      if (
        typeof value == "string" &&
        (forceType == "number" || this.schema.type == "number")
      ) {
        value = parseFloat(value);
      } else if (multiple && join.length > 0 && Array.isArray(value)) {
        value = value.join(join);
      } else if (
        Array.isArray(value) &&
        (forceType == "string" || this.schema.type == "string")
      ) {
        value = JSON.stringify(value);
      }
      return value;
    },
  },
};
</script>

<style lang="scss">
.select-widget-wrapper {
  width: 100%;
  height: 100%;

  >.select-widget {
    height: 100%;
    width: 100%;
  }
}
</style>