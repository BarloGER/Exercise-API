require("dotenv").config();

const express = require("express");
const cors = require("cors");
const app = express();
const pool = require("./db");

const PORT = process.env.PORT || 8080;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());


app.get("/users", async (req, res) => {
    try {
        const { rows } = await pool.query("SELECT * FROM users");
        console.log(rows);
        res.json(rows);
    } catch (err) {
      console.log(err);
    }
});


app.get("/users/:id", async (req, res) => {
    const { id } = req.params;

    try {
      const {
        rows: [user],
        rowCount,
      } = await pool.query(`SELECT * FROM users WHERE id=$1;`, [id]);
  
      if (!rowCount) {
        return res.status(404).send(`The user with the id ${id} does not exist`);
      }
      console.log("user by id", user);
      return res.status(200).send(user);
    } catch (err) {
      console.log(err);
    }
});


app.post("/users", async (req, res) => {
    const { firstName, lastName, age } = req.body;

    if (!firstName || !lastName || !age) {
        return res.status(400).send("Please fill in your first name, last name and age");
}
    try {
        const {
        rows: [createdUser],
        } = await pool.query(
        "INSERT INTO users(first_name, last_name, age) VALUES($1, $2, $3) RETURNING *;",
        [firstName, lastName, age]
        );
        return res.status(201).send(createdUser);
    } catch (err) {
        console.log(err);
        return res.status(500).send("Something went wrong");
    }
});


app.put("/users/:id", async (req, res) => {
    const { id } = req.params;

    const { firstName, lastName, age } = req.body;

    if (!firstName || !lastName || !age)
    return res
        .status(400)
        .send("Please provide values for first name, last name, age");

    try {
    const {
        rowCount,
        rows: [updatedUser],
    } = await pool.query(
        "UPDATE users SET first_name=$1,last_name=$2,age=$3 WHERE id=$4 RETURNING *",
        [firstName, lastName, age, id]
    );

    if (!rowCount)
        return res
        .status(404)
        .send(
            `The user with id ${id} that you are trying to update does not exist`
        );

    return res.status(201).send(updatedUser);
    } catch (err) {
        console.log(err);
        return res.status(500).send("Something went wrong");
    }
});


app.delete("/users/:id", async (req, res) => {
    const { id } = req.params;
    
    try {
        const {
        rows: [deletedUser],
        rowCount,
        } = await pool.query("DELETE FROM users WHERE id=$1 RETURNING *", [id]);
    
        if (!rowCount)
        return res
            .status(404)
            .send(
            `The user with id ${id} that you are trying to delete does not exist`
            );
    
        return res
        .status(200)
        .send(`The user "${deletedUser.name}" has been deleted`);
    } catch (err) {
        console.log(err);
        return res.status(500).send("Something went wrong");
    }
});




app.get("/orders", async (req, res) => {
    try {
        const { rows } = await pool.query("SELECT * FROM orders");
        console.log(rows);
        res.json(rows);
    } catch (err) {
        console.log(err);
    }
});
    

app.get("/orders/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const {
        rows: [order],
        rowCount,
        } = await pool.query(`SELECT * FROM orders WHERE id=$1;`, [id]);
    
        if (!rowCount) {
        return res.status(404).send(`The order with the id ${id} does not exist`);
        }
        console.log("order by id", order);
        return res.status(200).send(order);
    } catch (err) {
        console.log(err);
    }
});


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });