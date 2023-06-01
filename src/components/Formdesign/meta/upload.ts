/**
 *
        title: "上传",
        name: "imageFile",
        tips: "", // 提示
        listType: "picture-card", // 可选 text/picture/picture-card
        actions: "http://127.0.0.1:8080/manage/smallo/upload.do", // 上传路径
        deleteUrl: "http://127.0.0.1:8080/manage/smallo/removeFile.do", // 删除路径
        draggable: true, // 是否可拖拽
        multiple: true, // 多选
        autoUpload: true, // 是否在选取文件后立即进行上传
        limit: 3, // 上传限制
        disabled: false,
        showFileList: true, // 是否显示已上传文件列表
 *
 */
import { baseForm, baseLayout } from "./base"
export const attribute = {
    schema: {

    },
    values: {

    },
    form: {
        ...baseForm,
        layout: [
            ...baseLayout,
            {
                title: "提示语",
                name: "tips",
                size: "default",
                widget: "input"
            },
            {
                title: "类型",
                widget: "select",
                name: "listType",
                size: "default",
                options: [
                    {
                        value: "text",
                        label: "拖拽上传",
                    },
                    {
                        value: "picture",
                        label: "图片列表",
                    },
                    {
                        value: "picture-card",
                        label: "照片墙",
                    },
                ],
            },
            {
                title: "上传URL",
                name: "actions",
                size: "default",
                widget: "input",
            },
            {
                title: "删除URL",
                name: "deleteUrl",
                size: "default",
                widget: "input"
            },
            {
                title: "可拖拽",
                widget: "select",
                name: "draggable",
                size: "default",
                options: [
                    { value: true, label: "是" },
                    { value: false, label: "否" },
                ],
            },
            {
                title: "多选",
                widget: "select",
                name: "multiple",
                size: "default",
                options: [
                    { value: true, label: "是" },
                    { value: false, label: "否" },
                ],
            },
            {
                title: "立即上传",
                widget: "select",
                name: "autoUpload",
                size: "default",
                options: [
                    { value: true, label: "是" },
                    { value: false, label: "否" },
                ],
            },
            {
                title: "禁用",
                widget: "select",
                name: "disabled",
                size: "default",
                options: [
                    { value: true, label: "是" },
                    { value: false, label: "否" },
                ],
            },

            {
                title: "显示上传列表",
                widget: "select",
                name: "showFileList",
                size: "default",
                options: [
                    { value: true, label: "是" },
                    { value: false, label: "否" },
                ],
            }
        ],
    }
}

export const rules = {
    schema: {},
    values: {},
    form: {
        ...baseForm,
        layout: []
    }
}
