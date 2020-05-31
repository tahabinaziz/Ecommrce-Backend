const mongoose = require('mongoose');

/*************** */
/*Product Model*/
/*************** */
const productSchema = mongoose.Schema({
     _id: mongoose.Schema.Types.ObjectId,    
     title:{type:String},
     price:{type:String},
     details:{type:String},
     image:{type:String},
     productId:{type:Number},
         
  },{versionKey:false})
  exports.Products = mongoose.model('Products',productSchema);

  

