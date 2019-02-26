/**
 * @ngdoc function
 * @name app.controller:AppCtrl
 * @description
 * # MainCtrl
 * Controller of the app
 */

(function() {
  'use strict';
  var apiInclude ='../views/include/';
  
  angular
    .module('app')
    .controller('AppCtrl', AppCtrl);

  AppCtrl.$inject  = [ '$scope', '$location', '$rootScope', '$timeout', '$window', '$state', '$localStorage', 'httpService'];

  function AppCtrl( $scope, $location, $rootScope, $timeout, $window, $state, $localStorage, httpService) {
    var vm = $scope;
    vm.app = {
      name: 'travel_page',
      color: {
        primary: '#0cc2aa',
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
      },
      key: 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDl/Gib2wdSzW7n+zpB76tkfHbj\n' +
          'i8HMiG/9uIVDn+l9HyHqY3WucEcw7DX7eoCY3S3E6vqLYOzvrAipF7mcWK7ch67B\n' +
          '6GQ0hiMwHxzOQvG3Pd3w0t7q6rmBM3l59eBNMbPZ2lZ1NuyuZMgcOPLLdn3GENyE\n' +
          'NUkMSruAiAlJIOc4DwIDAQAB'
    }

    vm.apiInclude = apiInclude;

    vm.app.isAuthenticated = function(){
      var now = new Date()
      if(vm.app.setting && vm.app.setting.accessToken && vm.app.setting.expire && now < moment(vm.app.setting.expire).toDate()){
        return true
      }
      return false
    }

    // $rootScope.$on('$stateChangeStart', function (event, toState) {
    //   //check if login
    //   if (!vm.app.isAuthenticated() && toState.name.indexOf('login') == -1 && toState.name.indexOf('register') == -1 && toState.name.indexOf('home') == -1){
    //     var url = $location.path();
    //     var from = encodeURIComponent(url);
    //     // 如果已经在登陆界面，接收到401跳转到登陆界面了。
    //     vm.app.setting = {}
    //     $location.path('/app/login').search('state=' + from);
    //   }
    // });

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
      httpService.getProfile({id: vm.app.setting.userId},function(data){
        if(!data.id){
          var url = $location.path();
          var from = encodeURIComponent(url);
          $location.path('/app/login').search('state=' + from);
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
      vm.app.init();
    }
  }
})();
