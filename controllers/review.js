
const Villa = require('../models/villa')
const Review = require('../models/reviews');


// create reviews
module.exports.createReview = async (req, res) => {
    const villa = await Villa.findById(req.params.id);
    const review = new Review(req.body.review);
    console.log(review)
    review.author = req.user._id;
    villa.reviews.push(review);
    await review.save();
    await villa.save();
    //adding flash
    req.flash('success', 'Created new review')
    res.redirect(`/villas/${villa._id}`)

}




//delete reviews controls
module.exports.Deletereview = async (req, res) => {
    // await Review.findByIdAndDelete(req.)
    // we are removing review id from only review table but from campground atable we need $pull method 
    const { id, reviewId } = req.params;
    await Review.findByIdAndDelete(reviewId);
    await Villa.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });//pull means delete all the reviw related to  villa from review model also
    req.flash('success', 'Successfully Deleted a review')
    res.redirect(`/villas/${id}`)


}