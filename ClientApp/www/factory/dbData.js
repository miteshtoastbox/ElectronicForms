angular.module('sqldb', ['ngCordova'])

.factory('sqldb', ['$cordovaSQLite','$q',  function($cordovaSQLite,$q) { 

	var sqldb = {

	db:null,

        openDB: function(){
            db = window.openDatabase("my.db", "1.0", "Cordova Demo", 200000);
        },

        closeDB: function(){
            db.close;
            //console.log('-- mc, DB CLOSED --');
        },


        get_Log: function(){

            var deferred = $q.defer();

            var sql = 'select * from Log'
            sqldb.openDB();
            $cordovaSQLite.execute(db,sql)
            .then(function(res) {                 
                deferred.resolve(res);
            }).catch(function(err){ console.log(err); deferred.reject(err.message); })

            return deferred.promise;         
        },


        get_PersonalDetails: function(){

            var deferred = $q.defer();

            var sql = 'select * from PersonalDetails'
            sqldb.openDB();
            $cordovaSQLite.execute(db,sql)
            .then(function(res) {                 
                deferred.resolve(res);
            }).catch(function(err){ console.log(err); deferred.reject(err.message); })

            return deferred.promise;         
        },

        delete_PersonalDetails: function(){

            var deferred = $q.defer();

            var sql = 'delete from PersonalDetails'
            sqldb.openDB();
            $cordovaSQLite.execute(db,sql)
            .then(function(res) {                 

                var data={};
                for (var i = 0; i < res.rows.length; i++) 
                {                                
                    var row = res.rows.item(i);
                    data.PersonalDetails=row;                    
                }              

                deferred.resolve(data);
            }).catch(function(err){ console.log(err); deferred.reject(err.message); })

            return deferred.promise;         
        },


        get_PersonalDetailsById: function(id){

            var deferred = $q.defer();

            var sql = 'select * from PersonalDetails where pk_persondetails_id=?'
            sqldb.openDB();

            var data={};
            $cordovaSQLite.execute(db,sql,[id])
            .then(function(res) {                                                
                deferred.resolve(res);                
            }, function(err){ 
                console.log(err); 
                deferred.reject(err.message); 
            });

            return deferred.promise;         
        },

        get_ParentCourse: function(id){

            var deferred = $q.defer();

            var sql = 'select distinct OfferingID,MainOfferingName from ApprenticeshipsHierarchy order by MainOfferingName'
            sqldb.openDB();
            $cordovaSQLite.execute(db,sql)
            .then(function(res) {
                
                var data=[];
                for (var i = 0; i < res.rows.length; i++) 
                {                                
                    var row = res.rows.item(i);
                    data.push(row);
                }
                deferred.resolve(data);

            }, function(err){                 
                deferred.reject(err.message); 
            });

            return deferred.promise;         
        },

        get_ChildCourseModules: function(coursecode){

            var deferred = $q.defer();

            var sql = 'select * from ApprenticeshipsHierarchy where OfferingID=? order by MainOfferingName'
            sqldb.openDB();
            $cordovaSQLite.execute(db,sql,[coursecode])
            .then(function(res) {
                
                var data=[];
                for (var i = 0; i < res.rows.length; i++) 
                {                                
                    var row = res.rows.item(i);

                    // add additional fields for data capture based on yellow form
                    row.framework=null;
                    row.modeOfDelivery=null;
                    row.startDate=null;
                    row.expectedEndDate=null;

                    data.push(row);
                }
                deferred.resolve(data);

            }, function(err){                 
                deferred.reject(err.message); 
            });

            return deferred.promise;         
        },

        AddToLog: function(cf){

            var deferred = $q.defer();

            var sql = 'insert into Log (forename,surname,employer,datesubmitted) Values (?,?,?,?)'
            sqldb.openDB();            

            var d = new Date(); //current date
            $cordovaSQLite.execute(db,sql,[cf.PersonalDetails.forename,cf.PersonalDetails.surname,cf.PersonalDetails.emplrn_empby,d.toDateString()])
            .then(function(res) {                                 
                deferred.resolve(0);  
                console.log(res);
            }, function(err){
                console.log(err);
                deferred.reject(err); 
            });

            return  deferred.promise;
        },

        initAddPersonalDetails: function(cf){

            var deferred = $q.defer();

            var sql = 'insert into PersonalDetails (forename) Values (?)'
            sqldb.openDB();
            $cordovaSQLite.execute(db,sql,[cf.PersonalDetails.forename])
            .then(function(res) {                 
                cf.PersonalDetails.pk_persondetails_id = res.insertId; // assign unique personid for further updates.                
                deferred.resolve(res.insertId);  
            }, function(err){
                deferred.reject(err); 
            });

            return  deferred.promise;
        },

        updatePersonalDetails: function(cf){
             console.log('in updatePersonalDetails:');
             console.log(cf);
            // console.log('JSON.stringify(cf.PersonalDetails.additional_learning_supp):');
            // console.log(JSON.stringify(cf.PersonalDetails.additional_learning_supp));
            //console.log(cf.PersonalDetails.emerg_relationwith);

            var deferred = $q.defer();  

            var sql = 'update PersonalDetails '+
                        'set title=?,'+
                        'assessorname=?,'+
                        'has_attended_bury_college=?,'+                                                  
                        'dob=?,'+
                        'forename=?,'+                        
                        'surname=?,'+                                                  
                        'middlename=?,'+                                                
                        'sex=?,'+
                        'age_atstart=?,'+
                        'ni_number=?,'+                        
                        'email_addr=?,'+
                        'tel_home=?,'+
                        'tel_daytime=?,'+
                        'tel_mobile=?,'+
                        'title_other=?,'+
                        'ethnic_origin=?,'+
                        'elig_has_britishpassport=?,'+
                        'elig_country_nationality=?,'+
                        'elig_isuk_resident=?,'+
                        'elig_is_refugee=?,'+
                        'elig_has_visa=?,'+
                        'elig_is_asylum=?,'+
                        'elig_expiredate_asylum=?,'+
                        'edu_eduqualjson=?,'+
                        'hsehold_hhs1=?,'+
                        'hsehold_hhs2=?,'+
                        'hsehold_hhs3=?,'+
                        'hsehold_98=?,'+
                        'hsehold_99=?,'+
                        'emerg_contactname=?,'+
                        'emerg_relationwith=?,'+
                        'emerg_tel_home=?,'+
                        'emerg_tel_work=?,'+
                        'emerg_tel_mobile=?,'+
                        'emerg_email=?,'+
                        'emplrn_orgid=?,'+
                        'emplrn_empby=?,'+
                        'emplrn_contracttype=?,'+
                        'emplrn_fixedcontract_endate=?,'+
                        'emplrn_emp_startdate=?,'+
                        'emplrn_jobtitle=?,'+
                        'emplrn_weekhrs=?,'+
                        'emplrn_weeksal=?,'+
                        'emplrn_appr_situation=?,'+
                        'emplrn_appr_30hrweek=?,'+
                        'empslf_since=?,'+
                        'empslf_compname=?,'+
                        'empslf_hrsperweek=?,'+
                        'empall_empaddr=?,'+
                        'empall_postcode=?,'+
                        'empall_tel=?,'+
                        'empall_contactperson=?,'+
                        'empall_mentorname=?,'+
                        'empall_mentoremail=?,'+
                        'empall_biznature=?,'+
                        'empall_compsize=?,'+
                        'empall_edsnum=?,'+
                        'empall_govfund=?,'+
                        'empall_govfund_details=?,'+
                        
                        'empstat_employmentstatusjson=?,'+
                        'empstat_risk_neet=?,'+
                        'empstat_in_fulltime=?,'+
                        'empstat_self_emp=?,'+
                        'empstat_unemp_6=?,'+
                        'empstat_unemp_11=?,'+
                        'empstat_unemp_23=?,'+
                        'empstat_unemp_35=?,'+
                        'empstat_unemp_36=?,'+
                        'empstat_jsa=?,'+
                        'empstat_esa_wrag=?,'+
                        'empstat_unv_credit=?,'+
                        'empstat_otherbens=?,'+

                        'cost_regfee=?,'+
                        'cost_empfee=?,'+
                        'cost_learnerfee=?,'+
                        'cost_loanfee=?,'+
                        'cost_loanapp_date=?,'+

                        'lrs_uniqueno=?,'+
                        'lrs_schoolrelaltion=?,'+
                        'lrs_passport=?,'+
                        'lrs_drivelic=?,'+
                        'lrs_idcard=?,'+
                        'lrs_nicard=?,'+
                        'lrs_fundingcert=?,'+
                        'lrs_bankcard=?,'+
                        'lrs_photo=?,'+
                        'lrs_armedforces=?,'+
                        'lrs_re_enroll=?,'+
                        'lrs_examcert=?,'+
                        'lrs_other=?,'+
                        'lrs_checkedby=?,'+
                        'lrs_checkedby_date=?,'+

                        'offsitedelivery_postcode=?,'+
                        'esf_projnum=?,'+
                        'esf_dosssiernum=?,'+
                        'franchise_partner=?,'+
                        'franchise_ukprn=?,'+
                        'priv_optout_opps=?,'+
                        'priv_optout_research=?,'+
                        'priv_optout_post=?,'+
                        'priv_optout_phone=?,'+
                        'priv_optout_email=?,'+
                        'dec_optout_email=?,'+
                        'dec_optout_sms=?,'+
                        'dec_optout_social=?,'+
                        'dec_optout_other=?,'+
                        'dec_tutorname=?,'+
                        'dec_emp_sig=?,'+
                        'dec_student_sig=?,'+
                        'dec_student_date=?,'+
                        'dec_tutor_sig=?,'+
                        'dec_tutor_date=?,'+
                        'dec_empauth=?,'+
                        'dec_empauth_date=?,'+

                        'main_offeringcode=?,'+
                        'course_offeringjson=?,'+

                        'addlearnsupp_learndiff_listjson=?,'+ 
                        'addlearnsupp_prim_learndiff=?,'+
                        'addlearnsupp_has_rec_exam=?,'+
                        'addlearnsupp_has_rec_addlearn=?,'+
                        'addlearnsupp_has_lda=?,'+
                        'addlearnsupp_are_incare=?,'+
                        'addlearnsupp_are_fulltime_carer=?,'+

                        'address1=?,'+
                        'address2=?,'+
                        'address3=?,'+
                        'address4=?,'+
                        'postcode_in=?,'+
                        'postcode_out=?,'+
                        'edu_apl_skills=?,'+
                        'religion=?,'+
                        'sexuality=?,'+                        
                        'criminal_conviction=?,'+                        
                        'belongto_religion=?,'+                        
                        'religion_other=?,'+
                        'enrolling_tutor=? '+

                        'where pk_persondetails_id=?'
            sqldb.openDB();
            $cordovaSQLite.execute(db,sql,
                    [                                        
                        cf.PersonalDetails.title,
                        cf.PersonalDetails.assessorname,
                        cf.PersonalDetails.has_attended_bury_college,
                        cf.PersonalDetails.dob,
                        cf.PersonalDetails.forename,                        
                        cf.PersonalDetails.surname,                                                
                        cf.PersonalDetails.middlename,                                                
                        cf.PersonalDetails.sex,
                        cf.PersonalDetails.age_atstart,
                        cf.PersonalDetails.ni_number,                        
                        cf.PersonalDetails.email_addr,
                        cf.PersonalDetails.tel_home,
                        cf.PersonalDetails.tel_daytime,
                        cf.PersonalDetails.tel_mobile,
                        cf.PersonalDetails.title_other,
                        JSON.stringify(cf.PersonalDetails.ethnic_origin),
                        cf.PersonalDetails.elig_has_britishpassport,
                        JSON.stringify(cf.PersonalDetails.elig_country_nationality),
                        cf.PersonalDetails.elig_isuk_resident,
                        cf.PersonalDetails.elig_is_refugee,
                        cf.PersonalDetails.elig_has_visa,
                        cf.PersonalDetails.elig_is_asylum,
                        cf.PersonalDetails.elig_expiredate_asylum,
                        JSON.stringify(cf.PersonalDetails.edu_eduqualjson),
                        cf.PersonalDetails.hsehold_hhs1,
                        cf.PersonalDetails.hsehold_hhs2,
                        cf.PersonalDetails.hsehold_hhs3,
                        cf.PersonalDetails.hsehold_98,
                        cf.PersonalDetails.hsehold_99,
                        cf.PersonalDetails.emerg_contactname,
                        JSON.stringify(cf.PersonalDetails.emerg_relationwith),
                        cf.PersonalDetails.emerg_tel_home,
                        cf.PersonalDetails.emerg_tel_work,
                        cf.PersonalDetails.emerg_tel_mobile,
                        cf.PersonalDetails.emerg_email,
                        cf.PersonalDetails.emplrn_orgid,
                        cf.PersonalDetails.emplrn_empby,
                        cf.PersonalDetails.emplrn_contracttype,
                        cf.PersonalDetails.emplrn_fixedcontract_endate,
                        cf.PersonalDetails.emplrn_emp_startdate,
                        cf.PersonalDetails.emplrn_jobtitle,
                        cf.PersonalDetails.emplrn_weekhrs,
                        cf.PersonalDetails.emplrn_weeksal,
                        cf.PersonalDetails.emplrn_appr_situation,
                        cf.PersonalDetails.emplrn_appr_30hrweek,
                        cf.PersonalDetails.empslf_since,
                        cf.PersonalDetails.empslf_compname,
                        cf.PersonalDetails.empslf_hrsperweek,

                        cf.PersonalDetails.empall_empaddr,
                        cf.PersonalDetails.empall_postcode,
                        cf.PersonalDetails.empall_tel,
                        cf.PersonalDetails.empall_contactperson,
                        cf.PersonalDetails.empall_mentorname,
                        cf.PersonalDetails.empall_mentoremail,
                        cf.PersonalDetails.empall_biznature,
                        cf.PersonalDetails.empall_compsize,
                        cf.PersonalDetails.empall_edsnum,
                        cf.PersonalDetails.empall_govfund,
                        cf.PersonalDetails.empall_govfund_details,
                        
                        JSON.stringify(cf.PersonalDetails.empstat_employmentstatusjson),                                
                        cf.PersonalDetails.empstat_risk_neet,
                        cf.PersonalDetails.empstat_in_fulltime,
                        cf.PersonalDetails.empstat_self_emp,
                        cf.PersonalDetails.empstat_unemp_6,
                        cf.PersonalDetails.empstat_unemp_11,
                        cf.PersonalDetails.empstat_unemp_23,
                        cf.PersonalDetails.empstat_unemp_35,
                        cf.PersonalDetails.empstat_unemp_36,
                        cf.PersonalDetails.empstat_jsa,
                        cf.PersonalDetails.empstat_esa_wrag,
                        cf.PersonalDetails.empstat_unv_credit,
                        cf.PersonalDetails.empstat_otherbens,

                        cf.PersonalDetails.cost_regfee,
                        cf.PersonalDetails.cost_empfee,
                        cf.PersonalDetails.cost_learnerfee,
                        cf.PersonalDetails.cost_loanfee,
                        cf.PersonalDetails.cost_loanapp_date,

                        cf.PersonalDetails.lrs_uniqueno,
                        cf.PersonalDetails.lrs_schoolrelaltion,
                        cf.PersonalDetails.lrs_passport,
                        cf.PersonalDetails.lrs_drivelic,
                        cf.PersonalDetails.lrs_idcard,
                        cf.PersonalDetails.lrs_nicard,
                        cf.PersonalDetails.lrs_fundingcert,
                        cf.PersonalDetails.lrs_bankcard,
                        cf.PersonalDetails.lrs_photo,
                        cf.PersonalDetails.lrs_armedforces,
                        cf.PersonalDetails.lrs_re_enroll,
                        cf.PersonalDetails.lrs_examcert,
                        cf.PersonalDetails.lrs_other,
                        cf.PersonalDetails.lrs_checkedby,
                        cf.PersonalDetails.lrs_checkedby_date,

                        cf.PersonalDetails.offsitedelivery_postcode,
                        cf.PersonalDetails.esf_projnum,
                        cf.PersonalDetails.esf_dosssiernum,
                        cf.PersonalDetails.franchise_partner,
                        cf.PersonalDetails.franchise_ukprn,
                        cf.PersonalDetails.priv_optout_opps,
                        cf.PersonalDetails.priv_optout_research,
                        cf.PersonalDetails.priv_optout_post,
                        cf.PersonalDetails.priv_optout_phone,
                        cf.PersonalDetails.priv_optout_email,
                        cf.PersonalDetails.dec_optout_email,
                        cf.PersonalDetails.dec_optout_sms,
                        cf.PersonalDetails.dec_optout_social,
                        cf.PersonalDetails.dec_optout_other,
                        cf.PersonalDetails.dec_tutorname,
                        cf.PersonalDetails.dec_emp_sig,
                        cf.PersonalDetails.dec_student_sig,
                        cf.PersonalDetails.dec_student_date,
                        cf.PersonalDetails.dec_tutor_sig,
                        cf.PersonalDetails.dec_tutor_date,
                        cf.PersonalDetails.dec_empauth,
                        cf.PersonalDetails.dec_empauth_date,

                        JSON.stringify(cf.PersonalDetails.main_offeringcode),
                        JSON.stringify(cf.PersonalDetails.course_offeringjson),

                        JSON.stringify(cf.PersonalDetails.addlearnsupp_learndiff_listjson),
                        cf.PersonalDetails.addlearnsupp_prim_learndiff,
                        cf.PersonalDetails.addlearnsupp_has_rec_exam,
                        cf.PersonalDetails.addlearnsupp_has_rec_addlearn,
                        cf.PersonalDetails.addlearnsupp_has_lda,
                        cf.PersonalDetails.addlearnsupp_are_incare,
                        cf.PersonalDetails.addlearnsupp_are_fulltime_carer,

                        cf.PersonalDetails.address1,
                        cf.PersonalDetails.address2,
                        cf.PersonalDetails.address3,
                        cf.PersonalDetails.address4,
                        cf.PersonalDetails.postcode_in,
                        cf.PersonalDetails.postcode_out,
                        cf.PersonalDetails.edu_apl_skills,
                        JSON.stringify(cf.PersonalDetails.religion),
                        JSON.stringify(cf.PersonalDetails.sexuality),
                        cf.PersonalDetails.criminal_conviction,
                        cf.PersonalDetails.belongto_religion,
                        cf.PersonalDetails.religion_other,
                        cf.PersonalDetails.enrolling_tutor,

                        cf.PersonalDetails.pk_persondetails_id
                    ])
            .then(function(res) {
                deferred.resolve(res);
            }, function(err){ 
                deferred.reject(err);                 
            });

            return deferred.promise;
        },


        /* populate database table with ApprenticeshipsHierarchy*/        
        prepopLookup_ApprenticeshipsHierarchy: function (courses)
            {
                var deferred = $q.defer();
                var rows = 0;
                var howManyRecordProcessed =0;

                var arrayLength = courses.length;
                
                sqldb.openDB();

                for (var i = 0; i < arrayLength; i++)
                {
                    //... prepare data...
                    var query = "insert into ApprenticeshipsHierarchy (MainOfferingCode, MainOfferingName,ChildOffering,ChildOfferingName,OfferingID,SubOfferingID) Values (?,?,?,?,?,?);";                    
                    $cordovaSQLite.execute(db, query,[courses[i].MainOfferingCode, courses[i].MainOfferingName, courses[i].ChildOffering, courses[i].ChildOfferingName, courses[i].OfferingID.toString(),courses[i].SubOfferingID.toString()]).then(function (res)
                    {
                       //response after db save 
                        howManyRecordProcessed++;  //increment variable                        
                        console.log('imported:'+ howManyRecordProcessed);

                        //console.log('howManyRecordProcessed:'+ howManyRecordProcessed +'  ###  arrayLength:'+ arrayLength);
                        if(howManyRecordProcessed === arrayLength)
                        {
                          //resolve here
                          console.log('### Just Resolved Multi Data entry ###');
                          deferred.resolve(rows);
                        }
                        rows += 1;
                        
                    }, function (err)
                    {
                      //if some error occured.
                        howManyRecordProcessed++;
                        console.log(err);
                        alert(err.message);
                    });
                }

                return deferred.promise;
            },

        /* populate database table with Organisation Data */        
        prepopLookup_OrganisationData: function (orgs)
        {
            var deferred = $q.defer();
            var rows = 0;
            var howManyRecordProcessed =0;

            var arrayLength = orgs.length;
            
            sqldb.openDB();

            for (var i = 0; i < arrayLength; i++)
            {
                //... prepare data...
                var query = "insert into OrganisationData (OrganisationID ,Name, Address1, Address2, Address3, Address4, Address5, PostcodeOut, PostcodeIn, WorkTel) Values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);";                    
                $cordovaSQLite.execute(db, query,[orgs[i].OrganisationID.toString(), orgs[i].Name, orgs[i].Address1, orgs[i].Address2, orgs[i].Address3, orgs[i].Address4, orgs[i].Address5, orgs[i].PostcodeOut, orgs[i].PostcodeIn, orgs[i].WorkTel]).then(function (res)
                {
                   //response after db save 
                    howManyRecordProcessed++;  //increment variable                        
                    console.log('imported:'+ howManyRecordProcessed);

                    //console.log('howManyRecordProcessed:'+ howManyRecordProcessed +'  ###  arrayLength:'+ arrayLength);
                    if(howManyRecordProcessed === arrayLength)
                    {
                      //resolve here
                      console.log('### Just Resolved Multi Data entry ###');
                      deferred.resolve(rows);
                    }
                    rows += 1;
                    
                }, function (err)
                {
                  //if some error occured.
                    howManyRecordProcessed++;
                    console.log(err);
                    alert(err.message);
                });
            }

            return deferred.promise;
        },


        get_OrganisationDataObject: function(id){

            var deferred = $q.defer();

            var sql = 'select * from OrganisationData order by Name'
            sqldb.openDB();
            $cordovaSQLite.execute(db,sql)
            .then(function(res) {
                
                var data=[];
                for (var i = 0; i < res.rows.length; i++) 
                {                                
                    var row = res.rows.item(i);
                    data.push(row);
                }
                deferred.resolve(data);

            }, function(err){                 
                deferred.reject(err.message); 
            });

            return deferred.promise;         
        },

        get_OrgDataCount: function(id){

            var deferred = $q.defer();

            var sql = 'select COUNT(*) as count from OrganisationData'
            sqldb.openDB();
            $cordovaSQLite.execute(db,sql)
            .then(function(res) {                                
                deferred.resolve(res.rows.item(0).count);

            }, function(err){                 
                deferred.reject(err.message); 
            });

            return deferred.promise;         
        },    

        get_ApprenticeshipsHierarchyCount: function(id){

            var deferred = $q.defer();

            var sql = 'select COUNT(*) as count from ApprenticeshipsHierarchy'
            sqldb.openDB();
            $cordovaSQLite.execute(db,sql)
            .then(function(res) {                                
                deferred.resolve(res.rows.item(0).count);

            }, function(err){                 
                deferred.reject(err.message); 
            });

            return deferred.promise;         
        },
    };
    return sqldb;
}]);