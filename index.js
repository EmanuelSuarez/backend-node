const express = require('express');
const contenedor = require('./contenedor');
const { Router } = express;

const app = express();
const router = Router();

app.use(express.json())
app.use(express.urlencoded({extended: true}))

const PORT = 8080;

const server = app.listen(PORT, () => {
    console.log(`HTTP server listening on port: ${PORT}`);
});
server.on('error', err => console.log(`server error: ${err}`));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/static', express.static(__dirname + '/public'));

router.get('/productos', (req, res) => {
    return contenedor.getAll(req, res)
 })

router.get('/productos/:id', (req, res) => {
    return contenedor.getById(req, res)
 })

router.post('/productos', (req, res) => {
    return contenedor.save(req, res)
 })

router.put("/productos/:id", (req, res) => {
    return contenedor.edit(req, res)
})

router.delete("/productos/:id", (req, res) => {
    return contenedor.deleteById(req, res)
})

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

app.use('/api', router);