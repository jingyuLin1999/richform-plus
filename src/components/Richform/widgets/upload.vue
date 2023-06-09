<template>
  <div class="upload-widget" :id="widgetId">
    <div class="upload-type" v-if="field.showType">
      <span class="type-label" :style="{ color: colors.fontColor }">上传类型：</span>
      <elSwitch v-model="field.type" active-color="#13ce66" inactive-color="#ff4949" active-text="文件夹" inactive-text="文件"
        active-value="folder" inactive-value="file">
      </elSwitch>
    </div>
    <ElUpload ref="uploadWidget" class="upload-wrapper" :name="field.name" :list-type="field.listType"
      :file-list="fileList" :drag="field.draggable && field.listType == 'text'" :action="field.actions"
      :multiple="field.multiple" :auto-upload="field.autoUpload" :headers="header" :limit="field.limit"
      :disabled="field.disabled" :show-file-list="field.showFileList" :accept="field.accept"
      :before-remove="onBeforeRemove" :on-success="onSuccess" :on-remove="onRemoveSuccess"
      :on-preview="pictureCardPreview">
      <ElButton v-if="field.listType == 'picture'" size="default" type="primary">点击上传</ElButton>
      <ElIcon v-else-if="field.listType == 'picture-card'" class="avatar-uploader-icon">
        <Plus />
      </ElIcon>
      <div v-else-if="field.listType == 'text'">
        <ElIcon class="el-icon--upload">
          <UploadFilled />
        </ElIcon>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      </div>
      <template v-if="field.tips.length > 0" #tip>
        <div class="el-upload__tip">
          {{ field.tips }}
        </div>
      </template>
    </ElUpload>
    <!-- 查看详情 -->
    <ElDialog v-model="dialogVisible">
      <img w-full :src="dialogImageUrl" alt="Preview Image" />
    </ElDialog>
  </div>
</template>

<script lang="ts">
import baseMixin from "./baseMixin";
import {
  ElIcon,
  ElUpload,
  ElButton,
  ElDialog,
  ElMessage,
  ElSwitch as elSwitch,
} from "element-plus";
import { UploadFilled, Plus } from '@element-plus/icons-vue'
import { loadDict } from "../utils/index";

export default {
  mixins: [baseMixin],
  components: { ElUpload, ElMessage, ElButton, ElDialog, elSwitch, ElIcon, UploadFilled, Plus },
  data() {
    return {
      header: {
        [sessionStorage.getItem("richform-key")]:
          sessionStorage.getItem("richform-value"),
      },
      fileList: [], // 刚开始显示的图片
      dialogVisible: false,
      dialogImageUrl: null,
    };
  },
  mounted() {
    this.onFileList();
    this.onSwitchType();
  },
  watch: {
    "field.type"(newType) {
      this.onSwitchType(newType);
    },
  },
  methods: {
    defaultFieldAttr() {
      return {
        name: "file", // 上传文件字段名
        tips: "", // 提示
        type: "file", // folder|file
        showType: false, // 是否显示类型
        listType: "picture", // 可选 text/picture/picture-card
        actions: "http://127.0.0.1:8080/manage/minio/upload.do", // 上传路径
        deleteUrl: "http://127.0.0.1:8080/manage/minio/removeFile.do", // 删除路径
        draggable: true, // 是否可拖拽
        multiple: true, // 多选
        autoUpload: true, // 是否在选取文件后立即进行上传
        limit: 2, // 上传限制
        disabled: false,
        showFileList: true, // 是否显示已上传文件列表
        accept: "", // 可接受的类型 image/jpeg,image/gif,image/png,image/bmp
        mapValues: {
          // 将服务器返回值映射到values对应字段
          originalFilename: "filename", // 返回字段 value字段
          fileSize: "filesize",
        },
        removeFunc: null, // 删除自定义函数,返回一个异步函数
        uploadFunc: null, // 上传自定义函数,返回一个异步函数
        /*
         function (file, config) {
          return new Promise((resolve, reject) => {
            loadDict(config.deleteUrl, file).then((response) => {
            });
            resolve()
          }).catch((error) => {
            reject();
          });
        */
      };
    },
    pictureCardPreview(uploadFile) {
      this.dialogImageUrl = uploadFile.url;
      this.dialogVisible = true;
    },
    // 改变上传的是文件夹还是文件
    onSwitchType(newType = this.field.type) {
      this.$nextTick(() => {
        let isFolder = newType == "folder";
        if (this.field.listType == "text") {
          let uploadDom = document.querySelector(`#${this.widgetId} .upload-wrapper input`)
          if (uploadDom) uploadDom.webkitdirectory = isFolder;
        }
      })
    },
    onFileList() {
      if (Array.isArray(this.value) && this.value.length > 0) {
        this.value.map((urlItem) => {
          // 后端生成的uuid文件名
          let filePath =
            urlItem.indexOf("?") == -1
              ? urlItem
              : urlItem.slice(0, urlItem.indexOf("?"));
          let fileName = filePath.slice(
            filePath.lastIndexOf("/") + 1,
            filePath.length
          );
          // 原始文件名
          let mapValues = this.field.mapValues;
          let originalFilename = mapValues.originalFilename;
          originalFilename = this.values[originalFilename];
          // 初始值
          this.fileList.push({
            name: originalFilename || fileName,
            url: urlItem,
          });
        });
      }
    },
    onSuccess(response, file, fileList) {
      const { payload, msg, status } = response;
      if (status != 200) {
        Message({ type: "error", message: `上传失败，${msg}` });
        fileList.splice(fileList.length - 1, 1);
        return;
      }
      Object.assign(file, payload);
      this.pickValues(fileList);
    },
    pickValues(fileList) {
      let pickPath = [],
        fileSize = 0,
        fileName = "";
      fileList.map((fileItem, index) => {
        let filesizeItem = fileItem.size || fileItem.fileSize;
        if (filesizeItem) fileSize += fileItem.size || fileItem.fileSize;
        fileName += fileItem.name || fileItem.fileName;
        if (index != fileList.length - 1) fileName += ",";
        pickPath.push(fileItem.path || fileItem.url);
      });
      // 设置值
      this.changeValue(pickPath);
      // 映射值
      let mapValues = this.field.mapValues;
      if (fileName) this.values[mapValues.originalFilename] = fileName;
      if (fileSize) this.values[mapValues.fileSize] = fileSize;
    },
    onBeforeRemove(file) {
      // 发送完整路径，后端可能是分布式的
      return typeof this.field.removeFunc == "function" ?
        this.field.removeFunc(file, this.field) :
        new Promise((resolve, reject) => {
          loadDict(this.field.deleteUrl, file)
            .then((response) => {
              if (response.status != 200) {
                Message({
                  type: "error",
                  message: `删除失败，${response.msg}`,
                });
                reject();
              }
              resolve();
            })
            .catch((error) => {
              reject();
            });
        });
    },
    onRemoveSuccess(file, fileList) {
      this.pickValues(fileList);
    },
  },
};
</script>

<style lang="scss">
.upload-widget {
  width: 100%;
  overflow: hidden;

  .upload-type {
    display: flex;
    align-items: center;
    height: 25px;
    margin-bottom: 3px;
    margin-top: 5px;

    .type-label {
      font-size: 12px;
    }
  }
}
</style>