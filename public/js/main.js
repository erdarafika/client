/*** 
    Holla universe!
***/

// https://www.w3schools.com/tags/ref_av_dom.asp
// https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement
var ScarletsMediaPlayer = function(element){
	// https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Media_events
	var self = this;

	var propertyLinker = ['autoplay', 'loop', 'buffered', 'buffered', 'controller', 'currentTime', 'currentSrc', 'duration', 'ended', 'error', 'readyState', 'networkState', 'paused', 'played', 'seekable', 'seeking'];

	// Get element audio for output node
	var audioOutputNode = false;
	Object.defineProperty(self, 'audioOutput', {
		get: function(){
			if(!audioOutputNode)
				audioOutputNode = ScarletsMedia.getElementAudioNode(element);

			return audioOutputNode;
		},
		enumerable: true
	});

	if(element.tagName.toLowerCase() === 'video'){
		propertyLinker = propertyLinker.concat(['poster', 'height', 'width']);

		// Get element video for output node
		var videoOutputNode = false;
		Object.defineProperty(self, 'videoOutput', {
			get: function(){
				if(!videoOutputNode)
					videoOutputNode = ScarletsMedia.getElementVideoNode(element);

				return videoOutputNode;
			},
			enumerable: true
		});
	}

	// Reference element function
	self.load = function(){
		element.load();
	}

	self.canPlayType = function(){
		element.canPlayType();
	}

	// Reference element property
	for (var i = 0; i < propertyLinker.length; i++) {
		ScarletsMedia.extra.objectPropertyLinker(self, element, propertyLinker[i]);
	}

	self.preload = true;
	element.preload = 'metadata';
	self.audioFadeEffect = true;

	self.speed = function(set){
		if(set === undefined) return element.defaultPlaybackRate;
		element.defaultPlaybackRate = element.playbackRate = set;
	}

	self.mute = function(set){
		if(set === undefined) return element.muted;
		element.defaultMuted = element.muted = set;
	}

	var volume = 1;
	self.volume = function(set){
		if(set === undefined) return volume;
		element.volume = volume = set;
	}

	self.play = function(callback){
		if(!element.paused){
			if(callback) callback();
			return;
		}
		if(self.audioFadeEffect){
			element.volume = 0;
			element.play();
			ScarletsMedia.extra.fadeNumber(0, volume, 0.02, 400, function(num){
				element.volume = num;
			}, callback);
			return;
		}
		element.play();
		if(callback) callback();
	}

	self.pause = function(callback){
		if(element.paused){
			if(callback) callback();
			return;
		}
		if(self.audioFadeEffect){
			ScarletsMedia.extra.fadeNumber(volume, 0, -0.02, 400, function(num){
				element.volume = num;
			}, function(){
				element.pause();
				if(callback) callback();
			});
			return;
		}
		element.pause();
		if(callback) callback();
	}

	self.prepare = function(links, callback, force){
		// Stop playing media
		if(!force && !element.paused)
			return self.pause(function(){
				self.prepare(links, callback, true);
			});

		var temp = element.querySelectorAll('source');
		for (var i = temp.length - 1; i >= 0; i--) {
			temp[i].remove();
		}

		if(typeof links === 'string')
			element.insertAdjacentHTML('beforeend', `<source src="${links}"/>`);
		else{
			temp = '';
			for (var i = 0; i < links.length; i++) {
				temp += `<source src="${links[i]}"/>`;
			}
			element.insertAdjacentHTML('beforeend', temp);
		}

		// Preload data
		if(self.preload) element.load();
		if(callback) callback();
	}

	var eventRegistered = {};
	function eventTrigger(e){
		for (var i = 0; i < eventRegistered[e.type].length; i++) {
			eventRegistered[e.type][i](e, self);
		}
	}

	// https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Media_events
	self.on = function(eventName, callback){
		var name = eventName.toLowerCase();
		if(eventRegistered[name] === undefined){
			element.addEventListener(eventName, eventTrigger, true);
			eventRegistered[name] = [];
		}
		eventRegistered[name].push(callback);
		return self;
	}

	self.off = function(eventName, callback){
		var name = eventName.toLowerCase();
		if(eventRegistered[name] === undefined)
			return;

		if(!callback)
			eventRegistered[name].splice(0);
		else
			eventRegistered[name].splice(eventRegistered[name].indexOf(callback), 1);

		if(eventRegistered[name].length === 0){
			eventRegistered[name] = undefined;
			element.removeEventListener(eventName, eventTrigger, true);
		}
		return self;
	}

	self.once = function(eventName, callback){
		element.addEventListener(eventName, callback, {once:true});
		return self;
	}

	self.destroy = function(){
		for(var key in eventRegistered){
			self.off(key);
		}
		self.playlist.list.splice(0);
		self.playlist.original.splice(0);
		for(var key in self){
			delete self[key];
		}
		self = null;

		element.pause();
		element.innerHTML = '';
	}

	var playlistInitialized = false;
	function internalPlaylistEvent(){
		if(playlistInitialized) return;
		playlistInitialized = true;

		self.on('ended', function(){
			if(self.playlist.currentIndex < self.playlist.list.length - 1)
				self.playlist.next(true);
			else if(self.playlist.loop)
				self.playlist.play(0);
		});
	}

	function playlistTriggerEvent(name){
		if(!eventRegistered[name]) return;
		for (var i = 0; i < eventRegistered[name].length; i++) {
			eventRegistered[name][i](self, self.playlist, self.playlist.currentIndex);
		}
	}

	self.playlist = {
		currentIndex:0,
		list:[],
		original:[],
		loop:false,
		shuffled:false,

		// lists = [{yourProperty:'', stream:['main.mp3', 'fallback.ogg', ..]}, ...]
		reload:function(lists){
			this.original = lists;
			this.shuffle(this.shuffled);
			internalPlaylistEvent();
		},

		// obj = {yourProperty:'', stream:['main.mp3', 'fallback.ogg']}
		add:function(obj){
			this.original.push(obj);
			this.shuffle(this.shuffled);
			internalPlaylistEvent();
		},

		// index from 'original' property
		remove:function(index){
			this.original.splice(index, 1);
			this.shuffle(this.shuffled);
		},

		next:function(autoplay){
			this.currentIndex++;
			if(this.currentIndex >= this.list.length){
				if(this.loop)
					this.currentIndex = 0;
				else{
					this.currentIndex--;
					return;
				}
			}

			if(autoplay)
				this.play(this.currentIndex);
			else playlistTriggerEvent('playlistchange');
		},

		previous:function(autoplay){
			this.currentIndex--;
			if(this.currentIndex < 0){
				if(this.loop)
					this.currentIndex = this.list.length - 1;
				else{
					this.currentIndex++;
					return;
				}
			}

			if(autoplay)
				this.play(this.currentIndex);
			else playlistTriggerEvent('playlistchange');
		},

		play:function(index){
			this.currentIndex = index;
			playlistTriggerEvent('playlistchange');

			self.prepare(this.list[index].stream, function(){
				self.play();
			});
		},

		shuffle:function(set){
			if(set === true){
			    var j, x, i;
			    for (i = this.list.length - 1; i > 0; i--) {
			        j = Math.floor(Math.random() * (i + 1));
			        x = this.list[i];
			        this.list[i] = this.list[j];
			        this.list[j] = x;
			    }
			}
			else this.list = this.original.slice(0);

			this.shuffled = set;
		}
	};
}

