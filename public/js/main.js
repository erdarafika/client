/*** 
    Holla universe!
***/

/*
  SFMediaStream
  HTML5 media streamer library for playing music, video, playlist,
  or even live streaming microphone & camera with node server

  https://github.com/ScarletsFiction/SFMediaStream
*/
!function(e,n){"object"==typeof exports&&"undefined"!=typeof module?(module.exports={},n(module.exports,window,!0)):n(e,window)}(this||window,function(e,n,t){"use strict";var a={audioContext:!1,getElementAudioNode:function(e){return e.crossOrigin="anonymous",this.audioContext.createMediaElementSource(e)},getElementVideoNode:function(e){return e.crossOrigin="anonymous",null}},i={},o={webm:["opus","vorbis"],mp4:["mp4a.67","mp4a.40.29","mp4a.40.5","mp4a.40.2","mp3"],ogg:["opus","vorbis"]},r={webm:["vp8,opus","vp8,vorbis"],mp4:["mp4v.20.8,mp4a.40.2","mp4v.20.240,mp4a.40.2","avc1.42E01E,mp4a.40.2","avc1.58A01E,mp4a.40.2","avc1.64001E,mp4a.40.2"],"3gpp":["mp4v.20.8,samr"],ogg:["dirac,vorbis","theora,vorbis"]};!function(){var e=function(e){if(!n.AudioContext)return t();a.audioContext=new AudioContext;var i=a.audioContext.createBuffer(1,1,22050),o=a.audioContext.createBufferSource();o.buffer=i,o.connect(a.audioContext.destination),o.onended=function(){o.disconnect(0),o=i=null,t()},o.start?o.start(0):o.noteOn(0),a.audioContext.resume()};function t(){document.removeEventListener("touchstart",e,!0),document.removeEventListener("touchend",e,!0),document.removeEventListener("click",e,!0)}document.addEventListener("touchstart",e,!0),document.addEventListener("touchend",e,!0),document.addEventListener("click",e,!0)}();var c=function(e){e||(e=1e3);var n=e/1e3,t=this;t.debug=!1,t.playing=!1,t.latency=0,t.mimeType=null,t.bufferElement=[],t.audioContext=a.audioContext,t.outputNode=!1;var i=!0,o=!1,r=!1,c=new Audio,d=t.audioContext.createMediaElementSource(c);t.connect=function(e){!0===i&&(i=!1,d.disconnect()),t.outputNode=t.audioContext.createGain(),t.outputNode.connect(e),d.connect(e)},t.disconnect=function(){outputNode.disconnect(),i=!0,d.disconnect(),d.connect(t.audioContext.destination)},t.stop=function(){r.stop(),t.playing=!1,t.buffering=!1},t.setBufferHeader=function(n){if(n.data){var a=n.data;t.mimeType=n.mimeType,!1!==r?r.stop():d.connect(t.audioContext.destination),r=new u(t.mimeType,e,a),o=new Uint8Array(a),c.src=t.objectURL=r.objectURL,t.audioContext.decodeAudioData(a.slice(0),function(e){l=e.getChannelData(0).length})}else o=!1};var l=0;function f(e,n){var a;return t.bufferElement[e]=((a=t.audioContext.createBufferSource()).onended=function(){this.stop(),this.disconnect()},a),!1!==(n=function(e){var n=e.getChannelData(0).length-l;if(0===n)return!1;for(var a=e.numberOfChannels,i=t.audioContext.createBuffer(a,n,e.sampleRate),o=0;o<a;o++)i.getChannelData(o).set(e.getChannelData(o).subarray(l));return i}(n))&&(t.bufferElement[e].buffer=n,t.outputNode&&t.outputNode.context&&!1===i?t.bufferElement[e].connect(t.outputNode):t.bufferElement[e].connect(t.audioContext.destination),!0)}t.playStream=function(){t.playing=!0};var s=0;t.realtimeBufferPlay=function(e){if(!1!==t.playing&&(t.debug&&console.log("Receiving data",e[0].byteLength),0!==e[0].byteLength)){e=e[0],t.latency=Number(String(Date.now()).slice(-5,-3))-e[1]+n+t.audioContext.baseLatency;var a=s;++s>2&&(s=0),t.audioContext.decodeAudioData(function(e){var n=new Uint8Array(o.byteLength+e.byteLength);return n.set(o,0),n.set(new Uint8Array(e),o.byteLength),n.buffer}(e),function(e){!1!==f(a,e)&&t.bufferElement[a].start(0)})}},t.receiveBuffer=function(n){if(!1!==t.playing&&r.append&&(r.append(n[0]),c.paused&&c.play(),e)){t.latency=Number(String(Date.now()).slice(-5,-3))-n[1]+0+t.audioContext.baseLatency,t.debug&&console.log("Total latency: "+t.latency)}}};a.convert={midiToFreq:function(e){return e<=-1500?0:e>1499?3.282417553401589e38:440*Math.pow(2,(Math.floor(e)-69)/12)},freqToMidi:function(e){return e>0?Math.floor(Math.log(e/440)/Math.LN2*12+69):-1500},powerToDb:function(e){if(e<=0)return 0;var n=100+10/Math.LN10*Math.log(e);return n<0?0:n},dbToPower:function(e){return e<=0?0:(e>870&&(e=870),Math.exp(.1*Math.LN10*(e-100)))},ampToDb:function(e){return 20*(e>1e-5?Math.log(e)/Math.LN10:-5)},dbToAmp:function(e){return Math.pow(10,e/20)},velToAmp:function(e){return e/127}};var u=function(e,n,t){var a=this;a.source=new MediaSource,a.objectURL=URL.createObjectURL(a.source);var i=null;a.source.addEventListener("sourceopen",function(){(i=a.source.addSourceBuffer(e)).mode="sequence",i.appendBuffer(t)},{once:!0});var o=!1;a.source.addEventListener("updateend",function(){!1!==o&&(o=!1,i.remove(0,10))});var r=0;a.append=function(e){return null!==i&&(i.appendBuffer(e),(r+=n)>=2e4&&(o=!0),r/1e3)},a.stop=function(){i.updating&&i.abort(),"open"===a.source.readyState&&a.source.endOfStream()}},d=function(e){var n=this,t=["autoplay","loop","buffered","buffered","controller","currentTime","currentSrc","duration","ended","error","readyState","networkState","paused","played","seekable","seeking"],i=!1;if(Object.defineProperty(n,"audioOutput",{get:function(){return i||(i=a.getElementAudioNode(e)),i},enumerable:!0}),"video"===e.tagName.toLowerCase()){t=t.concat(["poster","height","width"]);var o=!1;Object.defineProperty(n,"videoOutput",{get:function(){return o||(o=a.getElementVideoNode(e)),o},enumerable:!0})}n.load=function(){e.load()},n.canPlayType=function(){e.canPlayType()};for(var r=0;r<t.length;r++)a.extra.objectPropertyLinker(n,e,t[r]);n.preload=!0,e.preload="metadata",n.audioFadeEffect=!0,n.speed=function(n){if(void 0===n)return e.defaultPlaybackRate;e.defaultPlaybackRate=e.playbackRate=n},n.mute=function(n){if(void 0===n)return e.muted;e.defaultMuted=e.muted=n};var c=1;n.volume=function(n){if(void 0===n)return c;e.volume=c=n},n.play=function(t){if(e.paused){if(n.audioFadeEffect)return e.volume=0,e.play(),void a.extra.fadeNumber(0,c,.02,400,function(n){e.volume=n},t);e.play(),t&&t()}else t&&t()},n.pause=function(t){e.paused?t&&t():n.audioFadeEffect?a.extra.fadeNumber(c,0,-.02,400,function(n){e.volume=n},function(){e.pause(),t&&t()}):(e.pause(),t&&t())},n.prepare=function(t,a,i){if(!i&&!e.paused)return n.pause(function(){n.prepare(t,a,!0)});for(var o=e.querySelectorAll("source"),r=o.length-1;r>=0;r--)o[r].remove();if("string"==typeof t)e.insertAdjacentHTML("beforeend",'<source src="'+t+'"/>');else{o="";for(r=0;r<t.length;r++)o+='<source src="'+t[r]+'"/>';e.insertAdjacentHTML("beforeend",o)}n.preload&&e.load(),a&&a()};var u={};function d(e){for(var t=0;t<u[e.type].length;t++)u[e.type][t](e,n)}n.on=function(t,a){var i=t.toLowerCase();return void 0===u[i]&&(e.addEventListener(t,d,!0),u[i]=[]),u[i].push(a),n},n.off=function(t,a){var i=t.toLowerCase();if(void 0!==u[i])return a?u[i].splice(u[i].indexOf(a),1):u[i].splice(0),0===u[i].length&&(u[i]=void 0,e.removeEventListener(t,d,!0)),n},n.once=function(t,a){return e.addEventListener(t,a,{once:!0}),n},n.destroy=function(){for(var t in u)n.off(t);for(var t in n.playlist.list.splice(0),n.playlist.original.splice(0),n)delete n[t];n=null,e.pause(),e.innerHTML=""};var l=!1;function f(){l||(l=!0,n.on("ended",function(){n.playlist.currentIndex<n.playlist.list.length-1?n.playlist.next(!0):n.playlist.loop&&n.playlist.play(0)}))}function s(e){if(u[e])for(var t=0;t<u[e].length;t++)u[e][t](n,n.playlist,n.playlist.currentIndex)}n.playlist={currentIndex:0,list:[],original:[],loop:!1,shuffled:!1,reload:function(e){this.original=e,this.shuffle(this.shuffled),f()},add:function(e){this.original.push(e),this.shuffle(this.shuffled),f()},remove:function(e){this.original.splice(e,1),this.shuffle(this.shuffled)},next:function(e){if(this.currentIndex++,this.currentIndex>=this.list.length){if(!this.loop)return void this.currentIndex--;this.currentIndex=0}e?this.play(this.currentIndex):s("playlistchange")},previous:function(e){if(this.currentIndex--,this.currentIndex<0){if(!this.loop)return void this.currentIndex++;this.currentIndex=this.list.length-1}e?this.play(this.currentIndex):s("playlistchange")},play:function(e){this.currentIndex=e,s("playlistchange"),n.prepare(this.list[e].stream,function(){n.play()})},shuffle:function(e){var n,t,a;if(!0===e)for(a=this.list.length-1;a>0;a--)n=Math.floor(Math.random()*(a+1)),t=this.list[a],this.list[a]=this.list[n],this.list[n]=t;else this.list=this.original.slice(0);this.shuffled=e}}},l=function(e,n){var t=this;n||(n=1e3),t.debug=!1,t.mediaStream=!1,t.onRecordingReady=null,t.onBufferProcess=null,t.mediaRecorder=null,t.recordingReady=!1,t.recording=!1,t.mediaGranted=!1,t.options={};var a=e.video?"video":"audio";if(!t.options.mimeType){var i=!1,c="audio"===a?o:r;for(var u in c){for(var d=a+"/"+u,l=c[u],f=0;f<l.length;f++){var s=d+';codecs="'+l[f]+'"';if(MediaRecorder.isTypeSupported(s)&&MediaSource.isTypeSupported(s)){i=s;break}}if(!1===i&&MediaRecorder.isTypeSupported(d)&&MediaSource.isTypeSupported(d)&&(i=d),!1!==i)break}t.options.mimeType=i,console.log("mimeType: "+i)}var v=function(e){t.mediaGranted=!0,t.mediaStream=e,t.bufferHeader=null;var a=!1;t.mediaRecorder=new MediaRecorder(e,t.options),t.debug&&console.log("MediaRecorder obtained"),t.mediaRecorder.onstart=function(e){t.recording=!0},t.mediaRecorder.ondataavailable=function(e){if(!1===a)"recording"===t.mediaRecorder.state&&(e.data.size<=1||(t.bufferHeader=e.data,a=e.data.size,t.onRecordingReady&&t.onRecordingReady({mimeType:t.options.mimeType,startTime:Date.now(),data:t.bufferHeader}),t.recordingReady=!0));else{var n=Number(String(Date.now()).slice(-5,-3));t.onBufferProcess([e.data,n])}},t.mediaRecorder.start(n)};t.startRecording=function(){return!1===t.mediaGranted||null===t.mediaRecorder?(t.recordingReady=!1,navigator.mediaDevices.getUserMedia(e).then(v).catch(console.error),!1):"recording"===t.mediaRecorder.state||(t.mediaRecorder.start(n),t.recording=!0,!0)},t.stopRecording=function(){if(t.mediaRecorder.stop(),t.mediaRecorder.stream.stop)t.mediaRecorder.stream.stop();else for(var e=t.mediaRecorder.stream.getTracks(),n=0;n<e.length;n++)e[n].stop(),t.mediaRecorder.stream.removeTrack(e[n]);t.mediaRecorder.ondataavailable=null,t.mediaRecorder.onstart=null,t.bufferHeader=null,t.recording=!1}};i.chorus=function(e){var n=a.audioContext,t=n.createGain(),i=void 0===e?n.createGain():null;i&&(e=i);var o=n.createGain(),r=n.createGain(),c=n.createChannelSplitter(2),u=n.createChannelMerger(2);e.connect(c),e.connect(o);for(var d=[{},{}],l=0;l<d.length;l++){var f=d[l];f.stream=n.createGain(),f.delayVibrato=n.createDelay(),f.delayFixed=n.createDelay(),f.feedback=n.createGain(),f.feedforward=n.createGain(),f.blend=n.createGain(),c.connect(f.stream,l,0),f.stream.connect(f.delayVibrato),f.stream.connect(f.delayFixed),f.delayVibrato.connect(f.feedforward),f.delayVibrato.connect(u,0,l),f.delayFixed.connect(f.feedback),f.feedback.connect(f.stream),f.blend.connect(u,0,l)}u.connect(r),o.connect(t),r.connect(t);var s=n.createOscillator(),v=n.createGain(),p=n.createGain();s.connect(v),s.connect(p),v.connect(d[0].delayVibrato.delayTime),p.connect(d[1].delayVibrato.delayTime),s.start(0),s.type="sine",s.frequency.value=.15,v.gain.value=.013,p.gain.value=-.017,d[0].delayFixed.delayTime.value=.005,d[1].delayFixed.delayTime.value=.007,d[0].delayVibrato.delayTime.value=.013,d[1].delayVibrato.delayTime.value=.017;var m={rate:0,intensity:0,mix:0},h={output:t,input:i,rate:function(e){if(void 0===e)return m.rate;m.rate=e,e=.29*e+.01,s.frequency.value=e},intensity:function(e){if(void 0===e)return m.intensity;m.intensity=e;for(var n=1-.2929*e,t=.2929*e+.7071,a=.7071*e,i=0;i<d.length;i++)d[i].blend.gain.value=n,d[i].feedforward.gain.value=t,d[i].feedback.gain.value=a},mix:function(e){if(void 0===e)return m.mix;m.mix=e,o.gain.value=e},destroy:function(){i&&i.disconnect(),t.disconnect(),s.stop(0),s.disconnect();for(var e=0;e<d.length;e++)d[e].stream.disconnect();for(var n in this)delete this[n];t=null}};return h.rate(.5),h.intensity(0),h.mix(.75),h},i.conReverb=function(e){var n=a.audioContext,t=n.createGain(),i=void 0===e?n.createGain():null;i&&(e=i);var o=n.createConvolver(),r=n.createGain(),c=n.createGain();function u(t){null!==o.buffer&&(o.disconnect(),o=n.createConvolver(),e.connect(o),o.connect(r)),o.buffer=t}return e.connect(c),e.connect(o),o.connect(r),c.connect(t),r.connect(t),{output:t,input:i,setBuffer:u,loadBuffer:function(e){var t=new XMLHttpRequest;t.open("GET",e,!0),t.responseType="arraybuffer",t.onload=function(){var e=t.response;n.decodeAudioData(e,function(e){u(e)},function(e){e.err})},t.send()},mix:function(e){if(void 0===e)return r.gain.value;c.gain.value=1-e,r.gain.value=e},destroy:function(){for(var e in i&&i.disconnect(),c.disconnect(),t.disconnect(),o.disconnect(),this)delete this[e];t=null}}},i.cutOff=function(e,n){var t=a.audioContext,i=t.createGain(),o=void 0===n?t.createGain():null;o&&(n=o);var r=t.createBiquadFilter();return r.type=e||"lowpass",r.frequency.value=350,r.Q.value=1,r.connect(i),n.connect(r),{output:i,input:o,type:function(e){if(void 0===e)return r.type;r.type=e},frequency:function(e){if(void 0===e)return r.frequency.value;r.frequency.value=e},width:function(e){if(void 0===e)return r.Q.value;r.Q.value=e},destroy:function(){for(var e in o&&o.disconnect(),r.disconnect(),i.disconnect(),this)delete this[e];i=null}}},i.delay=function(e){var n=a.audioContext,t=n.createGain(),i=void 0===e?n.createGain():null;i&&(e=i);var o=n.createGain(),r=n.createGain(),c=n.createGain(),u=n.createDelay();e.connect(o),o.connect(t),u.connect(c),c.connect(u),e.connect(u),u.connect(r),r.connect(t);var d={output:t,input:i,mix:function(e){if(void 0===e)return r.gain.value;o.gain.value=1-e,r.gain.value=e},time:function(e){if(void 0===e)return u.delayTime.value;u.delayTime.value=e},feedback:function(e){if(void 0===e)return c.gain.value;c.gain.value=e},destroy:function(){for(var e in i&&i.disconnect(),t.disconnect(),o.disconnect(),r.disconnect(),c.disconnect(),u.disconnect(),this)delete this[e];t=null}};return d.mix(.5),d.time(.3),d.feedback(.5),d},i.distortion=function(e){var n=a.audioContext,t=n.createGain(),i=void 0===e?n.createGain():null;i&&(e=i);var o=57*Math.PI/180,r=n.createWaveShaper();r.connect(t),e.connect(r);var c={amount:0};return{set:function(e){if(void 0===e)return c.amount;c.amount=e,e*=10;for(var t=new Float32Array(n.sampleRate),a=2/n.sampleRate,i=0;i<n.sampleRate;i++){var u=i*a-1;t[i]=(3+e)*u*o/(Math.PI+e*Math.abs(u))}r.curve=t},output:t,input:i,destroy:function(){for(var e in i&&i.disconnect(),r.disconnect(),t.disconnect(),r=t=null,this)delete this[e]}}},i.dubDelay=function(e){var n=a.audioContext,t=n.createGain(),i=void 0===e?n.createGain():null;i&&(e=i);var o=n.createGain(),r=n.createGain(),c=n.createGain(),u=n.createDelay(),d=n.createBiquadFilter();e.connect(o),o.connect(t),e.connect(r),e.connect(c),c.connect(d),d.connect(u),u.connect(c),u.connect(r),r.connect(t);var l={output:t,input:i,mix:function(e){if(void 0===e)return r.gain.value;o.gain.value=1-e,r.gain.value=e},time:function(e){if(void 0===e)return u.delayTime.value;u.delayTime.value=e},feedback:function(e){if(void 0===e)return c.gain.value;c.gain.value=e},cutoff:function(e){if(void 0===e)return d.frequency.value;d.frequency.value=e},destroy:function(){for(var e in i&&i.disconnect(),t.disconnect(),o.disconnect(),r.disconnect(),c.disconnect(),this)delete this[e];t=null}};return l.mix(.5),l.time(.7),l.feedback(.6),l.cutoff(700),l},i.equalizer=function(e,n){var t=e||[32,64,125,250,500,1e3,2e3,4e3,8e3,16e3],i=a.audioContext,o=i.createGain(),r=void 0===n?i.createGain():null;r&&(n=r);for(var c={},u=t.length-1,d=0;d<t.length;d++){var l=i.createBiquadFilter();l.gain.value=0,l.frequency.value=t[d],l.type=0===d?"lowshelf":d===u?"highshelf":"peaking",0!==d&&c[t[d-1]].connect(l),c[t[d]]=l}return n.connect(c[t[0]]),l.connect(o),{output:o,input:r,frequency:function(e,n){if(void 0===n)return c[e].gain.value;c[e].gain.value=n},destroy:function(){for(var e=0;e<t.length;e++)c[t[e]].disconnect();for(var n in c.splice(0),r&&r.disconnect(),o.disconnect(),this)delete this[n];c=o=null}}},i.fade=function(e){var n=a.audioContext,t=n.createGain(),i=void 0===e?n.createGain():null;return i&&(e=i),t.gain.value=1,e.connect(t),{output:t,input:i,in:function(e,a,i){t.gain.cancelScheduledValues(n.currentTime);var o=(1-t.gain.value)*e;t.gain.setTargetAtTime(1,n.currentTime,o*a),i&&setTimeout(i,1e3*a)},out:function(e,a,i){t.gain.cancelScheduledValues(n.currentTime);var o=t.gain.value*e;t.gain.setTargetAtTime(1e-5,n.currentTime,o/a),i&&setTimeout(i,1e3*a)},destroy:function(){for(var e in i&&i.disconnect(),t.disconnect(),this)delete this[e];t=null}}},i.flanger=function(e){var n=a.audioContext,t=n.createGain(),i=void 0===e?n.createGain():null;i&&(e=i);var o=n.createGain(),r=n.createGain(),c=n.createGain(),u=n.createDelay(),d=n.createOscillator(),l=n.createGain(),f=n.createGain();d.type="sine",e.connect(o),e.connect(c),o.connect(u),o.connect(r),u.connect(r),u.connect(f),f.connect(o),d.connect(l),l.connect(u.delayTime),c.connect(t),r.connect(t),d.start(0);var s={output:t,input:i,mix:function(e){if(void 0===e)return r.gain.value;c.gain.value=1-e,r.gain.value=e},time:function(e){if(void 0===e)return a.extra.denormalize(u.delayTime.value,.001,.02);u.delayTime.value=a.extra.normalize(e,.001,.02)},speed:function(e){if(void 0===e)return a.extra.denormalize(u.delayTime.value,.5,5);d.frequency.value=a.extra.normalize(e,.5,5)},depth:function(e){if(void 0===e)return a.extra.denormalize(u.delayTime.value,5e-4,.005);l.gain.value=a.extra.normalize(e,5e-4,.005)},feedback:function(e){if(void 0===e)return a.extra.denormalize(u.delayTime.value,0,.8);f.gain.value=a.extra.normalize(e,0,.8)},destroy:function(){for(var e in i&&i.disconnect(),t.disconnect(),o.disconnect(),c.disconnect(),this)delete this[e];t=null}};return s.time(.45),s.speed(.2),s.depth(.1),s.feedback(.1),s.mix(.5),s},i.harmonizer=function(e){var n=a.audioContext,t=n.createGain(),i=void 0===e?n.createGain():null;i&&(e=i);for(var o=[],r=[],c=[],u=0;u<8;u++)o[u]=n.createBiquadFilter(),o[u].type="bandpass",r[u]=n.createBiquadFilter(),r[u].type="bandpass",e.connect(o[u]),c[u]=n.createGain(),c[u].connect(t),o[u].connect(r[u]).connect(c[u]);t.gain.value=35;var d={pitch:0,slope:0,width:0},l={output:t,input:i,pitch:function(e){if(void 0===e)return d.pitch;d.pitch=e;for(var n=a.convert.midiToFreq(e),t=0;t<8;t++)o[t].frequency.value=n,r[t].frequency.value=n},slope:function(e){if(void 0===e)return d.slope;d.slope=e;for(var n=0;n<8;n++)c[n].gain.value=1+Math.sin(Math.PI+Math.PI/2*(e+n/8))},width:function(e){if(void 0===e)return d.width;d.width=e;for(var n=1;n<8;n++){var t=2+90*Math.pow(1-n/8,e);o[n].Q.value=t,r[n].Q.value=t}},destroy:function(){i&&i.disconnect(),t.disconnect();for(var e=0;e<8;e++)o[e].disconnect();for(var n in this)delete this[n];t=null}};return l.pitch(34),l.slope(.65),l.width(.15),l},i.noise=function(){var e=a.audioContext,n=e.createGain(),t=void 0===sourceNode?e.createGain():null;t&&(sourceNode=t);for(var i=Math.floor(9.73*e.sampleRate),o=new Float32Array(i),r=0;r<i;r++)o[r]=Math.sqrt(-2*Math.log(Math.random()))*Math.cos(2*Math.PI*Math.random())*.5;var c=e.createBuffer(2,i,e.sampleRate);c.getChannelData(0).set(o,0),c.getChannelData(1).set(o,0);var u=e.createBufferSource();return u.to(n),u.loop=!0,u.start(0),u.buffer=c,u.loopStart=9.73*Math.random(),{output:n,input:t,destroy:function(){for(var e in u.loop=!1,u.buffer=null,u.stop(0),u.disconnect(),u=null,t&&t.disconnect(),n.disconnect(),this)delete this[e];n=null}}},i.pingPongDelay=function(e){var n=a.audioContext,t=n.createGain(),i=void 0===e?n.createGain():null;i&&(e=i);var o=n.createDelay(),r=n.createDelay(),c=n.createGain(),u=n.createGain(),d=n.createGain(),l=n.createChannelMerger(2);e.connect(c),c.connect(t),o.connect(l,0,0),r.connect(l,0,1),o.connect(r),d.connect(o),r.connect(d),e.connect(d),l.connect(u),u.connect(t);var f={output:t,input:i,mix:function(e){if(void 0===e)return u.gain.value;c.gain.value=1-e,u.gain.value=e},time:function(e){if(void 0===e)return o.delayTime.value;o.delayTime.value=e,r.delayTime.value=e},feedback:function(e){if(void 0===e)return d.gain.value;d.gain.value=e},destroy:function(){for(var e in i&&i.disconnect(),t.disconnect(),c.disconnect(),d.disconnect(),this)delete this[e];t=null}};return f.mix(.5),f.time(.3),f.feedback(.5),f},i.pitchShift=function(e){var n=a.audioContext,t=n.createGain(),i=void 0===e?n.createGain():null;i&&(e=i);var o=.1,r=o/2,c=o*n.sampleRate,u=n.createGain(),d=n.createGain(),l=n.createDelay(),f=n.createDelay();u.connect(l.delayTime),d.connect(f.delayTime),e.connect(l),e.connect(f);var s=n.currentTime+r,v=n.currentTime+o;function p(e){for(var t=n.createBuffer(1,c,n.sampleRate),a=t.getChannelData(0),i=0;i<c;i++)a[i]=e?(c-i)/c:i/c;return t}for(var m=[0,0,0,0],h=[0,0,0,0],y=0;y<m.length;y++)m[y]=n.createBufferSource(),m[y].loop=!0,h[y]=n.createGain(),y<2?m[y].buffer=p(!1):(m[y].buffer=p(!0),h[y].gain.value=0),y%2?(h[y].connect(d),m[y].start(v)):(h[y].connect(u),m[y].start(s)),m[y].connect(h[y]);var g=function(){for(var e=n.createBuffer(1,c,n.sampleRate),t=e.getChannelData(0),a=r*n.sampleRate,i=c-a,o=0;o<c;o++)t[o]=o<a?Math.sqrt(o/a):Math.sqrt(1-(o-i)/a);return e}(),b=[0,0],x=[0,0];for(y=0;y<b.length;y++)b[y]=n.createBufferSource(),b[y].loop=!0,b[y].buffer=g,x[y]=n.createGain(),x[y].gain.value=0,b[y].connect(x[y].gain),y%2?(h[y].connect(d),b[y].start(v)):(h[y].connect(u),b[y].start(s)),x[y].connect(t);function T(e){u.gain.value=d.gain.value=.5*o*Math.abs(e)}l.connect(x[0]),f.connect(x[1]);var G={output:t,input:i,shift:function(e){if(void 0!==e){var n=e>0;h[0].gain.value=h[1].gain.value=n?0:1,h[2].gain.value=h[3].gain.value=n?1:0,T(e)}},destroy:function(){i&&i.disconnect(),t.disconnect();for(var e=0;e<b.length;e++)b[e].stop(),b[e].disconnect(),x[e].disconnect();for(e=0;e<m.length;e++)m[e].stop(),m[e].disconnect(),h[e].disconnect();for(var n in u.disconnect(),d.disconnect(),l.disconnect(),f.disconnect(),this)delete this[n];t=null}};return T(0),G},i.reverb=function(e){var n=a.audioContext,t=n.createGain(),i=void 0===e?n.createGain():null;i&&(e=i);var o=n.createConvolver(),r=n.createGain(),c=n.createGain();e.connect(c),c.connect(t),r.connect(t);var u=1,d=.1,l=!1;function f(){for(var t=n.sampleRate*u,a=n.createBuffer(2,t,n.sampleRate),i=a.getChannelData(0),c=a.getChannelData(1),f=0;f<t;f++){var s=l?t-f:f;i[f]=(2*Math.random()-1)*Math.pow(1-s/t,d),c[f]=(2*Math.random()-1)*Math.pow(1-s/t,d)}o.disconnect(),o=n.createConvolver(),e.connect(o),o.connect(r),o.buffer=a}return f(),{output:t,input:i,mix:function(e){if(void 0===e)return r.gain.value;c.gain.value=1-e,r.gain.value=e},time:function(e){if(void 0===e)return u;u=e,f()},decay:function(e){if(void 0===e)return d;d=e,f()},reverse:function(e){if(void 0===e)return l;l=e,f()},destroy:function(){for(var e in i&&i.disconnect(),c.disconnect(),t.disconnect(),o.disconnect(),this)delete this[e];t=null}}},i.stereoPanner=function(e){var n=a.audioContext,t=n.createGain(),i=void 0===e?n.createGain():null;i&&(e=i);var o=!1;if(n.createStereoPanner){var r=n.createStereoPanner();o=!0}else{(r=n.createPanner()).type="equalpower"}return e.connect(r),r.connect(t),r.pan.value=0,{output:t,input:i,set:function(e){if(void 0===e)return r.pan.value;o?r.pan.value=e:r.setPosition(e,0,1-Math.abs(e))},destroy:function(){for(var e in i&&i.disconnect(),t.disconnect(),r.disconnect(),this)delete this[e];t=r=null}}},i.tremolo=function(e){var n=a.audioContext,t=n.createGain(),i=void 0===e?n.createGain():null;i&&(e=i);var o=n.createGain(),r=n.createGain(),c=n.createGain();c.gain.value=0;var u=n.createWaveShaper();u.curve=new Float32Array([0,1]),u.connect(c.gain),e.connect(o),o.connect(t);var d=n.createOscillator();d.connect(u),d.type="sine",d.start(0),e.connect(c),c.connect(r),r.connect(t);var l={output:t,input:i,mix:function(e){if(void 0===e)return r.gain.value;o.gain.value=1-e,r.gain.value=e},speed:function(e){if(void 0===e)return a.extra.denormalize(d.frequency.value,0,20);d.frequency.value=a.extra.normalize(e,0,20)},depth:function(e){if(void 0===e)return 1-this.shaperNode.curve[0];u.curve=new Float32Array([1-e,1])},destroy:function(){for(var e in i&&i.disconnect(),t.disconnect(),o.disconnect(),c.disconnect(),this)delete this[e];t=null}};return l.speed(.2),l.depth(1),l.mix(.8),l},i.vibrato=function(e){var n=a.audioContext,t=n.createGain(),i=void 0===e?n.createGain():null;i&&(e=i),console.log("Vibrato was not finished yet");var o=n.createDelay(),r=n.createGain(),c=n.createGain(),u=n.createOscillator();return e.connect(c),c.connect(t),r.connect(t),o.delayTime.value=1,u.frequency.value=3,u.type="sine",u.start(0),u.connect(o.delayTime),e.connect(o),o.connect(r),{output:t,input:i,mix:function(e){if(void 0===e)return r.gain.value;c.gain.value=1-e,r.gain.value=e},delay:function(e){if(void 0===e)return o.delayTime.value;o.delayTime.value=e},depth:function(e){if(void 0===e)return depthNode.gain.value;depthNode.gain.value=e},speed:function(e){if(void 0===e)return u.frequency.value;u.frequency.value=e},destroy:function(){for(var n in i&&i.disconnect(),t.disconnect(),e.disconnect(o),e.disconnect(c),u.stop(),u.disconnect(),depthNode.disconnect(),this)delete this[n];t=null}}};var f=function(e,n){n||(n=1e3);var t=this;t.debug=!1,t.playing=!1,t.latency=0,t.mimeType=null,t.audioContext=a.audioContext,t.outputNode=!1;var i=!0,o=!1,r=t.audioContext.createMediaElementSource(e);t.audioConnect=function(e){!0===i&&(i=!1,r.disconnect()),t.outputNode=t.audioContext.createGain(),t.outputNode.connect(e),r.connect(e)},t.audioDisconnect=function(){outputNode.disconnect(),i=!0,r.disconnect(),r.connect(t.audioContext.destination)},t.stop=function(){o.stop(),t.playing=!1,t.buffering=!1},t.setBufferHeader=function(a){if(a.data){var i=a.data;t.mimeType=a.mimeType,!1!==o?o.stop():r.connect(t.audioContext.destination),o=new u(t.mimeType,n,i),e.src=t.objectURL=o.objectURL}},t.playStream=function(){t.playing=!0},t.receiveBuffer=function(a){if(!1!==t.playing&&o.append&&(o.append(a[0]),e.paused&&e.play(),n)){t.latency=Number(String(Date.now()).slice(-5,-3))-a[1]+0+t.audioContext.baseLatency,t.debug&&console.log("Total latency: "+t.latency)}}};a.extra=new function(){this.isMobile=function(){return/iPhone|iPad|iPod|Android|BlackBerry|BB10|Silk|Mobi/i.test(navigator.userAgent)},this.objectPropertyLinker=function(e,n,t){Object.defineProperty(e,t,{get:function(){return n[t]},set:function(e){n[t]=e},enumerable:!0,configurable:!0})},this.normalize=function(e,n,t){return(t-n)*e+n},this.denormalize=function(e,n,t){return(e-n)/(t-n)};var e=0;this.fadeNumber=function(n,t,a,i,o,r){e=0;var c=n,u=i/(Math.abs(n-t)/Math.abs(a));if(u&&u!=1/0)var d=setInterval(function(){if(e>=100&&clearInterval(d),e++,c=1e3*(c+a),c=Math.ceil(c)/1e3,a>=0&&(c>=t||n>=t)||a<=0&&(c<=t||n<=t)||c==1/0||!c)return clearInterval(d),o(t),void(r&&r());o&&o(c)},u);else setTimeout(function(){o&&o(t),r&&r()},i)};var n=[],t=0;this.preciseTimeout=function(e,a){var i=Date.now();return t++,n.push({id:t,when:i+a,func:e,fallback:setTimeout(function(){o(t).func()},a)}),c(),t},this.clearPreciseTimeout=function(e){o(e,n)};var a=[],i=0;function o(e,n){for(var t in n)if(n[t].id===e)return n.splice(t,1)}this.preciseInterval=function(e,n){var t=Date.now(),o={id:++i,interval:n,when:t+n,func:e};return o.fallback=setInterval(function(){o.when>=Date.now()||(o.when+=o.interval,o.func())},n),a.push(o),c(),i},this.clearPreciseInterval=function(e){var n=o(e,a);clearInterval(n.fallback)};var r=!1;function c(){if(!r){r=!0;requestAnimationFrame(function e(){if(0!==n.length||0!==a.length){requestAnimationFrame(e);var t=Date.now();for(var i in n)n[i].when<t&&(n[i].func(),clearTimeout(n[i].fallback),n.splice(i,1));for(var i in a)a[i].when<t&&(a[i].func(),a[i].when+=a[i].interval)}else r=!1})}}},t?(e.Media=a,e.MediaEffect=i,e.AudioStreamer=c,e.VideoStreamer=f,e.MediaPlayer=d,e.MediaPresenter=l):(e.ScarletsMedia=a,e.ScarletsMediaEffect=i,e.ScarletsAudioStreamer=c,e.ScarletsVideoStreamer=f,e.ScarletsMediaPlayer=d,e.ScarletsMediaPresenter=l)});
//# sourceMappingURL=SFMediaStream.min.js.map

const gun = Gun(['https://peer.nevalab.space/gun'])
const SEA = Gun.SEA
const now = moment();
const main = document.getElementById('main') 

const toHexString = function toHexString(byteArray) {
  return Array.prototype.map.call(byteArray, function(byte) {
    return ('0' + (byte & 0xFF).toString(16)).slice(-2);
  }).join('');
}

const smartTruncate = function smartTruncate(string, length) {
    var _ref = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
        _ref$mark = _ref.mark,
        mark = _ref$mark === undefined ? '\u2026' : _ref$mark,
        _ref$position = _ref.position,
        position = _ref$position === undefined ? length - 1 : _ref$position;

    if (typeof mark !== 'string') return string;

    var markOffset = mark.length;
    var minLength = 4;

    var str = string;

    if (typeof str === 'string') {
        str = str.trim();
    }

    var invalid = typeof str !== 'string' || str.length < minLength || typeof length !== 'number' || length <= minLength || length >= str.length - markOffset;

    if (invalid) return string;

    if (position >= length - markOffset) {
        var _start = str.substring(0, length - markOffset);
        return '' + _start + mark;
    }

    var start = str.substring(0, position);
    var end = str.slice(position + markOffset - length);

    return '' + start + mark + end;
}

const count = function count() {
    var msg = document.getElementsByClassName("msg")[0],
        charLeftLabel = "char-left",
        charLeft = document.getElementsByClassName(charLeftLabel)[0],
        maxChar = 200,
        maxCharWarn = 20;

    // show characters left at start
    charLeft.innerHTML = maxChar;

    // update while typing
    msg.onkeydown = function() {
        setTimeout(function() {
            charLeft.innerHTML = maxChar - msg.value.length;

            // whether or not to display warning class based on characters left
            var warnLabel = msg.value.length >= maxChar - maxCharWarn ? " warning" : "";
            charLeft.className = charLeftLabel + warnLabel;
        }, 1);
    };
}

