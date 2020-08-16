const port = 5000
const address = `http://localhost:${port}`
const { subjects, weekdays, convertHoursToMinutes } = require("./utils/format")
const database = require('./database/db')

// TODO: Por alguma razão está sempre returnando Proffys, mesmo quando não há buscas

function pageToLoad(fileName, context) {
    return async (req, res) => {
        if (context) {
            context.query = req.query
        }

        if (!req.query.subject || !req.query.weekday || !req.query.time) {
            return res.render(fileName + ".html", context)
        } else {
            const timeToMinute = convertHoursToMinutes(req.query.time)

            const sqlQuery = `
            SELECT classes.*, proffys.*
            FROM proffys
            JOIN classes ON (classes.proffy_id = proffys.id)
            WHERE EXISTS (
                SELECT class_schedules.*
                FROM class_schedules
                WHERE class_schedules.class_id = classes.id
                AND class_schedules.weekday = ${req.query.weekday}
                AND class_schedules.time_from <= ${timeToMinute}
                AND class_schedules.time_to > ${timeToMinute}
                )
                And classes.subject = ${req.query.subject}
                `

            try {
                const db = await database

                context.proffys = await db.all(sqlQuery)

                console.log(context.query)

            } catch (error) {
                console.log(error)
            }

            return res.render(fileName + ".html", context)
        }
    }
}

function saveClasses(redirect) {
    return async (req, res) => {
        const data = req.body

        const createProffy = require('./database/createProffy')

        const proffyValue = {
            name: data.name,
            avatar: data.avatar,
            whatsapp: data.whatsapp,
            bio: data.bio
        }

        const classValue = {
            subject: data.subject,
            cost: data.cost,
            //proffy_id
        }

        const classScheduleValues = data.weekday.map((weekday, index) => {
            return {
                weekday,
                time_from: convertHoursToMinutes(data.time_from[index]),
                time_to: convertHoursToMinutes(data.time_to[index])
                //class_id

            }
        })

        try {
            const db = await database
            await createProffy(db, { proffyValue, classValue, classScheduleValues })
            const filterString =
                `?subject=${data.subject}&weekday=${data.weekday[0]}&time=${data.time_from[0]}`
            return res.redirect(redirect + filterString)
        } catch (error) {
            console.log(error)
            return res.redirect("/")
        }

    }
}

const express = require('express')
const server = express()

const nunjucks = require('nunjucks')

nunjucks.configure('src/views', {
    express: server,
    noCache: true
})

server
    .use(express.static("public"))
    .use(express.urlencoded({ extended: true }))
    .get("/", pageToLoad("index"))
    .get("/study", pageToLoad("study", { subjects, weekdays }))
    .get("/give-classes", pageToLoad("give-classes", { subjects, weekdays }))
    .post("/save-classes", saveClasses("study"))
    .listen(5000)

console.log(address)
