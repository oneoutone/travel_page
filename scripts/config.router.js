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

    $urlRouterProvider.otherwise('/app/home');
    $stateProvider
      .state('app', {
        abstract: true,
        url: '/app',
        views: {
          '': {
            templateUrl: 'views/layout/layout.html',
            controller: "layoutCtrl",
            resolve: load(['scripts/layout/layout.js'])
          }
        }
      })

      .state('app.home', {
        url: '/home',
        templateUrl: 'views/home/home.html',
        controller: "homeCtrl",
        resolve: load(['scripts/js/slider.js','scripts/home/home.js'])
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