const comment = function comment(id) {
    const msg = document.getElementById('msg.' + id).value
    if (msg && msg.length <= 1000) {
        document.getElementById('msg.' + id).value = ""
        const pair = localStorage.getItem('pair')
        const key = JSON.parse(pair)
        if (message) {
            post(id, 'replies', {
                message: msg, type: "text"
            }, key).then(res => {
                const msg = JSON.parse(res)
                const sig = "SEA"+JSON.stringify({m: {message: msg.message, type: "text"}, s: msg.sig})
                verify(sig, key.pub).then(result => {

                })
            })
        }
    } else {

    }
}

const showreply = function showreply(id) {
    if (!document.getElementById("c." + id)) {
        let target = document.getElementById(id)
        let div = document.createElement('div')
        div.id = "c." + id
        div.innerHTML = `
            <div>
                <textarea id="msg.${id}" class="card w-100" style="height:100px;" placeholder="give your thoughts ..."></textarea>
                <div class="comment">
                    <span class="toggle"><a onclick="comment('${id}')">Reply</a></span>
                    <span class="toggle"><a onclick="comAudio('${id}')" id="actAudio">Voice Reply</a></span>
                </div>
            </div>
        `
        target.parentNode.insertBefore(div, target.nextSibling);

        gun.get(id).map().on(function(data) {
            let target = document.getElementById("c." + id)
            let div = document.createElement('div')
            div.className = 'item-view-header'
            const msg = JSON.parse(data)
            if (msg.type === "audio") {
                const sig = "SEA"+JSON.stringify({m: {message: msg.message, type: msg.type}, s: msg.sig})
                if (sig !== undefined && msg.pubkey !== undefined) {
                    verify(sig, msg.pubkey).then(result => {
                        if (result.message) {
                            const blob = new Blob([hex2byte(result.message)], {type: "audio/webm;codecs=opus"});
                            const audioUrl = URL.createObjectURL(blob);
                            div.innerHTML = `
                            <p class="meta" style="font-size: .9em">
                            ${smartTruncate(msg.pubkey, 25)}
                            </p>
                            <div style="line-height: 1.42857143em;">
                                <audio id="${msg.timestamp}" controls>                           
                                    <source id="source" src="${audioUrl}" type="audio/webm;codecs=opus"/>                        
                                </audio>
                            </div>
                            <p class="meta" style="font-size: .9em">
                            ${moment(msg.timestamp).fromNow()}
                            </p>
                            <div class="comment" id="${msg.hash}">
                                <span class="toggle"><a id="show.${msg.hash}" onclick="showreply('${msg.hash}')">[+]</a></span>
                            </div>
                            `
                        }
                    })
                }
            } else if( msg.type === "text") {
                const sig = "SEA"+JSON.stringify({m: {message: msg.message, type: msg.type}, s: msg.sig})
                if (sig !== undefined && msg.pubkey !== undefined) {
                    verify(sig, msg.pubkey).then(result => {
                        if (result.message) {
                            div.innerHTML = `
                            <p class="meta" style="font-size: .9em">
                            ${smartTruncate(msg.pubkey, 25)}
                            </p>
                            <div style="line-height: 1.42857143em;">${result.message.replace(new RegExp('\r?\n','g'), '<br />')}</div>
                            <p class="meta" style="font-size: .9em">
                            ${moment(msg.timestamp).fromNow()}
                            </p>
                            <div class="comment" id="${msg.hash}">
                                <span class="toggle"><a id="show.${msg.hash}" onclick="showreply('${msg.hash}')">[+]</a></span>
                            </div>
                            `
                        }
                    })
                }
            }
            target.appendChild(div)
            document.getElementById('show.'+id).setAttribute('onclick', "hide('"+id+"')")
            document.getElementById('show.'+id).innerHTML="[-]"
        });
    }
}

