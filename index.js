import express, { response } from "express"
import mysql2 from "mysql2"

const app = express()

app.use(express.json())

const database = mysql2.createPool({
    host: "benserverplex.ddns.net",
    user: "alunos",
    password: "senhaAlunos",
    database: "alunos_filmes_03MA"
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

app.post("/create-list", (request, response) => {
    const { description, status } = request.body

    const insertCommand = "INSERT INTO filmes_JoaoReis(description, status) VALUES (?, ?)"

    database.query(insertCommand, [description, status], (error) => {
        if(error) {
            console.log(error)
        } else {
            response.status(201).json({
                message: "Filme inserido com sucesso!"
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

app.listen(8080, () => {
    console.log("Servidor rodando na porta 8080")
})