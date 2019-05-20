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
        .controller('rePwdCtrl', rePwdCtrl);
    rePwdCtrl.$inject = ['$scope', '$interval', 'toastr', 'httpService', '$state'];
    function  rePwdCtrl($scope, $interval, toastr, httpService, $state) {

        var vm = $scope
        vm.content = '获取验证码'
        vm.waiting = false

        vm.getCode = function(){
            if(vm.waiting){ return }
            if(!vm.phone || !(/^1[2|3|4|5|6|7|8|9][0-9]\d{4,8}$/.test(vm.phone))){
                toastr.error('请输入正确的手机号')
                return
            }
            vm.waiting = true
            var second = 59
            vm.content = second+"s后重发";
            var timerHandler =$interval(function(){
                if(second<=1){
                    $interval.cancel(timerHandler);    //当执行的时间59s,结束时，取消定时器 ，cancle方法取消
                    second=59;
                    vm.content = "获取验证码";
                    vm.waiting = false;    //因为 ng-disabled属于布尔值，设置按钮可以点击，可点击发送
                }else{
                    second--;
                    vm.content = second+"s后重发";
                }
            },1000)

            httpService.sendAuthCode({phone: vm.phone}, function(r){
                console.log(r)
                toastr.success('发送成功')
            }, function(r){
                console.log(r)
            })
        }

        vm.passwordVisibleChange = function(){
            if($('#password').prop('type') == 'password'){
                $('#password').prop('type','text')
            }else{
                $('#password').prop('type','password')
            }
        }

        vm.reset = function(){
            if(!vm.phone || !(/^1[2|3|4|5|6|7|8|9][0-9]\d{4,8}$/.test(vm.phone))){
                toastr.error('请输入正确的手机号')
                return
            }
            if(!vm.code){
                toastr.error('请输入手机验证码')
                return
            }
            if(!vm.password){
                toastr.error('请输入密码')
                return
            }
            if(!vm.repassword){
                toastr.error('请输入确认密码')
                return
            }
            if(vm.password != vm.repassword){
                toastr.error('两次输入的密码 不一致')
                return
            }
            var crypt = new JSEncrypt()
            crypt.setPublicKey(vm.app.key)
            var enpassword = crypt.encrypt(vm.password);
            httpService.resetPassword({phone: vm.phone, password: enpassword, code: vm.code}, function (r) {
                toastr.success('重制密码成功')
            }, function(r){
                console.log(r)
                toastr.error(r.message)
            })
        }


    }

})();
