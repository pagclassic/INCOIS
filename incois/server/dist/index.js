"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = __importDefault(require("dotenv"));
const reports_1 = __importDefault(require("./routes/reports"));
const social_1 = __importDefault(require("./routes/social"));
const hotspots_1 = __importDefault(require("./routes/hotspots"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json({ limit: '10mb' }));
app.use((0, morgan_1.default)('dev'));
app.get('/health', (_req, res) => res.json({ ok: true }));
app.use('/api/reports', reports_1.default);
app.use('/api/social', social_1.default);
app.use('/api/hotspots', hotspots_1.default);
const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`API listening on :${port}`);
});
