var Botkit = require('botkit');
var controller = Botkit.slackbot();
var pool = 0;
var n = 0;
var users = [];
var balance =  [];
var chosenOption = [];
var topic = '';
var options = [];
var bot = controller.spawn({
  token: "xoxb-43033407299-6UYRNZxk9YGRXFrAnwtMJRxl"
})

bot.configureIncomingWebhook({url: "https://hooks.slack.com/services/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"});

bot.sendWebhook({
	  text: 'Are you ready to win big isk? Come join me in the casino.',
	  channel: '#testing',
	  username: 'iskbot',
	  icon_url: 'http://procanaudio.ca/images/iSK_Microphones_UK.jpg'
	},function(err,res) {
	  // handle error
	});

bot.startRTM(function(err,bot,payload) {
  if (err) {
    throw new Error('Could not connect to Slack');
  }
});

function createUser(name) {
	console.log('creating user')
	users[n] = name;
	balance[n] = 0;
	n = n + 1;
	return n-1;
}

function getUserID(name) {
	console.log(name+' '+n);
	var y = n;
		for(index = 0; index <= y; index++) {
		if (users[index] == name) {
			console.log("Got user "+name+" with balance "+balance[index]);
			return index;
		} else {
			createUser(name);
			return;
		}
	}
	console.log('Finished')
}

function checkBalance(name) {
	console.log('Getting balance')
	return balance[getUserID(name)];
}

function setBalance(name,x) {
	balance[getUserID(name)] = x;
}

function addBalance(name,x) {
	balance[getUserID(name)] = parseInt(balance[getUserID(name)])+parseInt(x);
	if (balance[getUserID(name)] == 0) {
		balance[getUserID(name)] = parseInt(balance[getUserID(name)])+parseInt(x)
	}
}

//reply to @bot hello
controller.on('direct_mention',function(bot,message) {

  // reply to _message_ by using the _bot_ object
  bot.reply(message,'Starting betting protocol.');
      options[1] = '';
   	  options[2] = '';
   	  options[3] = '';
   	  options[4] = '';
});

controller.hears("fuck","ambient",function(bot,message) {

	  // do something to respond to message
	  // all of the fields available in a normal Slack message object are available
	  // https://api.slack.com/events/message
	  bot.reply(message,'Fuck? When and where?');

	});	

controller.hears("Give me isk","ambient",function(bot,message) {

	  // do something to respond to message
	  // all of the fields available in a normal Slack message object are available
	  // https://api.slack.com/events/message
	  bot.reply(message,'Transferring 1,000,000,000.00 Isk to Tibblist1 Maricadie');

	});	

controller.hears("Give me (.*)",'ambient',function(bot, message) {
	console.log(message);
	if (message.match[1] < 10000000000 && message.match[1] > 0) {
		    var isk = parseInt(message.match[1]).toFixed(1);
			addBalance(message.user,isk);
	} else {
		bot.reply(message, 'HeHe you cannot break me!');
	}
});

controller.hears("!balance",'ambient',function(bot, message) {
	    console.log(message);
	    console.log(message.user);
	    bot.reply(message,"It is "+checkBalance(message.user));
});

controller.hears(['bet (.*) on (.*)'],['direct_message','direct_mention','mention','ambient'],function(bot,message) {

	  // start a conversation to handle this response.
	  bot.startConversation(message,function(err,convo) {
	  	console.log(getUserID(message.user));
		  var bet = 0;
		  var userID = getUserID(message.user);
		  bet = parseInt(message.match[1]);
		  if (message.match[2]) {
		  	console.log(message.user+' is betting');
		  	if (message.match[2] == options[1]) {
		  	chosenOption[getUserID(message.user)] = options[1];
		  	console.log('Option 1 matched to '+getUserID(message.user)+' option chosen is '+chosenOption[getUserID(message.user)]);
		  	} else if (message.match[2] == options[2]) {
		  		chosenOption[getUserID(message.user)] = options[2];
		  	} else if (message.match[2] == options[3]) {
		  		chosenOption[getUserID(message.user)] = options[3];
		  	} else if (message.match[2] == options[4]) {
		  		chosenOption[getUserID(message.user)] = options[4];
		  	} else if (options[1] == '') {
		  		bot.reply(message,'No options have been set yet.');
		  		convo.stop();
		  	} else {
		  		bot.reply(message,'You did not choose a valid option')
		  		convo.stop();
		  	}
		  } else {
		  	bot.reply(message,'Please specify an option by typing: bet (ISK) on (option).');
		  	convo.stop();
		  }
		  console.log(userID+' bet on '+chosenOption[userID]);
	    convo.ask('You are betting '+bet+' ISK on '+chosenOption[userID]+'. Please enter confirm to approve this bet.',[
	      {
	        pattern: 'confirm',
	        callback: function(response,convo) {
	           controller.storage.users.get(message.user,function(err, user) {
	               var newbalance = parseInt(checkBalance(message.user)) - bet;
		           if (newbalance > 0) {
		  	       setBalance(message.user,newbalance);
		  	       convo.say('OK you are done!');
		       } else {
		  	       bot.reply(message,'Not enough ISK to bet that much.')
		           }
	           });
	          convo.next();
	        }
	      },
	      {
	      	default: true,
	      	callback: function(response,convo) {
	      		convo.say('Bet canceled.');
	      		convo.next();
	      	}
	      }
	    ]);
	  })
	});	
