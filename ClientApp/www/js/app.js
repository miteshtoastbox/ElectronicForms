// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic','ngCordova','Controllers','booksManagerMod','Book','sqldb','controlDirectives','config'])

/*
.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})
*/

.run(function($ionicPlatform, $cordovaSQLite,sqldb,booksManager, $ionicPopup,$ionicLoading) {
    $ionicPlatform.ready(function() {
        if(window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if(window.StatusBar) {
            StatusBar.styleDefault();
        }                        
        
        // Create the database if no sql strings exist.
        // ### need to do a select sql statment to check this                        
        //if(window.Connection){
          if(1==1){
          //if(navigator.connection.type == Connection.NONE){
            if(1==2){
            $ionicPopup.confirm({
              title: "Internet Disconnected",
              content: "The Internet is disconected on your device."
            })
            .then(function(ok){
              if(!ok){                
                ionic.Platform.exitApp();
              }
            });
          } else{
            // We have a connection
            var import_OrgData=false;
            var import_ApprenHierarchy=false;

            // show loading ticker
            $ionicLoading.show({
              templateUrl:"templates/loading.html"
            });

            var promSetSqlString = booksManager.setSqlString(); // calls webservice                
            promSetSqlString.then(function(resp){                
              console.log(booksManager._path)                                  
              console.log(resp);
              return sqldb.openDB();
            }).then(function(){              
              return $cordovaSQLite.execute(db, localStorage.getItem("sqlCreate_PersonalDetails")).then(function(res){console.log(res);});                 
            }).then(function(){              
              return $cordovaSQLite.execute(db, localStorage.getItem("sqlCreateSql_ApprenticeshipsHierarchy")).then(function(res){console.log(res);});                 
            })
            .then(function(){              
              return $cordovaSQLite.execute(db, localStorage.getItem("sqlCreateSql_OrganisationData")).then(function(res){console.log(res);});                 
            })
            .then(function(){              
              return $cordovaSQLite.execute(db, localStorage.getItem("sqlCreateSql_Log")).then(function(res){console.log(res);});                 
            })
            .then(function(){
              return;
              //return booksManager.setLookupData("lookup_StudentContactRelationship","/getStudentContactRelationship");
            })
            .then(function(){
              return;
              //return booksManager.setLookupData("lookup_Nationality","/getHENationality");              
            })
            .then(function(){              
              return sqldb.get_OrgDataCount();
            })
            .then(function(OrgDataCount){              
              // if we have a record in OrganisationData table, don't re-import                          
              console.log('OrgDataCount:'+ OrgDataCount)
              if(OrgDataCount <= 0){
                import_OrgData=true;
              }
            })
            .then(function(){
              
              return;
              //return sqldb.get_ApprenticeshipsHierarchyCount();
            })
            .then(function(ApprenHierarchyCount){
              // if we have a record in ApprenticeshipsHierarchy table, don't re-import
              console.log('ApprenHierarchyCount:'+ ApprenHierarchyCount)
              if(ApprenHierarchyCount <= 0){
                import_ApprenHierarchy=true;
              }
            })
            .then(function(){
              if(import_OrgData==true){
                //return $cordovaSQLite.execute(db,"delete from OrganisationData").then(function(res){console.log(res);});          
              }
            })
            .then(function(){
              if(import_ApprenHierarchy==true){
                //return $cordovaSQLite.execute(db,"delete from ApprenticeshipsHierarchy").then(function(res){console.log(res);});                    
              }
            })
            .then(function(){
              if(import_OrgData==true){
                $ionicLoading.hide();
                $ionicLoading.show({
                  templateUrl:"templates/loadingorg.html"
                });
                return booksManager.getOrganisationData();  
              }
              
            })
            .then(function(){          
              // this will populdate the coureses.
              if(import_ApprenHierarchy==true){
                $ionicLoading.hide();
                $ionicLoading.show({
                  templateUrl:"templates/loadingcourse.html"
                });
                return booksManager.getApprenticeshipsHierarchy();                    
              }
              
            }).then(function(val){
                $ionicLoading.hide();
                console.log('val:'+ val);
            }, function(err){
                console.log('### there was an error along the promise chain ###');
                console.log('err object:');
                console.log(err);
                $ionicLoading.hide();
                $ionicPopup.alert({
                title: "Error Loading Data",
                content: "There was a problem loading the data. Please ensure you have a Internet Connection and Restart the app again."
                })
            });
          }
        }        
    });
})

.config(['$stateProvider', '$urlRouterProvider','$httpProvider', function ($stateProvider,$urlRouterProvider) {    

  $stateProvider  

  
  $urlRouterProvider.otherwise('/login');  


  $stateProvider.state('login',{ 
    url:'/login',        
    templateUrl:'templates/login.html',
    controller: 'LoginCtrl'        
  })

  $stateProvider.state('mainmenu',{ 
    url:'/mainmenu',        
    templateUrl:'templates/mainmenu.html',
    controller: 'MainmenuCtrl'        

  })

  $stateProvider.state('add',{ 
    url:'/add',        
    templateUrl:'templates/add_editperson.html',
    controller: 'LoginCtrl'        
  })

  // $stateProvider.state('controlsplay',{ 
  //   url:'/controlsplay',        
  //   templateUrl:'templates/controlsplay.html',
  //   controller: 'MultiformCtrl_Page1'        
  // })


  $stateProvider.state('listpersons',{ 
    url:'/listpersons',        
    templateUrl:'templates/listpersons.html',
    controller: 'ListPersonsCtrl'        
  })  

$stateProvider.state('log',{ 
    url:'/log',        
    templateUrl:'templates/log.html',
    controller: 'LogCtrl'        
  })  

  /**** MULTI FORM ****/
  .state('multiform', {
            abstract: true,
            url: '/multiform',
            templateUrl: "templates/multiform/layout/menu-layout.html",
            controller:"MultiformCtrl_Menu",
            cache: false,
        })

  .state('multiform.page1', {            
            url: '/page1',
            views:{
              "mainContent":{
                templateUrl: "templates/multiform/page1.html",                
                controller: 'MultiformCtrl_Page1'
              }
            }           
        })

  .state('multiform.page2', {            
            url: '/page2',
            views:{
              "mainContent":{
                templateUrl: "templates/multiform/page2.html",                
                controller: 'MultiformCtrl_Page2'
              }
            }           
        })
  

  .state('multiform.page3', {            
            url: '/page3',
            views:{
              "mainContent":{
                templateUrl: "templates/multiform/page3.html",                
                controller: 'MultiformCtrl_Page3'
              }
            }           
        })

  .state('multiform.page4', {            
            url: '/page4',
            views:{
              "mainContent":{
                templateUrl: "templates/multiform/page4.html",                
                controller: 'MultiformCtrl_Page4'
              }
            }           
        })

  /**************************/

}]) 