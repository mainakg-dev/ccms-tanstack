import {
  createRootRouteWithContext,
  Outlet,
  useLocation,
} from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import Footer from '../components/Footer'
import Header from '../components/Header'

import TanStackQueryDevtools from '../integrations/tanstack-query/devtools'

import { ErrorComponent } from '../components/ErrorComponent'
import { NotFoundComponent } from '../components/NotFoundComponent'

import type { QueryClient } from '@tanstack/react-query'

interface MyRouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  errorComponent: (props) => <ErrorComponent {...props} />,
  notFoundComponent: () => <NotFoundComponent />,
  component: RootComponent,
})

function RootComponent() {
  const location = useLocation()
  const isDashboard =
    location.pathname.startsWith('/admin') ||
    location.pathname.startsWith('/center')
  const isLogin = location.pathname === '/login'

  return (
    <>
      {!isDashboard && !isLogin && <Header />}
      <Outlet />
      {!isDashboard && !isLogin && <Footer />}
      <TanStackDevtools
        config={{
          position: 'bottom-right',
        }}
        plugins={[
          {
            name: 'Tanstack Router',
            render: <TanStackRouterDevtoolsPanel />,
          },
          TanStackQueryDevtools,
        ]}
      />
    </>
  )
}
