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
                <textarea id="msg.${id}" class="card w-100" style="height:100px;" placeholder="Write your comment..."></textarea>
            </div>
            <div>
                <button onclick="comment('${id}')" class="post-button">Reply</button></div>
                <!-- <button onclick="document.getElementById('c.${id}').remove()" class="red-button">Close</button> -->
            </div>
        `    
        target.parentNode.insertBefore(div, target.nextSibling);   

        gun.get(id).map().on(function(data) {
            let target = document.getElementById("c."+id)
            let div = document.createElement('div')
            div.className = 'tweetEntry'
            const msg = JSON.parse(data)
            if (msg.signed !== undefined && msg.pubkey !== undefined) {
                verify(msg.signed, msg.pubkey).then(result => {
                    if (result.message) {
                        div.innerHTML = `
                        <div class="row">
                            <div id="d-public.${msg.timestamp}~${msg.pubkey}" class="tweetEntry-content">
                                <span class="tweetEntry-avatar"><svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="fingerprint" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" class="svg-inline--fa fa-fingerprint fa-w-14 fa-9x"><defs class=""><clipPath id="clip-rZlolpo0ZmCK" class=""><path fill="currentColor" d="M400 32H48C21.5 32 0 53.5 0 80v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V80c0-26.5-21.5-48-48-48z" class=""></path></clipPath><mask x="0" y="0" width="100%" height="100%" id="mask-7IfAyCrJnlDP" maskUnits="userSpaceOnUse" maskContentUnits="userSpaceOnUse" class=""><rect x="0" y="0" width="100%" height="100%" fill="white" class=""></rect><g transform="translate(224 256)" class=""><g transform="translate(0, 0)  scale(0.5625, 0.5625)  rotate(0 0 0)" class=""><path fill="black" d="M256.12 245.96c-13.25 0-24 10.74-24 24 1.14 72.25-8.14 141.9-27.7 211.55-2.73 9.72 2.15 30.49 23.12 30.49 10.48 0 20.11-6.92 23.09-17.52 13.53-47.91 31.04-125.41 29.48-224.52.01-13.25-10.73-24-23.99-24zm-.86-81.73C194 164.16 151.25 211.3 152.1 265.32c.75 47.94-3.75 95.91-13.37 142.55-2.69 12.98 5.67 25.69 18.64 28.36 13.05 2.67 25.67-5.66 28.36-18.64 10.34-50.09 15.17-101.58 14.37-153.02-.41-25.95 19.92-52.49 54.45-52.34 31.31.47 57.15 25.34 57.62 55.47.77 48.05-2.81 96.33-10.61 143.55-2.17 13.06 6.69 25.42 19.76 27.58 19.97 3.33 26.81-15.1 27.58-19.77 8.28-50.03 12.06-101.21 11.27-152.11-.88-55.8-47.94-101.88-104.91-102.72zm-110.69-19.78c-10.3-8.34-25.37-6.8-33.76 3.48-25.62 31.5-39.39 71.28-38.75 112 .59 37.58-2.47 75.27-9.11 112.05-2.34 13.05 6.31 25.53 19.36 27.89 20.11 3.5 27.07-14.81 27.89-19.36 7.19-39.84 10.5-80.66 9.86-121.33-.47-29.88 9.2-57.88 28-80.97 8.35-10.28 6.79-25.39-3.49-33.76zm109.47-62.33c-15.41-.41-30.87 1.44-45.78 4.97-12.89 3.06-20.87 15.98-17.83 28.89 3.06 12.89 16 20.83 28.89 17.83 11.05-2.61 22.47-3.77 34-3.69 75.43 1.13 137.73 61.5 138.88 134.58.59 37.88-1.28 76.11-5.58 113.63-1.5 13.17 7.95 25.08 21.11 26.58 16.72 1.95 25.51-11.88 26.58-21.11a929.06 929.06 0 0 0 5.89-119.85c-1.56-98.75-85.07-180.33-186.16-181.83zm252.07 121.45c-2.86-12.92-15.51-21.2-28.61-18.27-12.94 2.86-21.12 15.66-18.26 28.61 4.71 21.41 4.91 37.41 4.7 61.6-.11 13.27 10.55 24.09 23.8 24.2h.2c13.17 0 23.89-10.61 24-23.8.18-22.18.4-44.11-5.83-72.34zm-40.12-90.72C417.29 43.46 337.6 1.29 252.81.02 183.02-.82 118.47 24.91 70.46 72.94 24.09 119.37-.9 181.04.14 246.65l-.12 21.47c-.39 13.25 10.03 24.31 23.28 24.69.23.02.48.02.72.02 12.92 0 23.59-10.3 23.97-23.3l.16-23.64c-.83-52.5 19.16-101.86 56.28-139 38.76-38.8 91.34-59.67 147.68-58.86 69.45 1.03 134.73 35.56 174.62 92.39 7.61 10.86 22.56 13.45 33.42 5.86 10.84-7.62 13.46-22.59 5.84-33.43z" transform="translate(-256 -256)" class=""></path></g></g></mask></defs><rect fill="currentColor" clip-path="url(#clip-rZlolpo0ZmCK)" mask="url(#mask-7IfAyCrJnlDP)" x="0" y="0" width="100%" height="100%" class=""></rect></svg></span>    
                                <span class="tweetEntry-username">
                                    <b>${smartTruncate(msg.pubkey, 20)}</b>
                                </span>
                                <span class="tweetEntry-timestamp"> - ${moment(msg.timestamp).format('L h:m:s a')}</span>
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
                                    
                                </div>
                            </form>
                        </div>
                        `
                    }
                })
            }
            // target.parentNode.insertBefore(div, target.nextSibling);
            target.appendChild(div)
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
        if (msg.signed !== undefined && msg.pubkey !== undefined) {
            verify(msg.signed, msg.pubkey).then(result => {
                if (result.message) {
                    div.innerHTML = `
                    <div class="row">
                        <div id="d-public.${msg.timestamp}~${msg.pubkey}" class="tweetEntry-content">
                            <span class="tweetEntry-avatar"><svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="fingerprint" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" class="svg-inline--fa fa-fingerprint fa-w-14 fa-9x"><defs class=""><clipPath id="clip-rZlolpo0ZmCK" class=""><path fill="currentColor" d="M400 32H48C21.5 32 0 53.5 0 80v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V80c0-26.5-21.5-48-48-48z" class=""></path></clipPath><mask x="0" y="0" width="100%" height="100%" id="mask-7IfAyCrJnlDP" maskUnits="userSpaceOnUse" maskContentUnits="userSpaceOnUse" class=""><rect x="0" y="0" width="100%" height="100%" fill="white" class=""></rect><g transform="translate(224 256)" class=""><g transform="translate(0, 0)  scale(0.5625, 0.5625)  rotate(0 0 0)" class=""><path fill="black" d="M256.12 245.96c-13.25 0-24 10.74-24 24 1.14 72.25-8.14 141.9-27.7 211.55-2.73 9.72 2.15 30.49 23.12 30.49 10.48 0 20.11-6.92 23.09-17.52 13.53-47.91 31.04-125.41 29.48-224.52.01-13.25-10.73-24-23.99-24zm-.86-81.73C194 164.16 151.25 211.3 152.1 265.32c.75 47.94-3.75 95.91-13.37 142.55-2.69 12.98 5.67 25.69 18.64 28.36 13.05 2.67 25.67-5.66 28.36-18.64 10.34-50.09 15.17-101.58 14.37-153.02-.41-25.95 19.92-52.49 54.45-52.34 31.31.47 57.15 25.34 57.62 55.47.77 48.05-2.81 96.33-10.61 143.55-2.17 13.06 6.69 25.42 19.76 27.58 19.97 3.33 26.81-15.1 27.58-19.77 8.28-50.03 12.06-101.21 11.27-152.11-.88-55.8-47.94-101.88-104.91-102.72zm-110.69-19.78c-10.3-8.34-25.37-6.8-33.76 3.48-25.62 31.5-39.39 71.28-38.75 112 .59 37.58-2.47 75.27-9.11 112.05-2.34 13.05 6.31 25.53 19.36 27.89 20.11 3.5 27.07-14.81 27.89-19.36 7.19-39.84 10.5-80.66 9.86-121.33-.47-29.88 9.2-57.88 28-80.97 8.35-10.28 6.79-25.39-3.49-33.76zm109.47-62.33c-15.41-.41-30.87 1.44-45.78 4.97-12.89 3.06-20.87 15.98-17.83 28.89 3.06 12.89 16 20.83 28.89 17.83 11.05-2.61 22.47-3.77 34-3.69 75.43 1.13 137.73 61.5 138.88 134.58.59 37.88-1.28 76.11-5.58 113.63-1.5 13.17 7.95 25.08 21.11 26.58 16.72 1.95 25.51-11.88 26.58-21.11a929.06 929.06 0 0 0 5.89-119.85c-1.56-98.75-85.07-180.33-186.16-181.83zm252.07 121.45c-2.86-12.92-15.51-21.2-28.61-18.27-12.94 2.86-21.12 15.66-18.26 28.61 4.71 21.41 4.91 37.41 4.7 61.6-.11 13.27 10.55 24.09 23.8 24.2h.2c13.17 0 23.89-10.61 24-23.8.18-22.18.4-44.11-5.83-72.34zm-40.12-90.72C417.29 43.46 337.6 1.29 252.81.02 183.02-.82 118.47 24.91 70.46 72.94 24.09 119.37-.9 181.04.14 246.65l-.12 21.47c-.39 13.25 10.03 24.31 23.28 24.69.23.02.48.02.72.02 12.92 0 23.59-10.3 23.97-23.3l.16-23.64c-.83-52.5 19.16-101.86 56.28-139 38.76-38.8 91.34-59.67 147.68-58.86 69.45 1.03 134.73 35.56 174.62 92.39 7.61 10.86 22.56 13.45 33.42 5.86 10.84-7.62 13.46-22.59 5.84-33.43z" transform="translate(-256 -256)" class=""></path></g></g></mask></defs><rect fill="currentColor" clip-path="url(#clip-rZlolpo0ZmCK)" mask="url(#mask-7IfAyCrJnlDP)" x="0" y="0" width="100%" height="100%" class=""></rect></svg></span>
                            <span class="tweetEntry-username">
                                <b>${smartTruncate(msg.pubkey, 20)}</b>
                            </span>
                            <span class="tweetEntry-timestamp">- ${moment(msg.timestamp).format('L h:m:s a')}</span>
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
                }
            })
        }
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