/** Every navigable path in one place — no stringly-typed hrefs scattered through screens. */
export const routes = {
  home: '/',
  welcome: '/welcome',
  login: '/login',
  signup: '/signup',
  discover: '/discover',
  orders: '/orders',
  community: '/community',
  profile: '/profile',
  cart: '/cart',
  checkout: '/checkout',
  createPost: '/create-post',
  addresses: '/addresses',
  payments: '/payments',
  notifications: '/notifications',
  settings: '/settings',
  book: (id: string) => `/books/${id}`,
  order: (id: string) => `/orders/${id}`,
  confirmation: (id: string) => `/confirmation/${id}`,
  club: (id: string) => `/clubs/${id}`,
  discoverWith: (params: {
    focus?: boolean;
    genre?: string;
    sort?: string;
    express?: boolean;
    q?: string;
  }) => {
    const search = new URLSearchParams();
    if (params.focus) search.set('focus', '1');
    if (params.genre) search.set('genre', params.genre);
    if (params.sort) search.set('sort', params.sort);
    if (params.express) search.set('express', '1');
    if (params.q) search.set('q', params.q);
    const query = search.toString();
    return query ? `/discover?${query}` : '/discover';
  },
} as const;
