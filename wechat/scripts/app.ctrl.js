/**
 * @ngdoc function
 * @name app.controller:AppCtrl
 * @description
 * # MainCtrl
 * Controller of the app
 */

(function() {
  'use strict';
  var apiInclude ='/cloud/views/include/';
  
  angular
    .module('app')
    .controller('AppCtrl', AppCtrl);

  AppCtrl.$inject  = [ '$scope', '$location', '$rootScope', '$timeout', '$window', '$state', '$localStorage', 'httpService'];

  function AppCtrl( $scope, $location, $rootScope, $timeout, $window, $state, $localStorage, httpService) {
    var vm = $scope;
    vm.app = {
      name: 'travel_page',
      setting: {},
      color: {
        primary: '#59def3',
        accent: '#a88add',
        warn: '#fcc100',
        info: '#6887ff',
        success: '#6cc788',
        warning: '#f77a99',
        danger: '#f44455',
        white: '#ffffff',
        light: '#f1f2f3',
        dark: '#2e3e4e',
        black: '#2a2b3c'
      }
    }


    vm.app.isAuthenticated = function(){
      console.log('start')
      var now = new Date()
      if(vm.app.setting && vm.app.setting.accessToken && vm.app.setting.expire && now < moment(vm.app.setting.expire).toDate()){
        console.log('true')
        return true
      }
      console.log('false')
      return false
    }

    $rootScope.$on('$stateChangeStart', function (event, toState) {
      //check if login
      console.log('$stateChangeStart')
      if (!vm.app.isAuthenticated() && toState.name.indexOf('login') == -1 && toState.name.indexOf('register') == -1 && toState.name.indexOf('home') == -1){
        var url = $location.path();
        var from = encodeURIComponent(url);
        // 如果已经在登陆界面，接收到401跳转到登陆界面了。
        $location.path('/register').search('state=' + from);
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
      vm.app.setting.accessToken = data.token
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

    vm.app.logout = function(){
      vm.app.setting = {}
      $state.go("app.home")
    }

    /**
     * initialization
     *
     */
    vm.app.init = function(callback){
      console.log('profile')
      httpService.getProfile(function(data){
        if(!data.id){
          var url = $location.path();
          var from = encodeURIComponent(url);
          $location.path('/register').search('state=' + from);
        }
        vm.app.setting.user = data
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
      console.log('init')
      vm.app.init();
    }
  }
})();
