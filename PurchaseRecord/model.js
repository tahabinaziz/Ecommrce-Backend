const mongoose = require('mongoose');

/*************** */
/*Product Model*/
/*************** */
const purchaseSchema = mongoose.Schema({
     _id: mongoose.Schema.Types.ObjectId,    
     username:{type:String},
     address:{type:String},
     contact:{type:String},
     email:{type:String},
     quantity:{type:Number},
         
  },{versionKey:false})
  exports.Purchase = mongoose.model('Purchase',purchaseSchema);

  

