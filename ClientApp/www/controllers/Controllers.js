angular.module('Controllers', ['ionic'])

.controller('MainmenuCtrl', ['$scope','booksManager','$q','$ionicHistory', function ($scope,booksManager,$q,$ionicHistory) {

	$scope.$on("$ionicView.enter", function () {
		// reset current form.
		booksManager.currentForm = null;		

		// clear any cache to avoid fields showing cached data.
	    $ionicHistory.clearCache();
	    $ionicHistory.clearHistory();	    
	});
}])


.controller('AddEditPersonCtrl', ['$scope','booksManager', function($scope,booksManager) {

	booksManager.create().then(function(){
		// new form instance initialised now.
		$scope.frm = booksManager.currentForm;			
	});

	$scope.AddPerson = function(){
		booksManager.addPerson($scope.frm);  	
	};
}])


.controller('LogCtrl', ['$scope','booksManager', function($scope,booksManager) {

	var promGetAllPersons = booksManager.getLog();
	promGetAllPersons.then(function(r){
		console.log(r);
		$scope.PersonList=r;		
	}, function(reason){
		console.log('reason:'+ reason);
	});	
	
}])

.controller('ListPersonsCtrl', ['$scope','booksManager','sqldb','$state','$ionicPopup','$ionicLoading', function ($scope,booksManager,sqldb,$state,$ionicPopup,$ionicLoading) {			

	var promGetAllPersons = booksManager.getAllPersons();
	promGetAllPersons.then(function(r){
		console.log(r);
		$scope.PersonList=r;		
	}, function(reason){
		console.log('reason:'+ reason);
	});	

	
	$scope.send = function(id){
		var promGetformbyid = booksManager.getPersonalDetailsById(id);
		promGetformbyid.then(function(data){
			booksManager.currentForm = data;
			
			/*#################################################################################################################################################*/
			// We set PK_PersonDetails_id=0 AND pk_persondetails_id=0 as the webservice uses the same method for client and serverside updates
			/*#################################################################################################################################################*/
			booksManager.currentForm.PersonalDetails.PK_PersonDetails_id=0;
			booksManager.currentForm.PersonalDetails.pk_persondetails_id=0;
			/*#################################################################################################################################################*/
			return booksManager.currentForm;
		})
		.then(function(frm){
			return booksManager.sendForm(frm);	
				// check we have a internet connection
				if(window.Connection){          		
	          		if(navigator.connection.type == Connection.NONE){            		
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
	          			return booksManager.sendForm(frm);	
	          		}	 
      			}       			
		}, function(err){
			console.log('error (loadeditform) :');
			console.log(err);
		});
	}

	$scope.loadeditform = function(id){

		$ionicLoading.show({
          templateUrl:"templates/loading.html"
        });

		var promGetformbyid = booksManager.getPersonalDetailsById(id);
		promGetformbyid.then(function(data){
			// set current form for edit			
			booksManager.currentForm = data;									
		}).then(function(){
			$state.go('multiform.page1');
		}, function(err){
			alert('error (loadeditform) :'+ err.message);
		});
	}
}])


.controller('MultiformCtrl_Page1', ['$scope','booksManager','$state','$ionicLoading', function ($scope,booksManager,$state,$ionicLoading) {
    function isEmpty(obj) {
	    for(var prop in obj) {
	        if(obj.hasOwnProperty(prop))
	            return false;
	    }

	    return true;
	}		
	

    if(isEmpty(booksManager.currentForm)){
    	console.log('is empty yay...');
    	$scope.booksManager = booksManager;

		// create new form instance
		var promFrmInstance = booksManager.create();
		promFrmInstance.then(function(){
			
			$scope.frm = booksManager.currentForm;									
			console.log('### New Instance ###');
			console.log(booksManager.currentForm);
			console.log('### #### ###');
		}).then(function(){
			return;
		}, function(err){
			console.log('err');
			console.log(err);
		});
    }    
    else
    {
    	/* load existing form */
    	$scope.frm = booksManager.currentForm;
    	console.log('### Existing Instance ###');
		console.log(booksManager.currentForm);

		booksManager.currentForm.PersonalDetails.officeuse1=[];
        booksManager.currentForm.PersonalDetails.officeuse2=[];
        booksManager.currentForm.PersonalDetails.officeuse3=[];
        booksManager.currentForm.PersonalDetails.funding_proportion=[];

		console.log('### #### ###');			
    }		

    // Populate Lookup Data Object
    booksManager.populateParentCourseDropDown();    
    booksManager.populateOrganisationDataObject();
    $scope.Nationality = JSON.parse(localStorage.getItem("lookup_Nationality"));   
    $ionicLoading.hide();
}])


