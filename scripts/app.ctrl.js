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

  AppCtrl.$inject  = [ '$scope', '$location', '$rootScope', '$timeout', '$window', '$state'];

  function AppCtrl( $scope, $location, $rootScope, $timeout, $window, $state) {
    var vm = $scope;

    vm.app = {
        name: 'travel_page',
    }
    
    vm.apiInclude = apiInclude;
  }
})();
