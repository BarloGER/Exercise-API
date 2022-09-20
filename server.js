require("dotenv").config();

const express = require("express");
const cors = require("cors");
const app = express();
const pool = require("./db");
const { DateTime } = require("luxon");

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
    return res
      .status(400)
      .send("Please fill in your first name, last name and age");
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

app.post("/orders", async (req, res) => {
  const { price, userId } = req.body;
  const date = DateTime.now();
  if (!price || !date || !userId) {
    return res.status(400).send("Please fill in price, date and user ID");
  }
  try {
    const {
      rows: [createdOrder],
    } = await pool.query(
      "INSERT INTO orders(price, date, user_id) VALUES($1, $2, $3) RETURNING *;",
      [price, date, userId]
    );
    return res.status(201).send(createdOrder);
  } catch (err) {
    console.log(err);
    return res.status(500).send("Something went wrong");
  }
});

app.put("/orders/:id", async (req, res) => {
  const { id } = req.params;
  const { price, userId } = req.body;
  const date = DateTime.now();

  if (!price || !date || !userId)
    return res
      .status(400)
      .send("Please provide values for price, date and user ID");

  try {
    const {
      rowCount,
      rows: [updatedOrder],
    } = await pool.query(
      "UPDATE orders SET price=$1, date=$2, user_id=$3 WHERE id=$4 RETURNING *",
      [price, date, userId, id]
    );

    if (!rowCount)
      return res
        .status(404)
        .send(
          `The order with id ${id} that you are trying to update does not exist`
        );

    return res.status(201).send(updatedOrder);
  } catch (err) {
    console.log(err);
    return res.status(500).send("Something went wrong");
  }
});

app.delete("/orders/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const {
      rows: [deletedOrder],
      rowCount,
    } = await pool.query("DELETE FROM orders WHERE id=$1 RETURNING *", [id]);

    if (!rowCount)
      return res
        .status(404)
        .send(
          `The order with id ${id} that you are trying to delete does not exist`
        );

    return res
      .status(200)
      .send(`The order "${deletedOrder.id}" has been deleted`);
  } catch (err) {
    console.log(err);
    return res.status(500).send("Something went wrong");
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
