const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const porta = process.env.PORTA || 3001;
const uri_conexao = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const nome_db = 'livros';

app.use(
    cors()
);
app.use(express.json());

// async function obterColecao(nomeColecao) {
//     const cliente = new MongoClient(uri_conexao);
//     await cliente.connect();
//     const bancoDados = cliente.db(nome_db);
//     return { colecao: bancoDados.collection(nomeColecao), cliente };
// }

// Início - rotas
app.get("/livro/:pagina", async (req, res) => {
    const pagina = parseInt(req.params.pagina);
    const pular = (pagina - 1) * 10;
    const cliente = new MongoClient(uri_conexao);
    try {
        //conexao
        await cliente.connect();
        const bancoDados = await cliente.db(nome_db);
        const colecao = await bancoDados.collection('livro');
        //fim
        // const { colecao, cliente } = await obterColecao('livro');
        const livro = await colecao.find({}).skip(pular).limit(10).toArray();
        return res.json(livro);
    } catch (erro) {
        console.error("Ocorreu um erro ao buscar os dados dos livros: ", erro);
        res.status(500).json({ mensagem: `Ocorreu um erro ao buscar os dados dos livros: ${erro}` });
    }finally{
        await cliente.close();
    }
});

app.get("/quantidade", async (req, res) => {
    try {
        const cliente = new MongoClient(uri_conexao);
        await cliente.connect();
        const bancoDados = await cliente.db(nome_db);
        const colecao = await bancoDados.collection('livro');
        // const { colecao, cliente } = await obterColecao('livro');
        const quantidade = await colecao.countDocuments();
        await cliente.close();
        res.json({ quantidade });
    } catch (erro) {
        console.error("Ocorreu um erro ao contar os livros: ", erro);
        res.status(500).json({ mensagem: `Ocorreu um erro ao contar os livros: ${erro}` });
    }
});

// Fim - rotas

app.listen(porta, () => {
    console.log(`Servidor rodando na porta ${porta}`);
});
