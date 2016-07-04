define([
'jquery',
'underscore',
'backbone',
'models/dialogState',
'models/sentence'
], function($, _,Backbone,DialogState, Sentence){
  'use strict';

  var DialogReader = function () {

    var _defaults = {
      "dialog": {}
    };

    var _settings = {};

    var _dialogState = {};

    var _sentences = [];

    var init = function(options) {

      _settings = $.extend({}, _defaults, options);

      _sentences = _settings.dialog.dialog.slice();
      _dialogState = new DialogState();
    }

    var nextSentence = function () {
      var currentSentence = _dialogState.get('currentSentence');

      if (currentSentence) {
        var currentPosition = currentSentence.get('position');

        if (currentPosition + 1 >= _sentences.length) {
          this.trigger('finished');
          return;
        } else {
          _dialogState.set('currentSentence', new Sentence(_sentences[currentPosition + 1]) );
          this.trigger('nextSentence', _dialogState.get('currentSentence'));
        }
      } else {
        _dialogState.set('currentSentence', new Sentence(_sentences[0]));
        this.trigger('nextSentence', _dialogState.get('currentSentence'));
      }
    }

    return {
      init : init,
      nextSentence : nextSentence
    }
  }

  var obj = new DialogReader();
  _.extend(obj, Backbone.Events);

  return obj;

});
