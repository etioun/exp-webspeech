/*global define*/
define([
	'jquery',
	'underscore',
	'backbone',
	'dialogReader',
	'speechSynth'
], function ($, _, Backbone, DialogReader, SpeechSynth) {
	'use strict';

	var SentenceView = Backbone.View.extend({

		initialize: function (Sentence) {
			this.model = Sentence;
			this.el = document.createElement("p");
			this.prefixe = '';
			this.suffixe = '';
			if (this.model.get('type') == "DN") {
				this.prefixe = " Amélie : ";
			} else if (this.model.get('type') == "DS") {
				this.prefixe = " Toi : ";
				this.suffixe = "    <== Vas-y dis-le ;)"
			}
			this.listenTo(Sentence, 'change:done', this.showDone);
		},

		render: function () {
			this.el.innerHTML = this.prefixe + this.model.get('body') + this.suffixe;
			return this.el;
		},

		showDone : function() {
			this.suffixe = "   Good !!!"
			this.render();
		}

	});

	return SentenceView;
});
