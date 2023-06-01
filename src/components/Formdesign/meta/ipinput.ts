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
            // {
            //     title: "前置内容",
            //     name: "prepend",
            //     size: "default",
            //     widget: "input"
            // },
            // {
            //     title: "后置内容",
            //     name: "append",
            //     size: "default",
            //     widget: "input"
            // },
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
