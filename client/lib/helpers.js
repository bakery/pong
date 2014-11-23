Helpers = {
    absolutePositionToRelative : function(v){
        var screenWidth = $(document.body).width();
        return v/screenWidth;
    },

    relativePositionToAbsolute : function(v){
        var screenWidth = $(document.body).width();
        return Math.floor(v*screenWidth);
    }
};