var MediaBuffer = function(mimeType, chunksDuration, bufferHeader){
	var scope = this;
	scope.source = new MediaSource();
	scope.objectURL = URL.createObjectURL(scope.source);

	var sourceBuffer = null;
	scope.source.addEventListener('sourceopen', function(){
		sourceBuffer = scope.source.addSourceBuffer(mimeType);
		sourceBuffer.mode = 'sequence';
		sourceBuffer.appendBuffer(bufferHeader);
	}, {once:true});

	var removing = false;
	scope.source.addEventListener('updateend', function(){
		if(removing === false) return;

		removing = false;
		sourceBuffer.remove(0, 10);
	});

	var totalTime = 0;
	scope.append = function(arrayBuffer){
		if(sourceBuffer === null) return false;

		sourceBuffer.appendBuffer(arrayBuffer);
		totalTime += chunksDuration;

		if(totalTime >= 20000)
			removing = true;

		return totalTime/1000;
	}

	scope.stop = function(){
		if(sourceBuffer.updating)
			sourceBuffer.abort();

		if(scope.source.readyState === "open")
			scope.source.endOfStream();
	}
}

// Minimum 3 bufferElement
var ScarletsAudioStreamer = function(chunksDuration){
	var bufferElement = 3;

	if(!chunksDuration) chunksDuration = 1000;
	var chunksSeconds = chunksDuration/1000;

	var scope = this;

	scope.debug = false;
	scope.playing = false;
	scope.latency = 0;
	scope.mimeType = null;
	scope.bufferElement = [];

	scope.audioContext = ScarletsMedia.audioContext;
	scope.outputNode = false; // Set this to a connectable Audio Node

	// If the outputNode is not set, then the audio will be outputted directly
	var directAudioOutput = true;

	var bufferHeader = false;
	var mediaBuffer = false;

	var audioElement = new Audio();
	var audioNode = scope.audioContext.createMediaElementSource(audioElement);

	scope.connect = function(node){
		if(directAudioOutput === true){
			directAudioOutput = false;
			audioNode.disconnect();
		}

		scope.outputNode = scope.audioContext.createGain();
		scope.outputNode.connect(node);
		audioNode.connect(node);
	}

	scope.disconnect = function(){
		outputNode.disconnect();
		directAudioOutput = true;

		audioNode.disconnect();
		audioNode.connect(scope.audioContext.destination);
	}

	scope.stop = function(){
		mediaBuffer.stop();
		scope.playing = false;
		scope.buffering = false;
	}

	scope.setBufferHeader = function(packet){
		if(!packet.data){
			bufferHeader = false;
			return;
		}

		var arrayBuffer = packet.data;
		scope.mimeType = packet.mimeType;

		if(mediaBuffer !== false)
			mediaBuffer.stop();
		else audioNode.connect(scope.audioContext.destination);

		mediaBuffer = new MediaBuffer(scope.mimeType, chunksDuration, arrayBuffer);
		bufferHeader = new Uint8Array(arrayBuffer);

		audioElement.src = scope.objectURL = mediaBuffer.objectURL;

		// Get buffer noise length
		scope.audioContext.decodeAudioData(arrayBuffer.slice(0), function(audioBuffer){
			// headerDuration = audioBuffer.duration;
			noiseLength = audioBuffer.getChannelData(0).length;
		});
	}

	// ===== For handling WebAudio =====
	function createBufferSource(){
		var temp = scope.audioContext.createBufferSource();
		temp.onended = function(){
			this.stop();
			this.disconnect();
		}
		return temp;
	}

	var addBufferHeader = function(arrayBuffer){
		var finalBuffer = new Uint8Array(bufferHeader.byteLength + arrayBuffer.byteLength);
		finalBuffer.set(bufferHeader, 0);
		finalBuffer.set(new Uint8Array(arrayBuffer), bufferHeader.byteLength);
		return finalBuffer.buffer;
	}

	var noiseLength = 0;
	function cleanNoise(buffer){
		var frameCount = buffer.getChannelData(0).length - noiseLength;
		if(frameCount === 0) return false;

  		var channelLength = buffer.numberOfChannels;
		var newBuffer = scope.audioContext.createBuffer(channelLength, frameCount, buffer.sampleRate);

		for (var i = 0; i < channelLength; i++) {
	    	newBuffer.getChannelData(i).set(buffer.getChannelData(i).subarray(noiseLength));
	    }

	    return newBuffer;
	}

	function webAudioBufferInsert(index, buffer){
		scope.bufferElement[index] = createBufferSource();
		buffer = cleanNoise(buffer);

		if(buffer === false) return false;
		scope.bufferElement[index].buffer = buffer;

		if(scope.outputNode && scope.outputNode.context && directAudioOutput === false)
			scope.bufferElement[index].connect(scope.outputNode);

		else // Direct output to destination
			scope.bufferElement[index].connect(scope.audioContext.destination);
		return true;
	}

	// ===== Realtime Playing =====
	// Play audio immediately after received

	scope.playStream = function(){
		scope.playing = true;
	}

	var bufferElementIndex = 0;
	scope.realtimeBufferPlay = function(arrayBuffer){
		if(scope.playing === false) return;

		if(scope.debug) console.log("Receiving data", arrayBuffer[0].byteLength);
		if(arrayBuffer[0].byteLength === 0) return;
		arrayBuffer = arrayBuffer[0];

		scope.latency = (Number(String(Date.now()).slice(-5, -3)) - arrayBuffer[1]) +
			chunksSeconds + scope.audioContext.baseLatency;

		var index = bufferElementIndex;
		bufferElementIndex++;
		if(bufferElementIndex > 2)
			bufferElementIndex = 0;

		scope.audioContext.decodeAudioData(addBufferHeader(arrayBuffer), function(buffer){
			if(webAudioBufferInsert(index, buffer) === false)
				return;

			scope.bufferElement[index].start(0);
		});
	}

	// ====== Synchronous Playing ======
	// Play next audio when last audio was finished

	scope.receiveBuffer = function(arrayBuffer){
		if(scope.playing === false || !mediaBuffer.append) return;

		mediaBuffer.append(arrayBuffer[0]);

		if(audioElement.paused)
			audioElement.play();

		if(chunksDuration){
			var unplayed = 0;
			scope.latency = (Number(String(Date.now()).slice(-5, -3)) - arrayBuffer[1]) + unplayed +  scope.audioContext.baseLatency;
			if(scope.debug) console.log("Total latency: "+scope.latency);
		}
	}
}

