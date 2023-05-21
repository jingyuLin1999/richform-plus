<template>
    <div class="richform-demo">
        <Richform :form="form" :schema="schema" :values="values" :isDesign="true" />
        <p class="temp">{{ form.layout }}</p>
    </div>
</template>

<script lang="ts">
import Richform from '@/components/Richform/index.vue'
export default {
    components: { Richform },
    data() {
        return {
            schema: {
                $schema: "http://json-schema.org/draft-07/schema#",
                title: "设备属性",
                description: "A product from Acme's catalog",
                type: "object",
                properties: {
                    input: {
                        type: "string",
                        minLength: 6,
                    },
                }
            }, // 验证规则
            values: {}, // 表单的值
            form: {
                border: true, // 显示边框
                grid: false, // 表单内部栅栏
                labelSuffix: ":", // 字段标题后缀内容，默认' : '
                labelWidth: "110px", // 标签宽度,默认50px
                validator: "input", // submit
                labelAlign: "right", // 标签对齐, 默认右对齐, 可选左对齐left
                labelInline: true, // 字段标题显示位置, 默认true左侧left,false显示在top上方
                actions: [
                    //声明显示在下方和动作按钮
                    {
                        name: "reset", // 按键的唯一标识符
                        type: "primary", // 按键类型,默认为primary，具体可见element button
                        title: "重置", // 按键的文字
                        icon: "el-icon-star-off", // 按键图标 具体可见element icon
                        right: true, // 如果=true，则显示在右侧
                        visible: true, // 按键是否可见,同时满足readonly===false和设置为true才会显示,默认为true
                        tips: "提示信息", // 鼠标悬浮在按键的提示信息
                        top: true, // 是否在上面, false则在下面
                        size: "large" // 'large'| 'default'| 'small', 若未指明，则等同于form.size
                    },
                    {
                        name: "submit", // 按键的唯一标识符
                        type: "info", // 按键类型,默认为primary，具体可见element button
                        title: "提交", // 按键的文字
                        icon: "", // 按键图标 具体可见element icon
                        right: true, // 如果=true，则显示在右侧
                        visible: true, // 按键是否可见,同时满足readonly===false和设置为true才会显示,默认为true
                        tips: "提示信息", // 鼠标悬浮在按键的提示信息
                        top: true, // 是否在上面, false则在下面
                        size: "large" // 'large'| 'default'| 'small', 若未指明，则等同于form.size
                    }
                ],
                layout: [
                    {
                        title: "名称对方",
                        widget: "input",
                        name: "input",
                        type: "text",
                    },
                    {
                        title: "按钮",
                        widget: "button",
                        name: "button",
                    },
                    {
                        widget: "button",
                        name: "button1",
                        title: "按钮",
                        showTitle: false,
                        type: "primary",
                        size: "small",
                        isGroup: true,
                        options: [
                            {
                                title: "按钮一",
                                type: "success", // primary / success / warning / danger / info / text
                                disabled: false,
                                loading: false,
                                style: {},
                                isGroup: false,
                                size: "small",
                                round: false,
                                plain: false,
                                circle: false,
                                leftIcon: "",
                                rightIcon: "",
                            },
                            {
                                title: "按钮二",
                                type: "warning",
                                disabled: false,
                                loading: false,
                                style: {},
                                isGroup: false,
                                size: "small",
                                round: false,
                                plain: false,
                                circle: false,
                                leftIcon: "",
                                rightIcon: "",
                            },
                        ],
                    },
                ]
            }
        }
    },
    mounted() { },
}
</script>

<style lang="scss">
.richform-demo {
    width: 100%;
    height: 100%;

    .temp {
        width: 100%;
        height: 120px;
        color: #f00;
    }
}
</style>