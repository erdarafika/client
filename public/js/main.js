// const gun = Gun(['http://localhost:3000/gun'])
const gun = Gun(['http://178.128.101.229:8791/gun'])
const SEA = Gun.SEA
const now = moment();
const main = document.getElementById('main')

const anonymous = async() => {
    try {
        const result = await SEA.pair()
        return result
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

    notsigned() {
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
        pin
        <input id="pin" class="card w-100" type="password" autocomplete="password" placeholder="*******">
    </div>
    <div class="row">
        <button type="submit" class="blue-button">Sign In</button> <button id="anon" class="blue-button">Anonymous</button>
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
                                        console.log('Wrong combination')
                                    } else {
                                        let pair = JSON.stringify(res)
                                        localStorage.setItem('pair', pair)

                                        let main = document.getElementById('main')
                                        let el_signin = document.getElementById('form-signin')
                                        el_signin.remove()

                                        let p = document.createElement('form')
                                        p.className = 'mb-1'
                                        p.id = 'post'
                                        p.innerHTML = `
                                            <div class="row">
                                                message
                                                <textarea id="message" class="card w-100" placeholder="Write here"></textarea>
                                            </div>
                                            <div class="row">
                                                <button type="submit" class="blue-button">Share</button>
                                            </div>
                                            <div class="tweetEntry-tweetHolder">
                <h1 id="tweet" class="tweetEntry" style="margin-bottom:0px;"></h1>
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
                                                                @<b>[username]</b>
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
                                        });
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
            })
        }, false);
    }

    signed() {
        let p = document.createElement('form')
        p.className = 'mb-1'
        p.id = 'post'
        p.innerHTML = `
            <div class="row">
                message
                <textarea id="message" class="card w-100" placeholder="Write here"></textarea>
            </div>
            <div class="row">
                <button type="submit" class="blue-button">Share</button> <div class="blue-button" id="signout">Sign Out</div>
            </div>

            <div class="tweetEntry-tweetHolder">
                <h1 id="tweet" class="tweetEntry" style="margin-bottom:0px;"></h1>
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
                                @<b>[username]</b>
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
        }, false)
    }

    render() {
        let pair = localStorage.getItem('pair')
        if (pair !== null) {
            this.signed()
        } else {
            this.notsigned()
        }
    }
}

let app = new App()
app.init()