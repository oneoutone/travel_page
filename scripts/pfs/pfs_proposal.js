(function() {
	'use strict';
	angular
		.module('app')
		.config(function(toastrConfig) {
			angular.extend(toastrConfig, {
				positionClass: 'toast-top-full-width',
				preventOpenDuplicates: true,
				timeOut: 1000
			});
		})
		.controller('pfsProposalCtrl', pfsProposalCtrl);
	pfsProposalCtrl.$inject = ['$scope', 'httpService', 'toastr', '$stateParams', '$state'];

	function pfsProposalCtrl($scope, httpService, toastr, $stateParams, $state) {
		var vm = $scope
		vm.header = {name:'7'};

	}

})();