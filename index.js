const {Client, MessageEmbed} = require("discord.js");
require('dotenv').config()
const moment = require('moment')
const client = new Client();
const fs = require('fs')
const fse = require('fs-extra')

const gameRoom = process.env.GAME_ROOM

client.on("ready", () => {

    client.user.setActivity('to your inputs', {
        type: 'LISTENING'
    })
    console.log('[Logged In] ' + client.user.tag)
    console.log('[Time] ' + moment().format('MMMM Do YYYY, h:mm:ss a'))
})

// GBA Emu

var GameBoyAdvance = require('gbajs');
 
var gba = new GameBoyAdvance();
 
gba.logLevel = gba.LOG_ERROR;
 
var biosBuf = fs.readFileSync('./node_modules/gbajs/resources/bios.bin');
gba.setBios(biosBuf);
gba.setCanvasMemory();
 
gba.loadRomFromFile('./data/rom.gba', function (err, result) {
  if (err) {
    console.error('loadRom failed:', err);
    process.exit(1);
  }
  gba.loadSavedataFromFile('./data/save.sav');
  gba.runStable();
});

function updateScreen(idx, msg, d) {

    var delay = 500
    if(d) {
        delay = 1250
    }
    setTimeout( () => {
        var png = gba.screenshot();
        png.pack().pipe(fs.createWriteStream('gba' + idx + '.png'));
    setTimeout( () => {
        var newScreen = new MessageEmbed()
        .setTitle("Current Screen")
        .attachFiles(['./gba0.png'])
        .setImage('attachment://gba0.png')
    if(!d) {
        newScreen.setFooter("This command has pulled the latest frame of the game. Type \"help\" to learn how to play.")
    } else {
        newScreen.setFooter("Type \"screen\" to see the latest frame without using the controls.")
    }
    
    msg.channel.send(newScreen)
    }, 250)
    
    
    }, delay)
    
}
function sendHelp(msg) {
    var help = new MessageEmbed()
        .setTitle("Help")
        .setDescription("Welcome to the DiscordPlaysPokemon Early Beta\n\n**Controls**\n" + 
                        "`a` - Presses **A**\n" +
                        "`b` - Presses **B**\n" +
                        "`l` - Presses **R**\n" +
                        "`r` - Presses **L**\n" +
                        "`start` - Presses **START**\n" +
                        "`select` - Presses **SELECT**\n" +
                        "`up` - Presses **UP**\n" +
                        "`down` - Presses **DOWN**\n" +
                        "`left` - Presses **LEFT**\n" +
                        "`right` - Presses **RIGHT**\n" +
                        "`screen` - Shows the current screen\n" +
                        "`help` - Shows this help message\n")
        .setFooter("Made by Skylar McCauley - skylarmccauley.com")
    msg.channel.send(help)
}

client.on("message", (message) => {
    var keypad = gba.keypad
    var idx = 0;
    if(message.channel.id !== gameRoom) return;
    if(message.author.id == client.user.id) return;
    const args = message.content.split(" ");

    switch ((args[0].toString()).toUpperCase()) {
        case 'A':
            keypad.press(keypad.A)
            updateScreen(idx, message, true)
          break;
        case 'B':
            keypad.press(keypad.B)
            updateScreen(idx, message, true)
        break;
        case 'L':
            keypad.press(keypad.L)
            updateScreen(idx, message, true)
        break;
        case 'R':
            keypad.press(keypad.R)
            updateScreen(idx, message, true)
        break;
        case 'UP':
            keypad.press(keypad.UP)
            updateScreen(idx, message, true)
        break;
        case 'DOWN':
            keypad.press(keypad.DOWN)
            updateScreen(idx, message, true)
        break;
        case 'LEFT':
            keypad.press(keypad.LEFT)
            updateScreen(idx, message, true)
        break;
        case 'RIGHT':
            keypad.press(keypad.RIGHT)
            updateScreen(idx, message, true)
        break;
        case 'START':
            keypad.press(keypad.START)
            updateScreen(idx, message, true)
        break;
        case 'SELECT':
            keypad.press(keypad.SELECT)
            updateScreen(idx, message, true)
        break;
        case 'SCREEN':
            updateScreen(idx, message, false)
        break;
        case 'HELP':
            sendHelp(message)
        break;
        default:
          console.log(`Incorrect input: ${(args[0].toString()).toUpperCase()}`);
        break;
      }

    
})

/*setInterval(function () {
  var keypad = gba.keypad;
  keypad.press(keypad.A);
 
  setTimeout(function () {
    // pngjs: https://github.com/lukeapage/pngjs 
    var png = gba.screenshot();
    png.pack().pipe(fs.createWriteStream('gba' + idx + '.png'));
  }, 200);
}, 2000);
*/

client.on("error", (error) => {
    console.log(error)
})

client.on("disconnect", () => {
    setTimeout(() => {
        client.user || (
            client.login(config.token)
        );
    }, 15000);
})

client.login(process.env.DISCORD_TOKEN) //Login