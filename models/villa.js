const mongoose = require("mongoose")
const Schema = mongoose.Schema;
const Review = require('./reviews')


const ImageSchema = new Schema({
    url: String,
    filename: String
});


ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200');
});

const opts = { toJSON: { virtuals: true } };

const villaSchema = new Schema({
    title: String,
    price: Number,
    description: String,
    location: String,
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    images: [ImageSchema],
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review"
        }
    ]

},opts)


//map feature
villaSchema.virtual('properties.popUpMarkup').get(function () {
    return `
    <strong><a href="/villas/${this._id}">${this.title}</a><strong>
    <p>${this.description.substring(0, 20)}...</p>`
});


villaSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Review.deleteMany({ // from review table  remove the id's of the review which ar present in the campground atable 
            _id: { $in: doc.reviews }
        })
    }
})



console.log("Done")


module.exports = mongoose.model("Campground", villaSchema)