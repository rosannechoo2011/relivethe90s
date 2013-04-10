window.fbAsyncInit = function() {
  FB.init({ appId: '136675969847991', 
        status: true, 
        cookie: true,
        xfbml: true,
        oauth: true});
        
  var setScoreRecord = false;

  function updateButton(response) {
    var button = document.getElementById('fb-auth');
        
    if (response.authResponse) {
      //user is already logged in and connected
      var userInfo = document.getElementById('user-info');
      FB.api('/me', function(response) {
        userInfo.innerHTML = '<img src="https://graph.facebook.com/' 
      + response.id + '/picture">  Welcome, ' + response.name;
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
      button.innerHTML = 'Login with Facebook';
      button.onclick = function() {
        if (response.status === 'not_authorized') {
            // the user is logged in to Facebook, 
            // but has not authenticated your app
            setScoreRecord = true;
          } 
        FB.login(function(response) {
      if (response.authResponse) {
            FB.api('/me', function(response) {
          var userInfo = document.getElementById('user-info');
          userInfo.innerHTML = 
                '<img src="https://graph.facebook.com/' 
            + response.id + '/picture" style="margin-right:5px"/>' 
            + response.name;
        });  
        
        if (setScoreRecord){
            var defscore = 0;
           FB.api('/me/scores/', 'post', { score: defscore }, function(response) {
                            console.log("default score set");  
                            console.log("setscore=" + response);
                            });
        }
          } else {
            //user cancelled login or did not grant authorization
          }
        }, {scope:'email,publish_actions,friends_games_activity'});    
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
