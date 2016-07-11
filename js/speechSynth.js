define([
'jquery',
], function($){



  var _defaults = {
    "setLang" : "fr-CA",
    "usedLang" : "fr-CA"
  };

  var _settings = {};

  var _voice;

  var init = function(options) {


    _settings = $.extend({}, _defaults, options);

    if (!('speechSynthesis' in window)) {
      return;
      };

    window.speechSynthesis.onvoiceschanged = function() {
      _setVoice();
    };

  }

  var _setVoice = function() {
    if (_settings.setLang == "fr-CA") {
      _setFrenchVoice();
    } else {
      _setDefaultVoice();
    }
  }

  var _setFrenchVoice = function() {
    var voice = window.speechSynthesis.getVoices().filter(function(voice) {
      return (voice.lang == "fr-CA" && voice.voiceURI == "Amelie");
    })[0];

    if (typeof voice === "undefined") {
       voice = window.speechSynthesis.getVoices().filter(function(voice) {
        return (voice.lang == "fr-FR" && voice.voiceURI == "Google français");
      })[0];
    }


    if (typeof voice === "undefined") {
       voice = window.speechSynthesis.getVoices().filter(function(voice) {
        return (voice.lang == "fr-FR" || voice.lang == "fr_FR");
      })[0];
    }

    if (typeof voice === "undefined") {
      _setDefaultVoice();
    } else {
      _settings.usedLang = voice.lang;
      _voice = voice;
    }
  }

  var _setDefaultVoice = function(){
    var voice = window.speechSynthesis.getVoices().filter(function(voice) {
      return (voice.default === true);
    })[0];

    _settings.usedLang = voice.lang;
    _voice = voice;
  }

  var say = function (text) {
    if (!('speechSynthesis' in window)) {
      return;
    };

    if (typeof _voice === "undefined") {
      _setVoice();
    }

    speechUtterance = new SpeechSynthesisUtterance();
    speechUtterance.voice = _voice;
    speechUtterance.lang = _voice.lang;
    speechUtterance.text = text;
    window.speechSynthesis.speak(speechUtterance);
  }


  var waitTillSilent = function (callback) {
    if (window.speechSynthesis.pending || window.speechSynthesis.speaking) {
      setTimeout(function (){waitTillSilent(callback);}, 500);
    } else {
      callback();
    }
  }

  var cancel = function () {
    if (!('speechSynthesis' in window)) {
      return;
      };

    window.speechSynthesis.cancel();
  }

  return {
    init : init,
    say : say,
    waitTillSilent : waitTillSilent,
    cancel : cancel
  }
});
