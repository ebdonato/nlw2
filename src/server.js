const port = 5000
const address = `http://localhost:${port}`

const proffys = [
    {
        name: "Diego Fernandes",
        avatar: "https://avatars2.githubusercontent.com/u/2254731?s=460&amp;u=0ba16a79456c2f250e7579cb388fa18c5c2d7d65&amp;v=4",
        whatsapp: "9898899998",
        bio: "Entusiasta das melhores tecnologias de química avançada.<br><br>Apaixonado por explodir coisas em laboratório e por mudar a vida das pessoas através de experiências. Mais de 200.000 pessoas já passaram por uma das minhas explosões.",
        subject: "0",
        cost: 20,
        weekday: [0],
        time_from: [720],
        time_to: [1220]
    },
    {
        name: "Fulano de Tal",
        avatar: "http://2.gravatar.com/avatar/95436a1e6147f1668b10d37547f7e930",
        whatsapp: "9898899998",
        bio: "Entusiasta das melhores tecnologias de química avançada.<br><br>Apaixonado por explodir coisas em laboratório e por mudar a vida das pessoas através de experiências. Mais de 200.000 pessoas já passaram por uma das minhas explosões.",
        subject: "9",
        cost: 30,
        weekday: [1],
        time_from: [720],
        time_to: [1220]
    }
]

const subjects = [
    "Artes",
    "Biologia",
    "Ciências",
    "Educação física",
    "Física",
    "Geografia",
    "História",
    "Matemática",
    "Português",
    "Química"
]

const weekdays = [
    "Domingo",
    "Segunda-feira",
    "Terça-feira",
    "Quarta-feira",
    "Quinta-feira",
    "Sexta-feira",
    "Sábado"
]

function pageToLoad(fileName, context) {
    //return (req,res) => res.sendFile(__dirname + `/views/${fileName}`)
    return (req,res) => {
        if (context) {
            context.query = req.query
        }

        return res.render(fileName + ".html", context)}
}

function pageReceiveData(fileName, context, redirect) {
    return (req,res) => {
        const data = req.query

        if(!Object.keys(data).length == 0) {
            proffys.push(data)
            if (redirect) {
                return res.redirect(redirect)
            }
        }

        return res.render(fileName + ".html", context)}
}

const express = require('express')
const server = express()

const nunjucks = require('nunjucks')

nunjucks.configure('src/views', {
    express: server,
    noCache: true
})

server.use(express.static("public"))
    .get("/", pageToLoad("index"))
    .get("/study", pageToLoad("study", { proffys, subjects, weekdays }))
    .get("/give-classes", pageReceiveData("give-classes", { subjects, weekdays }, "study"))
    .listen(5000)

console.log(address)
