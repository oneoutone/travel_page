
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
                for(var i=0; i<$scope.userList.length; i++){
                    if($scope.userList[i].roles.indexOf("admin") >= 0){
                        $scope.userList[i].title = '系统管理员'
                    }else if($scope.userList[i].roles.indexOf("manager") >= 0){
                        $scope.userList[i].title = '客户经理'
                    }else{
                        $scope.userList[i].title = '后台用户'
                    }
                }
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
