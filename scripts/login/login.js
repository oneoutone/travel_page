/**
 * Created by harris on 2016/12/13.
 */
(function() {
    'use strict';
    angular
        .module('app')
        .config(function(toastrConfig) {
            angular.extend(toastrConfig, {
                positionClass: 'toast-top-full-width',
                preventOpenDuplicates: true,
                timeOut: 1000
            });
        })
        .controller('loginCtrl', loginCtrl);
    loginCtrl.$inject = ['$scope', 'httpService', 'toastr', '$state'];
    function  loginCtrl($scope, httpService, toastr, $state) {

        var vm = $scope

        vm.passwordVisibleChange = function(){
            if($('#password').prop('type') == 'password'){
                $('#password').prop('type','text')
            }else{
                $('#password').prop('type','password')
            }
        }

        vm.login = function(){

            if(!vm.phone){
                toastr.error('请输入手机号或者用户名')
                return
            }
            if(!vm.password){
                toastr.error('请输入密码')
                return
            }

            var crypt = new JSEncrypt()
            crypt.setPublicKey(vm.app.key)
            var enpassword = crypt.encrypt(vm.password);
            httpService.login({username: vm.phone, password: enpassword}, function(r){
                vm.app.setAccessToken(r)
                vm.app.init(function(){
                    toastr.success("登陆成功，正在跳转")
                    $state.go('app.home')
                })

            }, function(r){
                toastr.error(r.message)
            })
        }
    }

})();
