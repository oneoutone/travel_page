(function() {
    'use strict';
    angular
        .module('httpService', [])
        .service('httpService', ['$http', '$localStorage', function ($http, $localStorage) {
            var self = this;
            //var host = 'http://hadupu.cn/api'
            var host = 'http://localhost:8080/api'

            function postRequest(url, data, options, success, fail){
                var header = {'Content-Type': 'application/json'}
                if (options.auth) {
                    header.Authorization =  getAccessToken()
                }
                var request = {
                    method: 'post',
                    url: url,
                    headers: header
                }
                if(data){
                    request.data = data
                }
                $http(request)
                    .success(function (r) {
                    success(r)
                    }).error(function (r) {
                    fail(r)
                })
            }

            function getRequest(url, data, options, success, fail){
                var header = {'Content-Type': 'application/json'}
                if (options.auth) {
                    header.Authorization =  getAccessToken()
                }
                var request = {
                    method: 'get',
                    url: url,
                    headers: header
                }
                if(data){
                    request.params = data
                }
                $http(request)
                    .success(function (r) {
                        success(r)
                    }).error(function (r) {
                    fail(r)
                })
            }

            /**
             * send auth code
             * @param data
             * @param success
             * @param fail
             */
            self.sendAuthCode = function(data, success, fail){
                postRequest(host + '/authCode/send',data, {auth:false}, success, fail)
            }

            /**
             * new customer register
             * @param data
             * @param success
             * @param fail
             */
            self.register = function(data,success, fail){
                postRequest(host + '/users/register', data, {auth:false}, success, fail)
            }

            self.resetPassword = function(data,success, fail){
                postRequest(host + '/users/resetPassword', data, {auth:false}, success, fail)
            }

            /**
             * login
             * @param data
             * @param success
             * @param fail
             */
            self.login = function(data, success, fail){
                postRequest(host + '/users/login', data, {auth:false}, success, fail)
            }

            self.adminLogin = function(data, success, fail){
                postRequest(host + '/users/adminLogin', data, {auth:false}, success, fail)
            }

            self.upsertManager = function(data, success, fail){
                postRequest(host + '/users/upsertManager', data, {auth:true}, success, fail)
            }
            /**
             *get user info
             */
            self.getProfile = function(success, fail){
                getRequest(host + '/users/profile', null, {auth:true}, success, fail)
            }

            self.getUserById = function(id, success, fail){
                getRequest(host + '/users/userById', {id: id}, {auth:true}, success, fail)
            }

            self.updateUserWarn = function(data, success, fail){
                postRequest(host + '/users/updateUserWarn', data, {auth:true}, success, fail)
            }
            self.updateWarnInfo = function(data, success, fail){
                postRequest(host + '/users/updateWarnInfo', data, {auth:true}, success, fail)
            }
            self.updateSpecifySource = function(data, success,fail){
                postRequest(host + '/users/updateSpecifySource', data, {auth:true}, success, fail)
            }

            self.updateSpecifyWarning = function(data, success,fail){
                postRequest(host + '/users/updateSpecifyWarning', data, {auth:true}, success, fail)
            }

            self.wechatOpenId = function(data, success, fail){
                postRequest(host + '/users/wechatOpenId', data, {auth:false}, success, fail)
            }

            self.wechatBind = function(data, success, fail){
                postRequest(host + '/users/wechatBind', data, {auth:false}, success, fail)
            }

            self.wechatAuth = function(data, success, fail){
                postRequest(host + '/users/wechatAuth', data, {auth:false}, success, fail)
            }
            /**
             * today yuqing info
             * @param data
             * @param success
             * @param fail
             */
            self.today_data = function(success,fail){
                getRequest(host + '/yuqing/today_data', null, {auth:true}, success, fail)
            }

            self.words = function(data, success, fail){
                getRequest(host + '/yuqing/words', data, {auth:true}, success, fail)
            }

            /**
             * today yuqing info
             * @param data
             * @param success
             * @param fail
             */
            self.history_data = function(success,fail){
                getRequest(host + '/yuqing/history_data', null, {auth:true}, success, fail)
            }

            self.emotion_date = function(data,success, fail){
                getRequest(host + '/yuqing/emotion_data', data, {auth:true}, success, fail)
            }

            self.leader_date = function(data,success, fail){
                getRequest(host + '/yuqing/leader_data', data, {auth:false}, success, fail)
            }

            self.data = function(data, success,fail){
                getRequest(host + '/yuqing/data', data, {auth:true}, success, fail)
            }

            self.data_count = function(data, success,fail){
                getRequest(host + '/yuqing/data_page', data, {auth:true}, success, fail)
            }

            self.article = function(data, success,fail){
                getRequest(host + '/yuqing/article', data, {auth:true}, success, fail)
            }
            self.trend = function(data, success,fail){
                getRequest(host + '/yuqing/trend', data, {auth:true}, success, fail)
            }

            self.weiboV = function(success,fail){
                getRequest(host + '/yuqing/weiboV', null, {auth:true}, success, fail)
            }

            self.weiboHot = function(success,fail){
                getRequest(host + '/yuqing/weiboHot', null, {auth:true}, success, fail)
            }

            self.sources = function(data,success,fail){
                getRequest(host + '/yuqing/sources', data, {auth:true}, success, fail)
            }

            self.addKeyWord = function(data,success,fail){
                postRequest(host + '/yuqing/keyWord/add', data, {auth:true}, success, fail)
            }
            self.getKeyWordList = function(data,success,fail){
                getRequest(host + '/yuqing/keyWord/list', data, {auth:true}, success, fail)
            }
            self.getKeyRequest = function(data,success,fail){
                getRequest(host + '/yuqing/keyWord/requestList', data, {auth:true}, success, fail)
            }
            self.getKeyWordCount = function(success,fail){
                getRequest(host + '/yuqing/keyWord/count', null, {auth:true}, success, fail)
            }
            self.updateKeyWord = function(data, success, fail){
                postRequest(host + '/yuqing/keyWord/update', data, {auth:true}, success, fail)
            }

            self.deleteKeyWord = function(data, success, fail){
                postRequest(host + '/yuqing/keyWord/delete', data, {auth:true}, success, fail)
            }
            self.addRequest = function(data,success,fail){
                postRequest(host + '/dataRequest/add', data, {auth:true}, success, fail)
            }
            self.getRequestList = function(data,success,fail){
                getRequest(host + '/dataRequest/list', data, {auth:true}, success, fail)
            }
            self.getRequestCount = function(success,fail){
                getRequest(host + '/dataRequest/count', null, {auth:true}, success, fail)
            }
            self.getRequestAllList = function(data,success,fail){
                getRequest(host + '/dataRequest/allList', data, {auth:true}, success, fail)
            }
            self.getRequestById = function(data,success,fail){
                getRequest(host + '/dataRequest/record', data, {auth:true}, success, fail)
            }
            self.getRequestAllCount = function(data,success,fail){
                getRequest(host + '/dataRequest/allCount', data, {auth:true}, success, fail)
            }
            self.getWarningSetList = function(data, success,fail){
                getRequest(host + '/yuqing/warningSet/list', data, {auth:true}, success, fail)
            }
            self.getWarningSetDetail = function(data, success,fail){
                getRequest(host + '/yuqing/warningSet/detail', data, {auth:true}, success, fail)
            }
            self.getWarningSetCount = function(data, success,fail){
                getRequest(host + '/yuqing/warningSet/count', data, {auth:true}, success, fail)
            }
            self.addWarningSet = function(data,success,fail){
                postRequest(host + '/yuqing/warningSet/add', data, {auth:true}, success, fail)
            }
            self.upsertWarningSet = function(data, success, fail){
                postRequest(host + '/yuqing/warningSet/upsert', data, {auth:true}, success, fail)
            }
            self.updatetWarningSetAll = function(data, success, fail){
                postRequest(host + '/yuqing/warningSet/updateAll', data, {auth:true}, success, fail)
            }
            self.updateWarningSet = function(data, success, fail){
                postRequest(host + '/yuqing/warningSet/update', data, {auth:true}, success, fail)
            }
            self.deleteWarningSet = function(data, success, fail){
                postRequest(host + '/yuqing/warningSet/delete', data, {auth:true}, success, fail)
            }
            self.addDataSource = function(data,success,fail){
                postRequest(host + '/yuqing/dataSource/add', data, {auth:true}, success, fail)
            }
            self.getDataSourceList = function(data,success,fail){
                getRequest(host + '/yuqing/dataSource/list', data, {auth:true}, success, fail)
            }
            self.dataSourceUpdate = function(data,success,fail){
                postRequest(host + '/dataRequest/update', data, {auth:true}, success, fail)
            }
            self.getDataSourceCount = function(data, success,fail){
                getRequest(host + '/yuqing/dataSource/count', data, {auth:true}, success, fail)
            }
            self.addDataSourceRequest = function(data,success,fail){
                postRequest(host + '/yuqing/dataSourceRequest/add', data, {auth:true}, success, fail)
            }
            self.getDataSourceRequestList = function(data,success,fail){
                getRequest(host + '/yuqing/dataSourceRequest/list', data, {auth:true}, success, fail)
            }
            self.getDataSourceRequestCount = function(data,success,fail){
                getRequest(host + '/yuqing/dataSourceRequest/count', data, {auth:true}, success, fail)
            }
            self.deleteDataSourceSet = function(data, success, fail){
                postRequest(host + '/yuqing/dataSource/delete', data, {auth:true}, success, fail)
            }
            self.getNotificationList = function(success, fail){
                getRequest(host + '/yuqing/article/list', null, {auth:true}, success, fail)
            }
            self.read = function(data, success, fail){
                postRequest(host + '/yuqing/article/read', data, {auth:true}, success, fail)
            }
            self.getReportlist = function(data, success,fail){
                getRequest(host + '/yuqing/report/list', data, {auth:true}, success, fail)
            }
            self.getReportCount = function(data, success,fail){
                getRequest(host + '/yuqing/report/count', data, {auth:true}, success, fail)
            }
            self.analysis = function(data, success,fail){
                getRequest(host + '/yuqing/analysis', data, {auth:false}, success, fail)
            }
            self.reportData = function(data, success,fail){
                getRequest(host + '/yuqing/reportData', data, {auth:true}, success, fail)
            }
            self.getManagers = function(success,fail){
                getRequest(host + '/users/managers', null, {auth:true}, success, fail)
            }
            self.getRole_managers = function(success,fail){
                getRequest(host + '/users/role_managers', null, {auth:true}, success, fail)
            }
            self.createCompany = function(data, success,fail){
                postRequest(host + '/company', data, {auth:true}, success, fail)
            }
            self.updateCompany = function(data, success,fail){
                postRequest(host + '/company/update', data, {auth:true}, success, fail)
            }
            self.getCompanyById = function(id, success, fail) {
                getRequest(host + '/company/findById', {id: id}, {auth: true}, success, fail)
            }
            self.getAllCompanyList = function(data, success, fail) {
                getRequest(host + '/company/allList', data, {auth: true}, success, fail)
            }
            self.getAllCompanyCount = function(data, success, fail) {
                getRequest(host + '/company/allCount', data, {auth: true}, success, fail)
            }
            self.addAdvice = function(data, success, fail) {
                postRequest(host + '/advice', data, {auth: true}, success, fail)
            }
            self.checkToken = function(data, success, fail) {
                postRequest(host + '/users/checkToken', data, {auth: false}, success, fail)
            }
            self.clientToken = function(data, success, fail) {
                postRequest(host + '/users/clientToken', data, {auth: true}, success, fail)
            }
            self.adviceCountByUserId = function(success, fail) {
                getRequest(host + '/advice/countByUserId', null, {auth: true}, success, fail)
            }
            self.adviceListByUserId = function(data, success, fail) {
                getRequest(host + '/advice/listByUserId', data, {auth: true}, success, fail)
            }
            self.deleteDataSourceRequestById = function(data, success, fail) {
                postRequest(host + '/yuqing/dataSourceRequest/deleteById', data, {auth: true}, success, fail)
            }
            self.updateDataSourceRequestById = function(data, success, fail) {
                postRequest(host + '/yuqing/dataSourceRequest/update', data, {auth: true}, success, fail)
            }
            self.confirmWord = function(success, fail) {
                postRequest(host + '/yuqing/keyWord/confirm', null, {auth: true}, success, fail)
            }
            self.createFollow = function(data, success,fail){
                postRequest(host + '/follow', data, {auth:true}, success, fail)
            }
            self.followCountByUserId = function(success, fail) {
                getRequest(host + '/follow/countByUserId', null, {auth: true}, success, fail)
            }
            self.followListByUserId = function(data, success, fail) {
                getRequest(host + '/follow/listByUserId', data, {auth: true}, success, fail)
            }
            self.deleteFollowById = function(data, success, fail) {
                postRequest(host + '/follow/delete', data, {auth: true}, success, fail)
            }
            self.followFindByArticleId = function(data, success, fail) {
                getRequest(host + '/follow/findByUserId', data, {auth: true}, success, fail)
            }

            //bids
            self.upserBidsInfo = function(data, success, fail) {
                postRequest(host + '/bid/upsertBidInfo', data, {auth: true}, success, fail)
            }
            self.getBidsInfo = function(success, fail) {
                getRequest(host + '/bid/bidsInfo', null, {auth: true}, success, fail)
            }
            self.bidPermissions = function(success, fail) {
                getRequest(host + '/bid/permissions', null, {auth: true}, success, fail)
            }
            self.upsertBuyer = function( success, fail) {
                postRequest(host + '/bid/buyer', null, {auth: true}, success, fail)
            }
            self.upsertSupplier = function( success, fail) {
                postRequest(host + '/bid/supplier', null, {auth: true}, success, fail)
            }
            self.upsertDistributor = function( success, fail) {
                postRequest(host + '/bid/distributor', null, {auth: true}, success, fail)
            }
            /**
             * get stored access token
             * @returns {*|string}
             */
            function getAccessToken() {
                return $localStorage["local-setting"].accessToken
            }
        }])
})();
