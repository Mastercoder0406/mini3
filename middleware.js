const { villaSchema, reviewSchema } = require('./schemas.js');
const ExpressError = require('./utils/expresserror.js');
const Review = require('./models/reviews.js');
const Villa = require('./models/villa.js');


//middleware for login
module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl; // add this line
    req.flash('error', 'You must be signed in first!');
    return res.redirect('/login');
  }
  next();
}

// Using middleware to validate the villa
module.exports.validateVilla = (req, res, next) => {
  const { error } = villaSchema.validate(req.body); // passing the data from the request to the JOI validation and taking error part if present
  if (error) {
    const msg = error.details.map((el) => el.message).join(',');
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};


//validating author
module.exports.isAuthor = async (req, res, next) => {
  const { id } = req.params;
  const villa = await Villa.findById(id);
  if (!villa.author.equals(req.user._id)) {
    req.flash('error', 'Permission Denied!');
    return res.redirect(`/campgrounds/${id}`);
  }
  next();
}


//validating reviews
module.exports.isReviewAuthor = async (req, res, next) => {
  const { id, reviewId } = req.params;
  const review = await Review.findById(reviewId);
  if (!review.author.equals(req.user._id)) {
    req.flash('error', 'Permission Denied!');
    return res.redirect(`/campgrounds/${id}`);
  }
  next();
}

// Middleware for reviews validation
module.exports.validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(',');
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};


