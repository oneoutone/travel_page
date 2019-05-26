(function() {
    angular
        .module('app')
        .config(function(toastrConfig) {
            angular.extend(toastrConfig,
                {positionClass: 'toast-top-full-width',
                    preventOpenDuplicates: true,
                    timeOut: 1000
                });
        })
        .controller('SignInCtrl', SignInCtrl);
    SignInCtrl.$inject = ['$scope','$state', 'toastr', 'httpService'];

    function SignInCtrl ($scope, $state, toastr, httpService) {
        var vm =  $scope
        vm.user = {}
        vm.app.ready(function(){
            if (vm.app.isAuthenticated()){
                $state.go('app.manager.list')
            }
        })



        vm.signin = function() {
            if (!vm.user.username || !$scope.user.password){
                if(!vm.user.username){
                    vm.error('请输入用户名')
                    return;
                }
                if(!vm.user.password){
                    toastr.error('请输入密码')
                    return;
                }
                return;
            }
            $scope.loading = true

            httpService.adminLogin(vm.user, function(result) {
                $scope.loading = false
                vm.app.setUser(result)
                vm.app.init(function(){
                    $state.go('app.manager.list', {reload: true})
                })
            }, function(result){
                console.log(result)
                $scope.loading = false
                toastr.error(result.message)
            })
        }
    }

})();
