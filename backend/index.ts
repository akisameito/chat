import express from 'express'

const app: express.Express = express()
const path = require('path');
const port = process.env.PORT || 3001;

app.use(express.static(path.join(__dirname, '../frontend/build')));

app.get("/api", (req: express.Request, res: express.Response) => {
    res.json({ message: "Hello World!" });
});

app.get('*', (req: express.Request, res: express.Response) => {
    res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
});

app.listen(port, () => {
    console.log(`listening on *:${port}`);
})
