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
                        const sig = "SEA"+JSON.stringify({m: {message: obj.message}, s: obj.sig})
                        verify_sig(sig, pubkey).then( res => {
                            const post = res.message
                            try {
                                const id = JSON.parse(pub_val)
                                if (res !== undefined && post.length <= 1000 && id.hash) {
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
                                const struct = {ct: obj.ct, iv: obj.iv, s: obj.s}
                                const auth = 'SEA{"m":{"ct":"'+obj.ct+'","iv":"'+obj.iv+'","s":"'+obj.s+'"},"s":"'+obj.sig+'"}'
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
                                        const struct = {ct: exist_obj.ct, iv: exist_obj.iv, s: exist_obj.s}
                                        const auth = 'SEA{"m":{"ct":"'+exist_obj.ct+'","iv":"'+exist_obj.iv+'","s":"'+exist_obj.s+'"},"s":"'+exist_obj.sig+'"}'
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
        maxChar = 10000,
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
                message: msg
            }, key).then(res => {
                const msg = JSON.parse(res)
                const sig = "SEA"+JSON.stringify({m: {message: msg.message}, s: msg.sig})
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
                    <span class="toggle"><a onclick="comment('${id}')">[ Reply ]</a></span>
                </div>
            </div>
        `
        target.parentNode.insertBefore(div, target.nextSibling);

        gun.get(id).map().on(function(data) {
            let target = document.getElementById("c." + id)
            let div = document.createElement('div')
            div.className = 'item-view-header'
            const msg = JSON.parse(data)
            const sig = "SEA"+JSON.stringify({m: {message: msg.message}, s: msg.sig})
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
            const sig = "SEA"+JSON.stringify({m: {message: msg.message}, s: msg.sig})
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
        const sig = "SEA"+JSON.stringify({m: {message: msg.message}, s: msg.sig})
        if (msg.sig !== undefined && msg.pubkey !== undefined) {
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
                    localStorage.setItem('pair', pair)
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
                <span class="toggle"><a id="share">[ Post ]</a></span> <span class="toggle"><a id="signout">[ Sign Out ]</a></span> <span class="char-left"></span>
            </div>
        </div>
        `
    main.appendChild(p)

    gun.get('posts').map().on(function(data) {
        let target = document.getElementById('main')
        let div = document.createElement('div')
        div.className = 'item-view-header'
        const msg = JSON.parse(data)
        const sig = "SEA"+JSON.stringify({m: {message: msg.message}, s: msg.sig})
        if (msg.sig !== undefined && msg.pubkey !== undefined) {
            verify(sig, msg.pubkey).then(result => {
                if (result.message) {
                    div.innerHTML = `
                        <p class="meta" style="font-size: .9em">
                        ${smartTruncate(msg.pubkey, 25)}
                        </p>
                        <div style="line-height: 1.42857143em">${result.message.replace(new RegExp('\r?\n','g'), '<br />')}</div>
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
        target.parentNode.insertBefore(div, target.nextSibling);
    });

    document.getElementById('share').addEventListener('click', (event) => {
        event.preventDefault()
        const message = document.getElementById('message').value
        const pair = localStorage.getItem('pair')
        const key = JSON.parse(pair)
        if (message) {
            post('posts', 'public', {
                message: message
            }, key).then(res => {
                const msg = JSON.parse(res)
                const sig = "SEA"+JSON.stringify({m: {message: msg.message}, s: msg.sig})
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

const verify = async(data, pub) => {
    try {
        const result = await SEA.verify(data, pub)
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
