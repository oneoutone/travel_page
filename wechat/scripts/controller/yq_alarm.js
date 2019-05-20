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
        .controller('AlarmCtrl', AlarmCtrl);

    AlarmCtrl.$inject = ['$scope', 'httpService'];

    function AlarmCtrl ($scope, httpService) {

        var vm = $scope

        httpService.getNotificationList(function(r){
            vm.notifications = r
            console.log(r)
        }, function(err){
            console.log(err)
        })


    }
})();
