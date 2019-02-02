// const gun = Gun(['http://localhost:3000/gun'])
// const gun = Gun(['http://178.128.101.229:8791/gun'])
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

const comment = function comment(id){
    const msg = document.getElementById('msg.'+id).value
    if (msg && msg.length <= 160) {
        document.getElementById('msg.'+id).value = ""
        const pair = localStorage.getItem('pair')
        const key = JSON.parse(pair)
        if (message) {
            post(id, 'replies', {
                message: msg
            }, key).then(res => {
                const msg = JSON.parse(res)
                verify(msg.signed, key.pub).then(result => {

                })
            })
        }
    } else {
        
    }
}

const showreply = function showreply(id) {
    if (!document.getElementById("c."+id)) {
        let target = document.getElementById(id)
        let div = document.createElement('div')
        div.id = "c."+id
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
            let target = document.getElementById("c."+id)
            let div = document.createElement('div')
            div.className = 'item-view-header'
            const msg = JSON.parse(data)
            if (msg.signed !== undefined && msg.pubkey !== undefined) {
                verify(msg.signed, msg.pubkey).then(result => {
                    if (result.message) {
                        div.innerHTML = `
                        <div style="line-height: 1.42857143em;">${result.message.replace(new RegExp('\r?\n','g'), '<br />')}</div>
                        <p class="meta" style="font-size: .9em">
                        ${moment(msg.timestamp).fromNow()} · ${smartTruncate(msg.pubkey, 25)}
                        </p>
                        <div class="comment" id="${msg.hash}">
                            <span class="toggle"><a onclick="showreply('${msg.hash}')">[+]</a></span>
                        </div>
                        `
                    }
                })
            }
            target.appendChild(div)
        });
    }
}

const showreplyanon = function showreplyanon(id) {
    if (!document.getElementById("c."+id)) {
        let target = document.getElementById(id)
        let div = document.createElement('div')
        div.id = "c."+id    
        target.parentNode.insertBefore(div, target.nextSibling);   

        gun.get(id).map().on(function(data) {
            let target = document.getElementById("c."+id)
            let div = document.createElement('div')
            div.className = 'item-view-header'
            const msg = JSON.parse(data)
            if (msg.signed !== undefined && msg.pubkey !== undefined) {
                verify(msg.signed, msg.pubkey).then(result => {
                    if (result.message) {
                        div.innerHTML = `
                        <div style="line-height: 1.42857143em;">${result.message.replace(new RegExp('\r?\n','g'), '<br />')}</div>
                        <p class="meta" style="font-size: .9em">
                        ${moment(msg.timestamp).fromNow()} · ${smartTruncate(msg.pubkey, 25)}
                        </p>
                        <div class="comment" id="${msg.hash}">
                            <span class="toggle"><a onclick="showreplyanon('${msg.hash}')">[+]</a></span>
                        </div>
                        `
                    }
                })
            }
            target.appendChild(div)
        });
    }
}

const notsigned = function notsigned() {
    let p = document.createElement('form')
    p.className = 'mb-0'
    p.id = 'form-signin'
    p.innerHTML = `
    <div class="item-view-header">
        <input id="alias" class="question" type="text" placeholder="alias">
        
        <input id="password" class="question" type="password" autocomplete="password" placeholder="password">
       
        <input id="pin" class="question" type="password" autocomplete="password" placeholder="pin">
        
        <div class="comment" style="margin-top: 15px">
            <span class="toggle"><a id="signin">[ SIgn IN ]</a></span> <span class="toggle"><a id="signup">[ Sign Up ]</a></span> <span class="toggle"><a id="anonymous">[ Anonymous ]</a></span>
        </div>
    </div>
        `
    main.appendChild(p)

    gun.get('posts').map().on(function(data) {
        let target = document.getElementById('main')
        let div = document.createElement('div')
        div.className = 'item-view-header'
        const msg = JSON.parse(data)
        if (msg.signed !== undefined && msg.pubkey !== undefined) {
            verify(msg.signed, msg.pubkey).then(result => {
                if (result.message) {
                    div.innerHTML = `
                        <div style="line-height: 1.42857143em;">${result.message.replace(new RegExp('\r?\n','g'), '<br />')}</div>
                        <p class="meta" style="font-size: .9em">
                        ${moment(msg.timestamp).fromNow()} · ${smartTruncate(msg.pubkey, 25)}
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
                        verify(sea.auth, sea.pub).then(res_sig => {
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
                    let el_signin = document.getElementById('form-signin')
                    el_signin.remove()
                    sig()
                }
            })
        }
    }, false)
}

const sig = function signed() {
    let main = document.getElementById('main')
    let p = document.createElement('form')
    p.className = 'mb-1'
    p.id = 'post'
    p.innerHTML = `
        <div class="item-view-header">
            "I cannot teach anybody anything. I can only make them think." - Socrates
            <textarea id="message" class="card w-100" placeholder="Write something ..."></textarea>
            <div class="comment">
                <span class="toggle"><a id="share">[ Post ]</a></span> <span class="toggle"><a id="signout">[ Sign Out ]</a></span>
            </div>
        </div>
        `
        main.appendChild(p)

    gun.get('posts').map().on(function(data) {
        let target = document.getElementById('main')
        let div = document.createElement('div')
        div.className = 'item-view-header'
        const msg = JSON.parse(data)
        if (msg.signed !== undefined && msg.pubkey !== undefined) {
            verify(msg.signed, msg.pubkey).then(result => {
                if (result.message) {
                    div.innerHTML = `
                        <div style="line-height: 1.42857143em">${result.message.replace(new RegExp('\r?\n','g'), '<br />')}</div>
                        <p class="meta" style="font-size: .9em">
                        ${moment(msg.timestamp).fromNow()} · ${smartTruncate(msg.pubkey, 25)}
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
                verify(msg.signed, key.pub).then(result => {
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

const register = async (username, password, salt) => {
    try {
        const pair = await SEA.pair()
        const proof = await SEA.work(password, salt)
        const auth = await SEA.encrypt(pair, proof)
        const signed = await SEA.sign(auth, pair)
        const obj = {pub: pair.pub, epub: pair.epub, auth: signed}
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
            const signed = await SEA.sign(data, pair)
            const obj = {
                hash: sha256(path + '.' + new Date().getTime() + '~' + pair.pub),
                pubkey: pair.pub,
                signed: signed,
                timestamp: new Date().getTime()
            }
            const jstring = JSON.stringify(obj)
            const result = await gun.get(node).get(path + '.' + new Date().getTime() + '~' + pair.pub).put(jstring)
            return result
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