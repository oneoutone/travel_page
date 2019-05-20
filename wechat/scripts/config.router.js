/**
 * Created by Joe on 7/26/16.
 */

(function() {
  'use strict';
  angular
    .module('app')
    .run(runBlock)
    .config(config);

  runBlock.$inject = ['$rootScope', '$state', '$stateParams'];
  function runBlock($rootScope,   $state,   $stateParams) {
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
  }

  config.$inject =  ['$stateProvider', '$urlRouterProvider', 'MODULE_CONFIG', '$httpProvider'];

  function config( $stateProvider,   $urlRouterProvider,   MODULE_CONFIG, $httpProvider ) {

    $httpProvider.interceptors.push(function($q, $location, $localStorage) {
      return {
        responseError: function(rejection) {
          console.log(1)
          if (rejection.status == 401) {
            console.log(2)
            var url = $location.path();
            var from = encodeURIComponent(url);
            // 如果已经在登陆界面，接收到401跳转到登陆界面了。
            $localStorage["local-setting"].accessToken = undefined
            $localStorage["local-setting"].user = undefined
            //event.preventDefault();
            $location.path('/register').search('state=' + from);
          }
          return $q.reject(rejection);
        }
      };
    });


    $urlRouterProvider.otherwise('/register');
    $stateProvider
        .state('home', {
          url: '/home',
          templateUrl: 'views/home.html'
        })
      .state('register', {
      	url: '/register',
      	templateUrl: 'views/register.html',
        controller: "RegisterCtrl",
        resolve: load(['toastr', 'scripts/controller/register.js'])
      })
        .state('my', {
          url: '/my',
          templateUrl: 'views/my.html',
          controller: "MyCtrl",
          resolve: load(['toastr', 'scripts/controller/my.js'])
        })
        .state('yq_analysis', {
          url: '/yq_analysis',
          templateUrl: 'views/yq_analysis.html',
          controller: "AnalysisCtrl",
          resolve: load(['moment', 'plot', 'scripts/controller/yq_analysis.js'])
        })
        .state('chart', {
          url: '/chart',
          templateUrl: 'views/chart.html',
          controller: "ChartCtrl",
          resolve: load(['moment', 'plot', 'scripts/controller/chart.js'])
        })
        .state('yq_alarm', {
          url: '/yq_alarm',
          templateUrl: 'views/yq_alarm.html',
          controller: "AlarmCtrl",
          resolve: load(['toastr', 'scripts/controller/yq_alarm.js'])
        })

    function load(srcs, callback) {
      return {
        deps: ['$ocLazyLoad', '$q',
          function( $ocLazyLoad, $q ){
            var deferred = $q.defer();
            var promise  = false;
            srcs = angular.isArray(srcs) ? srcs : srcs.split(/\s+/);
            if(!promise){
              promise = deferred.promise;
            }
            angular.forEach(srcs, function(src) {
              promise = promise.then( function(){
                angular.forEach(MODULE_CONFIG, function(module) {
                  if( module.name == src){
                    src = module.module ? module.name : module.files;
                  }
                });
                return $ocLazyLoad.load(src);
              } );
            });
            deferred.resolve();
            return callback ? promise.then(function(){ return callback(); }) : promise;
          }]
      }
    }

    function getParams(name) {
      name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
      var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
      return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    }
  }

})();
