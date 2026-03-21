export const useUiStore = () => {
  const state = useState('uiStore', () => ({
    sidebarVisible: false,
  }))

  const openSidebar = () => {
    state.value.sidebarVisible = true
  }

  const closeSidebar = () => {
    state.value.sidebarVisible = false
  }

  return {
    ...toRefs(state.value),
    openSidebar,
    closeSidebar,
  } as const
}
