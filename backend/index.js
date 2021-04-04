"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var app = express_1.default();
var path = require('path');
var port = process.env.PORT || 3001;
app.use(express_1.default.static(path.join(__dirname, '../frontend/build')));
app.get("/api", function (req, res) {
    res.json({ message: "Hello World!" });
});
app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
});
app.listen(port, function () {
    console.log("listening on *:" + port);
});
