const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware');


// Necessary imports for the 
const express = require('express')
const router = express.Router();
const catchAsync = require('../utils/catchAsync')
const ExpressError = require('../utils/expresserror')
const Villa = require('../models/villa')// importing the model for campground
const Review = require('../models/reviews')

//joi schema
const { reviewSchema } = require('../schemas')

//importing the controllers
const reviews = require('../controllers/review')







//Adding the reviews from the user input
router.post('/', isLoggedIn, validateReview, catchAsync(reviews.createReview))

//deletigng the reviews
router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviews.Deletereview))


// // Reviews model
// router.post('/:id/reviews', isLoggedIn, validateReview, catchAsync(async (req, res) => {
//     const villa = await Villa.findById(req.params.id);
//     const review = new Review(req.body.review);
//     review.author = req.user._id;
//     villa.reviews.push(review);
//     await review.save();
//     await villa.save();
//     req.flash('success', 'Created new Review!');
//     res.redirect(`/villas/${villa._id}`);
// }));

// router.get('/:id/reviews', catchAsync(async (req, res) => {
//     const villa = await Villa.findById(req.params.id).populate('reviews');
//     res.render('reviews', { villa });
// }));

// // Deleting the reviews
// router.delete('/:id/reviews/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(async (req, res) => {
//     const { id, reviewId } = req.params;
//     await Review.findByIdAndDelete(reviewId);
//     await Villa.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
//     req.flash('success', 'Successfully deleted!');
//     res.redirect(`/villas/${id}`);
// }));

module.exports = router;