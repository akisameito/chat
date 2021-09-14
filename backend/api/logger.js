module.exports = function (req, res, next) {
    // ipアドレス
    var ipaddress = req.headers["x-forwarded-for"] ||
        req.connection.remoteAddress ||
        (req.socket && req.socket.remoteAddress) ||
        (req.connection.socket && req.connection.socket.remoteAddress) ||
        "0.0.0.0";
    // 日付
    var date = (new Date()).toISOString();
    // リクエストメソッド
    var method = req.method;
    // リクエストURL
    var url = req.url;
    // リクエストユーザーーエージェント
    var ua = req.headers["user-agent"];
    // ログ出力
    console.log(`${ipaddress} [${date}] "${method} ${url}" - ${ua}`);
    // 次のミドルウェアを呼ぶ
    next();
};