const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const { villaSchema, reviewSchema } = require('../schemas');
const {isLoggedIn} = require('../middleware');
const ExpressError = require('../utils/expresserror');
const Villa = require('../models/villa');
const Review = require('../models/review');

// Using middleware to validate the villa
const validateVilla = (req, res, next) => {
  const { error } = villaSchema.validate(req.body); // passing the data from the request to the JOI validation and taking error part if present
  if (error) {
    const msg = error.details.map((el) => el.message).join(',');
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

// Middleware for reviews validation
const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(',');
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

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
  await villa.save();
  req.flash('success', 'Successfully made a new campground');
  res.redirect(`/villas/${villa._id}`);
}));

// Get villa by id
router.get('/:id', catchAsync(async (req, res) => {
  const villa = await Villa.findById(req.params.id).populate('reviews');
  if(!villa){
    req.flash('error', 'Cannot find that villa!');
    return res.redirect('/campgrounds');
  }
  res.render('show', { villa });
}));

// Edit the villa after found
router.get('/:id/edit', isLoggedIn, catchAsync(async (req, res) => {
  const villa = await Villa.findById(req.params.id);
  res.render('edit', { villa });
}));

router.put('/:id', isLoggedIn,  catchAsync(async (req, res) => {
  const { id } = req.params;
  const villa = await Villa.findByIdAndUpdate(id, { ...req.body.villa }); // (... is the spread operator)
  req.flash('success', 'Successfully updated Villa!');
  res.redirect(`/villas/${villa._id}`);
}));

// Delete villa
router.delete('/:id', isLoggedIn,  catchAsync(async (req, res) => {
  const { id } = req.params;
  await Villa.findByIdAndDelete(id);
  req.flash('success', 'Successfully deleted!');
  res.redirect('/villas');
}));

// Reviews model
router.post('/:id/reviews', validateReview, catchAsync(async (req, res) => {
  const villa = await Villa.findById(req.params.id);
  const review = new Review(req.body.review);
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
router.delete('/:id/reviews/:reviewId', catchAsync(async (req, res) => {
  const { id, reviewId } = req.params;
  await Review.findByIdAndDelete(reviewId);
  await Villa.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  req.flash('success', 'Successfully deleted!');
  res.redirect(`/villas/${id}`);
}));

module.exports = router;