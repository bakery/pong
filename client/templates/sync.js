Template.sync.events({
	'click .sync': function(e, template){
		var code = parseInt(template.$('input[name="code"]').val());
		var playerId = template.$('input[name="code"]').data('player-id');
		Meteor.call('sync',playerId,code, function(error,syncId){
			if(!error){

			} else {
				alert('can\'t sync!');
			}
		});
	}
});