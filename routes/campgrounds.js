const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const {isLoggedIn, isAuthor, isReviewAuthor, validateVilla, validateReview} = require('../middleware');
const Villa = require('../models/villa');
const Review = require('../models/review');


// Listing all the villas
router.get('/', async (req, res) => {
  const villas = await Villa.find({});
  res.render('villaslist', { villas });
});

// Creating new villa
router.get('/new', isLoggedIn, (req, res) => {
  res.render('new');
});

router.post('/', isLoggedIn, validateVilla, catchAsync(async (req, res, next) => {
  // if (!req.body.villa) throw new ExpressError('Invalid villa data ', 404)
  const villa = new Villa(req.body.villa);
  villa.author = req.user._id;
  await villa.save();
  req.flash('success', 'Successfully made a new campground');
  res.redirect(`/villas/${villa._id}`);
}));

// Get villa by id
router.get('/:id', catchAsync(async (req, res) => {
  const villa = await Villa.findById(req.params.id).populate({
    path:'reviews',
    populate:{
      path: 'author'
    }
  }).populate('author');
  console.log(villa);
  if(!villa){
    req.flash('error', 'Cannot find that villa!');
    return res.redirect('/campgrounds');
  }
  res.render('show', { villa });
}));

// Edit the villa after found
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    req.flash('error', 'Invalid villa ID!');
    return res.redirect('/campgrounds');
  }
  const villa = await Villa.findById(id);
  if (!villa) {
    req.flash('error', 'Cannot find that villa!');
    return res.redirect('/campgrounds');
  }
  res.render('edit', { villa });
}));

router.put('/:id', isLoggedIn, isAuthor, validateVilla,  catchAsync(async (req, res) => {
  const { id } = req.params;
  const villa = await Villa.findByIdAndUpdate(id, { ...req.body.villa }); // (... is the spread operator)
  req.flash('success', 'Successfully updated Villa!');
  res.redirect(`/villas/${villa._id}`);
}));

// Delete villa
router.delete('/:id', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
  const { id } = req.params;
  await Villa.findByIdAndDelete(id);
  req.flash('success', 'Successfully deleted!');
  res.redirect('/villas');
}));

// Reviews model
router.post('/:id/reviews', isLoggedIn, validateReview, catchAsync(async (req, res) => {
  const villa = await Villa.findById(req.params.id);
  const review = new Review(req.body.review);
  review.author = req.user._id;
  villa.reviews.push(review);
  await review.save();
  await villa.save();
  req.flash('success', 'Created new Review!');
  res.redirect(`/villas/${villa._id}`);
}));

router.get('/:id/reviews', catchAsync(async (req, res) => {
  const villa = await Villa.findById(req.params.id).populate('reviews');
  res.render('reviews', { villa });
}));

// Deleting the reviews
router.delete('/:id/reviews/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(async (req, res) => {
  const { id, reviewId } = req.params;
  await Review.findByIdAndDelete(reviewId);
  await Villa.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  req.flash('success', 'Successfully deleted!');
  res.redirect(`/villas/${id}`);
}));

module.exports = router;