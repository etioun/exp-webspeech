/*global define*/
define([
	'jquery',
	'underscore',
	'backbone',
	'dialogReader',
	'speechSynth',
	'views/sentence'
], function ($, _, Backbone, DialogReader, SpeechSynth, SentenceView) {
	'use strict';

	var DialogView = Backbone.View.extend({

		el: '#dialog',

		initialize: function () {
			this.listenTo(DialogReader, 'nextSentence', this.showNext);
			// this.listenTo(DialogReader, 'nextSentence', this.sayIt);
		},

		render: function () {
			this.$el.empty();
		},

		//React to control activation
		showNext: function(Sentence) {
			this.$el.append(new SentenceView(Sentence).render());
		},

		//React to control activation
		// sayIt: function(Sentence) {
		// 	SpeechSynth.say(Sentence.body);
		// }
	});

	return DialogView;
});