const hide = function hide(id){
    document.getElementById("c."+id).remove()
    document.getElementById('show.'+id).setAttribute('onclick', "showreply('"+id+"')")
    document.getElementById('show.'+id).innerHTML="[+]"
}

const hideanon = function hideanon(id){
    document.getElementById("c."+id).remove()
    document.getElementById('show.'+id).setAttribute('onclick', "showreplyanon('"+id+"')")
    document.getElementById('show.'+id).innerHTML="[+]"
}

const showreplyanon = function showreplyanon(id) {
    if (!document.getElementById("c." + id)) {
        let target = document.getElementById(id)
        let div = document.createElement('div')
        div.id = "c." + id
        target.parentNode.insertBefore(div, target.nextSibling);

        gun.get(id).map().on(function(data) {
            let target = document.getElementById("c." + id)
            let div = document.createElement('div')
            div.className = 'item-view-header'
            const msg = JSON.parse(data)
            if (msg.type === "audio") {
                const sig = "SEA"+JSON.stringify({m: {message: msg.message, type: msg.type}, s: msg.sig})
                if (sig !== undefined && msg.pubkey !== undefined) {
                    verify(sig, msg.pubkey).then(result => {
                        if (result.message) {
                            const blob = new Blob([hex2byte(result.message)], {type: "audio/webm;codecs=opus"});
                            const audioUrl = URL.createObjectURL(blob);
                            div.innerHTML = `
                            <p class="meta" style="font-size: .9em">
                            ${smartTruncate(msg.pubkey, 25)}
                            </p>
                            <div style="line-height: 1.42857143em;">
                                <audio id="${msg.timestamp}" controls>                           
                                    <source id="source" src="${audioUrl}" type="audio/webm;codecs=opus"/>                        
                                </audio>
                            </div>
                            <p class="meta" style="font-size: .9em">
                            ${moment(msg.timestamp).fromNow()}
                            </p>
                            <div class="comment" id="${msg.hash}">
                                <span class="toggle"><a id="show.${msg.hash}" onclick="showreplyanon('${msg.hash}')">[+]</a></span>
                            </div>
                            `
                        }
                    })
                }
            } else if( msg.type === "text") {
                const sig = "SEA"+JSON.stringify({m: {message: msg.message, type: msg.type}, s: msg.sig})
                if (sig !== undefined && msg.pubkey !== undefined) {
                    verify(sig, msg.pubkey).then(result => {
                        if (result.message) {
                            div.innerHTML = `
                            <p class="meta" style="font-size: .9em">
                            ${smartTruncate(msg.pubkey, 25)}
                            </p>
                            <div style="line-height: 1.42857143em;">${result.message.replace(new RegExp('\r?\n','g'), '<br />')}</div>
                            <p class="meta" style="font-size: .9em">
                            ${moment(msg.timestamp).fromNow()}
                            </p>
                            <div class="comment" id="${msg.hash}">
                                <span class="toggle"><a id="show.${msg.hash}" onclick="showreplyanon('${msg.hash}')">[+]</a></span>
                            </div>
                            `
                        }
                    })
                }
            }
            target.appendChild(div)
            document.getElementById('show.'+id).setAttribute('onclick', "hideanon('"+id+"')")
            document.getElementById('show.'+id).innerHTML="[-]"
        });
    }
}

