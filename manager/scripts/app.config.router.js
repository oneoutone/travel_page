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

        $httpProvider.interceptors.push(function($q, $location) {
            return {
                responseError: function(rejection) {
                    if (rejection.status == 401) {
                        // Now clearing the loopback values from client browser for safe logout...
                        // LoopBackAuth.clearUser();
                        // LoopBackAuth.clearStorage();
                        // $location.nextAfterLogin = $location.path();
                        // $location.path('/access/signin');
                        console.log("401 happened")
                   }
                   return $q.reject(rejection);
                }
            };
        });

        $urlRouterProvider.otherwise('/access/signin');
        $stateProvider
            .state('app', {
                abstract: true,
                url: '/app',
                views: {
                    '': {
                        templateUrl: 'views/layout/layout.html'
                    }
                }
            })
            .state('access', {
                url: '/access',
                template: '<div class="dark bg-auto w-full"><div ui-view class="fade-in-right-big smooth pos-rlt"></div></div>'
            })
            .state('access.signin', {
                url: '/signin',
                templateUrl: 'views/signin/signin.html',
                controller: "SignInCtrl",
                resolve: load(['toastr', 'scripts/signin/signin.js'])
            })
            .state('access.signup', {
                url: '/signup',
                templateUrl: 'views/signIn/signup.html',
                controller: "SignUpCtrl",
                resolve: load(['toastr', 'scripts/controllers/signin/signup.js'])
            })
            
            .state('app.index',{
                url: '/index',
                templateUrl: 'views/pfs/index.html'
            })
            
            .state('app.backlog',{
                url: '/backlog',
                templateUrl: 'views/pfs/backlog.html'
            })
            // 运营团队权限配置
            .state('app.manager',{
                url: '/managers',
                template: '<div ui-view></div>',
                data: {title: '管理团队'}
            })
            .state('app.manager.list', {
                url: '/list',
                templateUrl: 'views/manager/manager.list.html',
                controller: "ManagerListCtrl",
                resolve: load(['toastr', 'ngFileUpload', 'ui.bootstrap','footable', 'scripts/manager/manager.list.js'])
            })
            .state('app.manager.info', {
                url: '/info/:id',
                templateUrl: 'views/manager/manager.info.html',
                controller: "ManagerInfoCtrl",
                resolve: load(['toastr', 'scripts/manager/manager.info.js'])
            })

            .state('app.product',{
                url: '/product',
                template: '<div ui-view></div>',
                data: {title: '礼品管理'}
            })
            .state('app.product.list', {
                url: '/list?name&status&saleStatus&start&end&page',
                templateUrl: 'views/product/product.list.html',
                controller: "ProductListCtrl",
                resolve: load(['toastr', 'moment', 'mgcrea.ngStrap', 'scripts/product/product.list.js'])
            })
            .state('app.product.detail', {
                url: '/detail?id',
                templateUrl: 'views/product/product.detail.html',
                controller: "ProductDetailCtrl",
                resolve: load(['toastr', 'moment', 'ngFileUpload', 'mgcrea.ngStrap', 'scripts/product/product.detail.js'])
            })
            .state('app.product.info', {
                url: '/:id',
                templateUrl: 'views/product/product.info.html',
                controller: "ProductInfoCtrl",
                resolve: load(['toastr', 'moment', 'ngFileUpload', 'mgcrea.ngStrap', 'scripts/product/product.info.js'])
            })
            .state('app.confirm',{
                url: '/confirm',
                template: '<div ui-view></div>',
                data: {title: '礼品审核'}
            })
            .state('app.confirm.list', {
                url: '/list?id&name&status&page',
                templateUrl: 'views/product/confirm/confirm.list.html',
                controller: "ConfirmListCtrl",
                resolve: load(['toastr', 'moment', 'mgcrea.ngStrap', 'scripts/product/confirm/confirm.list.js'])
            })
            .state('app.confirm.info', {
                url: '/info?id',
                templateUrl: 'views/product/confirm/confirm.info.html',
                controller: "ConfirmInfoCtrl",
                resolve: load(['toastr', 'moment', 'mgcrea.ngStrap', 'scripts/product/confirm/confirm.info.js'])
            })
            .state('app.redeem',{
                url: '/redeem',
                template: '<div ui-view></div>',
                data: {title: '兑换订单'}
            })
            .state('app.redeem.list', {
                url: '/list?org&productName&employeeId&start&end&page',
                templateUrl: 'views/product/redeem.list.html',
                controller: "RedeemListCtrl",
                resolve: load(['ui.bootstrap', 'toastr', 'moment', 'mgcrea.ngStrap', 'scripts/product/redeem.list.js'])
            })
            .state('app.redeem.info', {
                url: '/info?id',
                templateUrl: 'views/product/redeem.info.html',
                controller: "RedeemInfoCtrl",
                resolve: load(['toastr', 'moment', 'mgcrea.ngStrap', 'scripts/product/redeem.info.js'])
            })

            .state('app.company',{
                url: '/company',
                template: '<div ui-view></div>',
                data: {title: '企业列表'}
            })

            .state('app.company.list', {
                url: '/list?status&index',
                templateUrl: 'views/meeting/company.list.html',
                controller: "CompanyListCtrl",
                resolve: load(['ui.bootstrap', 'toastr', 'moment','ui.bootstrap', 'scripts/meeting/company.list.js'])
            })

            .state('app.employee',{
                url: '/employee',
                template: '<div ui-view></div>',
                data: {title: '员工列表'}
            })
            .state('app.employee.list', {
                url: '/list?companyId&index',
                templateUrl: 'views/meeting/employee.list.html',
                controller: "EmployeeListCtrl",
                resolve: load(['toastr', 'moment','ui.bootstrap', 'scripts/meeting/employee.list.js'])
            })

            .state('app.meetingRoom',{
                url: '/meetingRoom',
                template: '<div ui-view></div>',
                data: {title: '会议室列表'}
            })
            .state('app.meetingRoom.list', {
                url: '/list',
                templateUrl: 'views/meeting/meetingRoom.list.html',
                controller: "MeetingRoomListCtrl",
                resolve: load(['toastr', 'moment','ui.bootstrap', 'scripts/meeting/meetingRoom.list.js'])
            })
            .state('app.meeting',{
                url: '/meeting',
                template: '<div ui-view></div>',
                data: {title: '会议室列表'}
            })
            .state('app.meeting.grid', {
                url: '/grid',
                templateUrl: 'views/meeting/meeting.grid.html',
                controller: "MeetingGirdCtrl",
                resolve: load(['toastr', 'moment','mgcrea.ngStrap','ui.select', 'scripts/meeting/meeting.grid.js'])
            })
            .state('app.dataList', {
                url: '/dataList?name&status&page',
                templateUrl: 'views/data/dataList.html',
                controller: "DataListCtrl",
                resolve: load(['ui.bootstrap', 'toastr', 'moment','mgcrea.ngStrap','ui.select', 'scripts/data/dataList.js'])
            })
            .state('app.dataSource', {
                url: '/dataList/:id',
                templateUrl: 'views/data/dataSource.html',
                controller: "DataSourceCtrl",
                resolve: load(['ui.bootstrap', 'toastr', 'moment','mgcrea.ngStrap','ui.select', 'scripts/data/dataSource.js'])
            })
            .state('app.clientList', {
                url: '/clientList?filter&status&page',
                templateUrl: 'views/manager/client.list.html',
                controller: "ClientListCtrl",
                resolve: load(['ui.bootstrap', 'toastr', 'moment','mgcrea.ngStrap','ui.select', 'scripts/manager/client.list.js'])
            })
            .state('app.clientInfo', {
                url: '/clientInfo/:id',
                templateUrl: 'views/manager/client.info.html',
                controller: "ClientInfoCtrl",
                resolve: load(['toastr', 'moment','mgcrea.ngStrap','ui.select', 'scripts/manager/client.info.js']),
                data: {title: '客户信息'}
            })
            .state('app.clientListOfManager', {
                url: '/clientListOfManager?filter&status&page',
                templateUrl: 'views/manager/manager.client.list.html',
                controller: "ManagerClientListCtrl",
                resolve: load(['ui.bootstrap', 'toastr', 'moment','mgcrea.ngStrap','ui.select', 'scripts/manager/manager.client.list.js'])
            })
            .state('app.eventList', {
                url: '/eventList?page&filter',
                templateUrl: 'views/manager/eventList.html',
                controller: "EventListCtrl",
                resolve: load(['ui.bootstrap','toastr', 'moment','mgcrea.ngStrap','ui.select', 'scripts/manager/eventList.js'])
            })
            .state('app.eventBind', {
                url: '/eventBind',
                templateUrl: 'views/manager/eventBind.html',
                controller: "EventBindCtrl",
                resolve: load(['ui.bootstrap','toastr', 'moment','mgcrea.ngStrap','ui.select', 'scripts/manager/eventArticle.js'])
            })
            .state('app.buyerList', {
                url: '/buyerList?page&status&filter',
                templateUrl: 'views/manager/buyerList.html',
                controller: "BuyerListCtrl",
                resolve: load(['ui.bootstrap','toastr', 'moment','mgcrea.ngStrap','ui.select', 'scripts/manager/buyerList.js']),
                data: {title: '供应商列表'}
            })
            .state('app.supplierList', {
                url: '/supplierList?page&status&filter',
                templateUrl: 'views/manager/supplierList.html',
                controller: "SupplierListCtrl",
                resolve: load(['ui.bootstrap','toastr', 'moment','mgcrea.ngStrap','ui.select', 'scripts/manager/supplierList.js']),
                data: {title: '供应商列表'}
            })
            .state('app.distributorList', {
                url: '/distributorList?page&status&filter',
                templateUrl: 'views/manager/distributorList.html',
                controller: "DistributorListCtrl",
                resolve: load(['ui.bootstrap','toastr', 'moment','mgcrea.ngStrap','ui.select', 'scripts/manager/DistributorList.js']),
                data: {title: '分销商列表'}
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
