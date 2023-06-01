<template>
  <div class="form-design">
    <div class="design-header">
      <div class="header-left">
        <a target="_blank" href="https://github.com/jingyuLin1999/richform">
          <span class="iconfont header-github-image">&#xe628;</span>
        </a>
        <h1 class="title">表单设计器</h1>
      </div>
      <div class="tools">
        <i class="el-icon-document-add tool" @click="onSubmit">生成JSON</i>
        <div class="tool" @click="onPreview">
          <i class="el-icon-view" v-if="isDesign">预览</i>
          <i class="el-icon-setting" v-else>设计</i>
        </div>
        <i class="el-icon-s-promotion tool" @click="onSubmit">保存</i>
      </div>
    </div>
    <div class="design-content">
      <split-layout first-panel-size="210px" last-panel-size="280px" :hasLastPanel="true" :lastPanelCanResize="false"
        direction="hori">
        <template #first>
          <!-- 基本组件 -->
          <div class="base-widgets">
            <div class="widget-title">基础字段</div>
            <draggable tag="div" v-bind="dragOptions()" v-model="widgetsMeta" :clone="cloneDragField" item-key="id"
              class="base-components">
              <template #item="{ element, index }">
                <span class="base-component-item">{{
                  element.title }}
                </span>
              </template>
            </draggable>
          </div>
          <!-- 布局组件 -->
          <div class="base-widgets">
            <div class="widget-title">布局组件</div>
            <draggable tag="div" v-bind="dragOptions()" v-model="layoutMeta" :clone="cloneDragField" item-key="id"
              class="base-components">
              <template #item="{ element, index }">
                <span class="base-component-item">
                  {{ element.title }}
                </span>
              </template>
            </draggable>
          </div>
        </template>
        <template #center>
          <!-- {{design.values}} -->
          <!-- {{ attribute.values }} -->
          <!-- {{ this.design.schema.properties }} -->
          <RichForm class="design-canvas" :isDesign="isDesign" :schema="design.schema" :form="design.form"
            :values="design.values" :authorization="authorization" @designItem="clickedField"></RichForm>
        </template>
        <template #last>
          <ElTabs class="tab-attribute" v-model="activeTabName">
            <ElTabPane label="属性配置" name="attribute" class="design-tab">
              <RichForm deepValues :schema="attribute.schema" :form="attribute.form" :values="attribute.values"
                :isDesign="false" @action="attributeAction" :isFriendValue="true"></RichForm>
            </ElTabPane>
            <ElTabPane label="校验规则" name="rules" class="design-tab">
              <RichForm :schema="rules.schema" :form="rules.form" :values="rules.values" :isFriendValue="true">
              </RichForm>
            </ElTabPane>
          </ElTabs>
        </template>
      </split-layout>
    </div>
  </div>
</template>

<script>
import RichForm from "../Richform/index.vue";
import Draggable from "vuedraggable";
import { mergeDeepRight, clone } from "ramda";
import SplitLayout from "../SplitLayout/index.vue";
import { layout, widgets } from "./meta/layout";
import { ElTabs, ElTabPane } from "element-plus";


