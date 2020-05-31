const express = require('express');
const app =express();
var cors = require('cors')
const bodyParser = require('body-parser');
const connectDB = require('./DB/Connection')
connectDB();
const port = process.env.Port || 5000;

app.use(cors())

const Product = require('./Product/route');
const Purchase = require('./PurchaseRecord/Route');
app.use(bodyParser.json())

app.use('/Products',Product);

app.use('/Purchase',Purchase);


app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
})

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({

        error: {
            message: error.message
        }
    });
});

app.listen(port,()=> console.log("Server Started"));
module.exports = app;