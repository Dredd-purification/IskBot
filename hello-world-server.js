var Botkit = require('botkit');
var controller = Botkit.slackbot();
var pool = 0;
var bot = controller.spawn({
  token: "xoxb-19866946519-lweH5HB96kdYiGDWgsq53c3M"
})

bot.configureIncomingWebhook({url: "https://hooks.slack.com/services/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"});

bot.sendWebhook({
	  text: 'Are you ready to win big isk? Come join me in the casino.',
	  channel: '#casino',
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


//reply to @bot hello
controller.on('direct_mention',function(bot,message) {

  // reply to _message_ by using the _bot_ object
  bot.reply(message,'I heard you mention me!');

});

controller.hears("fuck","ambient",function(bot,message) {

	  // do something to respond to message
	  // all of the fields available in a normal Slack message object are available
	  // https://api.slack.com/events/message
	  bot.reply(message,'You used a keyword!');

	});	

controller.hears("Give me isk","ambient",function(bot,message) {

	  // do something to respond to message
	  // all of the fields available in a normal Slack message object are available
	  // https://api.slack.com/events/message
	  bot.reply(message,'Transferring 1,000,000,000.00 Isk to Tibblist1 Maricadie');

	});	

controller.hears(['bet'],['direct_message','direct_mention','mention','ambient'],function(bot,message) {

	  // start a conversation to handle this response.
	  bot.startConversation(message,function(err,convo) {
		  
		  convo.ask('How much do you want to bet?',function(response,convo) {

		      convo.on

		    });

		  
	    convo.ask('Shall we proceed Say YES, NO or DONE to quit.',[
	      {
	        keyword: 'confirm',
	        callback: function(response,convo) {
	          convo.say('OK you are done!');
	          convo.next();
	        }
	      },
	    ]);
	  })
	});	
