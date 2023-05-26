<template>
  <Draggable :class="['layout', { 'drag-design': isDesign }]" :list="layout" tag="div" item-key="name"
    v-bind="getDragOptions()">
    <template #item="{ element }">
      <div :class="form.grid ? 'field-border-top' : ''">
        <field-group v-if="Array.isArray(element)" :fields="element" :schema="schema" :values="values" :form="form"
          :colors="colors" :fieldErrors="fieldErrors" :isFriendValue="isFriendValue" :hideFields="hideFields"
          :isDark="isDark">
        </field-group>
        <template v-else-if="typeof element == 'object' && element.widget == 'tabs'">
          <field-tabs :schema="schema" :values="values" :form="form" :colors="colors" :tabsItem="element"
            :isDesign="isDesign" :fieldErrors="fieldErrors" :isFriendValue="isFriendValue" :hideFields="hideFields"
            :isDark="isDark">
          </field-tabs>
        </template>
        <template v-else-if="typeof element == 'object' && element.widget == 'grid'">
          <field-grid :collapse="element" :schema="schema" :values="values" :form="form" :colors="colors"
            :gridItem="element" :isDesign="isDesign" :fieldErrors="fieldErrors" :isFriendValue="isFriendValue"
            :hideFields="hideFields" :isDark="isDark">
          </field-grid>
        </template>
        <template v-else-if="typeof element == 'object' && element.widget == 'collapse'">
          <field-collapse :collapse="element" :schema="schema" :values="values" :form="form" :colors="colors"
            :isDesign="isDesign" :fieldErrors="fieldErrors" :isFriendValue="isFriendValue" :hideFields="hideFields"
            :isDark="isDark">
          </field-collapse>
        </template>
        <field v-else :field="element" :schema="schema" :values="values" :form="form" :colors="colors"
          :isDesign="isDesign" :fieldErrors="fieldErrors" :isFriendValue="isFriendValue" :hideFields="hideFields"
          :isDark="isDark">
        </field>
      </div>
    </template>
  </Draggable>
</template>

<script lang="ts">
import Field from "./field.vue";
import FieldGroup from "./group/default.vue";
import FieldTabs from "./group/tabs.vue";
import FieldGrid from "./group/grid.vue";
import FieldCollapse from "./group/collapse.vue";
import Draggable from "vuedraggable";
import DragMixin from "./utils/designMixin";
import { defineComponent } from "vue";

export default defineComponent({
  name: "layout",
  mixins: [DragMixin],
  components: {
    FieldTabs,
    FieldGrid,
    FieldGroup,
    FieldCollapse,
    Field,
    Draggable,
  },
  props: {
    form: { type: Object, default: () => ({}) },
    schema: { type: Object, default: () => ({}) },
    values: { type: Object, default: () => ({}) },
    layout: { type: Array, default: () => [] },
    isDesign: { type: Boolean, default: false },
    fieldErrors: { type: Object, default: () => ({}) },
    hideFields: { type: Object, default: () => ({}) },
    colors: { type: Object, default: () => ({}) },
    isDark: { type: Boolean, default: false },
    isFriendValue: { type: Boolean, default: true },
  },
  methods: {},
});
</script>

<style lang="scss">
@import "./vars.scss";

.layout {
  .active-design {
    border: 3px solid $active-border-color;
  }

  padding-right: 0;

  .field-border-top:first-child {
    border-top: 1px solid $form-border-color;
  }
}
</style>