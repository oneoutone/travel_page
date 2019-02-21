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

  AppCtrl.$inject  = [ '$scope', '$location', '$rootScope', '$timeout', '$window', '$state', '$localStorage'];

  function AppCtrl( $scope, $location, $rootScope, $timeout, $window, $state, $localStorage) {
    var vm = $scope;

    vm.app = {
        name: 'travel_page',
    }

    vm.app.isAuthenticated = function(){
      var now = new Date()
      if(vm.app.setting && vm.app.setting.accessToken && vm.app.setting.expire && now < moment(vm.app.setting.expire).toDate()){
        return true
      }
      return false
    }

    $rootScope.$on('$stateChangeStart', function (event, toState) {
      //check if login
      if (!vm.app.isAuthenticated() && toState.name.indexOf('login') == -1 && toState.name.indexOf('register') == -1 && toState.name.indexOf('home') == -1){
        var url = $location.path();
        var from = encodeURIComponent(url);
        // 如果已经在登陆界面，接收到401跳转到登陆界面了。
        $location.path('/app/login').search('state=' + from);
      }
    });

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

    vm.app.setAccessToken = function(data){
      vm.app.setting.accessToken = data.accessToken
      vm.app.setting.userId = data.userId
      vm.app.setting.expire = data.expire
    }

    var setting = 'local-setting';
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


    /**
     * initialization
     *
     */
    vm.app.init = function(callback){
      httpService.getMyProfile(function(data){
        if(!data.id){
          var url = $location.path();
          var from = encodeURIComponent(url);
          $location.path('/signin').search('state=' + from);
        }
        vm.app.setting.user = data
        if(vm.app.setting.user.orgTree){
          var tree = vm.app.setting.user.orgTree.split(',');
          if(tree.length > 2){
            vm.app.setting.user.organ = tree[1]+'-'+tree[2]
          }else{
            vm.app.setting.user.organ = tree[1]
          }
        }
        vm.app.isReady = true
        vm.app.runTodos()
        if(callback){
          callback()
        }
      }, function(err){
        console.log(err)
      })
    };


    if(vm.app.isAuthenticated()){
      vm.app.init();
    }
  }
})();
