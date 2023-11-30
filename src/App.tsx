import type { FC } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createMemoryRouter, Link, Outlet, RouterProvider } from 'react-router-dom';

import { LoginPage } from './pages/login';
import { HomePage } from './pages/home';

const Protected: FC = () => {
    // Handle protecting logic here

    return <Outlet />;
};

const queryClient = new QueryClient();
const router = createMemoryRouter([
    {
        index: true,
        path: '/',
        element: <HomePage />,
    },
    {
        path: '/login',
        element: <LoginPage />,
    },
    {
        element: <Protected />,
        children: [
            {
                path: 'private',
                element: (
                    <div>
                        <header>
                            Navigate:{' '}
                            <Link to="/">
                                <u>Home</u>
                            </Link>
                        </header>
                        <hr />
                        <br />
                        <h2>
                            <em>Private</em> page
                        </h2>
                    </div>
                ),
            },
        ],
    },
]);

export const App: FC = () => {
    return (
        <QueryClientProvider client={queryClient}>
            <RouterProvider router={router} />
        </QueryClientProvider>
    );
};
