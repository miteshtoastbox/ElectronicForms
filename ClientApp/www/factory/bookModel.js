angular.module('Book', ['ngCordova'])

.factory('Book', ['$http', function($http) {  

    function Book(bookData) {
        "use strict";

        this.init = function(PersonDetails){

            function convertToObjects(data) {
                var keys = data.shift(),
                    i = 0, k = 0,
                    obj = null,
                    output = [];

                for (i = 0; i < data.length; i++) {
                    obj = {};

                    for (k = 0; k < keys.length; k++) {
                        obj[keys[k]] = null;
                    }

                    //### don't want to return an array, just want the object.
                    //output.push(obj);
                }

                return obj;
                // return output
            };
            
            this.PersonalDetails = convertToObjects([PersonDetails,[]]);                           
        }
    };

    return Book;
}]);