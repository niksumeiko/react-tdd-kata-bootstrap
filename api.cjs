const express = require('express');
const formidable = require('express-formidable');
require('dotenv').config();

/** Database */
class DataBase {
    #users = [];

    addUser(user) {
        this.#users.push(user);
        return user;
    }

    login({ id }) {
        const user = this.getUserById(id);
        user.token = createToken();
        return user;
    }

    logout({ id }) {
        const user = this.getUserById(id) ?? {};
        delete user.token;
    }

    getUserById(id) {
        return this.#users.find((user) => id === user.id);
    }

    getUserByToken(token) {
        return this.#users.find((user) => token === user.token);
    }

    getUserByCredentials({ email, password }) {
        return this.#users.find(
            (user) => user.email === email && user.password === password,
        );
    }
}

/** Utilities */
function createToken() {
    return (Math.random() + 1).toString(36).substring(2);
}

function createRandomDelay() {
    return (Math.floor(Math.random() * 2) + 1) * 1000;
}

function writeResponse(res, data, statusCode) {
    res.status(statusCode);

    if (data) {
        res.json(data);
    }

    res.end();
}
function wait(ms) {
    return new Promise((resolve) => {
        setTimeout(() => resolve(), ms ?? createRandomDelay());
    });
}

function writeSuccess(res, data) {
    writeResponse(res, data, 200);
}

function writeErrors(res, statusCode = 500, errors) {
    writeResponse(res, errors, statusCode);
}

/** Initialization */
const db = new DataBase();

db.addUser({ id: 1, name: 'Leo Messi', email: 'x@y.z', password: 'xyz' });

/** API */
const app = express();

app.use(formidable());
app.use((req, res, next) => {
    res.set({
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'OPTIONS, POST, GET',
        'Access-Control-Allow-Headers':
            'Origin, X-Requested-With, Content-Type, Accept, Authorization',
    });
    next();
});

app.post('/login', async (req, res) => {
    if (!req.fields.email || !req.fields.password) {
        return writeErrors(res, 412, [{ error: 'MISSING_CREDENTIALS' }]);
    }

    const email = req.fields.email.trim();
    const password = req.fields.password.trim();
    const user = db.getUserByCredentials({ email, password });

    if (!user) {
        return writeErrors(res, 404);
    }

    const { token } = db.login(user);
    await wait();
    return writeSuccess(res, { token });
});

app.post('/logout', async (req, res) => {
    const auth = req.get('Authorization') ?? '';
    const [, token] = auth.split(' ');

    if (!token) {
        return writeSuccess(res);
    }

    const user = db.getUserByToken(token);

    if (!user) {
        return writeSuccess(res);
    }

    db.logout(user);
    await wait();
    return writeSuccess(res);
});

app.get('/user', async (req, res) => {
    const auth = req.get('Authorization') ?? '';

    if (!auth.startsWith('Bearer ')) {
        return writeErrors(res, 401);
    }

    const [, token] = auth.split(' ');
    const user = db.getUserByToken(token);

    if (!user) {
        return writeErrors(res, 404);
    }

    await wait();
    return writeSuccess(res, user);
});

app.listen(process.env.APP_PORT, () => {
    console.info(`API ready/started: ${process.env.API_URL}`);
});
