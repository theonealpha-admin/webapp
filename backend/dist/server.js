"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require('@dotenvx/dotenvx').config();
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const compression_1 = __importDefault(require("compression"));
const cors_1 = __importDefault(require("cors"));
const fs_1 = __importDefault(require("fs"));
const app = (0, express_1.default)();
app.disable('x-powered-by');
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use((0, compression_1.default)({
    level: 6
}));
fs_1.default.readdirSync(__dirname + '/routes').map((version) => {
    fs_1.default.readdirSync(__dirname + `/routes/${version}`).map((route) => {
        try {
            if (route.endsWith('.map'))
                return;
            if (route.endsWith('.ts') || route.endsWith('.js')) {
                loadRoutes(route, version);
            }
            else if (fs_1.default.lstatSync(__dirname + `/routes/${version}/${route}`).isDirectory()) {
                fs_1.default.readdirSync(__dirname + `/routes/${version}/${route}`).map((subRoute) => {
                    if (subRoute.endsWith('.map'))
                        return;
                    if (subRoute.endsWith('.ts') || subRoute.endsWith('.js')) {
                        loadRoutes(`${route}/${subRoute}`, version);
                    }
                });
            }
        }
        catch (err) {
            console.log(err);
        }
    });
});
function loadRoutes(path, versionDir) {
    const version = Number(versionDir.replace(/\D/g, ''));
    const route = require(`./routes/${versionDir}/${path}`).default;
    console.log(`Loading route: /api/v${version}/${path.split('.').slice(0, -1).join('.')}`);
    app.use(`/api/v${version}/${path.split('.').slice(0, -1).join('.')}`, route);
}
app.listen(process.env.PORT || 3000, () => {
    console.log(`Server is running on port ${process.env.PORT || 3000}`);
});
