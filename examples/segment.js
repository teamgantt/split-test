// Simulates the segment tracking event by waiting about a second to fire,
// then calls the callback function.
const track = (name, properties, options, callback) => {
  window.console.log('trackEventInitiated');
  setTimeout(() => {
    window.console.log({
      name,
      properties,
      options,
      callback,
    });
    window.console.log('trackEventComplete');

    callback();
    window.console.log('trackEventCallbackFired');
  }, 1000);
};

window.analytics = {
  track
};
