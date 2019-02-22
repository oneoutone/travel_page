(function() {
	'use strict';
	angular
		.module('app')
		.controller('newsDetailCtrl', newsDetailCtrl);
	newsDetailCtrl.$inject = ['$scope'];

	function newsDetailCtrl($scope) {
		$scope.data = {name:'2'};
	}

})();