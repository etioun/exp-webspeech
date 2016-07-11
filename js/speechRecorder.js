define([
'jquery',
'underscore',
'backbone',
'speechRecognition', 'p5'
], function($,_,Backbone, SpeechRecognition, p5){
  'use strict';

  var SpeechRecorder = function () {
    var defaults = {

    };

    var settings = {};

    var _lastSoundFile = null;

    var _recorder = null;

    var _mic = null;

    var _recording = false;

    var _tsData = {};

    var init = function(options) {
      this.listenTo(SpeechRecognition, 'start', startRecording);
      this.listenTo(SpeechRecognition, 'processing', stampStartSpeech);
      this.listenTo(SpeechRecognition, 'processed', stopRecording);
      this.listenTo(SpeechRecognition, 'nothing', stopRecording);

      // create an audio in
      _mic = new p5.AudioIn();
      _mic.start();
      // _mic.stop();

      // create a sound recorder
      _recorder = new p5.SoundRecorder();

      // connect the mic to the recorder
      _recorder.setInput(_mic);

      // create an empty sound file that we will use to playback the recording
      _lastSoundFile = new p5.SoundFile();
    }

    var startRecording = function() {
      console.log('recording...');

      _recording = true;
      _recorder.record(_lastSoundFile);
      _tsData.startRec = Date.now();
    }

    var stampStartSpeech = function () {
      _tsData.startSpeech = Date.now();
    }

    var stopRecording = function() {
      console.log('recording stoped');

      if (_recording) {
        _recording = false;
        _recorder.stop();
      }
    }

    var playLast = function () {
      if (_lastSoundFile == null || _lastSoundFile.isPlaying()) {
        return;
      }

      //hack to play the sound almost exactly when the speech start
      var cue = (_tsData.startSpeech - _tsData.startRec) / 1000;
      if (cue > 1) {
        cue -= 1;
      } else {
        cue =0;
      }

      _lastSoundFile.jump(cue);
      // _lastSoundFile.play();
    }

    var stop = function () {
      if (_lastSoundFile !== null) {
        _lastSoundFile.stop();
      }
    }

    var getSoundFile = function () {
      return _lastSoundFile;
    }

    return {
      init : init,
      playLast : playLast,
      stop : stop,
      getSoundFile : getSoundFile
    }
  }

  var obj = new SpeechRecorder();
  _.extend(obj, Backbone.Events);

  return obj;
});
