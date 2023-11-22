const modals = ref([]);

export default function useModal() {
    const showModal = (component, props = {}) => {
        modals.value.push({
            component: markRaw(component),
            props: reactive(props),
        });
        return component;
    }

    const hideModal = (component) => {
        if (component) {
            modals.value.splice(modals.value.indexOf(component));
        } else {
            modals.value.pop();
        }
    }

    return {
        modals,
        showModal,
        hideModal,
    };
}