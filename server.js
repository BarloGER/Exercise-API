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