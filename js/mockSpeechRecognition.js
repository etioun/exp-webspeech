define([
'jquery',
'backbone',
], function($, Backbone){
  'use strict';

  var MockSpeechRecognition = function () {
    var defaults = {
      "lang" : "fr-fr",
      "onResult" : false
    };

    var settings = {};

    var _recognition = {};

    var _stopped = true;

    var init = function(options) {

      settings = $.extend({}, defaults, options);

      _recognition = new webkitSpeechRecognition();

      _recognition.continuous = true;
      _recognition.interimResults = false;
      _recognition.lang = settings["lang"];

      // _recognition.onresult = function (event) {
      //   for (var i = event.resultIndex; i < event.results.length; ++i) {
      //     if (event.results[i].isFinal && settings["onResult"]) {
      //         settings["onResult"](event.results[i][0]);
      //     }
      //   }
      // };

      mockResult();

      var thisRef = this;

      _recognition.onend = function (event) {
        console.log("ended");
        _stopped = true;
        thisRef.trigger('end');
      }

      _recognition.onstart = function (event) {
        _stopped = false;
        thisRef.trigger('start');
      }
    }

    var mockResult = function () {
      setTimeout( function () { settings["onResult"]({transcript : "oui et toi"}); mockResult(); }, 5000);
    }

    var onResult = function (callback) {
      settings["onResult"] = callback;
    }

    var start = function () {
      _recognition.start();
    }

    var stop = function (callback) {
      _recognition.stop();
      _waitTillStop(callback);
    }

    var _waitTillStop = function (callback) {
      if (_stopped == true) {
        callback();
      } else {
        setTimeout(function () { _waitTillStop(callback);}, 1000);
      }
    }

    return {
      init : init,
      onResult : onResult,
      start : start,
      stop : stop
    }
  }

  var obj = new MockSpeechRecognition();
  _.extend(obj, Backbone.Events);

  return obj;
});
