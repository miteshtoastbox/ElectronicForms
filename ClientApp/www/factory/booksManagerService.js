angular.module('booksManagerMod', ['ngCordova'])

.factory('booksManager', ['config','$http', '$q', 'Book', '$cordovaSQLite','sqldb','$state','$ionicPopup', function(config,$http, $q, Book, $cordovaSQLite,sqldb,$state,$ionicPopup) {  
    var booksManager = {
                
        _path : config.WebServicePath,

        _pool: [],
        currentForm: {},

        // lookupdata stores any looksup data we may use in dropddowns etc in the app
        lookupdata:{},

        /* the create strings will come from the webservice */
        // sqlCreate_PersonalDetails : 'CREATE TABLE PersonalDetails (PersonDetails_id integer primary key AUTOINCREMENT NOT NULL, name text, title text, has_attended_bury_college int, additional_learning_supp text, inpaid_employment text, dob text)',
        sqlCreate_PersonalDetails :null,

        // relates to - Additional Learning Support section on yellow form                

        // Stores all Apprenticehip courses
        sqlCreateSql_ApprenticeshipsHierarchy : null,          

        // Stores all Organisation Data
        sqlCreateSql_OrganisationData : null,          
                       
        // create new form and do any inits needed. 
        create: function(){

            function returnFieldArrayFromSql(sqlstring){
                console.log('sqlstring :');
                console.log(sqlstring);
                //var columns= sqlstring.match(/.*CREATE\s+TABLE\s+(\S+)\s*\((.*)\).*/)[2].split(/,/);
                var columns= sqlstring.match(/.*CREATE\s+TABLE\s+(\S+)\s*\((.*)\).*/)[2].split(/,/);
                for(i = 0;i < columns.length; i++) {
                    columns[i] = columns[i].toLowerCase();
                    columns[i] = columns[i].replace('integer', '');
                    columns[i] = columns[i].replace('primary', '');
                    columns[i] = columns[i].replace('key', '');
                    columns[i] = columns[i].replace('autoincrement', '');
                    columns[i] = columns[i].replace('not', '');
                    columns[i] = columns[i].replace('null', '');
                    columns[i] = columns[i].replace('text', '');
                    columns[i] = columns[i].trim();
                }
                return columns;
            }

            var deferred = $q.defer();
            var book = null;
            book = new Book();                 
            
            /* Filter out 'IF NOT EXISTS' from the sql string to create our clean objects */
            /*******************************************************************************/            
            //var filtered_PersonalDetails = booksManager.sqlCreate_PersonalDetails.replace('IF NOT EXISTS','');                                         
            var filtered_PersonalDetails = localStorage.getItem("sqlCreate_PersonalDetails").replace('IF NOT EXISTS','');                                                     
            /*******************************************************************************/            
            var tblPersonDetails = returnFieldArrayFromSql(filtered_PersonalDetails);                            

            book.init(tblPersonDetails);        

            // If creating a new form, this array needs to come from lookup. 
            //Otherwise it will come from the db field as a json string which needs converting to an object. Represents all options for this section.            
            var strAdditionalLearnSupportJson = '[\
                            {"code": "04","text": "04 Visual impairment"},\
                            {"code": "05","text": "05 Hearing impairment"},\
                            {"code": "06","text": "06 Disability affecting mobility"},\
                            {"code": "07","text": "07 Profound / complex disabilities"},\
                            {"code": "08","text": "08 Social & emotinal difficulties"},\
                            {"code": "09","text": "09 Mental health difficulty"},\
                            {"code": "10","text": "10 Moderate learning difficulty"},\
                            {"code": "11","text": "11 Severe learning difficulty"},\
                            {"code": "12","text": "12 Dyslexia"},\
                            {"code": "13","text": "13 Dyscalculia"},\
                            {"code": "14","text": "14 Autism spectrum disorder"},\
                            {"code": "15","text": "15 Aspergers syndrome"},\
                            {"code": "16","text": "16 Temporary disability after illness"},\
                            {"code": "93","text": "93 Other physical disability"},\
                            {"code": "94","text": "94 Other specific learning difficulty eg. Dyspraxia etc"},\
                            {"code": "95","text": "95 Other medical condition (epilepsy,asthma,diabetes etc)"},\
                            {"code": "96","text": "96 Other learning difficulty"},\
                            {"code": "97","text": "97 Other disability"},\
                            {"code": "98","text": "98 No disability / learning difficulty"}\
                            ]';            
            book.PersonalDetails.addlearnsupp_learndiff_listjson = JSON.parse(strAdditionalLearnSupportJson);

            var strEthnicOriginJson = '[\
                            {"code": "31","text": "31 White British"},\
                            {"code": "32","text": "32 White Irish"},\
                            {"code": "33","text": "33 White Gypsy or Traveller"},\
                            {"code": "34","text": "34 White any other White background"},\
                            {"code": "35","text": "35 Mixed - White and Black Caribbean"},\
                            {"code": "36","text": "36 Mixed - White and Black African"},\
                            {"code": "37","text": "37 Mixed - White and Asian"},\
                            {"code": "38","text": "38 Mixed - any other mixed multi ethnic background"},\
                            {"code": "39","text": "39 Asian or Asian British Indian"},\
                            {"code": "40","text": "40 Asian or Asian British Pakistani"},\
                            {"code": "41","text": "41 Asian or Asian British Bangladeshi"},\
                            {"code": "42","text": "42 Asian or Asian British Chinese"},\
                            {"code": "43","text": "43 Asian or Asian British any other Asian background"},\
                            {"code": "44","text": "44 Black or Black British - African"},\
                            {"code": "45","text": "45 Black or Black British - Caribbean"},\
                            {"code": "46","text": "46 Black or Black British - any other Black background"},\
                            {"code": "47","text": "47 Arab"},\
                            {"code": "98","text": "98 any other ethnic group"},\
                            {"code": "666","text": "0 TEST DO NOT USE"}\
                            ]';            
            book.PersonalDetails.ethnic_origin = JSON.parse(strEthnicOriginJson);

            // init as array
            book.PersonalDetails.edu_eduqualjson = [];

            // init dropdown object variables
            //book.PersonalDetails.OfferingCode = {MainOfferingCode:null};            

            booksManager.currentForm = book;            

            // Get courses and add it to our looksup object for use on page 4.
            var promGetParentCourses = sqldb.get_ParentCourse();            
            promGetParentCourses.then(function(res){                   
                booksManager.lookupdata.courses = res;                
                deferred.resolve(0);
            }, function(err){
                deferred.reject(err);
            });
            
            return deferred.promise; 
        },

        setSqlString: function(){
               
               var deferred = $q.defer();               
               $http.get(booksManager._path +'/GetAppSql').then(function(resp) {                
                
                // Save sql strings to localstorage so it works offline after initial load should the app close.                            
                localStorage.setItem("sqlCreate_PersonalDetails", "CREATE TABLE IF NOT EXISTS PersonalDetails ("+ resp.data[0].CreateSql_PersonalDetails + ")");                
                localStorage.setItem("sqlCreateSql_ApprenticeshipsHierarchy", "CREATE TABLE IF NOT EXISTS ApprenticeshipsHierarchy ("+ resp.data[0].CreateSql_ApprenticeshipsHierarchy + ")");                
                localStorage.setItem("sqlCreateSql_OrganisationData", "CREATE TABLE IF NOT EXISTS OrganisationData ("+ resp.data[0].CreateSql_OrganisationData + ")");
                localStorage.setItem("sqlCreateSql_Log", "CREATE TABLE IF NOT EXISTS Log ("+ resp.data[0].CreateSql_Log + ")");

                return;
              }).then(function(){
                deferred.resolve(0);                
              }, function(err) {                
                deferred.reject(err);                
              });

               return deferred.promise;
        },

        getApprenticeshipsHierarchy: function(){

          var deferred = $q.defer();               
          $http.get(booksManager._path +'/getApprenticeshipsHierarchy').then(function(resp) {
            return sqldb.prepopLookup_ApprenticeshipsHierarchy(resp.data);            
          }).then(function(){
            deferred.resolve(0);                
          }, function(err) {                
            deferred.reject(err);                
          });

           return deferred.promise;
        },
       

        setLookupData: function(setItemName,apiPath){

          var deferred = $q.defer();               

          if(localStorage.getItem(setItemName) == "" || localStorage.getItem(setItemName) == null)
          {            
              $http.get(booksManager._path + apiPath).then(function(resp) {
                console.log(resp);                        
                return localStorage.setItem(setItemName, JSON.stringify(resp.data));                                        
              }).then(function(){
                deferred.resolve(0);                
              }, function(err) {                
                deferred.reject(err);                
              });

               return deferred.promise;
          }
          else
          {
            console.log('lookup already set:'+ setItemName);
            deferred.resolve(0);
            return deferred.promise;
          }
        },

        getOrganisationData: function(){

          var deferred = $q.defer();               
          $http.get(booksManager._path +'/getOrganisation').then(function(resp) {
            console.log(resp);
            return sqldb.prepopLookup_OrganisationData(resp.data);            
          }).then(function(){
            deferred.resolve(0);                
          }, function(err) {                
            deferred.reject(err);                
          });

           return deferred.promise;
        },

        populateOrganisationDataObject: function(){
             // Get courses and add it to our looksup object for use on page 4.

            var deferred = $q.defer();

            var promOrg = sqldb.get_OrganisationDataObject();            
            promOrg.then(function(res){                   
                booksManager.lookupdata.OrganisationData = res;                
                deferred.resolve(0);
            }, function(err){
                deferred.reject(err);
            });
            return deferred.promise;
        },


        populateParentCourseDropDown: function(){
             // Get courses and add it to our looksup object for use on page 4.

            var deferred = $q.defer();

            var promGetParentCourses = sqldb.get_ParentCourse();            
            promGetParentCourses.then(function(res){                   
                booksManager.lookupdata.courses = res;                
                deferred.resolve(0);
            }, function(err){
                deferred.reject(err);
            });
            return deferred.promise;
        },

        getChildCourseModules: function(coursecode){
            
            var deferred = $q.defer();
                                    
            var promChildCourseModules = sqldb.get_ChildCourseModules(coursecode);
            promChildCourseModules.then(function(res){                                
                deferred.resolve(res);
            }, function(reason){                
                deferred.reject(reason);
            });
            return deferred.promise;
        },

        sendForm : function(objForm){
            
            console.log('Form Length:');
            console.log(Object.keys(objForm.PersonalDetails).length);
            console.log(objForm);
            
            var deferred = $q.defer();            
            var errorcheck=0;      
            
            $http({
                method:'POST',                
                url: booksManager._path +'/SaveForm',            
                data:JSON.stringify(objForm),
                headers: {'Content-Type': 'application/json'}
            }).then(function(resp) {                                
                deferred.resolve(resp);    
                
                errorcheck = resp.data.indexOf("Exception")
                if(errorcheck >0){
                    //alert('### There was an error sending your form to the server ###');
                    $ionicPopup.alert({
                        title: "Error Sending",
                        content: "# There was an error sending your form to the server :"+ resp.data
                    }).then(function(){
                         $http({
                            method:'POST',                
                            url: booksManager._path +'/AddErrorLog',            
                            data:JSON.stringify(resp.data),
                            headers: {'Content-Type': 'application/json'}
                        });
                    });                                        
                    console.log(resp);
                }
                else{
                    //sqldb.delete_PersonalDetails();                    
                    //alert('Form Successfully Sent To The Server');                    
                    $ionicPopup.alert({
                        title: "Form Successfully Sent",
                        content: "Form Successfully Sent To The Server"
                        })                    
                    console.log(resp);
                }

            }).then(function(){
                // add log of form sent
                if(errorcheck <=0){
                    console.log('adding to log');
                    console.log(objForm);
                    return sqldb.AddToLog(objForm);
                }

            }, function(err) {                
                deferred.reject(err);         
                $ionicPopup.alert({
                        title: "Error Sending",
                        content: "# There was an error sending your form to the server - "+ err
                        });                 
            });

           return deferred.promise;  
        },

        addPersonalDetails: function(cf){

            console.log(cf);
            var deferred = $q.defer();            
            
            $q.when(true).then(function(){
                if(cf.PersonalDetails.pk_persondetails_id === null){                    
                    // create new person record with minimal data. update thereafter and do inserts of the multiples table ...
                    return sqldb.initAddPersonalDetails(cf)
                }
                else {
                    return 0;
                }                
            }).then(function(res){                                  
                return sqldb.updatePersonalDetails(cf)                
            }).then(function(res){
                //return sqldb.updateAdditionalLearningSupport(cf);
                return res;
            }).then(function(res){
                deferred.resolve(res); 
            }, function(error){                            
                deferred.reject(error);
            });
            return deferred.promise;                      
        },

        getLog: function(){
            
            var deferred = $q.defer();
                                    
            var promLog = sqldb.get_Log();
            promLog.then(function(res){                
                var data=[];
                for (var i = 0; i < res.rows.length; i++) 
                {                                
                    var row = res.rows.item(i);
                    data.push(row);
                }
                deferred.resolve(data);
            }, function(reason){                
                deferred.reject(reason);
            });
            return deferred.promise;
        },

        getAllPersons: function(){
            
            var deferred = $q.defer();
                                    
            var promGetPersonalDetails = sqldb.get_PersonalDetails();
            promGetPersonalDetails.then(function(res){                
                var data=[];
                for (var i = 0; i < res.rows.length; i++) 
                {                                
                    var row = res.rows.item(i);
                    data.push(row);
                }
                deferred.resolve(data);
            }, function(reason){                
                deferred.reject(reason);
            });
            return deferred.promise;
        },

        getPersonalDetailsById: function(id){

            function convertToDate(strDate){
                // return as date format so ui friendly

                if(strDate==null||strDate=='')
                {
                    return null;
                }
                else{
                    return new Date(strDate)    
                }                
            }

            function convertCourse_offeringjsonDates (data) {
                if(data)
                {                
                    if(data.StartDate==null||data.StartDate==''){
                        data.StartDate=null;
                    }
                    else{
                        data.StartDate = new Date(data.StartDate);    
                    }
                    
                    if(data.EndDate==null || data.EndDate==''){
                        data.EndDate = null;
                    }
                    else{
                        data.EndDate = new Date(data.EndDate);                
                    }                    
                }
                return data;
              }

            function convertEdu_eduqualjsonDates (data) {
                if(data)
                {
                    for(var i=0; i < data.length; i++ )
                    {
                        if(data[i].datecompleted==null || data[i].datecompleted=='')
                        {
                            data[i].datecompleted=null
                        }
                        else{
                            data[i].datecompleted = new Date(data[i].datecompleted);                  
                        }                      
                    }
                }                
                return data;
              }

            var data={};
            var deferred = $q.defer();

            var promGetPersonalDetails = sqldb.get_PersonalDetailsById(id);            
            promGetPersonalDetails.then(function(res) {
                                
                for (var i = 0; i < res.rows.length; i++) 
                {                                
                    var row = res.rows.item(i);
                    // deep clone recordset object
                    data.PersonalDetails=(JSON.parse(JSON.stringify(row)));
                }                                        
                return data;                

            }).then(function(data){                
                

                // convert to valid date type for ui friendly
                data.PersonalDetails.dob = convertToDate(data.PersonalDetails.dob);                                
                data.PersonalDetails.elig_expiredate_asylum = convertToDate(data.PersonalDetails.elig_expiredate_asylum);
                data.PersonalDetails.emplrn_fixedcontract_endate = convertToDate(data.PersonalDetails.emplrn_fixedcontract_endate);
                data.PersonalDetails.emplrn_emp_startdate = convertToDate(data.PersonalDetails.emplrn_emp_startdate);
                data.PersonalDetails.cost_loanapp_date = convertToDate(data.PersonalDetails.cost_loanapp_date);
                data.PersonalDetails.lrs_checkedby_date = convertToDate(data.PersonalDetails.lrs_checkedby_date);
                data.PersonalDetails.dec_student_date = convertToDate(data.PersonalDetails.dec_student_date);
                data.PersonalDetails.dec_tutor_date = convertToDate(data.PersonalDetails.dec_tutor_date);
                data.PersonalDetails.dec_empauth_date = convertToDate(data.PersonalDetails.dec_empauth_date);

                // convert json string to object so ui friendly
                data.PersonalDetails.ethnic_origin = JSON.parse(data.PersonalDetails.ethnic_origin);                                
                data.PersonalDetails.edu_eduqualjson = JSON.parse(data.PersonalDetails.edu_eduqualjson);                
                data.PersonalDetails.addlearnsupp_learndiff_listjson = JSON.parse(data.PersonalDetails.addlearnsupp_learndiff_listjson);
                data.PersonalDetails.course_offeringjson =  JSON.parse(data.PersonalDetails.course_offeringjson);
                data.PersonalDetails.empstat_employmentstatusjson = JSON.parse(data.PersonalDetails.empstat_employmentstatusjson),
                data.PersonalDetails.main_offeringcode = JSON.parse(data.PersonalDetails.main_offeringcode),
                data.PersonalDetails.elig_country_nationality = JSON.parse(data.PersonalDetails.elig_country_nationality),

                data.PersonalDetails.emerg_relationwith = JSON.parse(data.PersonalDetails.emerg_relationwith),
                data.PersonalDetails.religion = JSON.parse(data.PersonalDetails.religion),               
                data.PersonalDetails.sexuality = JSON.parse(data.PersonalDetails.sexuality),               

                // convert date to object that sits within an array of objects
                data.PersonalDetails.main_offeringcode = convertCourse_offeringjsonDates(data.PersonalDetails.main_offeringcode);
                data.PersonalDetails.edu_eduqualjson = convertEdu_eduqualjsonDates(data.PersonalDetails.edu_eduqualjson);                                

                //#############################################################################
                //#### Need to assign a lowercase primary key variable due to an issue with 
                //### syncing primary key field from webservice when setting up table on device
                data.PersonalDetails.pk_persondetails_id = data.PersonalDetails.PK_PersonDetails_id;                
                //#############################################################################
                
                return data;
            }).then(function(data){                
                //return sqldb.get_AdditionalLearningSupportById(id);                          
                return data;            
            }).then(function(){
                deferred.resolve(data);
            }, function(err){ 
                deferred.reject(err); 
            });

            return deferred.promise;         
        },                       

    };
    return booksManager;
}]);
