import type { FC } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createBrowserRouter, Link, Outlet, RouterProvider } from 'react-router-dom';

const Protected: FC = () => {
    // Handle protecting logic here

    return <Outlet />;
};

const queryClient = new QueryClient();
const router = createBrowserRouter([
    {
        path: '/',
        element: (
            <div>
                <header>
                    Navigate:{' '}
                    <Link to="private">
                        <u>Private</u>
                    </Link>
                </header>
                <hr />
                <br />
                <h1>Home page</h1>
            </div>
        ),
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
