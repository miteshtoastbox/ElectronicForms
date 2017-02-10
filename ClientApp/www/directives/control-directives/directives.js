angular.module('controlDirectives', ['ionic'])

.directive("limitTo", function() {
    return {
        restrict: "A",
        link: function(scope, elem, attrs) {
            var limit = parseInt(attrs.limitTo);
            angular.element(elem).on("keypress", function(e) {
                if (this.value.length == limit) e.preventDefault();
            });
        }
    }
})

.directive('ctrlInputString', function () {
    return {
        restrict: 'E',
        scope: {
          myfield:'=myfield', 
          mylbl:'@'
      },
        templateUrl: 'directives/control-directives/ctrlInputString.tpl.html',
    }
  })

.directive('ctrlDropdownStatic', function () {
    return {
        restrict: 'E',
        scope: {
          myfield:'=myfield', 
          mylbl:'@',
          myoptions:'='
        },
        templateUrl: 'directives/control-directives/ctrlDropdownStatic.tpl.html',
    }
  })

.directive('ctrlDropdownDynamic', function () {
    return {
        restrict: 'E',
        scope: {
          myfield:'=myfield', 
          mylbl:'@',
          myoptions:'='
        },
        templateUrl: 'directives/control-directives/ctrlDropdownDynamic.tpl.html',
    }
  })

.directive('ctrlCheckboxDynm', function () {
    return {
        restrict: 'E',
        scope: {
          mylbl:'@',
          mylist:'='
        },
        templateUrl: 'directives/control-directives/ctrlCheckboxDynm.tpl.html',
    }
  })

.directive('ctrlToggle', function () {
    return {
        restrict: 'E',
        scope: {
          mylbl:'@',
          myfield:'=myfield'
        },
        templateUrl: 'directives/control-directives/ctrlToggle.tpl.html',
    }
  })

.directive('ctrlDate', function () {
    return {
        restrict: 'E',
        scope: {
          myfield:'=myfield', 
          mylbl:'@'
      },
        templateUrl: 'directives/control-directives/ctrlDate.tpl.html',
    }
  })

.directive('ctrlFrmEduQual', function ($ionicPopup) {
    return {
        restrict: 'E',
        scope: {
          myfield:'=', 
          mylbl:'@'
      },
      templateUrl: 'directives/control-directives/ctrlFrmEduQual.tpl.html',

      link: function(scope,element,attrs){
                      
        scope.addrow = function(){          
          scope.myfield.push({'qualdetails':null,'datecompleted':null,'level':null});          
        }

        scope.removerow = function(id){          

          var confirmPopup = $ionicPopup.confirm
          ({
              title: 'Remove Education Details',
              template: 'Are you sure you want to remove this Education Detail?'
          });
          confirmPopup.then(function(res) 
          {           
            if (id > -1) {
                scope.myfield.splice(id, 1);
            }
          });

        }

      }
    }
  })


.directive('ctrlCourseOffer', function () {
    return {
        restrict: 'E',
        scope: {
          myfield:'=', 
          mylbl:'@'
      },
      templateUrl: 'directives/control-directives/ctrlCourseOffer.tpl.html',

      link: function(scope,element,attrs){

        scope.addrow = function(){          
          scope.myfield.push({'course':null,'framework':null,'deliverymode':null,'startdate':null,'enddate':null});          
        }

      }
    }
  })

.directive('ctrlDropdownCourses', function (booksManager) {
    return {
        restrict: 'E',
        scope: {
          myfield:'=myfield', 
          course_offeringjson:'=course_offeringjson',
          mylbl:'@',
          myoptions:'='
        },
        templateUrl: 'directives/control-directives/ctrlDropdownCourses.tpl.html',

        link: function(scope,element,attrs){          

          scope.onParentCourseChange = function(coursecode){
            promGetChildCourseModules = booksManager.getChildCourseModules(coursecode.MainOfferingCode);
            promGetChildCourseModules.then(function(childmodules){                      
              scope.course_offeringjson = childmodules;
            });       
          }
      }
    }
  })

