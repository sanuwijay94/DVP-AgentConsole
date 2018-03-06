/** * Created by Damith on 1/9/2017. */agentApp.controller('agentSettingCtrl', function ($scope, $http, FileUploader, fileService,                                                  jwtHelper, userProfileApiAccess, authService, agentSettingFact,                                                  loginService, ticketService,profileDataParser,$anchorScroll,templateService,                                                  $ngConfirm,orgDetailService,$window,ngAudio,$auth,uuid4,recordingTime) {    // call $anchorScroll()    $anchorScroll();    window.URL = window.URL || window.webkitURL;    //basica data    $scope.tenant = 0;    $scope.company = 0;    $scope.isLoadingRequ = false;    $scope.pwdBox = false;    $scope.orgData={};    $scope.userLanguage={};    $scope.uploadProgress =0;    if(angular.isNumber(recordingTime))    {        $scope.greet_time_limit=recordingTime;    }    else    {        console.log("Not a number");        $scope.greet_time_limit=0;    }    $scope.showPlayer=false;    $scope.showPlayerView = function () {        $scope.showPlayer=!$scope.showPlayer;    }    $scope.playObj={        default:false,        morning:false,        afternoon:false,        evening:false    };    $scope.uploadObj={        default:false,        morning:false,        afternoon:false,        evening:false    };    /* $scope.recordGreeting = function (recorder) {     if( recorder.status.isRecording===true)     {     recorder.stopRecord();     }     else {     recorder.startRecord();     }     };     $scope.playGreeting = function (recorder) {     if(recorder.status.isPlaying)     {     recorder.playbackPause();     }     else {     recorder.playbackResume();     }     };*/    $scope.onLanguageSelect = function (lang) {        console.log(lang);    };    $scope.showConfirmation = function (title, contentData, okText, okFunc, closeFunc) {        $ngConfirm({            title: title,            content: contentData, // if contentUrl is provided, 'content' is ignored.            scope: $scope,            buttons: {                // long hand button definition                ok: {                    text: okText,                    btnClass: 'btn-primary',                    keys: ['enter'], // will trigger when enter is pressed                    action: function (scope) {                        okFunc();                    }                },                // short hand button definition                close: function (scope) {                    closeFunc();                }            }        });    };    var loginName = authService.GetResourceIss();    $scope.getOrganizationDetails = function () {        orgDetailService.getOrganizationDetails().then(function (org) {            $scope.orgData=org;        },function (err) {            console.log("Error in searching organisation data");        });    }    $scope.getOrganizationDetails();    $scope.getCompanyTenant = function () {        var decodeData = jwtHelper.decodeToken(authService.TokenWithoutBearer());        console.info(decodeData);        $scope.company = decodeData.company;        $scope.tenant = decodeData.tenant;    };    $scope.getCompanyTenant();    $scope.closeSettingPage = function () {        agentSettingFact.changeSettingPageStatus(false)        $scope.audio.restart();    };    $scope.safeApply = function (fn) {        var phase = this.$root.$$phase;        if (phase == '$apply' || phase == '$digest') {            if (fn && (typeof(fn) === 'function')) {                fn();            }        } else {            this.$apply(fn);        }    };    $scope.scrollEnabled = false;    $scope.viewScroll = function () {        $scope.safeApply(function () {            $scope.scrollEnabled = true;        });    };    $scope.hideScroll = function () {        $scope.safeApply(function () {            $scope.scrollEnabled = false;        });    };    $scope.scrollOtherEnabled = false;    $scope.viewOtherScroll = function () {        $scope.safeApply(function () {            $scope.scrollOtherEnabled = true;        });    };    $scope.hideOtherScroll = function () {        $scope.safeApply(function () {            $scope.scrollOtherEnabled = false;        });    };    $scope.showPasswordHints = function () {        $scope.pwdBox = !$scope.pwdBox;    }    $scope.myTemplates =[];    $scope.chatTemp ={}    var loadChatTemplates = function () {        templateService.getMyChatTemplates().then(function (temps) {            $scope.myTemplates = temps;        },function (error) {            $scope.showAlert('Error', 'error', 'Error in searching chat templates');            console.log(error);        })    };    $scope.saveNewChatTemplate = function () {        if($scope.chatTemp.content)        {            var obj =                {                    content:$scope.chatTemp.content,                    isCommon:false                }            templateService.addNewChatTemplate(obj).then(function (temps) {                $scope.showAlert('Success', 'success', 'New chat template added successfully');                $scope.myTemplates.push(temps);                $scope.chatTemp={};            },function (error) {                $scope.showAlert('Error', 'error', 'Error in adding new chat templates');                console.log(error);            })        }else        {            $scope.showAlert('Error', 'error', 'No content found');        }    };    $scope.deleteChatTemplate = function (tempID) {        $scope.showConfirmation("Delete Template","Do you want to delete Chat template","OK",function () {            templateService.RemoveChatTemplate(tempID).then(function (temps) {                $scope.showAlert('Success', 'success', 'Chat template deleted successfully');                var index = $scope.myTemplates.map(function(el) {                    return el._id;                }).indexOf(tempID);                $scope.myTemplates.splice(index,1);            },function (error) {                $scope.showAlert('Error', 'error', 'Error in deleting chat template');                console.log(error);            })        },function () {        })    };    /* 01. view point functions (set dynamically height)     02.get current profile data     02. get settings page menu function     03. personal information     04. image crop and upload     05. ticket config     * */    //    //01. view point functions (set dynamically height)	if(document.getElementById('settingWrapper') != null && document.getElementById('settingWrapper') != undefined){		document.getElementById('settingWrapper').style.height = jsUpdateSize();		var onLoadSetHeight = function () {			$scope.windowHeight = jsUpdateSize() + "px";			document.getElementById('settingWrapper').style.height = $scope.windowHeight;		};		window.onload = onLoadSetHeight();		window.onresize = function () {			$scope.windowHeight = jsUpdateSize() + "px";			document.getElementById('settingWrapper').style.height = $scope.windowHeight;		};	}    //02.get current profile data    $scope.CurrentProfile = {};    $scope.bUnit=profileDataParser.myBusinessUnit;    $scope.companyName=profileDataParser.companyName;    var loadCurrentProfile = function (username) {        userProfileApiAccess.getMyProfile().then(function (data) {            if (data.IsSuccess) {                $scope.CurrentProfile = data.Result;                if (data.Result) {                    if (data.Result.address) {                        $scope.displayAddress = data.Result.address.city + ' , ' + data.Result.address.province + ' , ' + data.Result.address.country;                    }                    if (data.Result.veeryaccount && data.Result.veeryaccount.contact) {                        $scope.displayVeeryContact = data.Result.veeryaccount.display + ' | ' + data.Result.veeryaccount.contact;                    }                    else {                        $scope.displayVeeryContact = 'Veery contact not configured yet';                    }                    if (data.Result.email) {                        $scope.displayEmail = data.Result.email.contact;                        $scope.displayEmailVerify = data.Result.email.verified;                    }                    // if (data.Result.phoneNumber) {                    //     $scope.displayPhoneNumber = data.Result.phoneNumber.contact;                    // }                    // if (data.Result.firstname) {                    //     $scope.displayName = data.Result.firstname;                    // }                    // if (data.Result.lastname) {                    //     $scope.displayName = $scope.displayName + ' ' + data.Result.lastname;                    // }                    if (data.Result.birthday) {                        var momentUtc = moment(data.Result.birthday).utc();                        data.Result.dob = {};                        data.Result.dob.day = momentUtc.date().toString();                        data.Result.dob.month = (momentUtc.month() + 1).toString();                        data.Result.dob.year = momentUtc.year();                    }                    else {                        data.Result.dob = {};                        data.Result.dob.day = moment().date().toString();                        data.Result.dob.month = (moment().month() + 1).toString();                        data.Result.dob.year = moment().year();                    }                    pickMyRatings(data.Result._id);                }            }            else {                console.log(data);            }        }, function (err) {            console.log(err);        });    };    var pickMyRatings = function (owner) {        userProfileApiAccess.getMyRatings(owner).then(function (resPapers) {            if (resPapers.Result) {                $scope.sectionArray = {};                $scope.myRemarks = [];                angular.forEach(resPapers.Result, function (submissions) {                    if (submissions.answers) {                        angular.forEach(submissions.answers, function (answer) {                            if (answer.section && answer.question && answer.question.weight > 0 && answer.question.type != 'remark') {                                if ($scope.sectionArray[answer.section._id]) {                                    var ansValue = $scope.sectionArray[answer.section._id].value;                                    var val = (answer.points * answer.question.weight) / 10;                                    $scope.sectionArray[answer.section._id].value = ansValue + val;                                    $scope.sectionArray[answer.section._id].itemCount += 1;                                    //  console.log(answer.section.name+" :  "+sectionArray[answer.section._id].value);                                    //console.log(answer.section.name+" Items :  "+sectionArray[answer.section._id].itemCount);                                }                                else {                                    //sectionArray[answer.section._id]=(answer.points * answer.question.weight)/10;                                    $scope.sectionArray[answer.section._id] =                                        {                                            value: (answer.points * answer.question.weight) / 10,                                            itemCount: 1,                                            name: answer.section.name,                                            id: answer.section._id                                        }                                    //console.log(answer.section.name+" :  "+sectionArray[answer.section._id].value);                                    // console.log(answer.section.name+" Items :  "+sectionArray[answer.section._id].itemCount);                                }                            }                            if (answer.section && answer.question && answer.question.type == 'remark') {                                var remarkObj =                                    {                                        evaluator: submissions.evaluator.name,                                        section: answer.section.name,                                        remark: answer.remarks                                    }                                $scope.myRemarks.push(remarkObj);                            }                        });                    }                });                //console.log($scope.sectionArray);            }            else {                console.log("Error");            }        }).catch(function (errPapers) {        })    };    $scope.inti = function () {        if (loginName) {            loadCurrentProfile(loginName);        }    };    //update profile image    var updateProfile = function () {        $scope.isLoadingRequ = true;        $('#proPersInfo').removeClass('display-none');        userProfileApiAccess.updateMyProfile($scope.CurrentProfile).then(function (data) {            $('#proPersInfo').addClass('display-none');            $('#updtBtn').removeClass('disabled-btn');            if (data.IsSuccess) {                $scope.showAlert('Success', 'success', 'User profile updated successfully');                $scope.isLoadingRequ = false;            }            else {                $scope.showAlert('Error', 'error', errMsg);                $scope.isLoadingRequ = false;            }        }, function (err) {            $scope.isLoadingRequ = false;            $('#proPersInfo').addClass('display-none');            loginService.isCheckResponse(err);            var errMsg = "Error occurred while saving profile";            if (err.statusText) {                errMsg = err.statusText;            }            $scope.showAlert('Error', 'error', errMsg);        });    };    /*settings page menu */    $scope.menusObj = {        menu: [],        selectedMenu: []    };    //Get setting menu    //Get all country list    var getSettingPageMenu = function () {        getJSONData($http, "settingMenu", function (res) {            $scope.menusObj.menu = res;            if (res && res.length != 0) {                $scope.menusObj.selectedMenu = res[0];                $scope.menusObj.selectedMenu.selected = true;            }        });    };    var getAllCountry = function () {        getJSONData($http, "countryList", function (res) {            $scope.countryList = res;        });    };    //Get all languages    var getAllLanguages = function () {        getJSONData($http, "languages", function (res) {            $scope.languages = res;        });    };    var onLoad = function () {        getSettingPageMenu();        getAllLanguages();        getAllCountry();    };    onLoad();    var getTicketConfig = function () {        ticketService.GetMyTicketConfig(function (status, res) {            if (status) {                $scope.ticket = res.Result;            } else {                $scope.showAlert('Error', 'error', 'Get Ticker Config Data Error.');            }        });    };    $scope.clickMenu = function (menu) {        $scope.audio.restart();        if (menu) {            if ($scope.menusObj.selectedMenu.length != 0) {                $scope.menusObj.selectedMenu.selected = false;                $scope.menusObj.selectedMenu = [];                $scope.menusObj.selectedMenu = menu;                $scope.menusObj.selectedMenu.selected = true;                if ($scope.menusObj.selectedMenu.id == 'sm04') {                    getTicketConfig();                }                else if($scope.menusObj.selectedMenu.id == 'sm06')                {                    loadChatTemplates();                }            }        } else {            //upload image wrapper dispaly            $scope.menusObj.selectedMenu.selected = false;            $scope.menusObj.selectedMenu = [];            $scope.menusObj.selectedMenu = $scope.menusObj.menu[7];        }    };    //personal information    $scope.gender = ['Male', 'Female'];    var genDayList = function () {        var max = 31;        var dayArr = [];        for (min = 1; min <= max; min++) {            dayArr.push(min);        }        return dayArr;    };    $scope.dayList = genDayList();    $scope.monthList = [        {index: 1, name: "January"},        {index: 2, name: "February"},        {index: 3, name: "March"},        {index: 4, name: "April"},        {index: 5, name: "May"},        {index: 6, name: "June"},        {index: 7, name: "July"},        {index: 8, name: "August"},        {index: 9, name: "September"},        {index: 10, name: "October"},        {index: 11, name: "November"},        {index: 12, name: "December"}    ];    $scope.yearList = [];    var getYears = function () {        var currentYear = new Date().getFullYear();        for (var i = 0; i < 100 + 1; i++) {            $scope.yearList.push(currentYear - i);        }    };    getYears();    /*image crop and upload */    $scope.isUploadImg = false;    $scope.myCroppedImage = '';    //    $scope.file = {};    $scope.file.Category = "PROFILE_PICTURES";    var uploader = $scope.uploader = new FileUploader({        url: fileService.UploadUrl,        headers: fileService.Headers    });    var clearQueue = function () {        uploader.clearQueue();        $scope.isUploadDisable = true;    };    //filter upload image    uploader.filters.push({        name: 'imageFilter',        fn: function (item /*{File|FileLikeObject}*/, options) {            var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';            return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;        }    });    // uploader callback function    uploader.onWhenAddingFileFailed = function (item /*{File|FileLikeObject}*/, filter, options) {        console.info('onWhenAddingFileFailed', item, filter, options);    };    uploader.onAfterAddingFile = function (item) {        console.info('onAfterAddingFile', item);        if (item.file.type.split("/")[0] == "image") {            //fileItem.upload();            item.croppedImage = '';            var reader = new FileReader();            reader.onload = function (event) {                $scope.$apply(function () {                    $scope.isUploadImg = true;                    item.image = event.target.result;                });            };            reader.readAsDataURL(item._file);            $scope.isUploadDisable = false;        }        else {            new PNotify({                title: 'Profile picture upload',                text: 'Invalid File type. Retry',                type: 'error',                styling: 'bootstrap3'            });        }    };    uploader.onAfterAddingAll = function (addedFileItems) {        if (!$scope.file.Category) {            uploader.clearQueue();            new PNotify({                title: 'File Upload!',                text: 'Invalid File Category.',                type: 'error',                styling: 'bootstrap3'            });            return;        }        console.info('onAfterAddingAll', addedFileItems);    };    uploader.onBeforeUploadItem = function (item) {        $scope.isLoadingRequ = true;        $('#proPersInfo').removeClass('display-none');        var blob = dataURItoBlob(item.croppedImage);        item._file = blob;        item.formData.push({'fileCategory': 'PROFILE_PICTURES'});    };    var dataURItoBlob = function (dataURI) {        var binary = atob(dataURI.split(',')[1]);        var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];        var array = [];        for (var i = 0; i < binary.length; i++) {            array.push(binary.charCodeAt(i));        }        return new Blob([new Uint8Array(array)], {type: mimeString});    };    uploader.onProgressItem = function (fileItem, progress) {        console.info('onProgressItem', fileItem, progress);    };    uploader.onProgressAll = function (progress) {        console.info('onProgressAll', progress);    };    uploader.onSuccessItem = function (fileItem, response, status, headers) {        console.info('onSuccessItem', fileItem, response, status, headers);    };    uploader.onErrorItem = function (fileItem, response, status, headers) {        console.info('onErrorItem', fileItem, response, status, headers);        $scope.isLoadingRequ = false;        $('#proPersInfo').addClass('display-none');    };    uploader.onCancelItem = function (fileItem, response, status, headers) {        console.info('onCancelItem', fileItem, response, status, headers);    };    uploader.onCompleteItem = function (fileItem, response, status, headers) {        console.info('onCompleteItem', fileItem, response, status, headers);        console.log("result ", response.Result);        new PNotify({            title: 'File Upload!',            text: "Picture uploaded successfully",            type: 'success',            styling: 'bootstrap3'        });        if (response.Result) {            $scope.CurrentProfile.avatar = baseUrls.fileService + "InternalFileService/File/Download/" + $scope.tenant + "/" + $scope.company + "/" + response.Result + "/ProPic";            updateProfile();        }    };    uploader.onCompleteAll = function () {        console.info('onCompleteAll');        $scope.isLoadingRequ = false;        $('#proPersInfo').addClass('display-none');        $scope.cancelUpload();    };    $scope.cancelUpload = function () {        $scope.isUploadImg = false;        $scope.uploader.queue[0].image = "";        clearQueue();    };    // Greeting Uploader    $scope.greetFile = {};    $scope.greetFile.Category = "AGENT_GREETINGS";    $scope.updatingGreet="";    var greetUploader = $scope.greetUploader = new FileUploader({        url: fileService.GreetingUploadUrl,        headers: fileService.Headers    });    $scope. clearGreetQueue = function (greet) {        greetUploader.clearQueue();        $scope.updatingGreet=greet;        //$scope.isGrtnUploadDisable = true;    };    $scope.isGrtnUploading=false;    $scope.isUserMetaChanged=false;    $scope.updateUserMeta = function () {        //var jsonData = JSON.parse($scope.CurrentProfile.user_meta);        orgDetailService.updateUserMeta($scope.CurrentProfile.username,$scope.CurrentProfile.user_meta).then(function (resMeta) {            if(resMeta)            {                $scope.showAlert('Success', 'success', "Greeting records updated successfully")                $scope.isUserMetaChanged=false;            }            else            {                $scope.showAlert('Error', 'error', "Greeting records uploading failed");            }        },function (errMeta) {            $scope.showAlert('Error', 'error', "Greeting records uploading failed");            console.log(errMeta);        });    };    $scope.updateObject = function () {        if(!$scope.CurrentProfile.user_meta.greetings ) {            $scope.CurrentProfile.user_meta.greetings ={};        }        if($scope.userLanguage && $scope.userLanguage.name && !$scope.CurrentProfile.user_meta.greetings[$scope.userLanguage.name]) {            $scope.CurrentProfile.user_meta.greetings[$scope.userLanguage.name]={                default:"",                morning:"",                afternoon:"",                evening:""            };        }        if($scope.fileName && $scope.updatingGreet && $scope.userLanguage && $scope.userLanguage.name)        {            $scope.CurrentProfile.user_meta.greetings[$scope.userLanguage.name][$scope.updatingGreet]=$scope.fileName;            $scope.isUserMetaChanged=true;        }    };    $scope.audio= ngAudio.load("");    $scope.isPlaying=false;    $scope.currentPlay="";    $scope.playFile = function (greet) {        if($scope.userLanguage && $scope.userLanguage.name && $scope.CurrentProfile.user_meta.greetings[$scope.userLanguage.name]) {            var voiceId="";            var playingStatus=false;            voiceId= $scope.CurrentProfile.user_meta.greetings[$scope.userLanguage.name][greet];            $scope.playObj[greet]=!$scope.playObj[greet];            playingStatus=$scope.playObj[greet];            if(playingStatus)            {                var palySrc=baseUrls.fileService+"FileService/Agent/FileDownload/"+voiceId;                $scope.audio=ngAudio.load(palySrc);                $scope.audio.play();                if($scope.currentPlay && $scope.currentPlay!=greet)                {                    $scope.playObj[$scope.currentPlay]=false;                }                $scope.currentPlay=greet;            }            else            {                $scope.audio.pause();                if($scope.currentPlay)                {                    $scope.playObj[$scope.currentPlay]=false;                }            }        }    };    var clearUploadSt = function () {        $scope.uploadObj={            default:false,            morning:false,            afternoon:false,            evening:false        };    }    var clearPlaySt = function () {        $scope.playObj={            default:false,            morning:false,            afternoon:false,            evening:false        }        $scope.audio.restart();    }    clearUploadSt();    clearPlaySt();    var setUploadingState = function () {        $scope.uploadObj[$scope.updatingGreet]=true;    }    $scope.deleteAttachedGreeting = function (greet) {        if($scope.CurrentProfile.user_meta.greetings && $scope.CurrentProfile.user_meta.greetings[$scope.userLanguage.name])        {            $scope.CurrentProfile.user_meta.greetings[$scope.userLanguage.name][greet]="";            $scope.isUserMetaChanged=true;            if($scope.currentPlay == greet)            {                $scope.playObj[$scope.currentPlay]=false;                $scope.audio.pause();                $scope.currentPlay="";            }                       $scope.showAlert("Success","success","Greeting detached successfully, Press 'SAVE' to save changes permanently");        }        else        {            $scope.showAlert("Error","error","Greeting detaching failed");        }    };    //filter upload image    /*greetUploader.filters.push({     name: 'imageFilter',     fn: function (item /!*{File|FileLikeObject}*!/, options) {     var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';     return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;     }     });*/    // uploader callback function$scope.fileName="";    $scope.onShowUpload = function (recordObj) {        console.log($scope.recorder.audioModel);    };    greetUploader.onWhenAddingFileFailed = function (item /*{File|FileLikeObject}*/, filter, options) {        console.info('onWhenAddingFileFailed', item, filter, options);    };    greetUploader.onAfterAddingFile = function (item) {        console.info('onAfterAddingFile', item);        if(item.file && item.file.type )        {            var ext=item.file.type.split("/")[1];            item.file.name=uuid4.generate()+"."+ext;        }        console.log(item.file.name);        $scope.fileName=item.file.name;        item.upload();        $scope.isGrtnUploading=true;        setUploadingState();    };    greetUploader.onAfterAddingAll = function (addedFileItems) {        if (!$scope.greetFile.Category) {            greetUploader.clearQueue();            new PNotify({                title: 'File Upload!',                text: 'Invalid File Category.',                type: 'error',                styling: 'bootstrap3'            });            return;        }        console.info('onAfterAddingAll', addedFileItems);    };    greetUploader.onBeforeUploadItem = function (item) {        item.formData.push({'fileCategory': 'AGENT_GREETINGS'});    };    greetUploader.onProgressItem = function (fileItem, progress) {        console.info('onProgressItem', fileItem, progress);        $scope.uploadProgress = progress;    };    greetUploader.onProgressAll = function (progress) {        console.info('onProgressAll', progress);    };    greetUploader.onSuccessItem = function (fileItem, response, status, headers) {        console.info('onSuccessItem', fileItem, response, status, headers);        $scope.showAlert("Success","success","Greeting file uploaded successfully, Press 'SAVE' to save changes permanently ");    };    greetUploader.onErrorItem = function (fileItem, response, status, headers) {        console.info('onErrorItem', fileItem, response, status, headers);        $scope.isGrtnUploading=false;        $scope.showAlert("Error","error","Failed to upload greeting file");    };    greetUploader.onCancelItem = function (fileItem, response, status, headers) {        console.info('onCancelItem', fileItem, response, status, headers);    };    greetUploader.onCompleteItem = function (fileItem, response, status, headers) {        console.info('onCompleteItem', fileItem, response, status, headers);        console.log("result ", response.Result);        $scope.updateObject();        $scope.isGrtnUploading=false;        clearUploadSt();    };    greetUploader.onCompleteAll = function () {        console.info('onCompleteAll');        $scope.isGrtnUploading=false;        //clearGreetQueue();    };    $scope.cancelUpload = function () {        $scope.isUploadImg = false;    };    //change agent password    $scope.oldPassword = null;    $scope.newPassword = null;    $scope.updateMyPassword = function (oldPwd, newPwd) {        //verify password        var param = {            oldpassword: '',            newpassword: ''        };        param.oldpassword = oldPwd;        param.newpassword = newPwd;        $scope.isLoadingRequ = true;        $('#proPersInfo').removeClass('display-none');        loginService.UpdateMyPwd(param, function (status, res) {            $scope.isLoadingRequ = false;            $('#proPersInfo').addClass('display-none');            if (res.IsSuccess) {                $scope.showAlert('Success', 'success', "Password updated successfully");            } else {                $scope.showAlert('Error', 'error', 'Current password is invalid..');            }        });    };    $scope.updateMyPersonalData = function () {        updateProfile();    };    //ticket config    $scope.ticket = {};    $scope.ticket = {        subject: '',        priority: 'normal',        description: ''    };    $scope.setPriority = function (priority) {        $scope.ticket.priority = priority;    };    $scope.updateTicketConfig = function () {        $scope.isLoadingRequ = true;        $('#proPersInfo').removeClass('display-none');        ticketService.SaveMyTicketConfig($scope.ticket, function (status, res) {            $('#proPersInfo').addClass('display-none');            $scope.isLoadingRequ = false;            if (status) {                $scope.showAlert('Success', 'success', 'Ticket Config Saved Successfully');                profileDataParser.myTicketMetaData=res.Result;            } else {                $scope.showAlert('Error', 'error', 'Ticker Config Save Error');            }        });    };    console.log('load agent setting ctrl...');    $scope.titles =[];    $scope.SetTitiles = function (value) {        $scope.titles =[];        for (var i = 1; i <= 10; i++)        {            $scope.titles.push(value);        }    };    $scope.RatingResultResolve = function (item) {        var rateObj =            {                starValue:Math.round(item.value/item.itemCount),                displayValue:(item.value/item.itemCount).toFixed(2)            }        return rateObj;    }}).config(function (recorderServiceProvider) {    recorderServiceProvider        .forceSwf(false)        .withMp3Conversion(true);});agentApp.directive('starRating', function () {    return {        restrict: 'EA',        template: '<ul class="star-rating" ng-class="{readonly: readonly}">' +        '  <li ng-repeat="star in stars" class="star" ng-class="{filled: star.filled}" ng-click="toggle($index)">' +        '    <i class="fa fa-star"></i>' + // or &#9733        '  </li>' +        '</ul>',        scope: {            ratingValue: '=ngModel',            max: '=?', // optional (default is 5)            onRatingSelect: '&?',            readonly: '=?'        },        link: function (scope, element, attributes) {            if (scope.max == undefined) {                scope.max = 5;            }            function updateStars() {                scope.stars = [];                for (var i = 0; i < scope.max; i++) {                    scope.stars.push({                        filled: i < scope.ratingValue                    });                }            };            scope.toggle = function (index) {                if (scope.readonly == undefined || scope.readonly === false) {                    scope.ratingValue = index + 1;                    scope.onRatingSelect({                        rating: index + 1                    });                }            };            scope.$watch('ratingValue', function (oldValue, newValue) {                if (newValue) {                    updateStars();                }            });        }    };});agentApp.directive('greetRecord', function (FileUploader,fileService) {    return {        restrict: 'EA',        scope: {            title:'=',            content:'=',            isGrtnUploading:'='        },        templateUrl: 'app/views/agent/template/myGreetingRecord.html',        link: function (scope, element, attributes) {            var grtUploader = scope.grtUploader = new FileUploader({                url: fileService.GreetingUploadUrl,                headers: fileService.Headers            });            /* scope.clearGreetQueue = function (greet) {             greetUploader.clearQueue();             scope.updatingGreet=greet;             //$scope.isGrtnUploadDisable = true;             };*/            grtUploader.onWhenAddingFileFailed = function (item /*{File|FileLikeObject}*/, filter, options) {                console.info('onWhenAddingFileFailed', item, filter, options);            };            grtUploader.onAfterAddingFile = function (item) {                console.info('onAfterAddingFile', item);                if(item.file)                {                    item.file.name=uuid4.generate();                }                $scope.fileName=item.file.name;                console.log(item.file.name);                item.upload();                scope.isGrtnUploading=true;            };            grtUploader.onAfterAddingAll = function (addedFileItems) {                /*if (!scope.greetFile.Category) {                 greetUploader.clearQueue();                 new PNotify({                 title: 'File Upload!',                 text: 'Invalid File Category.',                 type: 'error',                 styling: 'bootstrap3'                 });                 return;                 }*/                console.info('onAfterAddingAll', addedFileItems);            };            grtUploader.onBeforeUploadItem = function (item) {                item.formData.push({'fileCategory': 'AGENT_GREETINGS'});            };            grtUploader.onProgressItem = function (fileItem, progress) {                console.info('onProgressItem', fileItem, progress);                scope.uploadProgress = progress;            };            grtUploader.onProgressAll = function (progress) {                console.info('onProgressAll', progress);            };            grtUploader.onSuccessItem = function (fileItem, response, status, headers) {                console.info('onSuccessItem', fileItem, response, status, headers);            };            grtUploader.onErrorItem = function (fileItem, response, status, headers) {                console.info('onErrorItem', fileItem, response, status, headers);                scope.isGrtnUploading=false;            };            grtUploader.onCancelItem = function (fileItem, response, status, headers) {                console.info('onCancelItem', fileItem, response, status, headers);            };            grtUploader.onCompleteItem = function (fileItem, response, status, headers) {                console.info('onCompleteItem', fileItem, response, status, headers);                console.log("result ", response.Result);                scope.updateObject();                scope.isGrtnUploading=false;            };            grtUploader.onCompleteAll = function () {                console.info('onCompleteAll');                scope.isGrtnUploading=false;                //clearGreetQueue();            };            scope.clearGreetQueue = function (greet) {                grtUploader.clearQueue();                scope.updatingGreet=greet;                //$scope.isGrtnUploadDisable = true;            };        }    };});