Router.configure({
  layoutTemplate: 'layout'
});

// Router._filters = {
//     isLoggedIn: function(pause) {
//         if (!(Meteor.loggingIn() || Meteor.user())) {
//             this.render('login');
//             pause();
//             return;
//         }

//         this.next();
//     }
// };

// var filters = Router._filters;

// if(Meteor.isCordova){
//     Router.onBeforeAction(filters.isOnline);
//     Router.onBeforeAction(filters.isLoggedIn, { only: ['game'] });
// }

Router.map(function () {
    
    this.route('landing', {
        path: '/',
        action: function(){
            Meteor.call('createGame', function(error,gameId){
                if(!error){
                    Router.go('game', {gameId: gameId});
                } else {
                    alert('oops');
                }
            });
        }
    });

    this.route('game', {
        path: '/game/:gameId',
        template: 'gameCanvas',
        waitOn: function(){
            var gameId = this.params.gameId;
            return [
                Meteor.subscribe('game', gameId),
                Meteor.subscribe('syncsForGame',gameId),
                Meteor.subscribe('playersForGame',gameId)
            ];
        },
        data : function(){
            var gameId = this.params.gameId;
            return {
                game : Games.findOne({ _id : gameId }),
                syncs : Syncs.find({ gameId : gameId }),
                players : Players.find()
            };
        }
    });

    this.route('precontroller', {
        path: '/c',
        action : function(){
            Meteor.call('createPlayer', function(error,playerId){
                if(!error){
                    Router.go('controller', {playerId: playerId});
                } else {
                    alert('oops');
                }
            });
        }
    });

    this.route('controller', {
        path: '/play/:playerId',
        waitOn: function(){
            return [
                Meteor.subscribe('player',this.params.playerId),
                Meteor.subscribe('syncForPlayer',this.params.playerId),
                Meteor.subscribe('gameForPlayer',this.params.playerId)
            ];
        },
        data: function(){
            return {
                game : Games.findOne(),
                player : Players.findOne(this.params.playerId),
                sync : Syncs.findOne({ playerId : this.params.playerId })
            };
        }
    });
    

    // this.route('loading', { path: '/loading'});
    // this.route('offline', { path: '/offline'});
});