const notsigned = function notsigned() {
    let p = document.createElement('form')
    p.className = 'mb-0'
    p.id = 'form-signin'
    p.innerHTML = `
    <div class="item-view-header">
        <div style="margin-bottom: 20px;">
            Your identity is created here, by you. Not on a server. Your identity on this site is cryptographic keys owned by you. Only you have access to it, meaning even we cannot reset your password!. They enable additional features, but you can participate using anonymous keys.
        </div>
        <input id="alias" class="question" type="text" placeholder="alias">

        <input id="password" class="question" type="password" autocomplete="password" placeholder="password">

        <input id="pin" class="question" type="password" autocomplete="password" placeholder="pin">

        <div class="comment" style="margin-top: 15px">
            <span class="toggle"><a id="signin">[ SIgn In ]</a></span> <span class="toggle"><a id="signup">[ Sign Up ]</a></span> <span class="toggle"><a id="anonymous">[ Anonymous ]</a></span>
        </div>
    </div>
        `
    main.appendChild(p)

    gun.get('posts').map().on(function(data) {
        let target = document.getElementById('main')
        let div = document.createElement('div')
        div.className = 'item-view-header'
        const msg = JSON.parse(data)
        const sig = "SEA"+JSON.stringify({m: {message: msg.message, type: msg.type}, s: msg.sig})
        if (msg.sig !== undefined && msg.pubkey !== undefined) {
            verify(sig, msg.pubkey).then(result => {
                const blob = new Blob([hex2byte(result.message)], {type: "audio/webm;codecs=opus"});
                const audioUrl = URL.createObjectURL(blob);
                if (result.message) {
                   if (msg.type === "audio") {
                    div.innerHTML = `
                        <p class="meta" style="font-size: .9em">
                        ${smartTruncate(msg.pubkey, 25)}
                        </p>
                        <div style="line-height: 1.42857143em">
                           <audio id="${msg.timestamp}" controls>                           
                              <source id="source" src="${audioUrl}" type="audio/webm;codecs=opus"/>                        
                           </audio>
                        </div>
                        <p class="meta" style="font-size: .9em">
                        ${moment(msg.timestamp).fromNow()}
                        </p>
                        <div class="comment" id="${msg.hash}">
                            <span class="toggle"><a id="show.${msg.hash}" onclick="showreplyanon('${msg.hash}')">[+]</a></span>
                        </div>
                    `
                   } else if (msg.type === "text") {
                    div.innerHTML = `
                        <p class="meta" style="font-size: .9em">
                        ${smartTruncate(msg.pubkey, 25)}
                        </p>
                        <div style="line-height: 1.42857143em;">${result.message.replace(new RegExp('\r?\n','g'), '<br />')}</div>
                        <p class="meta" style="font-size: .9em">
                        ${moment(msg.timestamp).fromNow()}
                        </p>
                        <div class="comment" id="${msg.hash}">
                            <span class="toggle"><a id="show.${msg.hash}" onclick="showreplyanon('${msg.hash}')">[+]</a></span>
                        </div>
                    `
                  }
               }

            })
        }
        target.parentNode.insertBefore(div, target.nextSibling);
    });

    document.getElementById('signin').addEventListener('click', (event) => {
        event.preventDefault()
        const alias = document.getElementById('alias').value
        const password = document.getElementById('password').value
        const pin = document.getElementById('pin').value
        if (alias && password && pin) {
            sea(alias).then(res => {
                if (res == undefined) {
                    console.log('No user found on peer.')
                } else {
                    try {
                        const sea = JSON.parse(res)
                        const struct = {ct: sea.ct, iv: sea.iv, s: sea.s}
                        const auth = 'SEA{"m":{"ct":"'+sea.ct+'","iv":"'+sea.iv+'","s":"'+sea.s+'"},"s":"'+sea.sig+'"}'
                        verify(auth, sea.pub).then(res_sig => {
                            signin(password, pin, res_sig).then(res => {
                                if (res == undefined) {

                                } else {
                                    let pair = JSON.stringify(res)
                                    localStorage.setItem('pair', pair)
                                    let el_signin = document.getElementById('form-signin')
                                    el_signin.remove()
                                    sig()
                                }
                            })
                        })
                    } catch (error) {

                    }
                }
            })
        }
    })

    document.addEventListener('click', function(event) {
        if (!event.target.matches('#anonymous')) return;
        event.preventDefault();
        anonymous().then(x => {
            const pair = JSON.stringify(x)
            localStorage.setItem('pair', pair)
            let el_signin = document.getElementById('form-signin')
            el_signin.remove()
            sig()
        })
    }, false)

    document.addEventListener('click', function(event) {
        if (!event.target.matches('#signup')) return;
        event.preventDefault();
        const alias = document.getElementById('alias').value
        const password = document.getElementById('password').value
        const pin = document.getElementById('pin').value
        if (alias && password && pin) {
            register(alias, password, pin).then(res => {
                if (res == undefined) {

                } else {
                    let pair = JSON.stringify(res)
                    // localStorage.setItem('pair', pair)
                    document.getElementById('password').value = ""
                    document.getElementById('pin').value = ""
                    // let el_signin = document.getElementById('form-signin')
                    // el_signin.remove()
                    // sig()
                }
            })
        }
    }, false)
}

