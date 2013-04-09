window.fbAsyncInit = function($scope) {
  FB.init({ appId: '136675969847991', 
        status: true, 
        cookie: true,
        xfbml: true,
        oauth: true});

  function updateButton(response) {
    var button = document.getElementById('fb-auth');
        
    if (response.authResponse) {
      //user is already logged in and connected
      var userInfo = document.getElementById('user-info');
      FB.api('/me', function(response) {
        userInfo.innerHTML = '<img src="https://graph.facebook.com/' 
      + response.id + '/picture"><br> Welcome,' + response.name;
        button.innerHTML = 'Logout';
      });
      
      
                         console.log("Getting current score from Facebook");
                        FB.api('/me/scores/', 'get', function(response) {
                          console.log("Score retrieved from Facebook");  
                          var arr = response["data"];
                          userStreak = arr[0].score; 
                          alert("streak=" + userStreak);
                          arr[0].score = $scope.userStreak;
                          alert("scope.userStreak=" + $scope.userStreak);
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
        FB.login(function(response) {
      if (response.authResponse) {
            FB.api('/me', function(response) {
          var userInfo = document.getElementById('user-info');
          userInfo.innerHTML = 
                '<img src="https://graph.facebook.com/' 
            + response.id + '/picture" style="margin-right:5px"/>' 
            + response.name;
        });    
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
