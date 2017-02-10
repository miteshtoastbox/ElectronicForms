angular.module('config', ['ngCordova'])

.factory('config', ['$cordovaSQLite','$q',  function($cordovaSQLite,$q) { 

	var config = {
		WebServicePath:'http://erenrol.local/api/AppSql',            
    };
    return config;
}]);