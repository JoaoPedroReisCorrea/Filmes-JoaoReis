import express from "express"
import mysql2 from "mysql2"
import cors from "cors"

const app = express()

app.use(express.json())
app.use(cors())

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
            return response.status(500).json(error)
        }

        response.json(data)
    })
})

app.post("/create-list", (request, response) => {
    const {
        titulo,
        genero,
        duracao,
        classificacao_etaria
    } = request.body

    const insertCommand = `
        INSERT INTO filmes_JoaoReis
        (titulo, genero, duracao, classificacao_etaria)
        VALUES (?, ?, ?, ?)
    `

    database.query(
        insertCommand,
        [titulo, genero, duracao, classificacao_etaria],
        (error) => {
            if (error) {
                console.log(error)
                return response.status(500).json(error)
            }

            response.status(201).json({
                message: "Filme inserido com sucesso!"
            })
        }
    )
})

app.put("/edit-filme/:id", (request, response) => {
    const { id } = request.params
    const { titulo, genero, duracao, classificacao_etaria } = request.body

    const updateCommand = `
        UPDATE filmes_JoaoReis
        SET titulo = ?, genero = ?, duracao = ?, classificacao_etaria = ?
        WHERE id = ?
    `

    database.query(updateCommand, [titulo, genero, duracao, classificacao_etaria, id], (error) => {
        if (error) {
            console.log(error)
            return response.status(500).json(error)
        }

        response.json({
            message: "Filme editado com sucesso!"
        })
    })
})

app.delete("/delete-list/:id", (request, response) => {
    const { id } = request.params

    const deleteCommand = "DELETE FROM filmes_JoaoReis WHERE id = ?"

    database.query(deleteCommand, [id], (error) => {
        if (error) {
            console.log(error)
            return response.status(500).json(error)
        }

        response.json({
            message: "Filme apagado com sucesso!"
        })
    })
})

app.listen(8080, () => {
    console.log("Servidor rodando na porta 8080")
})