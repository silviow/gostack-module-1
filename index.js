const express = require("express");

const server = express();

server.use(express.json());

const users = ["Silvio", "Cláudio", "Victor"];

server.use((req, res, next) => {
    console.time("Execution time")
    const date = new Date();
    console.log(`Method: ${req.method} \nURL: ${req.url} \nDate: ${date.toDateString() + " " + date.toLocaleDateString()}`);

    next();

    console.timeEnd("Execution time")
    console.log("=-=-=-=-=-==-=-=-=-=-==-=-=-=-=-=");
});

function userHasBeenInformed(req, res, next) {
    if (!req.body.name) {
        return res.status(400).json({ error: "User name is required"});
    }

    return next();
}

function userExists(req, res, next) {
    const user = users[req.params.index];

    if (!user) {
        return res.status(400).json({ error: "User does not exists"});
    }

    req.user = user;

    return next();
}

server.get("/users", (req, res) => {
    return res.json(users);
});

server.get("/users/:index", userExists, (req, res) => {
    // const { index } = req.params;
    // return res.json(users[index]);
    // the code above can be replaced by the one below because middleware "userExists" informed "user" in the request
    return res.json(req.user);
})

server.post("/users", userHasBeenInformed, (req, res) => {
    const { name } = req.body;

    users.push(name);

    return res.json(users);
});

server.put("/users/:index", userHasBeenInformed, userExists, (req, res) => {
    const { index } = req.params;
    const { name } = req.body;

    users[index] = name;

    return res.json(users);
});

server.delete("/users/:index", userExists, (req, res) => {
    const { index } = req.params;

    users.splice(index, 1);

    return res.send();
});

server.listen(3000);