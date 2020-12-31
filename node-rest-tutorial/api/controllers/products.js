const Product = require('../models/product');
const mongoose = require('mongoose');

exports.products_get_all_products = (req,res,next)=>{
    Product.find()
        .select('_id name price productImage').exec()
        .then(docs => {
            const response = {
                count: docs.length,
                products: docs.map(doc=>{
                    return {
                        name : doc.name,
                        price: doc.price,
                        _id : doc._id,
                        productImage: doc.productImage,
                        request : {
                            type: 'GET',
                            url: 'http://localhost:3000/products/'+doc._id
                        }
                    }
                }),
            }
            // if(docs.length>=0){
                res.status(200).json(response);
            // }else{
            //     res.status(404).json({
            //         message: 'No entries found'
            //     });
            // }
        })
        .catch(err=>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}

exports.products_create_product = (req,res,next)=>{
    console.log(req.file);
    const product = new Product({
        _id: mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        productImage: req.file.path
    });
    product.save()
    .then(result=>{
        console.log(result)
        res.status(201).json({
            message : 'Created Product Successfully',
            createdProduct:{
                    name : result.name,
                    price: result.price,
                    productImage: result.productImage,
                    _id : result._id,
                    request : {
                        type: 'GET',
                        url: 'http://localhost:3000/products/'+result._id
                    }
            }
        });
    })
    .catch(err=>{
        console.log(err)
        res.status(500).json({
            error: err
        });
    });
}

exports.get_product_by_id = (req,res,next)=>{
    const id = req.params.productId;
    Product.findById(id)
        .select('name price _id productImage').exec()
        .then(doc=>{
            console.log(doc)
            if(doc){
                res.status(200).json({
                    product : doc,
                    request: {
                        type: 'GET',
                        url:'http://localhost:3000/products'
                    }
                });
            }
            else {
                res.status(404).json({
                    error:'No valid entry found'
                });
            }
        })
        .catch(err=>{
            console.log(err)
            res.status(500).json({
                error: err
            });
        });
}

exports.update_product = (req,res,next)=>{
    const id = req.params.productId;
    const updateOps = {};
    for(const ops of req.body){
        updateOps[ops.propName] = ops.value;
    }

    Product.update({_id: id},{$set: updateOps}).exec()
        .then(result=>{
            console.log(result);
            res.status(200).json({
                message: 'Product Updated',
                request: {
                    type:'GET',
                    url:'http://localhost:3000/products/'+id
                }
            });
        })
        .catch(err=>{
            console.log(err);
            res.status(500).json({
                error:err
            });
        });
}

exports.delete_product = (req,res,next)=>{
    const id = req.params.productId;
    Product.remove({_id:id}).exec()
        .then(result => {
            console.log(result);
            res.status(200).json({
                message:'Product deleted',
                request:{
                    type: 'POST',
                    url:'http://localhost:3000/products',
                    data:{
                        name:'String',
                        price:'Number'
                    }
                }
            });
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error: err
            })
        });
}