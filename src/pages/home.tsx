import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function getCookie(cname: string) {
    const name = `${cname}=`;
    const decodedCookie = decodeURIComponent(document.cookie);
    const ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i += 1) {
        let c = ca[i];
        while (c.charAt(0) === ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length);
        }
    }
    return '';
}

export const HomePage = () => {
    const [user, setUser] = useState();

    useEffect(() => {
        const token = getCookie('token');
        console.log({ token });
        if (!token) return;

        fetch('/user', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((res) => res.json())
            .then((data) => {
                // console.log(data);
                setUser(data);
            });
    }, []);

    return (
        <div>
            <header>
                <Link to="private">
                    <u>Private</u>
                </Link>
                <Link to="/login">Login</Link>

                <p>{user?.name || 'Hello, unknown friend'}</p>
            </header>
            <hr />
            <br />
            <h1>Home page</h1>
        </div>
    );
};