const sig = function signed() {
    let user = localStorage.getItem('pair')
    let pubkey = JSON.parse(user)
    let main = document.getElementById('main')
    let p = document.createElement('form')
    p.className = 'mb-1'
    p.id = 'post'
    p.innerHTML = `
        <div class="item-view-header">
            ${smartTruncate(pubkey.pub, 25)}
            <textarea id="message" class="msg" placeholder="Write something ..." onclick="count()"></textarea>
            <div class="comment">
                <span class="toggle"><a id="share">Post</a></span> 
                <span class="toggle"><a onclick="handleAction()" id="action"> Voice Post </a></span
                <span class="char-left"></span>
            <adiv>
        </div>
        `
    main.appendChild(p)

    gun.get('posts').map().on(function(data) {
        let target = document.getElementById('main')
        let div = document.createElement('div')
        div.className = 'item-view-header'
        const msg = JSON.parse(data)
        const sig = "SEA"+JSON.stringify({m: {message: msg.message, type: msg.type}, s: msg.sig})
        if (msg.sig !== undefined && msg.pubkey !== undefined) {
            verify(sig, msg.pubkey).then(result => {
                const blob = new Blob([hex2byte(result.message)], {type: "audio/webm;codecs=opus"});
                const audioUrl = URL.createObjectURL(blob);
                if (result.message) {
                   if (msg.type === "audio") {
                    div.innerHTML = `
                        <p class="meta" style="font-size: .9em">
                        ${smartTruncate(msg.pubkey, 25)}
                        </p>
                        <div style="line-height: 1.42857143em">
                           <audio id="${msg.timestamp}" controls>                           
                              <source id="source" src="${audioUrl}" type="audio/webm;codecs=opus"/>                        
                           </audio>
                        </div>
                        <p class="meta" style="font-size: .9em">
                        ${moment(msg.timestamp).fromNow()}
                        </p>
                        <div class="comment" id="${msg.hash}">
                            <span class="toggle"><a id="show.${msg.hash}" onclick="showreply('${msg.hash}')">[+]</a></span>
                        </div>
                    `
                   } else if (msg.type === "text") {
                    div.innerHTML = `
                        <p class="meta" style="font-size: .9em">
                        ${smartTruncate(msg.pubkey, 25)}
                        </p>
                        <div style="line-height: 1.42857143em;">${result.message.replace(new RegExp('\r?\n','g'), '<br />')}</div>
                        <p class="meta" style="font-size: .9em">
                        ${moment(msg.timestamp).fromNow()}
                        </p>
                        <div class="comment" id="${msg.hash}">
                            <span class="toggle"><a id="show.${msg.hash}" onclick="showreply('${msg.hash}')">[+]</a></span>
                        </div>
                    `
                  }
                }
            })
        }
        target.parentNode.insertBefore(div, target.nextSibling);
    });

    document.getElementById('share').addEventListener('click', (event) => {
        event.preventDefault()
        const message = document.getElementById('message').value
        const pair = localStorage.getItem('pair')
        const key = JSON.parse(pair)
        if (message) {
            post('posts', 'public', {
                message: message, type: "text"
            }, key).then(res => {
                const msg = JSON.parse(res)
                const sig = "SEA"+JSON.stringify({m: {message: msg.message, type: "text"}, s: msg.sig})
                verify(sig, key.pub).then(result => {
                    document.getElementById('message').value = ""
                })
            })
        }
    })

    document.addEventListener('click', function(event) {
        if (!event.target.matches('#signout')) return;
        event.preventDefault();
        localStorage.removeItem('pair')
        const el = document.getElementById('post')
        el.remove()
        notsigned()
    }, false)
}

