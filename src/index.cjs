'use strict';

const {getCookie, saveCookie} = require('./helpers/cookies.cjs');
const {trackToSegment} = require('./helpers/segment.cjs');
const {makeRandomSelection} = require('./helpers/randomizer.cjs');

const tgSplitTest = {
  variantA: btoa('original'),
  variantB: btoa('experiment'),
};

/**
 * Checks cookies for the saved variant of experimentName
 *
 * @param {string} experimentName The experiment in question
 *
 * @return {(null|string)} The saved variant or null if nothing is saved
 */
tgSplitTest.getSavedVariant = function (experimentName) {
  return getCookie(experimentName);
};

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
  const cookieVariant = this.getSavedVariant(experimentName);

  if (cookieVariant === this.variantA || cookieVariant === this.variantB) {
    return cookieVariant;
  }

  return makeRandomSelection(tgSplitTest.variantA, tgSplitTest.variantB)
    ? this.variantA
    : this.variantB;
};

/**
 * Is the user in this.variantB
 *
 * @param {string} experimentName The name of the experiment
 *
 * @return {bool} Returns true for users in the test, false for user not in the test
 */
tgSplitTest.isInExperiment = function (experimentName) {
  const variant = this.getVariant(experimentName);
  const isInExperiment = variant === this.variantB;

  this.saveVariant(experimentName, variant);
  this.track(experimentName, isInExperiment);

  return isInExperiment;
};

/**
 * Saves the selected variant of the specified experiment to
 * the user's cookies for 90 days.
 *
 * @param {string} experimentName The experiment in question
 * @param {string} variant The selected variant for the experiment
 *
 * @return {void}
 */
tgSplitTest.saveVariant = function (experimentName, variant) {
  saveCookie(experimentName, variant);
};

/**
 * Tracks the results of the split test to segment.
 *
 * @param {string} experimentName
 * @param {bool} isInExperiment
 */
tgSplitTest.track = function (experimentName, isInExperiment) {
  trackToSegment(experimentName, isInExperiment);
};

module.exports = tgSplitTest;
