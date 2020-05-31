const Purchase = require('./model').Purchase;
const sendResponse  = require('../Utils/common').sendResponse;
const mongoose = require('mongoose');

exports.Purchase = async (req, res) => {
    try {
        console.log("product")
        
        let purchase = new Purchase({

            _id:new mongoose.Types.ObjectId(),
            username: req.body.username,
            address: req.body.address,
            contact: req.body.contact,
            email: req.body.email,
            quantity: req.body.quantity,
        });
      
        let insertProduct = await purchase.save();

        sendResponse(res, true, "Purchase Record Created Successfully", { insertProduct });
        console.log(insertProduct);
    }
    catch (err) {
        sendResponse(res, false, "Post Error" + err, {});
    }

}

exports.GetPurchase = async(req,res)=>{
    try{
        let purchase = await Purchase.find({ }).exec()
       // sendResponse(res, true, "All  Product", {products});
    res.json(purchase)
    
    }
    catch(err){
        sendResponse(res, false, "error"+err, {});
    }

}


