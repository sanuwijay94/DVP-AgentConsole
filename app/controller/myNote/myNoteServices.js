/**
 * Created by Damith on 10/24/2016.
 */

agentApp.factory("myNoteServices", function ($http, baseUrls, authService) {

    var getAllMyToDo = function (status) {
        return $http({
            method: 'GET',
            url: baseUrls.toDoUrl + "ToDoList",
            headers: {
                'authorization': authService.GetToken()
            }
        }).then(function (response) {
            return response;
        });
    };

    var createMyNote = function (note) {
        return $http({
            method: 'POST',
            url: baseUrls.toDoUrl + "ToDo",
            data: note,
            headers: {
                'authorization': authService.GetToken()
            }
        }).then(function (response) {
            return response;
        });
    };

    var deleteMyNote = function (note) {
        return $http({
            method: 'DELETE',
            url: baseUrls.toDoUrl + "ToDo/" + note._id,
            headers: {
                'authorization': authService.GetToken()
            }
        }).then(function (response) {
            return response;
        });
    };

    var checkMyNote = function (note) {
        return $http({
            method: 'PUT',
            url: baseUrls.toDoUrl + "ToDo/" + note._id + "/Check",
            headers: {
                'authorization': authService.GetToken()
            }
        }).then(function (response) {
            return response;
        });
    };

    //return functions
    return {
        GetAllMyToDo: getAllMyToDo,
        CreateMyNote: createMyNote,
        CreateMyNote: createMyNote,
        CheckMyNote: checkMyNote
    }
});