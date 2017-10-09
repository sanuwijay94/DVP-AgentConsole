/**
 * Created by team verry on 9/29/2016.
 */


agentApp.factory("dashboradService", function ($http, baseUrls, authService, $state) {

    var getTotalTicketCount = function (status) {
        return $http({
            method: 'GET',
            url: baseUrls.dashBordUrl + "DashboardEvent/TotalCount/" + status + "/user_" + authService.GetResourceIss() + "/*"
        }).then(function (response) {
            if (response.status === 200) {
                if (response.data.IsSuccess && response.data.Result) {
                    return response.data.Result;
                } else {
                    return 0;
                }
            } else {
                return 0;
            }
        });

    };

    var getCreatedTicketSeries = function () {
        return $http({
            method: 'GET',
            url: baseUrls.dashBordUrl + "DashboardGraph/NewTicketByUser/30"
        }).then(function (response) {
            if (response.data) {
                if (response.data.IsSuccess && response.data.Result && response.data.Result[0].datapoints) {
                    return response.data.Result[0].datapoints;
                } else {
                    return {};
                }
            } else {

                return {};
            }
        });

    };

    var getResolvedTicketSeries = function () {
        return $http({
            method: 'GET',
            url: baseUrls.dashBordUrl + "DashboardGraph/ClosedTicketByUser/30"
        }).then(function (response) {
            if (response.data) {
                if (response.data.IsSuccess && response.data.Result && response.data.Result[0].datapoints) {
                    return response.data.Result[0].datapoints;
                } else {
                    return {};
                }
            } else {

                return {};
            }
        });
    };

    var getDeferenceResolvedTicketSeries = function () {
        return $http({
            method: 'GET',
            url: baseUrls.dashBordUrl + "DashboardGraph/ClosedVsOpenTicketByUser/30"
        }).then(function (response) {
            if (response.data) {
                if (response.data.IsSuccess && response.data.Result && response.data.Result[0].datapoints) {
                    return response.data.Result[0].datapoints;
                } else {
                    return {};
                }
            } else {

                return {};
            }
        });

    };

    var productivityByResourceId = function (id) {
        return $http({
            method: 'get',
            url: baseUrls.resourceService + id + "/Productivity"
        }).then(function (response) {
            if (response.data && response.data.IsSuccess) {
                return response.data.Result;
            } else {
                return undefined;
            }
        });
    };

    var getQueueDetails = function () {
        return $http({
            method: 'get',
            url: baseUrls.dashBordUrl + "DashboardEvent/QueueDetails"
        }).then(function (response) {
            if (response.data.IsSuccess && response.data.Result) {
                return response.data.Result;
            } else {
                return 0;
            }
        });
    };

    var getNewTicketCountViaChenal = function (chenal) {
        return $http({
            method: 'GET',
            url: baseUrls.dashBordUrl + "DashboardEvent/TotalCount/NEWTICKET/via_" + chenal + "/*"
        }).then(function (response) {
            if (response.data) {
                if (response.data.IsSuccess && response.data.Result) {
                    return response.data.Result;
                } else {
                    return 0;
                }
            } else {
                return 0;
            }
        });

    };

    var getStoredNotices = function () {
        return $http({
            method: 'GET',
            url: baseUrls.notification + "/DVP/API/1.0.0.0/NotificationService/NoticeBoard"
        }).then(function (response) {
            return response.data;
        });

    };

    var getAgentActivity = function () {
        return $http({
            method: 'GET',
            url: baseUrls.cdrProcessor + "CallCDR/MyAgentStatus"
        }).then(function (response) {
            return response.data;
        });
    };

    var getAgentPerformance = function (id) {
        return $http({
            method: 'GET',
            url: baseUrls.resourceService + "Resource/" + id + "/AgentPerformance"
        }).then(function (response) {
            return response.data;
        });
    };

    var getMyQueueDetails = function (skills) {
        return $http({
            method: 'get',
            url: baseUrls.resourceService + "MyQueues",
            params: {Skills:skills}
        }).then(function (response) {
            if (response.data.IsSuccess && response.data.Result) {
                return response.data.Result;
            } else {
                return 0;
            }
        });
    };

    var checkMyQueue = function (recID,resId,callTaskId) {
        return $http({
            method: 'get',
            url: baseUrls.resourceService + "IsMyQueue/"+recID+"/Resource/"+resId+"/ByTasks",
            params:{tasks:JSON.stringify([callTaskId])}
        }).then(function (response) {
            if (response) {
                return response;
            } else {
                return false;
            }
        });

    }



    return {
        ProductivityByResourceId: productivityByResourceId,
        GetCreatedTicketSeries: getCreatedTicketSeries,
        GetResolvedTicketSeries: getResolvedTicketSeries,
        GetTotalTicketCount: getTotalTicketCount,
        GetDeferenceResolvedTicketSeries: getDeferenceResolvedTicketSeries,
        GetQueueDetails: getQueueDetails,
        getStoredNotices: getStoredNotices,
        GetAgentActivity: getAgentActivity,
        GetAgentPerformance: getAgentPerformance,
        getMyQueueDetails: getMyQueueDetails,
        checkMyQueue: checkMyQueue
    }
});

