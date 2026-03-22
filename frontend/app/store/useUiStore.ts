export const useUiStore = () => {
  const state = useState('uiStore', () => ({
    sidebarVisible: true,
  }))

  const openSidebar = () => {
    state.value.sidebarVisible = true
  }

  const closeSidebar = () => {
    state.value.sidebarVisible = false
  }

  const toggleSidebar = () => {
    state.value.sidebarVisible = !state.value.sidebarVisible
  }

  return {
    ...toRefs(state.value),
    openSidebar,
    closeSidebar,
    toggleSidebar,
  } as const
}
