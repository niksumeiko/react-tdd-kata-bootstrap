import { Link, useNavigate } from 'react-router-dom';

export const LoginPage = () => {
    const navigate = useNavigate();

    return (
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
            <form
                onSubmit={async (e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    const email = formData.get('email');
                    const password = formData.get('password');

                    const response = await fetch(`http://localhost:9000/login`, {
                        method: 'POST',
                        body: JSON.stringify({ email, password }),
                    });
                    const json = await response.json();
                    const token = json.token as string;
                    document.cookie = `token=${token}`;
                    navigate('/');
                }}
            >
                <input type="email" name="email" />
                <input type="password" name="password" />
                <button type="submit">Submit</button>
            </form>
        </div>
    );
};
