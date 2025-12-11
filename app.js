const express = require("express")
const exphbs = require("express-handlebars")
const path = require("path")

const app = express()
const PORT = 3000

app.engine("handlebars", exphbs.engine({partialsDir: 'views/partials'}))
app.set("view engine", "handlebars")
app.set("views", path.join(__dirname, "views"))

//Necesitamos pasar la info a Json

app.use(express.json())
app.use(express.urlencoded({extended: true}))

//Poner a disposicion public

app.use(express.static(path.join(__dirname, "public")))

let bicicletas = [
    { id: 1, marca: "Trek", modelo: "jaja1", precio: 900, disponible: true},
    { id: 2, marca: "Giant", modelo: "C4", precio: 800, disponible: true},
    { id: 3, marca: "Trek", modelo: "Abc3", precio: 1200, disponible: false}  
]

app.get("/", (req, res) => {
    res.render('formularios', {titulo: "Gestion de Bicicletas"})
})

app.get("/bicicletas", (req, res) => {
    res.render("bicicletas", {titulo: "Listado de Bicicletas", bicicletas})
})

app.get("/bicicletas/:id", (req, res) => {
    const bicicleta = bicicletas.find(b => b.id == req.params.id)
    if(!bicicleta) return res.send("La bicicleta no ha sido encontrada")
    res.render("bicicleta", {titulo: "Detalle de Bicicleta", bicicleta})
})

app.get("/agregar-get", (req, res) => {
    const {marca, modelo, precio} = req.query
    if(marca && modelo && precio) {
        const biciNueva = {
            id: bicicletas.length + 1,
            marca,
            modelo,
            precio: Number(precio),
            disponible: true
        }
        bicicletas.push(biciNueva)
    }
    res.redirect("/bicicletas")
})

app.listen(PORT, ()=> {
    console.log(`Servidor corriendo en http://localhost:${PORT}`)
})