const anonymous = async() => {
    try {
        const result = await SEA.pair()
        return result
    } catch (error) {

    }
}

const register = async(username, password, salt) => {
    try {
        const pair = await SEA.pair()
        const proof = await SEA.work(password, salt)
        const auth = await SEA.encrypt(pair, proof)
        const signed = await SEA.sign(auth, pair)
        const enc = JSON.parse(auth.substr(3)) 
        const sigm = JSON.parse(signed.substr(3))
        const obj = {
            pub: pair.pub,
            epub: pair.epub,
            ct: enc.ct,
            iv: enc.iv,
            s: enc.s, 
            sig: sigm.s
        }
        const jstring = JSON.stringify(obj)
        const user = await gun.get(username).get('sea').put(jstring)
        return user
    } catch (error) {

    }
}

const sea = async(alias) => {
    try {
        const result = await gun.get(alias).get('sea')
        return result
    } catch (error) {

    }
}

const signin = async(password, salt, auth) => {
    try {
        const login = await SEA.work(password, salt)
        const keys = await SEA.decrypt(auth, login)
        return keys
    } catch (error) {

    }
}

const sign = async(data, pub) => {
    try {
        const result = await SEA.sign(data, pub)
        return result
    } catch (error) {

    }
}

const verify = async(data, pub) => {
    try {
        const result = await SEA.verify(data, pub)
        return result
    } catch (error) {

    }
}

