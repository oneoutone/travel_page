(function() {
	'use strict';
	angular
		.module('app')
		.controller('newsAnalyseCtrl', newsAnalyseCtrl);
	newsAnalyseCtrl.$inject = ['$scope'];

	function newsAnalyseCtrl($scope) {
		$scope.data = {name:'2'};
	}

})();