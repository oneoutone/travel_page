/**
 * @ngdoc function
 * @name app.controller:AppCtrl
 * @description
 * # MainCtrl
 * Controller of the app
 */

(function() {
    'use strict';
    angular
        .module('app')
        .controller('AppCtrl', AppCtrl);

    AppCtrl.$inject  = [ '$scope', '$localStorage', '$location', '$rootScope', '$anchorScroll', '$timeout', '$window', '$state', 'httpService'];

    function AppCtrl( $scope, $localStorage, $location, $rootScope, $anchorScroll, $timeout, $window, $state, httpService) {
        var vm = $scope;
        /**
         * Usage:
         * vm.log('error', 'this is a test message');
         *
         */

        $rootScope.miniSidebarActive = true;

        vm.app = {
            name: '广西旅游云',
            version: '0.6.0',
            // for chart colors
            color: {
                'primary': '#0cc2aa',
                'accent': '#a88add',
                'warn': '#fcc100',
                'info': '#6887ff',
                'success': '#6cc788',
                'warning': '#f77a99',
                'danger': '#f44455',
                'white': '#ffffff',
                'light': '#f1f2f3',
                'dark': '#2e3e4e',
                'black': '#2a2b3c'
            },
            setting: {
                theme: {
                    primary: 'blue',
                    accent: 'indigo',
                    warn: 'primary'
                },
                color: {},
                folded: false,
                boxed: false,
                container: false,
                themeID: 1,
                bg: ''
            }
        };

        vm.app.isAuthenticated = function(){
            console.log(22222222222222222)
            var now = new Date()
            if(vm.app.setting && vm.app.setting.accessToken1 && vm.app.setting.expire1 && now < new Date(vm.app.setting.expire1)){
                return true
            }
            return false
        }
        vm.app.roles = {};
        vm.app.user1 = {};
        vm.app.setUser = function(user){
            vm.app.setting.accessToken1 = user.token
            vm.app.setting.userId1 = user.userId
            vm.app.setting.expire1 = user.expire

        }
        /**
         * 程序初始化使用。使用方法
         *
         * vm.app.ready(function() {
     *  // insert your code here.
     * })
         *
         */
        vm.app.isReady = false;    // 程序是否初始化成功
        var todos = [];
        vm.app.ready = function(func) {
            if (vm.app.isReady) { return func(); }
            todos.push(func);
        };
        vm.app.runTodos = function() {
            for (var i = 0; i < todos.length; i++) {
                todos[i]();
            }
        };


        $rootScope.$on('$stateChangeStart', function (event, toState) {
            //console.info( LoopBackAuth.currentUserData)
            if (!vm.app.isAuthenticated() && toState.name.indexOf('access.') == -1) {
                event.preventDefault();
                $state.go('access.signin');
                return
            }
        });


        /**
         * 初始化程序，
         *
         * @param next
         */
        vm.app.init = function (callback) {
            httpService.getProfile(function(data){
                vm.app.setting.user1 = data
                console.log(data)
                var roleList = {}
                if(data.roles){
                    console.log(data.roles)
                    var roles = data.roles.split(',')
                    for(var i=0; i<roles.length; i++){
                        roleList[roles[i]] = true
                    }
                }
                vm.app.setting.roles = roleList
                vm.app.setting.user1.roles = roleList
                vm.app.isReady = true
                vm.app.runTodos()
                if(callback){
                    callback()
                }
            }, function(err){
                console.log(err)
            })

        };

        vm.isIE = isIE();
        vm.isSmart = isSmart();
        // config

        vm.app.logout = function () {
            vm.app.setting.userId1 = undefined
            vm.app.setting.accessToken1 = undefined
            vm.app.setting.expire1 = undefined
            vm.app.setting.user1 = undefined
            vm.app.setting.roles = {}
            vm.app.isReady = false
            $localStorage[setting].userId1 = undefined
            $localStorage[setting].accessToken1 = undefined
            $localStorage[setting].expire1 = undefined
            $localStorage[setting].user1 = undefined
            $localStorage[setting].roles = undefined
            $location.path('/access/signin');
        };

        var setting = 'local-setting1';
        console.log(setting)
        // save settings to local storage
        if (angular.isDefined($localStorage[setting])) {
            vm.app.setting = $localStorage[setting];
        } else {
            $localStorage[setting] = vm.app.setting;
        }
        // watch changes
        $scope.$watch('app.setting', function () {
            $localStorage[setting] = vm.app.setting;
        }, true);

        getParams('bg') && (vm.app.setting.bg = getParams('bg'));
        vm.setTheme = setTheme;
        setColor();

        function setTheme(theme) {
            vm.app.setting.theme = theme.theme;
            setColor();
            if (theme.url) {
                $timeout(function () {
                    $window.location.href = theme.url;
                }, 100, false);
            }
        }

        function setColor() {
            vm.app.setting.color = {
                primary: getColor('blue'),
                accent: getColor('indigo'),
                warn: getColor('primary')
            };
            vm.app.setting.theme = {
                    primary: 'blue',
                        accent: 'indigo',
                        warn: 'primary'
                }
        }

        function getColor(name) {
            return vm.app.color[name] ? vm.app.color[name] : palette.find(name);
        }


        vm.goBack = function () {
            $window.history.back();
        };

        function isIE() {
            return !!navigator.userAgent.match(/MSIE/i) || !!navigator.userAgent.match(/Trident.*rv:11\./);
        }

        function isSmart() {
            // Adapted from http://www.detectmobilebrowsers.com
            var ua = $window['navigator']['userAgent'] || $window['navigator']['vendor'] || $window['opera'];
            // Checks for iOs, Android, Blackberry, Opera Mini, and Windows mobile devices
            return (/iPhone|iPod|iPad|Silk|Android|BlackBerry|Opera Mini|IEMobile/).test(ua);
        }

        function getParams(name) {
            name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
            var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
                results = regex.exec(location.search);
            return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
        }

        /**
         * get user roles and convert to {admin: true, executive: true} format
         *
         * @param callback
         */

     if(vm.app.isAuthenticated){
            vm.app.init();
        }


    }
})();
