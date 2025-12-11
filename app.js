const express = require("express")
const exphbs = require("express-handlebars")
const path = require("path")

const app = express()
const PORT = 3000

const helpers = {
    capitalize: (texto) => {
        if(!texto) return ''
        return texto.toLowerCase().split(' ').map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(' ')
    }
}

app.engine("handlebars", exphbs.engine({ partialsDir: path.join(__dirname,'views/partials'), helpers}))
app.set("view engine", "handlebars")
app.set("views", path.join(__dirname, "views"))

//Necesitamos pasar la info a Json

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

//Poner a disposicion public

app.use(express.static(path.join(__dirname, "public")))

let bicicletas = [
    { id: 1, marca: "Trek", modelo: "jaja1", precio: 900, disponible: true },
    { id: 2, marca: "Giant", modelo: "C4", precio: 800, disponible: true },
    { id: 3, marca: "Trek", modelo: "Abc3", precio: 1200, disponible: false }
]

app.get("/", (req, res) => {
    res.render('formularios', { titulo: "Gestion de Bicicletas" })
})

app.get("/bicicletas", (req, res) => {
    const success = req.query.success === 'true'
    res.render("bicicletas", { titulo: "Listado de Bicicletas", bicicletas, success})
})

app.get("/bicicletas/:id", (req, res) => {
    const bicicleta = bicicletas.find(b => b.id == req.params.id)
    if (!bicicleta) return res.send("La bicicleta no ha sido encontrada")
    res.render("bicicleta", { titulo: "Detalle de Bicicleta", bicicleta })
})

app.get("/buscar", (req, res) => {
    const q = req.query.q?.toLowerCase() || ""
    const resultados = bicicletas.filter(b => b.marca.toLowerCase().includes(q) || b.modelo.toLowerCase().includes(q))
    res.render("bicicletas", { titulo: `Resultados para "${q}"`, bicicletas: resultados })

})

//generar datos
app.get("/agregar-get", (req, res) => {
     try {
        const { marca, modelo, precio } = req.query
        if (!marca || !modelo || !precio) {
            return res.status(400).send("Faltan datos para crear la bicicleta")
        }
        const biciNueva = {
            id: bicicletas.length + 1,
            marca,
            modelo,
            precio: Number(precio),
            disponible: true
        }
        bicicletas.push(biciNueva)
        console.log(`Bicicleta ${biciNueva.marca} ${biciNueva.modelo}, ha sido creada exitosamente.`)

        res.redirect("/bicicletas?success=true")
    } catch (error) {
        console.error("Error al crear la bicicleta", error)
        res.status(500).send("Error interno del servidor.")
    }
})

//para agregar mas cantidad de datos, y enviar datos mas sensibles que no se puede usar el url
app.post("/agregar-post", (req, res) => {
    try {
        const { marca, modelo, precio } = req.body
        if (!marca || !modelo || !precio) {
            return res.status(400).send("Faltan datos para crear la bicicleta")
        }
        const biciNueva = {
            id: bicicletas.length + 1,
            marca,
            modelo,
            precio: Number(precio),
            disponible: true
        }
        bicicletas.push(biciNueva)
        console.log(`Bicicleta ${biciNueva.marca} ${biciNueva.modelo}, ha sido creada exitosamente.`)

        res.redirect("/bicicletas?success=true")
    } catch (error) {
        console.error("Error al crear la bicicleta", error)
        res.status(500).send("Error interno del servidor.")
    }


})

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`)
})