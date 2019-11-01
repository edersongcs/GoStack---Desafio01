const express = require('express');

const app = express();

app.use(express.json());

const projetos = [];
let cont = 1;

// Middleware Global - Contabiliza a quantidade de requisições realizadas
app.use((req, res, next) => {
  console.log(`Numero de Requisições: ${cont++}`); // Informa no terminal a quantidade de requisições feitas
  
  return next(); // Prosegue a execução do codigo
});

// Middleware Local - Verifica se o Projeto informado existe
function checkProjectExists (req, res, next) {
  const { id } = req.params; // Seleciona o ID informado na URL ...3333/projects/0
  const projeto = projetos.find(p => p.id == id); // Procura no array o ID informado

  if(!projeto) { // Se não encontrar o ID informado retorna Bad Request e mensagem de erro.
    return res.status(400).json({ error: 'Projeto informado não existe'});
  }
  return next(); // Prosegue a execução do codigo
}

// Create New Projects
app.post('/projects', (req, res) => {
  const { id, title } = req.body; // Pega o id e o titulo informado no corpo

  const projeto = {
    id,
    title,
    tasks: []
  };

  projetos.push(projeto);

  return res.json(projeto);
})

// Read All Projects
app.get('/projects', (req, res) => {
  return res.json(projetos); // Retorna a array
})

// Update Projects
app.put('/projects/:id', checkProjectExists, (req, res) => {
  const { id } = req.params; // Seleciona o ID informado na URL ...3333/projects/0
  const { title } = req.body; // Pega o titulo informado no corpo

  const projeto = projetos.find(p => p.id == id); // Procura no array o ID informado

  projeto.title = title; // Substitui o titulo anterior pelo novo titulo

  return res.json(projeto); // Retorna a array atualizada
})

// Delete Projects
app.delete('/projects/:id', checkProjectExists, (req, res) => {
  const { id } = req.params; // Seleciona o ID informado na URL ...3333/projects/0

  const projetoIndex = projetos.findIndex(p => p.id == id); // Busca no array se o ID informado existe

  projetos.splice(projetoIndex, 1); // Deleta o ID informado

  return res.send();
})

// Create New Tasks
app.post('/projects/:id/tasks', checkProjectExists, (req, res) => {
  const { id } = req.params; // Seleciona o ID informado na URL ...3333/projects/0
  const { title } = req.body; // Pega a tarefa informada no corpo

  const projeto = projetos.find(p => p.id == id); // Busca no array se o ID informado existe

  projeto.tasks.push(title); // Inseri a tarefa no projeto selecionado

  return res.json(projeto); // Retorna a array atualizada
})

app.listen(3333);
