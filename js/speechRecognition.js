define([
'jquery',
'underscore',
'backbone'
], function($,_,Backbone){
  'use strict';

  var SpeechRecognition = function () {
    var defaults = {
      "lang" : "fr-fr",
      "onResult" : false
    };

    var settings = {};

    var _recognition = {};

    var _stopped = true;

    var _nothingHeard = false;

    var _self = null;

    var init = function(options) {

      _self = this;

      settings = $.extend({}, defaults, options);

      if (!('webkitSpeechRecognition' in window)) {
        _recognition = {
          start: function () { return;},
          stop: function () { return;}
        };
      } else {
        _recognition = new webkitSpeechRecognition();
      }

      _recognition.continuous = false;
      _recognition.interimResults = false;
      _recognition.maxAlternatives = 1;
      _recognition.lang = settings["lang"];

      _recognition.onresult = function (event) {
        console.log(event);
        _nothingHeard = false;

        for (var i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal ) {
            console.log(event.results[i][0].confidence);
            _self.trigger('result', event.results[i]);
          }
        }
      };


      _recognition.onend = function (event) {
        console.log("ended");
        _stopped = true;
        if (_nothingHeard) {
          _self.trigger('nothing');
        }
      }

      _recognition.onstart = function (event) {
        console.log('started');
        _stopped = false;
        _nothingHeard = true;
        _self.trigger('start');
      }

      _recognition.onspeechstart = function (event) {
        console.log('start blabla');
        _nothingHeard = true;
        _self.trigger('processing');
      }

      _recognition.onspeechend = function (event) {
        console.log('finish blabla');
        _self.trigger('processed');
      }

      _recognition.onnomatch = function (event) {
        console.log('nomatch');
        _nothingHeard = true;
      }

      _recognition.onerror = function (event) {
        console.log('nothing');
        console.log(event);
        _self.trigger('nothing');
      }
    }

    var start = function (callback) {
        stop(function(){
          _recognition.start();
          _self.on('result', callback);
        });
    }

    var stop = function (callback) {
      _nothingHeard = false;
      _recognition.stop();
      _self.off('result');
      if (callback) {
        _waitTillStop(callback);
      }
    }

    var _waitTillStop = function (callback) {
      if (_stopped == true) {
        callback();
      } else {
        setTimeout(function () { _waitTillStop(callback);}, 1000);
      }
    }

    var expect = function(activations, callbackSuccess, callbackFail) {
      start(function(result){
        var found = false;
        $.each(activations, function (i, v) {
          if (v == result[0].transcript.trim()){
            found = true;
            callbackSuccess(v);
            stop();
            return false;
          }
        });
        if (found == false) {
          callbackFail(result);
          stop();
          // _restart();
        }
      });

    }

    var mockSpeech = function (speech) {
      _self.trigger('result', [ { "transcript": speech }]);
      _nothingHeard = false;
    }

    return {
      init : init,
      start : start,
      stop : stop,
      expect : expect,
      mockSpeech : mockSpeech
    }
  }

  var obj = new SpeechRecognition();
  _.extend(obj, Backbone.Events);

  return obj;
});
