//Pakete aufrufen.
const dotenv = require('dotenv');
dotenv.config();

const token = process.env.TOKEN;

const Discord = require("discord.js");
const bot     = new Discord.Client();
const fs      = require("fs");
const moment = require("moment");

//JSON Dateien.

let userData  = JSON.parse(fs.readFileSync("Storage/userData.json", 'utf8'));
let commands = JSON.parse(fs.readFileSync("Storage/commands.json", 'utf8'));

//Listener Event: Message Receive.

bot.on('message', message => {

    //Variablen
    var sender = message.author; //Person der die Nachricht gesendet hat.
    var msg    = message.content.toUpperCase(); //Nimmt die Nachricht und macht sie GROß.
    var prefix = '$' //Damit werden die Commands benutzt.
    let cont = message.content.slice(prefix.length).split(" ");
    let args = cont.slice(1);

    if (bot.user.id === message.author.id) { return } // Close all
    //Events
    let userData  = JSON.parse(fs.readFileSync("Storage/userData.json", 'utf8'));

    if (!userData[sender.username + "," + message.guild.id]) userData[sender.username + "," + message.guild.id] = {} //Das macht eine JSON Datei für die User + Guild.
    if (!userData[sender.username + "," + message.guild.id].money) userData[sender.username + "," + message.guild.id].money = 1000; //Das erstellt ein Geld Objekt für einen User, wenns dieser keine hat hat er 1000 Kekse.
    if (!userData[sender.username + "," + message.guild.id].lastDaily) userData[sender.username + "," + message.guild.id].lastDaily = "Not Collected";
    if (!userData[sender.username + "," + message.guild.id].username) userData[sender.username + "," + message.guild.id].username = message.author.username;

    //if (!userData[sender.username]) userData[sender.username] = {} //Das macht eine JSON Datei für die User + Guild.
    //if (!userData[sender.username].money) userData[sender.username].money = 1000; //Das erstellt ein Geld Objekt für einen User, wenns dieser keine hat hat er 1000 Kekse.
    //if (!userData[sender.username].lastDaily) userData[sender.username].lastDaily = "Not Collected";
    //if (!userData[sender.username].username) userData[sender.username].username = message.author.username;


    //if (!userData[sender.id + message.guild.id]) userData[sender.id + message.guild.id] = {} //Das macht eine JSON Datei für die User + Guild.
    //if (!userData[sender.id + message.guild.id].money) userData[sender.id + message.guild.id].money = 1000; //Das erstellt ein Geld Objekt für einen User, wenns dieser keine hat hat er 1000 Kekse.
    //if (!userData[sender.id + message.guild.id].lastDaily) userData[sender.id + message.guild.id].lastDaily = "Not Collected";
    //if (!userData[sender.id + message.guild.id]) userData[sender.id + message.guild.id].username = message.author.username;

    //Commands
    if (msg === prefix + 'PING') {
        message.channel.send('Pong') //Sendet eine Nachricht. = Pong
        message.delete();
    }

    if (msg === prefix + 'KEKSE' || msg === 'BALANCE' ) {
      message.delete();
        message.channel.send({embed:{
        "title" : "Keks-Bank",
        "color" :  0x874c02,
        "fields":[{
          name  : "Konto-Besitzer",
          value : message.author.username,
          inline: true
            },
          {
          name  :  "Kontostand",
          //value : "Du hast " + userData[sender.id + message.guild.id].money + " Keks/Kekse",
          //value : "Du hast " + userData[sender.username].money + " Keks/Kekse",
          value : "Du hast " + userData[sender.username + "," + message.guild.id].money + " Keks/Kekse",
          inline: true
        }]
      }})
    }

    if (msg === prefix + 'DAILY') {
        message.delete();
      //if (userData[sender.id + message.guild.id].lastDaily != moment().format('L')) {
          //userData[sender.id + message.guild.id].lastDaily = moment().format('L')
          //userData[sender.id + message.guild.id].money += 1500;

          if (userData[sender.username + "," + message.guild.id].lastDaily != moment().format('L')) {
              userData[sender.username + "," + message.guild.id].lastDaily  = moment().format('L')
              userData[sender.username + "," + message.guild.id].money     += 1500;
        //if (userData[sender.username].lastDaily != moment().format('L')) {
            //userData[sender.username].lastDaily = moment().format('L')
            //userData[sender.username].money += 1500;
            message.channel.send({embed:{

              "title": "Tägliches Geschenk",
              "color" :  0x00fd02,
              "description": "Du hast 1500 Kekse bekommen! Dein nächstes Geschenk erwartet dich in " + moment().endOf('day').fromNow()

        }});

      } else {

        message.channel.send({embed:{

          "title": "Tägliches Geschenk",
          "color": 0xdd0000,
          "description": "Du hast dein Tägliches Geschenk schon erhalten! Du kannst dein nächstes erst " + moment().endOf('day').fromNow() + " bekommen"

        }});

        }

    };
      //Guild Info Command
    if  (msg === prefix + 'RANK') {
      message.delete();
      //Variablen
      var rankMoney = 0 //Total
      var rankUsers = 0
      var rankRichest = ''
      var rankRichest$ = 0

      for (var i in userData) {
        if (i.endsWith(message.guild.id)) {
          rankMoney     += userData[i].money, //Adds 1 Total
          rankUsers     += 1
          if (userData[i].money > rankRichest$) {
            rankRichest$ = userData[i].money,
            rankRichest  = userData[i].username
          }
        }
      } //Remember Close all statements.
      message.channel.send({embed:{
        "title" : "Leaderboard",
        "color" :  0xddff00,
        "fields":[{
          name  : "Konten",
          value : rankUsers,
          inline: true
        },
        {
          name  :  "Insgesammte Kekse",
          value : rankMoney,
          inline: true
        },
        {
          name: "Reichestes Konto",
          value: `${rankRichest} mit ${rankRichest$} Keksen.`
        },
      ],
      }})
    }

    if (msg.startsWith(prefix + 'CLEAR')) {
      //Awaits only work in Async
      async function clear() {
        message.delete();

        //Have role?
        if (!message.member.roles.find("name", "Admin")) {

        } else {

        }
        if (!message.member.roles.find("name", "Entwickler")) {
                  message.channel.send('Du brauchst die Admin oder Entwickler Rolle um diesen Befehl nutzen zu können!');
                  return;
        }
        // Is a number?
        if (isNaN(args[0])) {
          message.channel.send('Bitte schreibe eine nummer! \n Benutzung: ' + prefix + 'clear <Zahl>');
          return;
        }

        const fetched = await message.channel.fetchMessages({limit: args[0]});
        console.log(fetched.size + ' Nachrichten gefunden, löschen...');

        //Deleting
        message.channel.bulkDelete(fetched)
            .catch(error => message.channel.send(`Error: ${error}`));
      }

      //Function loading
      clear();

      //Two more things.
    }

    if (msg.startsWith(prefix + 'HELP')) { // We're also going to use a seperate JSON file, so we need to call it.
        message.delete();
        // Let's see if the only thing they typed in chat was ~help
        if (msg === `${prefix}HELP`) { // If they only type this, lets ONLY show the commands for regular users

            // Start of the embed
            const embed = new Discord.RichEmbed()
                .setColor(0x1D82B6) // You can set this color to whatever you want.

            // Variables
            let commandsFound = 0; // We also want to tell them how many commands there are for that specific group.

            // Lets create the for loop that loops through the commands
            for (var cmd in commands) { // We should start creating the commands json first.

                // Checks if the group is "users" - and replace type with group
                if (commands[cmd].group.toUpperCase() === 'USER') {
                    // Lets also count commandsFound + 1 every time it finds a command in the group
                    commandsFound++
                    // Lets add the command field to the embed
                    embed.addField(`${commands[cmd].name}`, `**Description:** ${commands[cmd].desc}\n**Usage:** ${prefix + commands[cmd].usage}`); // This will output something like <commandname>[title] [newline] desc: <description> [newline] usage: <usage
                }

            }

            // Add some more to the embed - we need to move that out of the for loop.
            embed.setFooter(`Ich bin mit Toni zusammen <3.`)
            embed.setDescription(`**${commandsFound} commands found** - <> means required, [] means optional`)

            // We can output it two ways. 1 - Send to DMs, and tell them that they sent to DMs in chat. 2 - Post commands in chat. [since commands take up a lot let's send to DMs]
            message.author.send({embed})
            // Post in chat they sent to DMs
            message.channel.send({embed: {
                color: 0x1D82B6,
                description: `**Check your DMs ${message.author}!**`
            }})

            // Let's test this! - We have a few bugs first though.
            // Turns out you can only use the word embed to define embeds.

        } else if (args.join(" ").toUpperCase() === 'GROUPS') {

            // Variables
            let groups = '';

            for (var cmd in commands) {
                if (!groups.includes(commands[cmd].group)) {
                    groups += `${commands[cmd].group}\n`
                }
            }

            message.channel.send({embed: {
                description:`**${groups}**`,
                title:"Groups",
                color: 0x1D82B6
            }})

            return; // Testing!


        } else {
            // Now, lets do something when they do ~help [cmd / group] - You can use copy and paste for a lot of this part.

            // Variables
            let groupFound = '';

            for (var cmd in commands) { // This will see if their is a group named after what the user entered.

                if (args.join(" ").trim().toUpperCase() === commands[cmd].group.toUpperCase()) {
                    groupFound = commands[cmd].group.toUpperCase(); // Lets set the ground found, then break out of the loop.
                    break;
                }

            }

            if (groupFound != '') { // If a group is found, run this statement.

                // Start of the embed
                const embed = new Discord.RichEmbed()
                    .setColor(0x1D82B6) // You can set this color to whatever you want.

                // Variables
                let commandsFound = 0; // We also want to tell them how many commands there are for that specific group.


                for (var cmd in commands) { // We can use copy and paste again

                    // Checks if the group is "users" - and replace type with group
                    if (commands[cmd].group.toUpperCase() === groupFound) {
                        // Lets also count commandsFound + 1 every time it finds a command in the group
                        commandsFound++
                        // Lets add the command field to the embed
                        embed.addField(`${commands[cmd].name}`, `**Description:** ${commands[cmd].desc}\n**Usage:** ${prefix + commands[cmd].usage}`); // This will output something like <commandname>[title] [newline] desc: <description> [newline] usage: <usage
                    }

                }

                // Add some more to the embed - we need to move that out of the for loop.
                embed.setFooter(`Ich bin mit Toni zusammen <3.`)
                embed.setDescription(`**${commandsFound} commands found** - <> means required, [] means optional`)

                // We can output it two ways. 1 - Send to DMs, and tell them that they sent to DMs in chat. 2 - Post commands in chat. [since commands take up a lot let's send to DMs]
                message.author.send({embed})
                // Post in chat they sent to DMs
                message.channel.send({embed: {
                    color: 0x1D82B6,
                    description: `**Check your DMs ${message.author}!**`
                }})

                // Make sure you copy and paste into the right place, lets test it now!
                return; // We want to make sure we return so it doesnt run the rest of the script after it finds a group! Lets test it!

                // Now lets show groups.
            }

            // Although, if a group is not found, lets see if it is a command

            // Variables
            let commandFound = '';
            let commandDesc = '';
            let commandUsage = '';
            let commandGroup = '';

            for (var cmd in commands) { // Copy and paste

                if (args.join(" ").trim().toUpperCase() === commands[cmd].name.toUpperCase()) {
                    commandFound = commands[cmd].name; // Lets change this so it doesnt make it go uppcase
                    commandDesc = commands[cmd].desc;
                    commandUsage = commands[cmd].usage;
                    commandGroup = commands[cmd].group;
                    break;
                }

            }

            // Lets post in chat if nothing is found!
            if (commandFound === '') {
                message.channel.send({embed: {
                    description:`**No group or command found titled \`${args.join(" ")}\`**`,
                    color: 0x1D82B6,
                }})

            }

            // Since this one is smaller, lets send the embed differently.
            message.channel.send({embed: {
                title:'<> means required, [] means optional',
                color: 0x1D82B6,
                fields: [{
                    name:commandFound,
                    value:`**Description:** ${commandDesc}\n**Usage:** ${commandUsage}\n**Group:** ${commandGroup}`
                }]
            }})

            return; // We want to return here so that it doesnt run the rest of the script also.

        }

    }

    fs.writeFile('Storage/userData.json', JSON.stringify(userData), (err) => { // Das schreibtt die änderungen die wir gemacht haben in die JSON.
        if (err) console.error(err);
  });
}); //END OF THE BOT.ON

//Bot ist gestartet...
bot.on('ready', () => {
    console.log('Economy Gestartet...');
});

//Login / Token.
bot.login(token);
