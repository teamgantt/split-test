'use strict';

const {saveCookie, getCookie} = require('./cookies.cjs');

/**
 * Tracks the given experiment's properties to segment.
 * This assumes window.analytics is wired up correctly to segment.
 * To prevent tracking the same user in the same experiment multiple times, cookie is stored when the track is successful.
 *
 * @param {string} experimentName
 * @param {bool} isInExperiment
 *
 * @returns void
 */
module.exports.trackToSegment = (experimentName, isInExperiment) => {
  const trackName = [experimentName, '__tracked'].join('');
  const isSaved = getCookie(trackName) !== null;

  if (
    isSaved ||
    typeof window === 'undefined' ||
    typeof window.analytics === 'undefined'
  ) {
    return;
  }

  const eventName = 'Experiment Viewed';
  const eventProperties = {
    experimentName: experimentName,
    variationId: !isInExperiment ? 1 : 2,
    variationName: !isInExperiment ? 'Control' : 'Variation',
  };
  const eventOptions = {};
  const callback = () => {
    saveCookie(trackName, 'true');
  };

  window.analytics.track(eventName, eventProperties, eventOptions, callback);
};
