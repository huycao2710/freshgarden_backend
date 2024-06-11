const Product = require("../models/ProductModel")

const createNewProductService = (newProduct) => {
    return new Promise(async (resolve, reject) => {
        const { nameProduct, imageProduct, categoryName, price, countInStock, rating, description, discount, featured } = newProduct
        try {
            const checkProduct = await Product.findOne({
                nameProduct: nameProduct
            })
            if (checkProduct !== null) {
                resolve({
                    status: 'ERR',
                    message: 'The name of product is already'
                })
            }
            const newProduct = await Product.create({
                nameProduct,
                imageProduct,
                categoryName,
                price,
                countInStock: Number(countInStock),
                rating,
                description,
                discount: Number(discount),
                featured
            })
            if (newProduct) {
                resolve({
                    status: 'OK',
                    message: 'SUCCESS',
                    data: newProduct
                })
            }
        } catch (e) {
            reject(e)
        }
    })
};

const updateInfoProductService = (id, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkProduct = await Product.findOne({
                _id: id
            })
            if (checkProduct === null) {
                resolve({
                    status: 'ERR',
                    message: 'The product is not defined'
                })
            }
            const updateInfoProductService = await Product.findByIdAndUpdate(id, data, { new: true })
            resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: updateInfoProductService
            })
        } catch (e) {
            reject(e)
        }
    })
};

const deleteInfoProductService = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkProduct = await Product.findOne({
                _id: id
            })
            if (checkProduct === null) {
                resolve({
                    status: 'ERR',
                    message: 'The product is not defined'
                })
            }
            await Product.findByIdAndDelete(id)
            resolve({
                status: 'OK',
                message: 'Delete product SUCCESS',
            })
        } catch (e) {
            reject(e)
        }
    })
}

const getAllInfoProductService = (limit, page, sort, filter) => {
    return new Promise(async (resolve, reject) => {
        try {
            const totalProduct = await Product.countDocuments()
            let allProduct = []
            if (filter) {
                const label = filter[0];
                const allObjectFilter = await Product.find({ [label]: { '$regex': filter[1] } }).limit(limit).skip(page * limit)
                resolve({
                    status: 'OK',
                    message: 'Success',
                    data: allObjectFilter,
                    total: totalProduct,
                    pageCurrent: Number(page + 1),
                    totalPage: Math.ceil(totalProduct / limit)
                })
            }
            if (sort) {
                const objectSort = {}
                objectSort[sort[1]] = sort[0]
                const allProductSort = await Product.find().limit(limit).skip(page * limit).sort(objectSort)
                resolve({
                    status: 'OK',
                    message: 'Success',
                    data: allProductSort,
                    total: totalProduct,
                    pageCurrent: Number(page + 1),
                    totalPage: Math.ceil(totalProduct / limit)
                })
            }
            if (!limit) {
                allProduct = await Product.find().limit(limit)
            } else {
                allProduct = await Product.find().limit(limit).skip(page * limit)
            }
            resolve({
                status: 'OK',
                message: 'Success',
                data: allProduct,
                total: totalProduct,
                pageCurrent: Number(page + 1),
                totalPage: Math.ceil(totalProduct / limit)
            })
        } catch (e) {
            reject(e)
        }
    })
}

const getDetailsInfoProductService = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const product = await Product.findOne({
                _id: id
            })
            if (product === null) {
                resolve({
                    status: 'ERR',
                    message: 'The product is not defined'
                })
            }
            resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: product
            })
        } catch (e) {
            reject(e)
        }
    })
}

const deleteManyProductService = () => {
    return new Promise(async (resolve, reject) => {
        try {
            await Product.deleteMany({ _id: ids })
            resolve({
                status: 'OK',
                message: 'Delete product success',
            })
        } catch (e) {
            reject(e)
        }
    })
}

const getAllCategoryService = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const allCategory = await Product.distinct('categoryName')
            resolve({
                status: 'OK',
                message: 'Success',
                data: allCategory,
            })
        } catch (e) {
            reject(e)
        }
    })
}

const getProductsByCategoryService = (categoryName, page, limit) => {
    return new Promise(async (resolve, reject) => {
        try {
            const totalProducts = await Product.countDocuments({ categoryName });
            const products = await Product.find({ categoryName })
                                           .skip(page * limit)
                                           .limit(limit);
            resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: products,
                total: totalProducts,
                currentPage: page + 1,
                totalPages: Math.ceil(totalProducts / limit)
            });
        } catch (error) {
            reject({
                status: 'ERR',
                message: error.message
            });
        }
    });
    // return new Promise(async (resolve, reject) => {
    //     try {
    //         const products = await Product.find({ categoryName: categoryName });
    //         if (!products.length) {
    //             resolve({
    //                 status: 'ERR',
    //                 message: 'No products found for the given category'
    //             });
    //         } else {
    //             resolve({
    //                 status: 'OK',
    //                 message: 'SUCCESS',
    //                 data: products
    //             });
    //         }
    //     } catch (error) {
    //         reject({
    //             status: 'ERR',
    //             message: error.message
    //         });
    //     }
    // });
};

const getFeaturedProductsService = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const featuredProducts = await Product.find({ featured: true });
            resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: featuredProducts
            });
        } catch (error) {
            reject({
                status: 'ERR',
                message: error.message
            });
        }
    });
};
module.exports = {
    createNewProductService,
    updateInfoProductService,
    deleteInfoProductService,
    getAllInfoProductService,
    getDetailsInfoProductService,
    deleteManyProductService,
    getAllCategoryService,
    getProductsByCategoryService,
    getFeaturedProductsService,
    
}