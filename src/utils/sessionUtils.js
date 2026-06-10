export const routeSessionKeys = {
  '/admin-users': 'admin-user-search',
  '/business-customer': 'business-customer-search',
  '/business-category': 'business-category-search',
};

// Strip route to match just base
export const getBasePath = (path) => {
  const segments = path.split('/');
  return '/' + (segments[1] || '');
};

export const clearPreviousRouteSession = (prevPath, currentPath) => {
  const prevBase = getBasePath(prevPath);
  const currBase = getBasePath(currentPath);

  if (prevBase !== currBase && routeSessionKeys[prevBase]) {
    console.log(`Clearing session key: ${routeSessionKeys[prevBase]}`);
    sessionStorage.removeItem(routeSessionKeys[prevBase]);
  }
};
