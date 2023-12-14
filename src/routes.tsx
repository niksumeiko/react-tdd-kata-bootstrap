import { Link, Outlet } from 'react-router-dom';
import type { FC } from 'react';

const Protected: FC = () => {
    // Handle protecting logic here

    return <Outlet />;
};

export const routes = [
    {
        index: true,
        path: '/',
        element: (
            <div>
                <header>
                    <Link to="private">
                        <u>Private</u>
                    </Link>
                    <Link to="/login">Login</Link>
                </header>
                <hr />
                <br />
                <h1>Home page</h1>
            </div>
        ),
    },
    {
        path: '/login',
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
                <h2>Login page</h2>
                <form>
                    <input type="email" name="email" />
                    <input type="password" name="password" />
                    <button type="submit">Submit</button>
                </form>
            </div>
        ),
    },
    {
        element: <Protected />,
        children: [
            {
                path: '/private',
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
];
