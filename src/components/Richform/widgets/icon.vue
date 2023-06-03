
<template>
  <ElPopover placement="bottom-start" ref="iconRef" title="请选择" width="800" trigger="click">
    <div class="icon-container">
      <div v-for="(iconObj, key) in ElementPlusIconsVue" :key="key"
        :class="['icon-cell', latestIcon == iconObj.name ? 'active-icon' : '']" @click="clickIcon(key)">
        <ElIcon class="el-icon--right">
          <component :is="ElementPlusIconsVue[key]" />
        </ElIcon>
      </div>
    </div>
    <ElButton type="primary" :size="field.size" class="sure-icon" @click="onSureIcon">确定
    </ElButton>
    <template #reference>
      <ElButton :size="field.size" :disabled="field.disabled" :style="{ fontSize: field.fontSize }">
        <span v-if="value == null">请选择</span>
        <ElIcon class="el-icon--right">
          <component :is="ElementPlusIconsVue[value]" />
        </ElIcon>
      </ElButton>
    </template>
  </ElPopover>
</template>

<script lang="ts">
import baseMixin from "./baseMixin";
import { ElPopover, ElButton } from "element-plus";
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

export default {
  mixins: [baseMixin],
  components: { ElPopover, ElButton },
  mounted() {
    this.latestIcon = this.value;
  },
  methods: {
    defaultFieldAttr() {
      return {
        size: "default",
        disabled: false,
        fontSize: "14px",
      };
    },
    clickIcon(val) {
      this.value = this.latestIcon == val ? null : val;
      this.latestIcon = this.value;
    },
    onSureIcon() {
      this.$refs.iconRef.hide();
    },
  },
  data() {
    return {
      latestIcon: "",
      ElementPlusIconsVue,
    };
  },
};
</script>

<style lang="scss">
.icon-container {
  display: flex;
  flex-wrap: wrap;
  max-height: 400px;
  overflow: auto;
  border-left: 1px solid #eee;
  border-top: 1px solid #eee;

  .icon-cell {
    width: 50px;
    height: 50px;
    line-height: 50px;
    text-align: center;
    font-size: 21px;
    border: 1px solid #eee;
    border-left: 0;
    border-top: 0;
  }

  .active-icon {
    color: #4f9ffe;
  }

  .icon-cell:last-child {
    border-right: 1px solid #eee;
  }

  .icon-cell:hover {
    color: #4f9ffe;
  }
}

.sure-icon {
  float: right;
  margin-top: 4px;
}
</style>