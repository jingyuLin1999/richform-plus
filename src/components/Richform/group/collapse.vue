<!-- 折叠面板 -->
<template>
  <div :class="[
    'collapse-wrapper',
    form.grid ? 'collapse-wrapper-border ' : '',
    collapse.activeDesign ? 'active-design' : '',
  ]">
    <!-- 避免触发发缩收 -->
    <div v-if="isDesign" class="design-no-collapse" @click="onClickedItem(collapse)"></div>
    <ElCollapse v-model="openCollapseName" @change="onChange">
      <ElCollapseItem :name="collapse.name" class="collapse-item">
        <template #title>
          <span :style="collapse.style" class="collapse-title">{{ collapse.title }}</span>
        </template>
        <div class="collapse-container">
          <component :is="asyncLyaout" :layout="collapse.fields" :isDesign="isDesign" :form="form" :values="values"
            :colors="colors" :schema="schema" :fieldErrors="fieldErrors" :hideFields="hideFields"
            :isFriendValue="isFriendValue" :isDark="isDark">
          </component>
          <component :is="asyncAction" v-if="Array.isArray(collapse.actions)" :actions="collapse.actions"
            :isDesign="isDesign">
          </component>
        </div>
      </ElCollapseItem>
    </ElCollapse>
    <!--拖拽-->
    <span class="design-draggable design-handle-move" v-if="isDesign && collapse.isClicked">
      <el-icon>
        <Rank />
      </el-icon>
    </span>
    <!--复制-->
    <span class="design-copy" @click="onCopyItem(schema)" v-if="isDesign && collapse.isClicked">
      <el-icon>
        <CopyDocument />
      </el-icon>
    </span>
    <!--删除-->
    <span class="design-delete" @click="onDeleteItem(form, collapse)" v-if="isDesign && collapse.isClicked">
      <el-icon>
        <Delete />
      </el-icon>
    </span>
  </div>
</template>

<script lang="ts">
import { defineComponent, defineAsyncComponent } from "vue";
import DesignMixin from "../utils/designMixin";
import { ElCollapse, ElCollapseItem } from "element-plus";
export default defineComponent({
  name: "collapse",
  mixins: [DesignMixin],
  components: { ElCollapse, ElCollapseItem },
  props: {
    collapse: { type: Object, default: () => ({}) },
  },
  data() {
    return {
      openCollapseName: "",
    };
  },
  computed: {
    asyncLyaout() {
      return defineAsyncComponent(() => import("../layout.vue"))
    },
    asyncAction() {
      return defineAsyncComponent(() => import("../actions.vue"))
    },
  },
  mounted() {
    this.openCollapse();
  },
  methods: {
    openCollapse() {
      if (this.collapse.expand) {
        this.openCollapseName = this.collapse.name;
      }
    },
    onChange(activeName) {
      this.emit("action", activeName);
    },
  },
});
</script>

<style lang="scss" scoped>
@import "../vars.scss";

.collapse-wrapper {
  overflow: hidden;
  margin-top: 10px;
  box-sizing: border-box;
  position: relative;

  .collapse-title {
    color: #409eff;
    font-size: 15px;
    margin-left: 3px;
  }

  .collapse-container {
    box-sizing: border-box;
    padding: 0 5px;
  }

  >.design-no-collapse {
    width: 100%;
    height: 50px;
    position: absolute;
    left: 100px;
  }
}

.collapse-wrapper-border {
  border: 1px solid $form-border-color;
  border-top: 0;
  border-bottom: 0;
  cursor: pointer;
}
</style>