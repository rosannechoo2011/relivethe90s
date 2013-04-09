<!DOCTYPE html>
<html lang="en" ng-app="myApp">
   <head>
      <title>RPS: Game On!</title>
      <style type='text/css'>
         /* MUST HAVE WIDTH/HEIGHT */
         .ace-editor {
         width:100%;
         height:200px;
         }
         #contents {
         width:50%;
         height:50%;
         position:absolute;
         top:0;
         }
      </style>
      <script src="angular.min.js"></script>
      <script src="angular-resource.min.js"></script>
      <script src="jquery.min.js"></script>
      <script src="angular-ace.js"></script>
      <script src="ace.js" type="text/javascript" charset="utf-8"></script>
      <script language="javascript" type="text/javascript">
         angular.module('myApp', ['ngResource','ace']);
         
         function FirstController($scope, $resource){ 
             $scope.supported_langugages = [
               {language : 'java', urlName : 'java' },
               {language : 'js', urlName : 'js' },
             ];
             
             $scope.bots = [
               {bot : 'dumb bot', urlName : 'dumb bot' },
               {bot : 'smart bot', urlName : 'smart bot' },
             ];
         
            $scope.bot = 'dumb bot';
              
             $scope.language = 'java';
         
                     //Some example code for each language.
             $scope.d = {
                          "js":{"solution":"a=1;\nb=7;",
                               "tests":"assert_equal(1,a);\nassert_equal(2,b);"},
                         
                         "java":{"solution":"public String nextMove(){\n\treturn \"paper\";\n}",
                                 "tests":"String userChoice = nextMove(); assertEquals(1, userChoice); ",
                         }
                 },
         
         
             $scope.status = "Ready"
             //Load some good code
             $scope.load_example_code = function(){
               $scope.solution = $scope.d[$scope.language]["solution"];
               $scope.tests = $scope.d[$scope.language]["tests"];
             };
         
         
             // For the loadbalancer version with fewer options. 
             $scope.VerifierModel = $resource('http://ec2-54-251-193-188.ap-southeast-1.compute.amazonaws.com/:language',
                                     {},{'get': {method: 'JSONP', isArray: false, params:{vcallback: 'JSON_CALLBACK'}}
                                        }
                                 );
         
             $scope.verify = function(){
               data = {solution: $scope.solution, tests: $scope.tests}
               jsonrequest = btoa(JSON.stringify(data));
         
               $scope.status = "Verifying"
               $scope.VerifierModel.get({'language':$scope.language,
                                         'jsonrequest':jsonrequest},
                   
                  
                     function(response) { 
                       $scope.result = response;
                       var arr = response["results"];
                       var userChoice = arr[0].received;
                       $scope.status = "Ready";
                       getWinner(userChoice);
         
                     });
         
                     
                     function getWinner(userChoice){
                          
                          var computerChoice = ""; 
                          
                          if($scope.bot==="dumb bot"){
                            computerChoice = "rock";
                          }else {
                            var computer = Math.random(); 
                            if (computer < 0.34) {computerChoice = "rock";} 
                            else if (computer < 0.67){computerChoice = "paper";} 
                            else {computerChoice = "scissors";} 
                          }
                       
                       var msg = "";
               
               // Rock, Paper, Scissors, Lizard, Spock
         
         var choices = ["rock","paper","scissors"]; // you could comment out the last two for the standard game.
         
         
         var userStreak = "";
         var getScore = function(){
                   console.log("Getting current score from Facebook");
                  FB.api('/me/scores/', 'get', function(response) {
                    console.log("Score retrieved from Facebook");  
                    jsonres = JSON.stringify(response);
                    console.log("res" + jsonres);
                    
                    var arr = jsonres["data"];
                    alert(data);
                    userStreak = arr[1].score;
                    alert(userStreak);
                    userStreak = arr[1];
                    alert("f=" + userStreak);
                    
        });
         };
         
         
         var userWins = 0;
         var computerWins = 0;
         var results = {
         "scissorspaper" : "cuts",//Scissors cuts paper
         "paperrock" : "covers", //Paper covers rock
         "rockscissors" : "crushes" //Rock crushes scissors
         };
         // compare makes a key of the two choices and determines the winner
         var computer = computerChoice;
         var user = userChoice.toString().trim().replace("[","").replace("]",""); 
         alert(computer);
         alert(user);
         var winner = "";
         var compare = function(user,computer){
         if (user === computer){
         msg = "The result is a tie!";
         winner = "Draw";
         }
         else if (results[user+""+computer] !== undefined){ // user beats computer
         userWins++;
         msg = user+" "+results[user+""+computer]+" "+computer;
         winner ="Congrats, you beat the bot!";
         } else { //computer beats user
         computerWins++;
         msg = computer+" "+results[computer+""+user]+" "+user;
         winner = "Try again, this bot is good (;";
         }
         };
                  compare(user, computer);
                  $scope.computerMove = computer;
                  $scope.userMove = user;
               $scope.winner = winner;
                  $scope.outcome = msg;
                  getScore();
                  if (userStreak < userWins ){
                        var setscore = function(userWins){
                           console.log("Posting score to Facebook");
                          FB.api('/me/scores/', 'post', { score: userWins }, function(response) {
                            console.log("Score posted to Facebook");           
                            });
      
                        }
                        setscore();
                  } else {
                    console.log("old streak higher");
                  }
                  
                     }
                     
             };
         
           }
      </script>
   </head>
   <body ng-controller="FirstController">
      <br>
      <div id = "fb-root"></div>
      <div id = "user-info"></div>
      <p><button id="fb-auth">Login</button></p>
      <script src = "./fblogin.js"></script>
      Choose which language you want to code in:<br>
      <select ng-model="language" ng:change="load_example_code()" ng-options="item.language as item.urlName for item in supported_langugages"></select>
      <br>
      
      Choose which bot you want to beat<br>
      <select ng-model="bot" ng-options="item.bot as item.urlName for item in bots"></select>
      <br>
      Status: {{status}}<br>
      Result: 
      <pre>{{result}}</pre>
      <br>
      Winner: {{winner}}</br>
      Outcome: {{outcome}}</br>
      <table border=1 bgcolor=#FFFFFF>
         <tr >
            <th>Computer</th>
            <th>Player</th>
         </tr>
         <tr>
            <td>{{computerMove}}</td>
            <td>{{userMove}}</td>
         </tr>
      </table>
      Player Solution:
      <div>
         <textarea ng-model="solution" name="solution" rows="8" cols="50"></textarea>
      </div>
<input type="submit" value="Try and beat the bot!" ng-click="verify()">
      <br>
      <span ng-init="load_example_code()"></span>
   </body>
</html>
