'use strict';

/**
 * Makes a randomized selection of a boolean value. Safeguards are in place to
 * try to make an accurate randomization by rejecting results that are too heavily
 * weighted to one side or the other.
 *
 * @returns bool
 */
module.exports.makeRandomSelection = () => {
  let attempts = 0;
  let maxAttempts = 10;
  let numberOfTries = 15;
  let outlierThreshold = Math.floor(numberOfTries * 0.2);
  let variantDifference = randomVariantSelector(numberOfTries);

  // Prevent outliers and re-run the randomization if it's
  // weighted too heavily in one direction
  while (
    variantDifference > outlierThreshold ||
    variantDifference < outlierThreshold * -1 ||
    variantDifference === 0
  ) {
    variantDifference = randomVariantSelector(numberOfTries);

    if (++attempts >= maxAttempts) {
      break;
    }
  }

  return variantDifference > 0;
};

/**
 * Runs a random A/B selector a specified number of tries and returns the
 * difference between option A & option B
 *
 * @param {number} numberOfTries How many times to randomly select A or B
 *
 * @return {number} The difference between option variantA & variantB selections
 */
const randomVariantSelector = numberOfTries => {
  let variantAUses = 0;
  let variantBUses = 0;

  for (let i = 0; i < numberOfTries; i++) {
    let number = Math.round(Math.floor(Math.random() * 2));

    if (number % 2 === 1) {
      variantAUses++;
      continue;
    }

    variantBUses++;
  }

  return variantAUses - variantBUses;
};
