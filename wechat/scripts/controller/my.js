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
        .controller('MyCtrl', MyCtrl);

    MyCtrl.$inject = ['$scope', 'httpService'];

    function MyCtrl ($scope, httpService) {

        var vm = $scope

        vm.app.ready(function(){
            httpService.getProfile(function(data){
                vm.user = data
            }, function(err){
                console.log(err)
            })

        })
    }
})();
