define([
'jquery',
'backbone',
], function($, Bacbone){

  var _defaults = {
    "lang" : "fr-fr"
  };

  var _settings = {};

  // var _speechUtterance = {};

  var init = function(options) {

    _settings = $.extend({}, _defaults, options);

  }

  var say = function (text) {
    speechUtterance = new SpeechSynthesisUtterance();
    speechUtterance.lang = _settings.lang;
    speechUtterance.text = text;
    window.speechSynthesis.speak(speechUtterance);
  }


  var waitTillSilent = function (callback) {
    if (window.speechSynthesis.pending || window.speechSynthesis.speaking) {
      setTimeout(function (){waitTillSilent(callback);}, 1000);
    } else {
      callback();
    }
  }

  return {
    init : init,
    say : say,
    waitTillSilent : waitTillSilent
  }
});
