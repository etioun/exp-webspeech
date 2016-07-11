/*global define*/
define([
	'jquery',
	'underscore',
	'backbone',
	'speechRecognition',
	'speechRecorder'
], function ($, _, Backbone, SpeechRecognition, speechRecorder) {
	'use strict';

	var UserConsoleView = Backbone.View.extend({
		el: '#user-console',
		events: {
	    "click .refresh"         : "reloadSlide",
			"click .restart"         : "restart",
			"click .feedback"         : "playFeedback",
			"click .answers"         : "playAnswers"
	  },

		initialize: function () {
			// this.listenTo(SpeechRecognition, "processing", this.showProcessing);
			this.listenTo(SpeechRecognition, "nothing", this.showError);
			$(this.el).show();
			this.clear();
		},

		render: function () {
			return this.el;
		},

		showDone : function() {
			this.clear();
			$(this.el).find('#bien').fadeIn("slow");
		},
		showMistake : function(transcript)  {
			this.clear();
			var mistakeEl = null;

			if (transcript) {
				mistakeEl = $(this.el).find('#mistake1');
				$(mistakeEl).find("strong").html(transcript);
			} else {
				mistakeEl = $(this.el).find('#mistake2');
			}
			mistakeEl.show();
			this.playFeedback();
		},
		showSayIt : function(transcript) {
			this.clear();
			$(this.el).find('#sayIt').show();
			$(this.el).find('#sayIt').animate({ "font-size": "200px"}, 500);
		},
		showProcessing : function(transcript) {
			this.clear();
			$(this.el).find('#processing').show();
		},
		showError : function(transcript) {
			this.clear();
			$(this.el).find('#nothing').show();
		},
		showRestart : function(transcript) {
			this.clear();
			$(this.el).find('#restart').show();
		},
		clear: function () {
			$(this.el).children().hide();
		},
		reloadSlide: function () {
			this.trigger('reloadSlide');
		},
		restart: function () {
			this.trigger('restart');
		},
		showSpeechRecognitionNotSupported : function(){
			$(this.el).find('#speechRecognitionNotSupported').show();
		},
		showSpeechSynthesisNotSupported : function(){
			$(this.el).find('#speechSynthesisNotSupported').show();
		},
		playFeedback : function () {
			speechRecorder.playLast();
		},
		playAnswers : function() {
			this.trigger('playAnswers');
		}

	});

	return new UserConsoleView();
});
