const gateway = {
    state: {
        serviceTreeData: []
    },
    actions: {

    },
    mutations: {
        SERVICE_TREE: (state, data) => {
            state.serviceTreeData = data
        }
    }
}
export default gateway
