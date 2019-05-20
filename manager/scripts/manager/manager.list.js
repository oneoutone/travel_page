
(function() {
    angular
        .module('app')
        .config(function(toastrConfig) {
            angular.extend(toastrConfig, {
                positionClass: 'toast-top-full-width',
                preventOpenDuplicates: true,
                timeOut: 1000,
            });
        })
        .controller('ManagerListCtrl', ManagerListCtrl);

    ManagerListCtrl.$inject = ['$scope', 'toastr', 'httpService'];

    function ManagerListCtrl($scope, toastr, httpService) {

        var vm = $scope

        function fetchManagers(){
            httpService.getManagers(function(data){
                $scope.userList = data;
            }, function(err){
               console.log(err)
            })
        }

        vm.app.ready(function(){
            fetchManagers()
        })

        vm.removeUser = function(userId){
            $scope.currentId = userId
        };

        vm.deleteManager = function(){
            httpService.deleteManager(vm.currentId, function(data){
                $('#delete').modal('hide');
                fetchManagers()
            }, function(err){
                $('#delete').modal('hide');
                console.info(err);
            })
        }
    }
})();
