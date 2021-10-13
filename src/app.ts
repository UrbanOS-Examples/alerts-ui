import express from 'express';
const app = express();

app.get('/healthcheck', function (req, res) {
    res.send('Healthy');
});

export default app;
