CREATE DATABASE biblioteca;
USE biblioteca;

CREATE TABLE livros (
  id INT PRIMARY KEY AUTO_INCREMENT,
  titulo VARCHAR(100),
  autor VARCHAR(100),
  genero VARCHAR(50),
  paginas INT,
  avaliacao DECIMAL(2,1)
);


SELECT * FROM livros;