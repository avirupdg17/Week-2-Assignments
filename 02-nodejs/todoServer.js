/**
  You need to create an express HTTP server in Node.js which will handle the logic of a todo list app.
  - Don't use any database, just store all the data in an array to store the todo list data (in-memory)
  - Hard todo: Try to save responses in files, so that even if u exit the app and run it again, the data remains (similar to databases)

  Each todo has a title and a description. The title is a string and the description is a string.
  Each todo should also get an unique autogenerated id every time it is created
  The expected API endpoints are defined below,
  1.GET /todos - Retrieve all todo items
    Description: Returns a list of all todo items.
    Response: 200 OK with an array of todo items in JSON format.
    Example: GET http://localhost:3000/todos
    
  2.GET /todos/:id - Retrieve a specific todo item by ID
    Description: Returns a specific todo item identified by its ID.
    Response: 200 OK with the todo item in JSON format if found, or 404 Not Found if not found.
    Example: GET http://localhost:3000/todos/123
    
  3. POST /todos - Create a new todo item
    Description: Creates a new todo item.
    Request Body: JSON object representing the todo item.
    Response: 201 Created with the ID of the created todo item in JSON format. eg: {id: 1}
    Example: POST http://localhost:3000/todos
    Request Body: { "title": "Buy groceries", "completed": false, description: "I should buy groceries" }
    
  4. PUT /todos/:id - Update an existing todo item by ID
    Description: Updates an existing todo item identified by its ID.
    Request Body: JSON object representing the updated todo item.
    Response: 200 OK if the todo item was found and updated, or 404 Not Found if not found.
    Example: PUT http://localhost:3000/todos/123
    Request Body: { "title": "Buy groceries", "completed": true }
    
  5. DELETE /todos/:id - Delete a todo item by ID
    Description: Deletes a todo item identified by its ID.
    Response: 200 OK if the todo item was found and deleted, or 404 Not Found if not found.
    Example: DELETE http://localhost:3000/todos/123

    - For any other route not defined in the server return 404

  Testing the server - run `npm run test-todoServer` command in terminal
 */
const express = require("express");
const { v4: uuidv4 } = require("uuid");
const bodyParser = require("body-parser");
const fs = require("fs");
const PORT = 3000;
const app = express();

app.use(bodyParser.json());
app.listen(PORT);
let todos = [];
app.get("/todos", (req, res) => {
  console.log("new call");
  if (todos.length == 0) {
    console.log("i am here");
    fs.readFile("todos.json", "utf-8", (err, data) => {
      if (err) throw err;
      todos = JSON.parse(data);
      console.log(todos);
      res.json(todos);
    });
  } else {
    res.json(todos);
  }
});

app.get("/todos/:id", (req, res) => {
  if (todos.length == 0) {
    console.log("i am here");
    fs.readFile("todos.json", "utf-8", (err, data) => {
      if (err) throw err;
      todos = JSON.parse(data);
    });
  }
  let filteredTodo = todos.find((todo) => todo.id == req.params.id);
  if (filteredTodo) res.json({ ...filteredTodo });
  else res.sendStatus(404);
});

app.post("/todos", (req, res) => {
  fs.readFile("todos.json", "utf-8", (err, data) => {
    if (err) throw err;
    todos = data ? JSON.parse(data) : [];
    const uniqueId = uuidv4();
    todos.push({ ...req.body, id: uniqueId });
    fs.writeFile("todos.json", JSON.stringify(todos), (err) => {
      if (err) throw err;
      res.json(uniqueId);
    });
  });
});

app.put("/todos/:id", (req, res) => {
  fs.readFile("todos.json", "utf-8", (err, data) => {
    if (err) throw err;
    if (data) {
      let index = JSON.parse(data).findIndex(
        (todo) => todo.id == req.params.id
      );
      if (index >= 0) {
        for (let key in req.body) {
          todos[index][key] = req.body[key];
        }
        fs.writeFile("todos.json", JSON.stringify(todos), (err) => {
          if (err) throw err;
          res.sendStatus(200);
        });
      } else res.sendStatus(404);
    } else res.sendStatus(404);
  });
});
app.delete("/todos/:id", (req, res) => {
  fs.readFile("todos.json", "utf-8", (err, data) => {
    if (err) throw err;
    if (data) {
      let index = JSON.parse(data).findIndex(
        (todo) => todo.id == req.params.id
      );
      if (index >= 0) {
        todos.splice(filteredTodoIndex, 1);
      }
      fs.writeFile("todos.json", JSON.stringify(todos), (err) => {
        if (err) throw err;
        res.sendStatus(200);
      });
    } else res.sendStatus(404);
  });
});
module.exports = app;