const encrypt = async(data, pub) => {
    try {
        const result = await SEA.encrypt(data, pub)
        return result
    } catch (error) {

    }
}

const decrypt = async(data, pub) => {
    try {
        const result = await SEA.decrypt(data, pub)
        return result
    } catch (error) {

    }
}

// Elliptic-curve Diffie–Hellman

const secret = async(epub, pair) => {
    try {
        const result = await SEA.secret(epub, pair);
        return result
    } catch (error) {

    }
}

const post = async(node, path, data, pair) => {
    if (pair) {
        try {
            if (pair.pub == undefined || pair.pub == "") {
                
            } else {
                const signed = await SEA.sign(data, pair)
                const seasig = JSON.parse(signed.substr(3))
                const hash = sha256(path + '.' + new Date().getTime() + '~' + pair.pub+seasig.m.message+seasig.s)
                const obj = {
                    hash: hash,
                    pubkey: pair.pub,
                    message: seasig.m.message,
                    type: seasig.m.type,
                    sig: seasig.s,
                    timestamp: new Date().getTime()
                }
                const jstring = JSON.stringify(obj)
                const result = await gun.get(node).get(path + '.' + new Date().getTime() + '~' + pair.pub).put(jstring)
                return result
            }
        } catch (error) {

        }
    }
}

const blob2abuff = async (blob) => {
    const result = new Response(blob).arrayBuffer();
    return result;
}

const buf2hex = function buf2hex(buffer) {
  return Array.prototype.map.call(new Uint8Array(buffer), x => ('00' + x.toString(16)).slice(-2)).join('');
}

const hex2byte = function hex2byte(str) {
  if (!str) {
    return new Uint8Array();
  }
  
  var a = [];
  for (var i = 0, len = str.length; i < len; i+=2) {
    a.push(parseInt(str.substr(i,2),16));
  }
  
  return new Uint8Array(a);
}

const recordAudio = () =>
  new Promise(async resolve => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    const audioChunks = [];

    mediaRecorder.addEventListener("dataavailable", event => {
      audioChunks.push(event.data);
    });

    const start = () => mediaRecorder.start();

    const stop = () =>
      new Promise(resolve => {
        mediaRecorder.addEventListener("stop", () => {
          const audioBlob = new Blob(audioChunks);
          const audioUrl = URL.createObjectURL(audioBlob);
          const audio = new Audio(audioUrl);
          const play = () => audio.play();
          blob2abuff(audioBlob).then(data => {
            const uint8View = new Uint8Array(data);
            const hex = buf2hex(uint8View)
	        const pair = localStorage.getItem('pair')
            const key = JSON.parse(pair)
            post('posts', 'public', {message: hex, type: "audio"}, key).then(res => {
                const msg = JSON.parse(res)
                const sig = "SEA"+JSON.stringify({m: {message: msg.message, type: "audio"}, s: msg.sig})
            })
          })
          resolve({ audioBlob, audioUrl, play });
        });

        mediaRecorder.stop();
      });

    resolve({ start, stop });
});

const commentAudio = (id) =>
  new Promise(async resolve => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    const audioChunks = [];

    mediaRecorder.addEventListener("dataavailable", event => {
      audioChunks.push(event.data);
    });

    const start = () => mediaRecorder.start();

    const stop = () =>
      new Promise(resolve => {
        mediaRecorder.addEventListener("stop", () => {
          const audioBlob = new Blob(audioChunks);
          const audioUrl = URL.createObjectURL(audioBlob);
          const audio = new Audio(audioUrl);
          const play = () => audio.play();
          blob2abuff(audioBlob).then(data => {
            const uint8View = new Uint8Array(data);
            const hex = buf2hex(uint8View)
	        const pair = localStorage.getItem('pair')
            const key = JSON.parse(pair)
            post(id, 'replies', {message: hex, type: "audio"}, key).then(res => {
                const msg = JSON.parse(res)
                const sig = "SEA"+JSON.stringify({m: {message: msg.message, type: "audio"}, s: msg.sig})
            })
          })
          resolve({ audioBlob, audioUrl, play });
        });

        mediaRecorder.stop();
      });

    resolve({ start, stop });
});

const sleep = time => new Promise(resolve => setTimeout(resolve, time));

const handleAction = async () => {
  const recorder = await recordAudio();
  const actionButton = document.getElementById('action');
  actionButton.disabled = true;
  recorder.start();
  await sleep(9000);
  const audio = await recorder.stop();
  audio.play();
  await sleep(9000);
  actionButton.disabled = false;
}

const comAudio = async (id) => {
    const recorder = await commentAudio(id);
    const actionButton = document.getElementById('actAudio');
    actionButton.disabled = true;
    recorder.start();
    await sleep(9000);
    const audio = await recorder.stop();
    audio.play();
    await sleep(9000);
    actionButton.disabled = false;
}

class App {
    constructor() {

    }

    init() {
        this.render()
    }

    render() {
        let pair = localStorage.getItem('pair')
        if (pair !== null) {
            sig()
        } else {
            notsigned()
        }
    }
}

let app = new App()
app.init()
