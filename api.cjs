const http = require('http');
const { URL } = require('url');
const qs = require('querystring');
require('dotenv').config();

const PORT = process.env.APP_PORT;
const DEFAULT_HEADERS = {
    'Access-Control-Allow-Origin': 'http://localhost:5173',
    'Access-Control-Allow-Methods': 'OPTIONS, POST, GET',
    'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
};

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
    res.writeHead(statusCode, DEFAULT_HEADERS);
    if (data) res.write(JSON.stringify(data));
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

function writeErrors(res, errors, statusCode = 500) {
    writeResponse(res, errors, statusCode);
}

function getRequestUrl(req) {
    const host = req.getHeader('host');
    return new URL(req.url, `http://${host}/`);
}

function getPostData(req) {
    return new Promise((resolve) => {
        let body = '';

        req.on('data', (data) => {
            body += data;
        });

        req.on('end', function () {
            resolve(qs.parse(body));
        });
    });
}

/** Handlers */
async function handleUserEndpoint(req, res) {
    const auth = req.getHeader('Authorization');

    if (!req.hasHeader('Authorization')) {
        return writeErrors(res, undefined, 401);
    }

    if (!auth.startsWith('Bearer ')) {
        return writeErrors(res, undefined, 401);
    }

    const [, token] = auth.split(' ');
    const user = db.getUserByToken(token);

    if (!user) {
        return writeErrors(res, undefined, 404);
    }

    await wait();
    return writeSuccess(res, user);
}

async function handleLoginEndpoint(req, res) {
    const data = await getPostData(req);

    if (!data.email || !data.password) {
        return writeErrors(req, [{ error: 'MISSING_CREDENTIALS' }], 412);
    }

    const email = data.email.trim();
    const password = data.password.trim();
    const user = db.getUserByCredentials({ email, password });

    if (!user) {
        return writeErrors(req, undefined, 404);
    }

    db.login(user);
    await wait();
    return writeSuccess(res);
}

async function handleLogoutEndpoint(req, res) {
    const { Authorization: auth = '' } = req.getHeaders();
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
}

/** Initialization */
const db = new DataBase();
db.addUser({ id: 1, name: 'Leo Messi', email: 'x@y.z', password: 'xyz' });

http.createServer((req, res) => {
    const { pathname } = getRequestUrl(req);

    if (req.method === 'OPTIONS') {
        return writeResponse(res, undefined, 204);
    }

    if (req.method === 'GET') {
        if (pathname === '/user') {
            return handleUserEndpoint(req, res);
        }
    }

    if (req.method === 'POST') {
        if (pathname === '/login') {
            return handleLoginEndpoint(req, res);
        }

        if (pathname === '/logout') {
            return handleLogoutEndpoint(req, res);
        }
    }

    writeErrors(res, [{ message: 'Not found' }], 404);
}).listen(PORT, () => console.info('API ready/started'));
