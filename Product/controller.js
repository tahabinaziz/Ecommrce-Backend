const Products = require('./model').Products;
const sendResponse  = require('../Utils/common').sendResponse;
const mongoose = require('mongoose');

exports.Products = async (req, res) => {
    try {
        console.log("product")
        
        let product = new Products({

            _id:new mongoose.Types.ObjectId(),
            title: req.body.title,
            productId: req.body.productId,
            details: req.body.details,
            price: req.body.price,
            image: req.body.image,
        });
      
        let insertProduct = await product.save();

        sendResponse(res, true, "Product Created Successfully", { insertProduct });
        console.log(insertProduct);
    }
    catch (err) {
        sendResponse(res, false, "Post Error" + err, {});
    }

}

exports.GetProducts = async(req,res)=>{
    try{
        let products = await Products.find({ }).exec()
       // sendResponse(res, true, "All  Product", {products});
    res.json(products)
    
    }
    catch(err){
        sendResponse(res, false, "error"+err, {});
    }

}


exports.getProductId = async (req, res) => {
    try {
        let id = req.params.productId

        let getProductId = await Products.findOne({ _id: id })

        res.json(getProductId);

        }
       

    
    catch (err) {

        sendResponse(res, false, "Something went wrong... ", {});
    }
}