.directive('ctrlEmpBy', function (booksManager,$q,$timeout) {
    return {
        restrict: 'E',
        scope: {
          myfield:'=myfield', 
          mylbl:'@'
      },
        templateUrl: 'directives/control-directives/ctrlEmpBy.tpl.html',

        link: function(scope,element,attrs){

          scope.empbyOnChange = function(){
            if(scope.myfield.length >= 3)
            {
              searchOrg(scope.myfield).then(function(matches){
                scope.OrgData = matches;
              })
            }            
          }

        scope.orgOnClick = function(org){                
          scope.OrgData=null;
          // set object data based on selection          
          booksManager.currentForm.PersonalDetails.emplrn_orgid = org.OrganisationID;
          booksManager.currentForm.PersonalDetails.emplrn_empby = org.Name;

          if(org.Address1 !==null){
            booksManager.currentForm.PersonalDetails.empall_empaddr = org.Address1; 
          }

          if(org.Address2 !==null){
            booksManager.currentForm.PersonalDetails.empall_empaddr = booksManager.currentForm.PersonalDetails.empall_empaddr +", "+ org.Address2; 
          }

          if(org.Address3 !==null){
            booksManager.currentForm.PersonalDetails.empall_empaddr = booksManager.currentForm.PersonalDetails.empall_empaddr +", "+ org.Address3; 
          }

          if(org.Address4 !==null){
            booksManager.currentForm.PersonalDetails.empall_empaddr = booksManager.currentForm.PersonalDetails.empall_empaddr +", "+ org.Address4; 
          }

          if(org.Address5 !==null){
            booksManager.currentForm.PersonalDetails.empall_empaddr = booksManager.currentForm.PersonalDetails.empall_empaddr +", "+ org.Address5; 
          }

          if(org.PostcodeIn !==null){
            booksManager.currentForm.PersonalDetails.empall_postcode = org.PostcodeIn;
          }
          
          if(org.PostcodeOut !==null){
            booksManager.currentForm.PersonalDetails.empall_postcode = booksManager.currentForm.PersonalDetails.empall_postcode +" "+ org.PostcodeOut;
          }

           if(org.WorkTel !==null){
            booksManager.currentForm.PersonalDetails.empall_tel = booksManager.currentForm.PersonalDetails.empall_tel = org.WorkTel;
          }
          
          console.log(org)
        }

        scope.orgClear = function(){
          booksManager.currentForm.PersonalDetails.emplrn_orgid='';
          booksManager.currentForm.PersonalDetails.emplrn_empby='' ;       
          booksManager.currentForm.PersonalDetails.empall_empaddr = '';
          booksManager.currentForm.PersonalDetails.empall_empaddr = '';
          booksManager.currentForm.PersonalDetails.empall_empaddr = '';
          booksManager.currentForm.PersonalDetails.empall_empaddr = '';
          booksManager.currentForm.PersonalDetails.empall_empaddr = '';
          booksManager.currentForm.PersonalDetails.empall_postcode = '';
          booksManager.currentForm.PersonalDetails.empall_postcode = '';
          booksManager.currentForm.PersonalDetails.empall_tel = '';
        }

        searchOrg = function(searchFilter) {
          var deferred = $q.defer();
          var matches = booksManager.lookupdata.OrganisationData.filter( function(org) {
            if(org.Name.toLowerCase().indexOf(searchFilter.toLowerCase()) !== -1 ) return true;
          })

          $timeout( function(){            
             deferred.resolve( matches );
          }, 500);
          return deferred.promise;
        }      
      }
    }
  })


.directive('ctrlSignature', function ($ionicModal) {
    return {
        restrict: 'E',
        scope: {
          myfield:'=myfield', 
          mylbl:'@',          
          canvasid:'@',
        },
        templateUrl: 'directives/control-directives/ctrlSignature.tpl.html',

        link: function(scope,element,attrs){


          $ionicModal.fromTemplateUrl('image-modal.html', {
          scope: scope,
          animation: 'slide-in-up'
          }).then(function(modal) {
            scope.modal = modal;
          });         

          var canvas = '';
          var signaturePad = '';          

          scope.openModal = function() {
            scope.modal.show()
            .then(function(){
              canvas = document.getElementById(scope.canvasid);              
              signaturePad = new SignaturePad(canvas);              
            });      
          };

          scope.showSig = function(){            
            scope.openModal();      
          }

          scope.saveCanvas = function() {                   
              var sigImg = signaturePad.toDataURL();                            
              scope.myfield = sigImg;                                        

              scope.modal.remove();
              scope.modal.hide();              
          }

          scope.closeCanvas = function(){                        
            scope.modal.remove();
            scope.modal.hide();
          }    
        }
    }
  })





