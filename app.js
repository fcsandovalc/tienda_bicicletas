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

let biciletas = [
    { id: 1, marca: "Trek", modelo: "jaja1", precio: 900, disponible: true},
    { id: 2, marca: "Giant", modelo: "C4", precio: 800, disponible: true},
    { id: 3, marca: "Trek", modelo: "Abc3", precio: 1200, disponible: false}  
]

app.get("/", (req, res) => {
    res.render('formularios', {titulo: "Gestion de Bicicletas"})
})

app.listen(PORT, ()=> {
    console.log(`Servidor corriendo en http://localhost:${PORT}`)
})