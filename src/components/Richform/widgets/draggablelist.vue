<template>
  <dl class="draggable-list-widget" :id="widgetId">
    <!-- https://github.com/SortableJS/vue.draggable.next/issues/82#issuecomment-1109941745 -->
    <draggable v-bind="dragOptions()" v-model="value"
      :item-key="typeof field.template == 'string' ? ((item) => value.indexOf(item)) : field.idKey" tag="div">
      <template #item="{ element, index }">
        <dd class="draggable-list-item">
          <ElIcon :class="[
            'draggable-list-icon',
            'list-handle-move',
          ]">
            <Operation />
          </ElIcon>
          <!-- 字符串 -->
          <template v-if="typeof element == 'string'">
            <ElInput v-if="field.strAttr.widget == 'input'" class="input-draggable" :size="field.size"
              v-model="value[index]" :placeholder="value[index]" />
            <Expression v-else-if="field.strAttr.widget == 'expression'" :form="form" :values="values"
              :field="{ name: field.name, index, ...field.strAttr }" />
          </template>
          <!-- 对象 -->
          <div v-else class="column-wrapper" v-for="(key, index) in Object.keys(element)" :key="index">
            <ElInput class="input-draggable" v-if="
              field.attribute[key] &&
              field.attribute[key].editable &&
              field.attribute[key].widget == 'input'
            " v-model="element[key]" :size="field.size" :disabled="field.attribute[key].disabled == true"
              :placeholder="field.attribute[key].placeholder || key" />
            <ElColorPicker v-else-if="
              field.attribute[key] &&
              field.attribute[key].editable &&
              field.attribute[key].widget == 'colorpicker'
            " :disabled="field.attribute[key].disabled == true" v-model="element[key]" :size="field.size">
            </ElColorPicker>
            <ElSelect v-else-if="
              field.attribute[key] &&
              field.attribute[key].editable &&
              field.attribute[key].widget == 'select'
            " v-model="element[key]" :size="field.size" :disabled="field.attribute[key].disabled == true"
              :placeholder="field.attribute[key].placeholder || key">
              <ElOption v-for="element in field.attribute[key].options" :key="element.value" :label="element.label"
                :value="element.value">
              </ElOption>
            </ElSelect>
          </div>
          <ElIcon v-if="field.showOperation" :class="['el-icon-remove', 'delete-list-icon']" @click="deleteItem(index)">
            <Remove />
          </ElIcon>
        </dd>
      </template>
    </draggable>
    <div v-show="field.showOperation" class="draggable-list-add" @click="addItem">
      添加
    </div>
  </dl>
</template>
<script lang="ts">
import baseMixin from "./baseMixin";
import Expression from "./expression.vue";
import Draggable from 'vuedraggable/src/vuedraggable'; 
import { Operation, Minus, Remove } from '@element-plus/icons-vue'
import { ElInput, ElColorPicker, ElSelect, ElOption, ElIcon } from "element-plus";
export default {
  name: "DraggableListWidget",
  mixins: [baseMixin],
  components: { Draggable, ElInput, ElColorPicker, ElSelect, ElOption, Expression, ElIcon, Operation, Minus, Remove },
  data() {
    return {
      id: 1,
    };
  },
  mounted() {
    if (!Array.isArray(this.value)) this.value = [];
    if (this.field.atLeastOne && this.value.length == 0) this.addItem();
    // 找出最大id
    for (let key in this.value) {
      let item = this.value[key];
      this.id = item.id > this.id ? item.id : this.id;
    }
  },
  methods: {
    // 定义一个规范化Schema的方法，用来为组件添加个性化的默认属性
    defaultFieldAttr() {
      return {
        idKey: "id", // id的键值
        size: "default", //   "default", "small", "large"
        title: "拖拽列表",
        atLeastOne: true, // 选项至少要有一个D
        icon: "el-icon-circle-plus", // 添加图标
        showOperation: true, // 是否显示操作图标
        template: { label: "", value: "" }, // 新增模板,可以是对象也可以是字符串： { label: "", value: "" } 或 ""
        attribute: {
          // template各个字段属性
          label: {
            widget: "input", // colorpicker|input|select
            placeholder: "",
            editable: true, // 是否可编辑
            disabled: false,
            options: [],
          },
          value: {
            widget: "input",
            placeholder: "",
            editable: true,
            disabled: false,
            options: [], // { label: "sss", value: "s" }
          },
        },
        strAttr: {
          // 当template为字符串时有效
          size: "default",
          widget: "input", // input|expression
          key: {
            title: "字段",
            show: true,
            order: 1,
            options: [],
          },
          exp: {
            title: "不等式",
            show: true,
            order: 2,
            options: [{ label: "等于", value: "==" }],
          },
          val: {
            title: "值",
            show: true,
            order: 3,
            options: [],
          },
        },
      };
    },
    // 增加项目
    addItem() {
      let template = null;
      if (typeof this.field.template == "string")
        template = this.field.template;
      else if (Object.keys(this.field.template).length > 0) {
        template = JSON.parse(JSON.stringify(this.field.template));
        let key = ++this.id;
        template[this.field.idKey] = key.toString();
      } else if (Array.isArray(this.field.template))
        template = JSON.parse(JSON.stringify(this.field.template));
      this.value.push(template);
    },
    // 删除项目
    deleteItem(index) {
      if (this.value.length === 1 && this.field.atLeastOne) return;
      this.value.splice(index, 1);
    },
    // 拖拽配置
    dragOptions() {
      return {
        sort: true,
        animation: 200,
        ghostClass: "ghost",
        handle: ".list-handle-move",
        easing: "cubic-bezier(1, 0, 0, 1)",
        group: {
          name: "draggablelist",
          put: false,
        },
      };
    },
  },
};
</script>

<style lang="scss">
.draggable-list-widget {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  margin: 0;
  padding: 0;

  .draggable-list-icon,
  .delete-list-icon {
    width: 30px;
    height: 30px;
    line-height: 30px;
    font-size: 25px;
    cursor: pointer;
  }

  .delete-list-icon {
    color: #fbc5c5;
  }

  .delete-list-icon:hover {
    color: #f56c6c;
  }

  .draggable-list-icon {
    color: #c8cbcc;
    cursor: move;
  }

  .draggable-list-item {
    display: flex;
    align-items: center;
    margin: 5px 0;

    .list-handel-move {
      color: #556567;
    }

    .input-draggable {
      min-width: 60px;
    }

    .column-wrapper {
      margin-right: 3px;
    }
  }

  .draggable-list-add {
    margin-top: 5px;
    font-size: 14px;
    color: #1890ff;
    cursor: pointer;
  }
}
</style>