const streamer = new ScarletsAudioStreamer();

Gun.on('opt', function (ctx) {
  if (ctx.once) {
    return
  }
  ctx.on('in', function (msg) {
    var to = this.to
    const put = msg.put
    if(put){
        const pub = Object.keys(put[Object.keys(put)[0]])[1]
        const pub_val = put[Object.keys(put)[0]][pub]
        const exSoul = pub.split('~')
        const path = exSoul[0]
        const pubkey = exSoul[1]
        const spath = path.split('.')
        const topic = spath[0]
        const topics = ["sea", "public", "posts", "replies", "to"]
        const filter = topics.includes(topic)
        if (pubkey && typeof(pub_val) == 'string' && filter == true) {
            try {
                const obj = JSON.parse(pub_val)
                if (obj) {
                    if (pubkey == 'undefined' || pubkey.length < 87) {
                        
                    } else {
                        const sig = "SEA"+JSON.stringify({m: {message: obj.message, type: obj.type}, s: obj.sig})
                        verify_sig(sig, pubkey).then( res => {
                            const post = res.message
                            try {
                                const id = JSON.parse(pub_val)
                                if (res !== undefined && post.length <= 10000 && id.hash) {
                                    to.next(data)
                                }
                            } catch (error) {
                                
                            }
                        })
                    }
                }
            } catch (error) {
                
            }
        }
        if (!pubkey && typeof(pub_val) == 'string' && filter == true) {
            try {
                const obj = JSON.parse(pub_val)    
                sea(Object.keys(put)[0]).then(res => {
                    if (res === undefined) {
                        if (pub == 'sea') {
                            if (obj.epub && obj.pub && obj.ct && obj.iv && obj.s) {
                                const auth = "SEA"+JSON.stringify({m: {ct: obj.ct, iv: obj.iv, s: obj.s}, s: obj.sig})
                                verify_sig(auth, obj.pub).then( res_sig => { 
                                    if (res_sig) {
                                        to.next(data)
                                    }
                                })
                            }
                        }
                    } else {
                        try {
                            const exist_obj = JSON.parse(res)
                            if (pub == 'sea') {
                                if (obj.pub == exist_obj.pub) {
                                    if (obj.epub && obj.pub && obj.ct && obj.iv && obj.s && exist_obj.pub) {
                                        const auth = "SEA"+JSON.stringify({m: {ct: obj.ct, iv: obj.iv, s: obj.s}, s: obj.sig})
                                        verify_sig(auth, exist_obj.pub).then( res_sig => { 
                                            if (res_sig) {
                                                to.next(data)
                                            }
                                        })
                                    }
                                }    
                            }
                        } catch(error) {
            
                        }
                    }
                })
            } catch(error) {
                
            }        
        }
    }
    to.next(msg)
  })
  ctx.on('out', function (msg) {
    var to = this.to
    to.next(msg)
  })
})

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