controller.hears("channels",['direct_message','ambient'],function(bot, message) {
	bot.api.channels.list({},function(err,response) {
console.log(response);
})

});
controller.hears("groups",['direct_message','ambient'],function(bot, message) {
	bot.api.groups.list({},function(err,response) {
console.log(response);
})

});

controller.hears('set topic (.*)','ambient',function(bot, message) {
   bot.startConversation(message,function(err,convo) {
   	  topic = message.match[1];
   	  options[1] = '';
   	  options[2] = '';
   	  options[3] = '';
   	  options[4] = '';
   	  convo.say('You are betting on '+topic+'. Please enter the options to bet on separated by a comma.');
   	  convo.next();
   }) 
});

controller.hears('set options (.*), (.*), (.*), (.*)','ambient',function(bot, message) {
	console.log(message);
    if (message.match[1]) {options[1] = message.match[1];} else {bot.reply(message,'You need at least 2 options')};
    if (message.match[2]) {options[2] = message.match[2];} else {bot.reply(message,'You need at least 2 options')};
    if (message.match[3]) {options[3] = message.match[3];}
    if (message.match[4]) {options[4] = message.match[4];}
    bot.reply(message,'Your options are '+options[1]+', '+options[2]+', '+options[3]+', '+options[4]+'.');
});

controller.hears('set options (.*), (.*), (.*)','ambient',function(bot, message) {
	console.log(message);
    if (message.match[1]) {options[1] = message.match[1];} else {bot.reply(message,'You need at least 2 options')};
    if (message.match[2]) {options[2] = message.match[2];} else {bot.reply(message,'You need at least 2 options')};
    if (message.match[3]) {options[3] = message.match[3];}
    if (message.match[4]) {options[4] = message.match[4];}
    bot.reply(message,'Your options are '+options[1]+', '+options[2]+', '+options[3]+'.');
});

controller.hears('set options (.*), (.*)','ambient',function(bot, message) {
	console.log(message);
    if (message.match[1]) {options[1] = message.match[1];} else {bot.reply(message,'You need at least 2 options')};
    if (message.match[2]) {options[2] = message.match[2];} else {bot.reply(message,'You need at least 2 options')};
    if (message.match[3]) {options[3] = message.match[3];}
    if (message.match[4]) {options[4] = message.match[4];}
    bot.reply(message,'Your options are '+options[1]+', '+options[2]+'.');
});

controller.hears('options','ambient',function(bot, message) {
    if (options[1] != '' && options[2] != '' && options[3] == '') {
    	bot.reply(message,'There are two options '+options[1]+', '+options[2]+'.');
    } else if (options[1] != '' && options[2] != '' && options[3] != '' && options[4] == '') {
    	bot.reply(message,'There are three options '+options[1]+', '+options[2]+', '+options[3]+'.')
    } else if (options[1] != '' && options[2] != '' && options[3] != '' && options[4] != '') {
    	bot.reply(message,'There are four options '+options[1]+', '+options[2]+', '+options[3]+', '+options[4]+'.')
    } else if (topic != ''){
    	bot.reply(message,'Options have not yet been set.')
    } else {
    	bot.reply(message,'No topic has been set yet.')
    }
});

controller.hears('list bets', 'ambient',function(bot, message) {
   var y = n;
   for (index = 0; index <= y; index++) {
   	bot.reply(message, 'User '+users[index]+' has bet (unknown yet) on '+chosenOption[index]+'.');
   } 
});