.controller('MultiformCtrl_Page2', ['$scope','booksManager','$state', function ($scope,booksManager,$state) {      
   
   $scope.ContactRelationship = JSON.parse(localStorage.getItem("lookup_StudentContactRelationship"));   
   
   $scope.frm = booksManager.currentForm;   
   console.log(booksManager.currentForm); 

}])


.controller('MultiformCtrl_Page3', ['$scope','booksManager','$state', function ($scope,booksManager,$state) {
	
	$scope.EmpStatusLookup = [
   		{id:"01", description:"Self employed"},
   		{id:"10", description:"In Paid Employment"},
   		{id:"11", description:"Unemployed, looking for work and available to start work"},
   		{id:"12", description:"Unemployed, not looking for work and/or not available to start work"},   		
   		{id:"98", description:"Not Known/Not Provided"}];

   	$scope.ReligionLookup = [
   		{id:"1", description:"Christianity"},
   		{id:"2", description:"Judaism"},
   		{id:"3", description:"Buddhism"},
   		{id:"4", description:"Sikhism"},   		
   		{id:"5", description:"Hinduism"},
   		{id:"6", description:"Islam"}];

   	$scope.SexualityLookup = [
       { id: "1", description: "Heterosexual/Straight" },
       { id: "2", description: "Bisexual" },
       { id: "3", description: "Gay/Lesbian" },       
       { id: "4", description: "Prefer not to say" }];

   	$scope.frm = booksManager.currentForm;      
}])

.controller('MultiformCtrl_Page4', ['$scope','booksManager','$state', function ($scope,booksManager,$state) {
   
   $scope.frm = booksManager.currentForm;      

   //bind parent courses to the dropdown
   $scope.parentcourse = booksManager.lookupdata.courses;
   $scope.frm.PersonalDetails.main_offeringcode = booksManager.currentForm.PersonalDetails.main_offeringcode;   

   // onChange of Parent Course, get child modules
   $scope.onParentCourseChange = function(main_offeringcode){   		   		
   		promGetChildCourseModules = booksManager.getChildCourseModules(main_offeringcode.OfferingID);
   		promGetChildCourseModules.then(function(childmodules){   			   			
   			$scope.frm.PersonalDetails.course_offeringjson = childmodules;
   		});   		
   }   
}])


.controller('LoginCtrl', ['$scope','$state','$ionicPopup', function($scope,$state,$ionicPopup){
	$scope.login={username:'erenrol',password:'wpl123'};

	$scope.dologin = function(login){
		if(login.username.toLowerCase() =='erenrol' && login.password.toLowerCase() =='wpl123'){			
			$state.go('mainmenu');
		}
		else{
			$ionicPopup.alert({
      		title: "Login Incorrect",
      		content: "Sorry but the username or password was incorrect."
    		}).then(function(){
    			$scope.login={username:'',password:''};
    		})
		}
	}
}])

.controller('MultiformCtrl_Menu', ['$scope','booksManager','$state','$ionicPopup', function ($scope,booksManager,$state,$ionicPopup) {
   
    $scope.SaveForm = function(){		
		
		var promAddPersonalDetails = booksManager.addPersonalDetails(booksManager.currentForm);
		promAddPersonalDetails.then(function(r){
			console.log('data saved :');
			console.log(r);
			
		}, function(err){
			alert('error: (AddFormToDB) :');
			console.log(err.message);
		});
	}		

	$scope.SaveFormExit = function(){
		console.log($scope.frm);

		var promAddPersonalDetails = booksManager.addPersonalDetails(booksManager.currentForm);
		promAddPersonalDetails.then(function(r){
			console.log('data inserted :'+ r);
			$state.go('mainmenu');
		}, function(err){
			alert('error: (AddFormToDB) :');
			console.log(err.message);
		});
	}

	$scope.Exit = function(){

		$ionicPopup.confirm({
  		title: "Have You Saved Your Form?",
  		content: "<b>Have you saved your form before you Exit?</b>",
  		scope: $scope,
  		buttons:[
  			{
  				text:'NO', 
  				type: 'button-assertive',
  				type: 'button-assertive',
  				onTap: function(e){  					
  				}
  			},
  			{
  				text: 'YES',  				
  				onTap: function(e){
  					$state.go('mainmenu');
  				}
  			}
  		]
		});		
	}			
}])

