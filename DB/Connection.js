const mongoose = require('mongoose');

const URI = "mongodb+srv://ecommerce:ecommerce@123@ecommerce-du2dp.mongodb.net/test?retryWrites=true&w=majority"

const connectDB= async ()=>{
    await mongoose.connect(URI,{
        useUnifiedTopology:true,
        useNewUrlParser:true
    });
    console.log('db connected...!')
}



module.exports = connectDB;