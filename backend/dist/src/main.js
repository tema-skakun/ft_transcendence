"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const app_module_1 = require("./modules/app/app.module");
const cookieParser = require("cookie-parser");
const cors = require("cors");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, { cors: true });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
    }));
    app.use(cookieParser());
    app.use(cors((req, callback) => {
        const origin = req.headers.origin;
        callback(null, { origin: origin, credentials: true });
    }));
    await app.listen(6969, '0.0.0.0');
}
bootstrap();
//# sourceMappingURL=main.js.map