type TRouteParams = Record<string, string | number>;

const fillRouteParams = (path: string, params: TRouteParams) =>
  path.replace(/:([A-Za-z0-9_]+)/g, (match, name: string) => {
    const value = params[name];
    return value === undefined ? match : encodeURIComponent(String(value));
  });

export const usePageRoutes = () => {
  const cmsBootstrap = useCmsBootstrap();

  const findRoute = (routeName: string) =>
    cmsBootstrap.bootstrap.value?.routes.find(
      item => item.routeName === routeName,
    );

  const fallback = (message: string) => {
    if (import.meta.dev && cmsBootstrap.bootstrap.value) {
      throw new Error(message);
    }

    console.error(message);
    return cmsBootstrap.localizePath(findRoute("not-found")?.path ?? "/404");
  };

  const resolve = (routeName: string, params: TRouteParams = {}) => {
    const target = findRoute(routeName);
    if (!target) {
      return fallback(`Unknown CMS route: ${routeName}`);
    }

    const path = fillRouteParams(target.path, params);
    if (path.includes(":")) {
      return fallback(`Missing CMS route params for ${routeName}`);
    }

    return cmsBootstrap.localizePath(path);
  };

  return { resolve };
};
