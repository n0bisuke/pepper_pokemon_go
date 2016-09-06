'use strict';

const PokemonGO = require('pokemon-go-node-api');
const pepper = require('./pepper_connect');
const pokemondb = require('./pokemon');

// using var so you can login with multiple users
let a = new PokemonGO.Pokeio();

//Set environment variables or replace placeholder text
let location = {
    type: 'name',
    name: process.env.PGO_LOCATION || 'Taito,Tokyo/Taito-ku'
};

var username = process.env.PGO_USERNAME || '';
var password = process.env.PGO_PASSWORD || '';
var provider = process.env.PGO_PROVIDER || 'google';

a.init(username, password, location, provider, (err) => {
    if (err) throw err;

    console.log('1[i] Current location: ' + a.playerInfo.locationName);
    console.log('1[i] lat/long/alt: : ' + a.playerInfo.latitude + ' ' + a.playerInfo.longitude + ' ' + a.playerInfo.altitude);

    a.GetProfile((err, profile) => {
        if (err) throw err;

        console.log('1[i] Username: ' + profile.username);
        console.log('1[i] Poke Storage: ' + profile.poke_storage);
        console.log('1[i] Item Storage: ' + profile.item_storage);

        var poke = 0;
        if (profile.currency[0].amount) {
            poke = profile.currency[0].amount;
        }

        console.log('1[i] Pokecoin: ' + poke);
        console.log('1[i] Stardust: ' + profile.currency[1].amount);

        setInterval(function(){
            a.Heartbeat(function(err,hb) {
                if(err) {
                    console.log(err);
                }

                var texts = '';
                for (var i = hb.cells.length - 1; i >= 0; i--) {
                    if(hb.cells[i].NearbyPokemon[0]) {
                        //console.log(a.pokemonlist[0])
                        var pokemon = a.pokemonlist[parseInt(hb.cells[i].NearbyPokemon[0].PokedexNumber)-1];
                        console.log('1[+] There is a ' + pokemon.name + ' near.');

                        var getpokemon = pokemondb.filter((element, index, array) => {
                            return (element.en === pokemon.name);
                        });

                        var jpname = getpokemon[0].ja;
                        texts += `あ！やせいの${jpname}が飛び出してきた！  `;
                    }
                }

                pepper(texts);

            });
        }, 10000);

    });
});
