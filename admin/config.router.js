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

    $urlRouterProvider.otherwise('/app/pfs_index1');
    $stateProvider
      .state('app', {
        abstract: true,
        url: '/app',
        views: {
          '': {
            templateUrl: '../views/layout/layout.html',
            controller: "layoutCtrl",
            resolve: load(['../scripts/layout/layout.js'])
          }
        },
        data: {
        	css: ['../assets/styles/style.css', '../assets/styles/plugins/iCheck/custom.css', '../assets/styles/plugins/datapicker/datepicker3.css', '../assets/styles/bootstrap.min.css']
    	}
      })
      
      .state('app.pfs_detail', {
        url: '../pfs_detail',
        templateUrl: '../views/pfs/pfs_detail.html',
        data: {
        	css: '../assets/styles/pfs_detail.css'
    	}
      })
      
      .state('app.pfs_index', {
        url: '/pfs_index',
        templateUrl: '../views/pfs/pfs_index.html',
        controller: "pfsIndexCtrl",
        resolve: load(['plot', 'ui.bootstrap' ,'mgcrea.ngStrap', 'toastr', '../scripts/pfs/pfs_index.js']),
        data: {
          css: ['../assets/styles/flot_set.css', '../assets/styles/pfs_index.css', '../assets/styles/news_list.css']
        }
      })

        .state('app.pfs_wait', {
          url: '/pfs_wait',
          templateUrl: '../views/pfs/pfs_wait.html',
          controller: "WaitCtrl",
          resolve: load(['ui.bootstrap' ,'mgcrea.ngStrap', 'toastr', '../scripts/pfs/wait.js']),
          data: {
            css: ['../assets/styles/flot_set.css', '../assets/styles/pfs_index.css', '../assets/styles/news_list.css']
          }
        })


        .state('app.news_list', {
        url: '/news/?channel&type&page',
        templateUrl: '../views/pfs/news_list.html',
        controller: "newsListCtrl",
        resolve: load(['ui.bootstrap' ,'mgcrea.ngStrap', 'toastr', '../scripts/pfs/news_list.js']),
        data: {
        	css: '../assets/styles/news_list.css'
    	}
      })

        .state('app.follow_list', {
          url: '/follow_list?page',
          templateUrl: '../views/pfs/follow_list.html',
          controller: "FollowListCtrl",
          resolve: load(['ui.bootstrap' ,'mgcrea.ngStrap', 'toastr', '../scripts/pfs/follow_list.js']),
          data: {
            css: '../assets/styles/news_list.css'
          }
        })

        .state('app.news_detail', {
          url: '/news/:id',
          templateUrl: '../views/pfs/news_detail.html',
          controller: "newsDetailCtrl",
          resolve: load(['../scripts/pfs/news_detail.js']),
          data: {
            css: '../assets/styles/news_detail.css'
          }
        })
      
      .state('app.news_analyse', {
        url: '/news_analyse/:id',
        templateUrl: '../views/pfs/news_analyse.html',
        controller: "newsAnalyseCtrl",
        resolve: load(['../scripts/pfs/news_analyse.js'])
      })
      
      .state('app.pfs_keyword', {
        url: '/pfs_keyword?page&filter',
        templateUrl: '../views/pfs/pfs_keyword.html',
        controller: "pfsKeywordCtrl",
        resolve: load(['ui.bootstrap' ,'mgcrea.ngStrap', 'toastr', '../scripts/pfs/pfs_keyword.js'])
      })
      
      .state('app.pfs_set', {
        url: '/pfs_set?page',
        templateUrl: '../views/pfs/pfs_set.html',
        controller: "pfsSetCtrl",
        resolve: load(['ui.bootstrap', 'mgcrea.ngStrap', 'toastr', 'ui.select', '../scripts/pfs/pfs_set.js']),
        data: {
        	css: '../assets/styles/pfs_set.css'
    	}
      })

        .state('app.follow', {
          url: '/follow?id',
          templateUrl: '../views/pfs/follow.html',
          controller: "FollowCtrl",
          resolve: load(['ui.bootstrap', 'mgcrea.ngStrap', 'toastr', 'ui.select', '../scripts/pfs/follow.js']),
          data: {
            css: '../assets/styles/pfs_index.css'
          }
        })
      
      .state('app.pfs_data_source', {
        url: '/pfs_data_source&page',
        templateUrl: '../views/pfs/pfs_data_source.html',
        controller: "pfsDataSourceCtrl",
        resolve: load(['ui.bootstrap' ,'mgcrea.ngStrap', 'toastr', '../scripts/pfs/pfs_data_source.js']),
        data: {
        	css: '../assets/styles/pfs_data_source.css'
    	}
      })
      
      .state('app.pfs_report_manager', {
        url: '/pfs_report_manager',
        templateUrl: '../views/pfs/pfs_report_manager.html',
        controller: "pfsReportManagerCtrl",
        resolve: load(['ui.bootstrap' ,'mgcrea.ngStrap', 'plot', '../scripts/pfs/pfs_report_manager.js']),
        data: {
          css: '../assets/styles/pfs_index.css'
        }
      })
      
      .state('app.pfs_analysis', {
        url: '/pfs_analysis',
        templateUrl: '../views/pfs/pfs_analysis.html',
        controller: "AnalysisCtrl",
        resolve: load(['../scripts/pfs/analysis.js']),
        data: {
        	css: '../assets/styles/pfs_analysis.css'
    	}
      })
        .state('app.pfs_index1',{
          url: '/pfs_index1',
          templateUrl: '../views/pfs/pfs_index1.html',
          controller: "Index1Ctrl",
          resolve: load(['../scripts/pfs/pfs_index1.js']),
          data: {
            css:  '../assets/styles/pfs_index.css'
          }
        })
      
      .state('app.pfs_proposal', {
        url: '/pfs_proposal',
        templateUrl: '../views/pfs/pfs_proposal.html',
        controller: "pfsProposalCtrl",
        resolve: load(['ui.bootstrap' ,'mgcrea.ngStrap', 'toastr', '../scripts/pfs/pfs_proposal.js'])
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
