import { baseForm, baseLayout } from "./base"
export const attribute = {
    schema: {

    },
    values: {

    },
    form: {
        ...baseForm,
        layout: [
            {
                title: "标题",
                name: "title",
                size: "default",
                widget: "input"
            },
        ],
    }
}

export const rules = {
    schema: {},
    values: {},
    form: {
        ...baseForm
    }
}
