const mapping: Record<string, string> = {
  cryptocurrencies: 'cryptocurrency',
  games: 'game',
  organizations: 'organization',
  payments: 'payment',
  users: 'user',
};

export function convertRouteToEntityUtil(route: string) {
  return mapping[route] || route;
}
