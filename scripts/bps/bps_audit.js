(function() {
	'use strict';
	angular
		.module('app')
		.controller('bpsAuditCtrl', bpsAuditCtrl);
	bpsAuditCtrl.$inject = ['$scope'];

	function bpsAuditCtrl($scope) {
		var vm = $scope;
		vm.step = 1;
	}

})();