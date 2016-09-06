'use strict'

const Nightmare = require('nightmare');
const vo = require('vo');
const IP = '192.168.179.29';

function pepper(text) {
    vo(function* () {
    const nightmare = Nightmare({ show: true });
    const link = yield nightmare
        .goto('http://kuetsuhara.github.io/pepperConnect.html')
        .insert('input#pepperIP','')
        .type('input#pepperIP', ip)
        .click('button[onclick="connect()"]')
        .wait(4000)
        .type('input#sayText', text)
        .click('button[onclick="say()"]')
        .evaluate(() => {
            return document.getElementsByClassName('ac-21th')[0].href;
        });
    yield nightmare.end();
        return link;
    })((err, result) => {
        if (err) return console.log(err);
        console.log(result);
    });   
}

module.exports = pepper;