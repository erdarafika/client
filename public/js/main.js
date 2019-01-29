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

const notsigned = function notsigned() {
    let p = document.createElement('form')
    p.className = 'mb-0'
    p.id = 'form-signin'
    p.innerHTML = `
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
    <div class="2 col"><button id="up" class="blue-button">Register</button></div>
    <div class="8 col"><button id="anon" class="blue-button">Anonymous</button></div>
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
            <textarea id="message" class="card w-100" placeholder="Write here"></textarea>
        </div>
        <div class="row">
        <div class="2 col"><button type="submit" class="blue-button">Share</button></div>
        <div class="10 col"><div class="blue-button" id="signout">Sign Out</div></div>
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
                    <div class="tweetEntry-content">

                            <img class="tweetEntry-avatar" src="http://placekitten.com/100/100">

                            <span class="tweetEntry-username">
                            <b>${smartTruncate(msg.pubkey, 20)}</b>
                        </span>

                            <span class="tweetEntry-timestamp">- ${moment(msg.timestamp).format('L h:m a')}</span>

                        <div class="tweetEntry-text-container">
                            ${result.message}
                        </div>

                    </div>

                    <div class="optionalMedia" style="display:none;">
                        <img class="optionalMedia-img" src="https://i.imgur.com/kOhhPAk.jpg">
                    </div>

                    <div class="tweetEntry-action-list" style="line-height:24px;color: #b1bbc3;">
                        <i class="fa fa-reply" style="width: 80px;"></i>
                        <i class="fa fa-retweet" style="width: 80px"></i>
                        <i class="fa fa-heart" style="width: 80px"></i>
                    </div>
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
                verify_sig(msg.signed, key.pub).then(result => {

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