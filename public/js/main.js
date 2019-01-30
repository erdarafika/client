// const gun = Gun(['http://localhost:3000/gun'])
const gun = Gun(['http://178.128.101.229:8791/gun'])
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
                <textarea id="msg.${id}" class="card w-100" style="height:100px;" placeholder="Write your comment..."></textarea>
            </div>
            <div><button onclick="comment('${id}')" class="post-button">Reply</button></div>
        `    
        target.parentNode.insertBefore(div, target.nextSibling);   

        gun.get(id).map().on(function(data) {
            console.log(data)
            let target = document.getElementById("c."+id)
            let div = document.createElement('div')
            div.className = 'tweetEntry'
            const msg = JSON.parse(data)
            verify(msg.signed, msg.pubkey).then(result => {
                div.innerHTML = `
                    <div class="row">
                        <div id="d-public.${msg.timestamp}~${msg.pubkey}" class="tweetEntry-content">
                            <img class="tweetEntry-avatar" src="http://placekitten.com/100/100">
                            <span class="tweetEntry-username">
                                <b>${smartTruncate(msg.pubkey, 20)}</b>
                            </span>
                            <span class="tweetEntry-timestamp"> - ${moment(msg.timestamp).format('L h:m a')}</span>
                            <div class="tweetEntry-text-container">
                                ${result.message}
                            </div>
                        </div>
                        <form id="f.public.${msg.timestamp}~${msg.pubkey}">
                            <div class="optionalMedia" style="display:none;">
                                <input id="public.${msg.timestamp}~${msg.pubkey}" type="text" value="superman">
                                <img class="optionalMedia-img" src="https://i.imgur.com/kOhhPAk.jpg">
                            </div>
                            <div class="tweetEntry-action-list" style="line-height:32px;color: #b1bbc3;">
                                <i id="r.public.${msg.timestamp}~${msg.pubkey}" onclick="showreply('public.${msg.timestamp}~${msg.pubkey}')" class="fa fa-reply" style="width: 80px; cursor: pointer;"></i>
                                
                            </div>
                        </form>
                    </div>
                    `
            })
            target.parentNode.insertBefore(div, target.nextSibling);
        });
    }
}

const notsigned = function notsigned() {
    let p = document.createElement('form')
    p.className = 'mb-0'
    p.id = 'form-signin'
    p.innerHTML = `
    <div class="row">
    <svg xmlns="http://www.w3.org/2000/svg" version="1" width="20%" height="20%" viewBox="0 0 132.000000 65.000000" class="logo __web-inspector-hide-shortcut__"><path d="M0 33v32h11.3c12.5 0 17.7-1.6 21.5-6.5 3.8-4.8 4.4-9 4-28-.3-16.8-.5-18.2-2.7-21.8C30.3 2.5 26.1 1 12 1H0v32zm23.1-19.1c2.3 1.9 2.4 2.3 2.4 18.5 0 15.7-.1 16.7-2.2 18.8-1.7 1.6-3.5 2.2-7 2.2l-4.8.1-.3-20.8L11 12h4.9c3.3 0 5.6.6 7.2 1.9zM46.1 3.6c-2 2.6-2.1 3.9-2.1 29.6v26.9l2.5 2.4c2.3 2.4 2.9 2.5 16 2.5H76V54.1l-10.2-.3-10.3-.3v-15l6.3-.3 6.2-.3V27H55V12h21V1H62.1c-13.9 0-14 0-16 2.6zM87 15.2c2.1 7.9 5.5 20.8 7.6 28.8 3.2 12.3 4.3 15 7 17.7 1.9 2 4.2 3.3 5.7 3.3 3.1 0 7.1-3.1 8.5-6.7 1-2.6 15.2-55.6 15.2-56.8 0-.3-2.8-.5-6.2-.3l-6.3.3-5.6 21.5c-3.5 13.6-5.8 20.8-6.2 19.5C105.9 40 96 1.9 96 1.4c0-.2-2.9-.4-6.4-.4h-6.4L87 15.2z"></path></svg>
    </div>
    <div class="row">
    username
    <input id="alias" class="card w-100" type="text" placeholder="superman">
    </div>
    <div class="row">
        password
        <input id="password" class="card w-100" type="password" autocomplete="password" placeholder="*******">
    </div>
    <div class="row">
        pin ex: 897065
        <input id="pin" class="card w-100" type="password" autocomplete="password" placeholder="*******">
    </div>
    <div class="row">
    <div class="2 col"><button type="submit" class="blue-button">Sign In</button></div>
    <div class="2 col"><button id="up" class="green-button">Register</button></div>
    <div class="8 col"><button id="anon" class="red-button">Anonymous</button></div>
    </div>
        `
    main.appendChild(p)

    document.getElementById('form-signin').addEventListener('submit', (event) => {
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
        if (!event.target.matches('#anon')) return;
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
        if (!event.target.matches('#up')) return;
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
    let p = document.createElement('form')
    p.className = 'mb-1'
    p.id = 'post'
    p.innerHTML = `
        <div class="row">
            <svg xmlns="http://www.w3.org/2000/svg" version="1" width="20%" height="20%" viewBox="0 0 132.000000 65.000000" class="logo __web-inspector-hide-shortcut__"><path d="M0 33v32h11.3c12.5 0 17.7-1.6 21.5-6.5 3.8-4.8 4.4-9 4-28-.3-16.8-.5-18.2-2.7-21.8C30.3 2.5 26.1 1 12 1H0v32zm23.1-19.1c2.3 1.9 2.4 2.3 2.4 18.5 0 15.7-.1 16.7-2.2 18.8-1.7 1.6-3.5 2.2-7 2.2l-4.8.1-.3-20.8L11 12h4.9c3.3 0 5.6.6 7.2 1.9zM46.1 3.6c-2 2.6-2.1 3.9-2.1 29.6v26.9l2.5 2.4c2.3 2.4 2.9 2.5 16 2.5H76V54.1l-10.2-.3-10.3-.3v-15l6.3-.3 6.2-.3V27H55V12h21V1H62.1c-13.9 0-14 0-16 2.6zM87 15.2c2.1 7.9 5.5 20.8 7.6 28.8 3.2 12.3 4.3 15 7 17.7 1.9 2 4.2 3.3 5.7 3.3 3.1 0 7.1-3.1 8.5-6.7 1-2.6 15.2-55.6 15.2-56.8 0-.3-2.8-.5-6.2-.3l-6.3.3-5.6 21.5c-3.5 13.6-5.8 20.8-6.2 19.5C105.9 40 96 1.9 96 1.4c0-.2-2.9-.4-6.4-.4h-6.4L87 15.2z"></path></svg>
            <textarea id="message" class="card w-100" placeholder="Write here"></textarea>
        </div>
        <div class="row">
        <div class="2 col"><button type="submit" class="post-button">Share</button></div>
        <div class="10 col"><div class="red-button" id="signout">Sign Out</div></div>
        </div>
        <div class="row">
            <div class="tweetEntry-tweetHolder">
                <h1 id="tweet" class="tweetEntry" style="margin-bottom:0px;"></h1>
            </div>
        </div>
        `
    main.appendChild(p)

    gun.get('posts').map().on(function(data) {
        let target = document.getElementById('tweet')
        let div = document.createElement('div')
        div.className = 'tweetEntry'
        const msg = JSON.parse(data)
        verify(msg.signed, msg.pubkey).then(result => {
            div.innerHTML = `
                <div class="row">
                    <div id="d-public.${msg.timestamp}~${msg.pubkey}" class="tweetEntry-content">
                        <img class="tweetEntry-avatar" src="http://placekitten.com/100/100">
                        <span class="tweetEntry-username">
                            <b>${smartTruncate(msg.pubkey, 20)}</b>
                        </span>
                        <span class="tweetEntry-timestamp">- ${moment(msg.timestamp).format('L h:m a')}</span>
                        <div class="tweetEntry-text-container">
                            ${result.message}
                        </div>
                    </div>
                    <form id="f.public.${msg.timestamp}~${msg.pubkey}">
                        <div class="optionalMedia" style="display:none;">
                            <input id="public.${msg.timestamp}~${msg.pubkey}" type="text" value="superman">
                            <img class="optionalMedia-img" src="https://i.imgur.com/kOhhPAk.jpg">
                        </div>
                        <div class="tweetEntry-action-list" style="line-height:32px;color: #b1bbc3;">
                            <i id="${msg.hash}" onclick="showreply('${msg.hash}')" class="fa fa-reply" style="width: 80px; cursor: pointer;"></i>
                        </div>
                    </form>
                </div>
                `
        })
        target.parentNode.insertBefore(div, target.nextSibling);
    });

    document.getElementById('post').addEventListener('submit', (event) => {
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