window.fbAsyncInit = function() {
  FB.init({ appId: '136675969847991', 
        status: true, 
        cookie: true,
        xfbml: true,
        oauth: true});


var access_token = "";
  function updateButton(response) {
    var button = document.getElementById('fb-auth');
        
    if (response.authResponse) {
      //user is already logged in and connected
      var userInfo = document.getElementById('user-info');
      FB.api('/me', function(response) {
        userInfo.innerHTML = '<img src="https://graph.facebook.com/' 
      + response.id + '/picture">' + response.name;
        button.innerHTML = 'Logout';
      });
      button.onclick = function() {
        FB.logout(function(response) {
          var userInfo = document.getElementById('user-info');
          userInfo.innerHTML="";
    });
      };
    } else {
      //user is not connected to your app or logged out
      button.innerHTML = 'Login';
      button.onclick = function() {
        FB.login(function(response) {
      if (response.authResponse) {
            FB.api('/me', function(response) {
          var userInfo = document.getElementById('user-info');
          userInfo.innerHTML = 
                '<img src="https://graph.facebook.com/' 
            + response.id + '/picture" style="margin-right:5px"/>' 
            + response.name;
          access_token =   FB.getAuthResponse()['accessToken'];
    
        });   
        
        var scorepoint = 15;
        FB.api("/me/scores", 'post', {score: scorepoint, access_token: access_token}, function(response){
       if (!response || response.error) {
          console.error(response);
       } else {
         console.log(response);
         var userScore = document.getElementById('userscore');
          userScore.innerHTML = 
                'userScore=' 
            + response;
         
}
}); 
        
          } else {
            //user cancelled login or did not grant authorization
          }
        }, {scope:'email,publish_actions,user_games_activity,friends_games_activity'});    
      }
    }
  }
    
  // run once with current status and whenever the status changes
  FB.getLoginStatus(updateButton);
  FB.Event.subscribe('auth.statusChange', updateButton);    
};
    
(function() {
  var e = document.createElement('script'); e.async = true;
  e.src = document.location.protocol 
    + '//connect.facebook.net/en_US/all.js';
  document.getElementById('fb-root').appendChild(e);
}());
