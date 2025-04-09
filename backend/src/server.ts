require('@dotenvx/dotenvx').config();

import express from 'express';
import bodyParser from 'body-parser';
import compression from 'compression';
import cors from 'cors';
import fs from 'fs';

const app = express();

app.disable('x-powered-by');

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(compression({
    level: 6
}));

fs.readdirSync(__dirname + '/routes').map((version) => {
    fs.readdirSync(__dirname + `/routes/${version}`).map((route) => {
        try {
            if (route.endsWith('.map')) return;

            if (route.endsWith('.ts') || route.endsWith('.js')) {
                loadRoutes(route, version);
            } else if (fs.lstatSync(__dirname + `/routes/${version}/${route}`).isDirectory()) {
                fs.readdirSync(__dirname + `/routes/${version}/${route}`).map((subRoute) => {
                    if (subRoute.endsWith('.map')) return;

                    if (subRoute.endsWith('.ts') || subRoute.endsWith('.js')) {
                        loadRoutes(`${route}/${subRoute}`, version);
                    }
                });
            }
        } catch (err) {
            console.log(err)
        }
    });
});

function loadRoutes(path: string, versionDir: string) {
    const version = Number(versionDir.replace(/\D/g, ''));
    const route = require(`./routes/${versionDir}/${path}`).default;

    console.log(`Loading route: /api/v${version}/${path.split('.').slice(0, -1).join('.')}`);

    app.use(`/api/v${version}/${path.split('.').slice(0, -1).join('.')}`, route)
}

app.listen(process.env.PORT || 3000, () => {
    console.log(`Server is running on port ${process.env.PORT || 3000}`);
});