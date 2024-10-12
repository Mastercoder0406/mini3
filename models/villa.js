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

const villaSchema = new Schema({
    title: String,
    price: Number,
    description: String,
    location: String,
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

})

villaSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Review.deleteMany({ // from review table  remove the id's of the review which ar present in the campground atable 
            _id: { $in: doc.reviews }
        })
    }
})



console.log("Done")


module.exports = mongoose.model("Campground", villaSchema)