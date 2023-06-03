<!-- 标签页 --->
<template>
  <div :class="['tab-wrapper', tabsItem.activeDesign ? 'active-design' : '']">
    <!-- 点击区域，不影响tabs -->
    <div v-if="isDesign" class="design-no-tabs" @click="onClickedItem(tabsItem)"></div>
    <ElTabs v-model="activeTabName" @tab-click="clickTab">
      <ElTabPane v-for="(tab, index) in tabsItem.tabs" :key="index" :label="tab.label" :name="tab.name">
        <div class="tab-container">
          <component :is="asyncComponent" :layout="tab.fields" :isDesign="isDesign" :form="form" :values="values"
            :colors="colors" :schema="schema" :fieldErrors="fieldErrors" :isFriendValue="isFriendValue"
            :hideFields="hideFields" :isDark="isDark">
          </component>
        </div>
      </ElTabPane>
    </ElTabs>
    <!--拖拽-->
    <span class="design-draggable design-handle-move" v-if="isDesign && tabsItem.isClicked">
      <el-icon>
        <Rank />
      </el-icon>
    </span>
    <!--复制-->
    <span class="design-copy" @click="onCopyItem(schema)" v-if="isDesign && tabsItem.isClicked">
      <el-icon>
        <CopyDocument />
      </el-icon>
    </span>
    <!--删除-->
    <span class="design-delete" @click="onDeleteItem(form, tabsItem)" v-if="isDesign && tabsItem.isClicked">
      <el-icon>
        <Delete />
      </el-icon>
    </span>
  </div>
</template>

<script lang="ts">
import { defineComponent, defineAsyncComponent } from "vue";
import DesignMixin from "../utils/designMixin";
import { ElTabs, ElTabPane } from "element-plus";
export default defineComponent({
  name: "tabs-layout",
  mixins: [DesignMixin],
  components: { ElTabs, ElTabPane },
  props: {
    tabsItem: { type: Object, default: () => ({}) },
  },
  data() {
    return {
      activeTabName: this.tabsItem.tabs[0] ? this.tabsItem.tabs[0].name : "",
    };
  },
  computed: {
    asyncComponent() {
      return defineAsyncComponent(() => import("../layout.vue"))
    },
  },
  methods: {
    clickTab(tab) {
      this.emit("action", tab);
    },
  },
});
</script>

<style lang="scss">
.tab-wrapper {
  position: relative;
  box-sizing: border-box;

  >.design-no-tabs {
    width: 100%;
    height: 40px;
    position: absolute;
    z-index: 2;
  }

  .tab-container {
    min-height: 15px;
  }
}
</style>