export default {
  name: "FormDesign",
  components: { Draggable, SplitLayout, RichForm, ElTabs, ElTabPane },
  props: {
    fields: { type: Array, default: () => [] }, // 表的字段
    authorization: { type: Object, default: () => ({}) }, // 权限
  },
  computed: {
    friendlyFields() {
      return this.fields.map((item) => {
        if (typeof item == "string") return { label: item, value: item };
        else if (
          Object.prototype.toString.call(item) === "[object Object]" &&
          !item.value
        ) {
          item.value = item.label;
        }
        return item;
      });
    },
  },
  data() {
    return {
      isDesign: true,
      designItem: {}, // 触发的item
      design: {
        // 设计模式
        form: {
          border: true, // 显示边框
          grid: true, // 表单内部栅栏
          labelSuffix: ":", // 字段标题后缀内容，默认' : '
          labelWidth: "100px", // 标签宽度,默认50px
          validator: "input", // submit
          labelAlign: "right", // 标签对齐, 默认右对齐, 可选左对齐left
          labelInline: true, // 字段标题显示位置, 默认true左侧left,false显示在top上方
          colors: {
            theme: "",
            fontColor: "",
            btnColor: "",
            btnBgColor: "",
            activeColor: "",
            dateRangeBgColor: "",
            multiOptionBgColor: "",
          }, // 颜色
          layout: [],
        },
        values: {},
        schema: {
          $schema: "http://json-schema.org/draft-07/schema#",
          title: "表单设计器",
          description: "form design",
          type: "object",
          properties: {},
        },
      },
      rules: {
        form: {},
        values: {},
        schema: {},
      },
      attribute: {
        // 属性配置
        form: {},
        values: {},
        schema: {},
      },
      activeTabName: "attribute",
      layoutMeta: layout,
      widgetsMeta: widgets,
    };
  },
  methods: {
    attributeAction(info) {
      if (info.name == "resetTheme") {
        for (let key in this.design.form.colors)
          this.design.form.colors[key] = "";
      }
    },
    // 拖拽option参数：https://github.com/SortableJS/Sortable#options
    // 拖拽迁移记录：https://github.com/SortableJS/Vue.Draggable/blob/master/documentation/migrate.md#options-props
    dragOptions() {
      return {
        animation: 0, // 动画效果
        group: {
          name: "formdesign", // 两个draggable要相互拖拽必须设置相同
          pull: "clone", // 克隆方式拖拽出去
          put: false, // 禁止拖拽回来
          ghostClass: "design-field-ghost",
          dragClass: "design-sortable-drag", // 排序背景显示
        },
        sort: false, // 禁止排序
      };
    },
    async clickedField(item) {
      try {
        this.designItem = item;
        // 不能使用import，否则build后的包会出错
        let { attribute, rules } = await import(`./meta/${item.widget}.ts`);
        this.setAttribute(item, attribute);
        this.setRules(item, rules);
      } catch (e) {
        this.attribute.form = {};
        console.warn("加载表单字段元数据错误：" + e);
      }
    },
    setAttribute(item, attribute) {
      let attributeMeta = clone(attribute);
      mergeDeepRight(attributeMeta.values, item);
      // 数据库字段
      let name = attributeMeta.form.layout.find((item) => item.name == "name");
      if (name) name.options = this.friendlyFields;
      // 依赖
      let hideRely = attributeMeta.form.layout.find(
        (item) => item.name == "hideRely"
      );
      if (hideRely) hideRely.strAttr.key.options = this.friendlyFields;
      // 设置属性值
      this.attribute.values = item;
      this.attribute.form = attributeMeta.form;
      this.attribute.schema = attributeMeta.schema;
    },
    setRules(item, rules) {
      // TODO schema由数据库字段生成
      let rulesMeta = clone(rules);
      let curRules = this.design.schema.properties;
      let ruleValue = rulesMeta.values;
      if (curRules[item.name]) {
        mergeDeepRight(ruleValue, curRules[item.name]);
      }
      this.design.schema.properties[item.name] = ruleValue;
      this.rules.values = this.design.schema.properties[item.name];
      this.rules.form = rulesMeta.form
    },
    // 布局克隆前预设处理
    cloneDragField(dragItem) {
      let newdragItem = JSON.parse(JSON.stringify(dragItem));
      newdragItem.designId = 'r' + Math.random().toString(16).slice(2, 14);
      newdragItem.name = newdragItem.name + newdragItem.designId;
      return newdragItem;
    },
    onPreview() {
      this.designItem.activeField = false;
      this.$data.isDesign = !this.isDesign
    },
    onSubmit() { },
  },
};
// 加载表单元数据，供外部调用
// function loadMetas() {
//   const metaFiles = require.context("./meta", true, /\.js$/);
//   const modules = metaFiles.keys().reduce((modules, modulePath) => {
//     const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, "$1");
//     const value = metaFiles(modulePath);
//     modules[moduleName] = value;
//     return modules;
//   }, {});
//   return modules;
// }
// export const FormMetas = loadMetas();
</script>

<style lang="scss">
@font-face {
  font-family: "iconfont";
  src: url("./iconfont/iconfont.woff2?t=1635472525124") format("woff2"),
    url("./iconfont/iconfont.woff?t=1635472525124") format("woff"),
    url("./iconfont/iconfont.ttf?t=1635472525124") format("truetype");
}

.iconfont {
  font-family: "iconfont" !important;
  font-size: 16px;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.form-design {
  height: 100%;
  display: flex;
  flex-direction: column;

  .design-sortable-drag {
    background: #f00;
  }

  a {
    text-decoration: none;
  }

  // 修改属性配置elementUi tab的样式
  .tab-attribute {
    .el-tabs__item {
      width: 140px;
      text-align: center;
    }
  }

  >.design-header {
    height: 55px;
    padding: 0 10px;
    color: #fff;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: linear-gradient(90deg, #1179f4 45%, #079dc8, #01b3ac);

    .header-left {
      display: flex;
      align-items: center;

      .header-github-image {
        color: #000;
        font-size: 28px;
        margin-right: 12px;
      }

      .title {
        margin: 0;
        padding: 0;
        font-size: 19px;
        height: 55px;
        line-height: 55px;
      }

      .header-github-image {
        width: 25px;
        height: 25px;
        margin-right: 12px;
      }
    }

    .tools {
      display: flex;
      font-size: 14px;
      align-items: center;

      >.tool {
        cursor: pointer;
        margin-left: 10px;
      }
    }
  }

  >.design-content {
    height: 100%;
    position: relative;

    .base-widgets {
      padding-right: 2px;

      .widget-title {
        height: 25px;
        line-height: 25px;
        font-size: 13px;
        margin-left: 3px;
      }

      .base-components {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;

        >.base-component-item {
          height: 30px;
          line-height: 30px;
          width: 49.5%;
          text-align: center;
          font-size: 12px;
          background: #eff0f3;
          margin: 3px 0;
          cursor: move;
          box-sizing: border-box;
        }

        >.base-component-item:hover {
          border: 1px dashed #01b3ac;
        }
      }
    }

    .design-canvas {
      height: 100%;
    }
  }
}
</style>