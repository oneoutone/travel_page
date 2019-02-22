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
        resolve: load(['scripts/js/slider.js','scripts/home/home.js']),
        data: {
        	css: 'assets/styles/index.css'
    	}
      })
      
      .state('app.login', {
        url: '/login',
        templateUrl: 'views/login/login.html',
        controller: "loginCtrl",
        resolve: load(['scripts/login/login.js']),
        data: {
        	css: 'assets/styles/login.css'
    	}
      })
      
      .state('app.register', {
        url: '/register',
        templateUrl: 'views/register/register.html',
        controller: "registerCtrl",
        resolve: load(['toastr', 'scripts/register/register.js']),
        data: {
        	css: 'assets/styles/login.css'
    	}
      })
      
      .state('app.my', {
        url: '/my',
        templateUrl: 'views/pfs/my.html',
        controller: "myCtrl",
        resolve: load(['scripts/pfs/my.js']),
        data: {
        	css: ['assets/styles/my.css', 'assets/styles/product_list.css']
    	}
      })
      
      .state('app.console', {
        url: '/console',
        templateUrl: 'views/pfs/console.html',
        data: {
        	css: 'assets/styles/pfs_index.css'
    	}
      })
      
      .state('app.pfs_detail', {
        url: '/pfs_detail',
        templateUrl: 'views/pfs/pfs_detail.html',
        data: {
        	css: 'assets/styles/pfs_detail.css'
    	}
      })
      
      .state('app.product_list', {
        url: '/product_list',
        templateUrl: 'views/pfs/product_list.html',
        data: {
        	css: 'assets/styles/product_list.css'
    	}
      })
      
      .state('app.pfs_index', {
        url: '/pfs_index',
        templateUrl: 'views/pfs/pfs_index.html',
        controller: "pfsIndexCtrl",
        resolve: load(['scripts/pfs/pfs_index.js']),
        data: {
        	css: 'assets/styles/pfs_index.css'
    	}
      })
      
      .state('app.news_list', {
        url: '/news_list',
        templateUrl: 'views/pfs/news_list.html',
        controller: "newsListCtrl",
        resolve: load(['scripts/pfs/news_list.js']),
        data: {
        	css: 'assets/styles/news_list.css'
    	}
      })
      
      .state('app.news_detail', {
        url: '/news_detail',
        templateUrl: 'views/pfs/news_detail.html',
        controller: "newsDetailCtrl",
        resolve: load(['scripts/pfs/news_detail.js']),
        data: {
        	css: 'assets/styles/news_detail.css'
    	}
      })
      
      .state('app.pfs_keyword', {
        url: '/pfs_keyword',
        templateUrl: 'views/pfs/pfs_keyword.html',
        controller: "pfsKeywordCtrl",
        resolve: load(['scripts/pfs/pfs_keyword.js'])
      })
      
      .state('app.pfs_set', {
        url: '/pfs_set',
        templateUrl: 'views/pfs/pfs_set.html',
        controller: "pfsSetCtrl",
        resolve: load(['scripts/pfs/pfs_set.js']),
        data: {
        	css: 'assets/styles/pfs_set.css'
    	}
      })
      
      .state('app.pfs_data_source', {
        url: '/pfs_data_source',
        templateUrl: 'views/pfs/pfs_data_source.html',
        controller: "pfsDataSourceCtrl",
        resolve: load(['scripts/pfs/pfs_data_source.js'])
      })
      
      .state('app.pfs_report_manager', {
        url: '/pfs_report_manager',
        templateUrl: 'views/pfs/pfs_report_manager.html',
        controller: "pfsReportManagerCtrl",
        resolve: load(['scripts/pfs/pfs_report_manager.js'])
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
