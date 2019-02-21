(function() {
    'use strict';
    angular
        .module('httpService', [])
        .service('httpService', ['$http', '$localStorage', function ($http, $localStorage) {
            var self = this;
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

            /**
             * get stored access token
             * @returns {*|string}
             */
            function getAccessToken() {
                if (!self.accessToken) {
                    self.accessToken = $localStorage["local-setting"].accessToken
                }
                return self.accessToken
            }
        }])
})();
