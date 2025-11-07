import express from "express";
import cors from "cors";
import mysql from "mysql2/promise";

const app = express();
app.use(express.json());
app.use(cors());

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "senai",
  database: "biblioteca",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});


app.get("/", (req, res) => {
  res.send("API da BiblioFile rodando!");
});


app.get("/livros", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM livros");
    res.json(rows);
  } catch (error) {
    console.error("Erro ao buscar livros:", error);
    res.status(500).json({ erro: error.message });
  }
});


app.get("/livros/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query("SELECT * FROM livros WHERE id = ?", [id]);
    if (rows.length === 0) {
      return res.status(404).json({ erro: "Livro não encontrado" });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error("Erro ao buscar livro:", error);
    res.status(500).json({ erro: error.message });
  }
});


app.post("/livros", async (req, res) => {
  try {
    const { titulo, autor, genero, paginas, avaliacao } = req.body;

    if (!titulo || !autor) {
      return res.status(400).json({ erro: "Título e autor são obrigatórios" });
    }


    await pool.query(
      "INSERT INTO livros (titulo, autor, genero, paginas, avaliacao) VALUES (?, ?, ?, ?, ?)",
      [titulo, autor, genero, paginas, avaliacao]
    );

    res.status(201).json({ mensagem: "Livro adicionado com sucesso!" });
  } catch (error) {
    console.error("Erro ao cadastrar livro:", error);
    res.status(500).json({ erro: error });
  }
});


app.put("/livros/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, autor, genero, paginas, avaliacao } = req.body;

    const [result] = await pool.query(
      "UPDATE livros SET titulo=?, autor=?, genero=?, paginas=?, avaliacao=? WHERE id=?",
      [titulo, autor, genero, paginas, avaliacao, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ erro: "Livro não encontrado" });
    }

    res.json({ mensagem: "Livro atualizado com sucesso!" });
  } catch (error) {
    console.error("Erro ao atualizar livro:", error);
    res.status(500).json({ erro: error.message });
  }
});

app.delete("/livros/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query("DELETE FROM livros WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ erro: "Livro não encontrado" });
    }

    res.json({ mensagem: " Livro deletado com sucesso!" });
  } catch (error) {
    console.error("Erro ao deletar livro:", error);
    res.status(500).json({ erro: error.message });
  }
});


app.listen(3000, () =>
  console.log("Servidor rodando em http://localhost:3000")
);
