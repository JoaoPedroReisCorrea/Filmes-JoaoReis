import express, { response } from "express"
import mysql2 from "mysql2"

const app = express()

app.use(express.json())

const database = mysql2.createPool({
    host: "benserverplex.ddns.net",
    user: "alunos",
    password: "senhaAlunos",
    database: "filmes_JoãoReis"
})

app.get("/all-filmes", (request, response) => {
    const selectCommand = "SELECT * FROM filmes_JoaoReis"

    database.query(selectCommand, (error, data) => {
        if (error) {
            console.log(error)
            return
        }

        response.json(data)
    })
})

app.get("/active-tasks", (request, response) => {
    const selectCommand = "SELECT * FROM filmes_JoaoReis WHERE status = 0"

    database.query(selectCommand, (error, data) => {
        if (error) {
            console.log(error)
            return
        }

        response.json(data)
    })
})

app.get("/completed-tasks", (request, response) => {
    const selectCommand = "SELECT * FROM filmes_JoaoReis WHERE status = 1"

    database.query(selectCommand, (error, data) => {
        if (error) {
            console.log(error)
            return
        }

        response.json(data)
    })
})

app.post("/create-list", (request, response) => {
    const { description, status } = request.body

    const insertCommand = "INSERT INTO filmes_JoaoReis(description, status) VALUES (?, ?)"

    database.query(insertCommand, [description, status], (error) => {
        if(error) {
            console.log(error)
        } else {
            response.status(201).json({
                message: "Tarefa criada com sucesso!"
            })
        }
    })
})

app.delete("/delete-list/:id", (request, response) => {
    const { id }  = request.params

    const deleteCommand = "DELETE FROM filmes_JoaoReis WHERE id=?"

    database.query(deleteCommand, [id], (error) => {
        if(error) {
            console.log(error)
        } else {
            response.json({
                message: "Tarefa apagada com sucesso!"
            })
        }
    })
})

app.put("/update-task/:id", async (request, response) => {
    const { id } = request.params

    const selectTaskCommand = "SELECT * FROM filmes_JoaoReis"

    const task = await database.promise().query(selectTaskCommand, [id], (error, data) => {
        if (error) {
            console.log(error)
            return
        }

        return data
    })

    const updateCommand = "UPDATE filmes_JoaoReis SET status = ? WHERE id = ?"

    database.query(updateCommand, [task[0][0].status ? 0 : 1, id], (error,data) => {
        if (error) {
            console.log(error)
            return
        }else {
            response.json({
                message: "Tarefa atualizada com sucesso!"
            })
        }
        
    })
})

app.listen(8080, () => {
    console.log("Servidor rodando na porta 8080")
})