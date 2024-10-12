
const Joi = require('joi');
const villa = require('./models/villa');
module.exports.villaSchema = Joi.object({
    //campground object created because inside campground(passed from req.body submtted by form contain campground object) there are many properties, since in JOI one property at a time to group all together, campground object created
    villa: Joi.object({
        title: Joi.string().required(),
        price: Joi.number().required().min(0),
        location: Joi.string().required(),
        description: Joi.string().required()
        //price:joi.number()

    }).required(),
    deleteImages: Joi.array()
});


// reviews validation schemas 
module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        body: Joi.string().required()

    }).required()
})