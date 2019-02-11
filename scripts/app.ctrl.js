/**
 * @ngdoc function
 * @name app.controller:AppCtrl
 * @description
 * # MainCtrl
 * Controller of the app
 */

(function() {
  'use strict';
  angular
    .module('app')
    .controller('AppCtrl', AppCtrl);

  AppCtrl.$inject  = [ '$scope', '$location', '$rootScope', '$timeout', '$window', '$state'];

  function AppCtrl( $scope, $location, $rootScope, $timeout, $window, $state) {
    var vm = $scope;

    vm.app = {
        name: 'travel_page',
    }
  }
})();
