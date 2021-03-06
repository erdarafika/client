/*** 
    Holla universe!
***/

const gun = Gun(['http://localhost:4000/gun'])
const SEA = Gun.SEA
const user = gun.user();
const now = moment();
const main = document.getElementById('main') 
const session = gun.user().recall({sessionStorage: true});

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

const comment = function comment(id, y, m, d) {
    const msg = document.getElementById('msg.' + id).value
    if (msg && msg.length <= 1000) {
        document.getElementById('msg.' + id).value = ""
        if (message) {
            post(id, 'replies', {
                message: msg, type: "text"
            }, y, m, d).then(res => {
                console.log(res);
            })
        }
    } else {

    }
}

const showreply = function showreply(id, pubKey) {
    if (!document.getElementById("c." + id)) {
        var d = new Date();
        var y = d.getFullYear();
        var m = d.getMonth();
        var d = d.getDate();
        let target = document.getElementById(id)
        let div = document.createElement('div')
        div.id = "c." + id
        div.innerHTML = `
            <div>
                <textarea id="msg.${id}" class="card w-100" style="height:100px;" placeholder="give your thoughts ..."></textarea>
                <div class="comment">
                    <span class="toggle"><a onclick="comment('${id}','${y}','${m}','${d}')">Reply</a></span>
                    <span class="toggle"><a onclick="comAudio('${id}')" id="actAudio">Voice Reply</a></span>
                </div>
            </div>
        `
        target.parentNode.insertBefore(div, target.nextSibling);
        gun.get(id).get('replies').get(y).get(m).get(d).map().on(function(data) {
            let target = document.getElementById("c." + id)
            let div = document.createElement('div')
            div.className = 'item-view-header'
            const msg = data
            div.innerHTML = `
                            <p class="meta" style="font-size: .9em">
                            ${msg.username}
                            </p>
                            <div style="line-height: 1.42857143em;">${msg.message.replace(new RegExp('\r?\n','g'), '<br />')}</div>
                            <p class="meta" style="font-size: .9em">
                            ${moment(msg.timestamp).fromNow()}
                            </p>
                            <div class="comment" id="${msg.hash}">
                                <span class="toggle"><a id="show.${msg.hash}" onclick="showreply('${msg.hash}', '${msg.pubKey}')">[+]</a></span>
                            </div>
                            `
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

        session.get(id).map().on(function(data) {
            console.log(data);
            let target = document.getElementById("c." + id)
            let div = document.createElement('div')
            div.className = 'item-view-header'
            const msg = data
            verify(sig, msg.pubkey).then(result => {
                if (result.message) {
                    div.innerHTML = `
                    <p class="meta" style="font-size: .9em">
                    ${smartTruncate(msg.username, 25)}
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
    let pubkey = session.is
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
                <span class="toggle"><a onclick="handleAction()" id="action"> Voice Post </a></span>
                <span class="char-left"></span>
            <adiv>
        </div>
        `
    main.appendChild(p)

    var d = new Date();
    var y = d.getFullYear();
    var m = d.getMonth();
    var d = d.getDate();
    gun.get('posts').get('public').get(y).get(m).get(d).map().on(function(data, key) {
        console.log(key);
        let target = document.getElementById('main')
        let div = document.createElement('div')
        div.className = 'item-view-header'
        div.innerHTML = `
                        <p class="meta" style="font-size: .9em">
                        ${data.username}
                        </p>
                        <div style="line-height: 1.42857143em;">${data.message.replace(new RegExp('\r?\n','g'), '<br />')}</div>
                        <p class="meta" style="font-size: .9em">
                        ${moment(data.timestamp).fromNow()}
                        </p>
                        <div class="comment" id="${data.hash}">
                            <span class="toggle"><a id="show.${data.hash}" onclick="showreply('${data.hash}', '${data.pubKey}')">[+]</a></span>
                        </div>
                    `
        target.parentNode.insertBefore(div, target.nextSibling);
    });

    document.getElementById('share').addEventListener('click', (event) => {
        event.preventDefault()
        const message = document.getElementById('message').value
        if (message) {
            post('posts', 'public', {
                message: message, type: "text"
            }, y, m, d).then(res => {
            
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
        // const user = await gun.get(username).get('sea').put(jstring)
        // return user
        const new_user = await user.create(username, password)
        return new_user;
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

const post = async(node, path, data, y, m, d) => {
    data.hash = sha256(path + '.' + new Date().getTime())
    data.timestamp = new Date().getTime()
    data.type = "text"
    data.username = session.is.alias
    data.pubKey = session.is.pub
    var ab = session.get(data.hash).put(data)
    const result = session.get(node).get(path).get(y).get(m).get(d).set(ab)
    gun.get(node).get(path).get(y).get(m).get(d).set(ab)
    return result
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
        async () => {
            let pair = await session.is
        if (pair !== null) {
            sig()
        } else {
            notsigned()
        }
        }
    }
}

let app = new App()
app.init()
