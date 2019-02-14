"use strict";

var tgSplitTest = {
  variantA: btoa('original'),
  variantB: btoa('experiment')
}

/**
 * Gets the root domain of the current domain, prefixed with a '.'
 * to allow for use across subdomains within the root domain.
 *
 * @return {string} The period prefixed root domain
 **/
tgSplitTest.getDomain = function () {
  var hostName = window.location.hostname;

  return '.' + hostName.substring(hostName.lastIndexOf('.', hostName.lastIndexOf('.') - 1) + 1);
}

/**
 * Checks cookies for the saved variant of experimentName
 *
 * @param {string} experimentName The experiment in question
 *
 * @return {(null|string)} The saved variant or null if nothing is saved
 */
tgSplitTest.getSavedVariant = function (experimentName) {
  var name = experimentName + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var cookieParts = decodedCookie.split(';');

  for (var i = 0; i < cookieParts.length; i++) {
    var cookiePart = cookieParts[i];

    while (cookiePart.charAt(0) === ' ') {
      cookiePart = cookiePart.substring(1);
    }

    if (cookiePart.indexOf(name) === 0) {
      return cookiePart.substring(name.length, cookiePart.length);
    }
  }

  return null;
}

/**
 * Returns the saved variant of an already ran experiment
 * or a randomly selected variant for a newly specified experiment
 *
 * @param {string} experimentName The experiment in question
 *
 * @return {string} Returns this.variantA or this.variantB depending
 * on the saved variant or randomized selection
 */
tgSplitTest.getVariant = function (experimentName) {
  var cookieVariant = this.getSavedVariant(experimentName);

  if (cookieVariant === this.variantA || cookieVariant === this.variantB) {
    return cookieVariant;
  }

  var attempts = 0;
  var maxAttempts = 10;
  var numberOfTries = 15;
  var outlierThreshold = Math.floor(numberOfTries * 0.2);
  var variantDifference = this.randomVariantSelector(numberOfTries);

  // Prevent outliers and re-run the randomization if it's
  // weighted too heavily in one direction
  while (
    variantDifference > outlierThreshold
    || variantDifference < outlierThreshold * -1
    || variantDifference === 0
  ) {
    variantDifference = this.randomVariantSelector(numberOfTries);

    if (++attempts >= maxAttempts) {
      break;
    }
  }

  var selectedVariant = variantDifference > 0 ? this.variantA : this.variantB;

  return this.saveVariant(experimentName, selectedVariant);
}

/**
 * Is the user in this.variantB
 *
 * @param {string} experimentName The name of the experiment
 *
 * @return {bool} Returns true for users in the test, false for user not in the test
 */
tgSplitTest.isInExperiment = function(experimentName) {
  var isInExperiment = this.getVariant(experimentName) === this.variantB;

  this.trackToSegment(experimentName, isInExperiment);

  return isInExperiment;
}

tgSplitTest.trackToSegment = function(experimentName, isInExperiment) {
  // If Segment is not present, retry
  if (!window.analytics) {
    return;
  }

  // Send tracking to Segment
  window.analytics.track('Experiment Viewed', {
    experimentName: experimentName,
    variationId: !isInExperiment ? 1 : 2,
    variationName: !isInExperiment ? 'Var A' : 'Var B',
  });
}

/**
 * Runs a random A/B selector a specified number of tries and returns the
 * difference between option A & option B
 *
 * @param {number} numberOfTries How many times to randomly select A or B
 *
 * @return {number} The difference between option variantA & variantB selections
 */
tgSplitTest.randomVariantSelector = function (numberOfTries) {
  var variantAUses = 0;
  var variantBUses = 0;

  for (var i = 0; i < numberOfTries; i++) {
    var number = Math.round(Math.floor(Math.random() * 2));

    if (number % 2 === 1) {
      variantAUses++;
      continue;
    }

    variantBUses++;
  }

  return variantAUses - variantBUses;
}

/**
 * Saves the selected variant of the specified experiment to
 * the user's cookies for 90 days.
 *
 * @param {string} experimentName The experiment in question
 * @param {string} variant The selected variant for the experiment
 *
 * @return {string} The saved variant of the experiment
 */
tgSplitTest.saveVariant = function (experimentName, variant) {
  var expires = new Date();
  expires.setDate(expires.getDate() + 90);

  var cookieDetails = experimentName + '=' + variant+';'
    + 'expires='+expires+';'
    + 'path=/;'
    + 'domain='+this.getDomain()+';'
    + 'secure=true';

  document.cookie = cookieDetails;

  return variant;
}

module.exports = tgSplitTest;
