const formidable = require("formidable")
const _ = require('lodash')
const fs = require("fs")
const Product = require("../models/product");
const { errorHandler } = require('../helpers/dbErrorHandler')

exports.productById = (req, res, next, id) => {
    Product.findById(id).exec((err, product) => {
        if (err || !product) {
            return res.status(400).json({
                error: "Product not found"
            })
        }
        console.log(req.product)
        req.product = product
        next();
    })

}

exports.read = (req, res) => {
    req.product.photo = undefined
    return res.json(req.product)
}

exports.create = (req, res, ) => {
    let form = new formidable.IncomingForm()
    form.keepExtensions = true
    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: "Image could not be uploaded"
            })
        }

        //check for all fields

        const { name, description, price, category, quantity, shipping } = fields

        if (!name || !description || !price || !category || !quantity || !shipping) {
            return res.status(400).json({
                error: "All fields are required"
            })
        }

        let product = new Product(fields)

        if (files.photo) {
            if (files.photo.size > 1000000) {
                return res.status(400).json({
                    error: "Image should be less then 1mb in size"
                })
            }
            product.photo.data = fs.readFileSync(files.photo.path)
            product.photo.contentType = files.photo.type
        }

        product.save((err, result) => {
            if (err) {
                return req.status(400).json({
                    err: errorHandler(err)
                })
            }
            res.json(result);
        })
    })

}

exports.remove = (req, res) => {
    let product = req.product

    product.remove((err, deletedProduct) => {
        if (err) {
            return req.status(400).json({
                err: errorHandler(err)
            })
        }

        res.json({
            message: "Product Deleted successfully"
        })
    })
}

exports.update = (req, res, ) => {
    let form = new formidable.IncomingForm()
    form.keepExtensions = true
    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: "Image could not be uploaded"
            })
        }

        //check for all fields

        const { name, description, price, category, quantity, shipping } = fields

        if (!name || !description || !price || !category || !quantity || !shipping) {
            return res.status(400).json({
                error: "All fields are required"
            })
        }

        let product = req.product
        product = _.extend(product, fields)

        if (files.photo) {
            if (files.photo.size > 1000000) {
                return res.status(400).json({
                    error: "Image should be less then 1mb in size"
                })
            }
            product.photo.data = fs.readFileSync(files.photo.path)
            product.photo.contentType = files.photo.type
        }

        product.save((err, result) => {
            if (err) {
                return req.status(400).json({
                    err: errorHandler(err)
                })
            }
            res.json(result);
        })
    })

}
