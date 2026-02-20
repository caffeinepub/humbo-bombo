import { createRouter, createRoute, createRootRoute, RouterProvider, Outlet } from '@tanstack/react-router';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import GameSelection from './pages/GameSelection';
import GamePlay from './pages/GamePlay';
import GameHistory from './pages/GameHistory';
import WalletPage from './pages/WalletPage';

const rootRoute = createRootRoute({
  component: () => (
    <Layout>
      <Outlet />
    </Layout>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
});

const gamesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/games',
  component: GameSelection,
});

const gamePlayRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/play/$gameName',
  component: GamePlay,
});

const historyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/history',
  component: GameHistory,
});

const walletRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/wallet',
  component: WalletPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  gamesRoute,
  gamePlayRoute,
  historyRoute,
  walletRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

function App() {
  return <RouterProvider router={router} />;
}

export default App;
