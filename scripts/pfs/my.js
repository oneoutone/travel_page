(function() {
	'use strict';
	angular
		.module('app')
		.controller('myCtrl', myCtrl);
	myCtrl.$inject = ['$scope', 'httpService'];

	function myCtrl($scope, httpService) {

		var vm = $scope

		vm.app.ready(function(){
			httpService.getProfile(function(data){
				vm.user = data
			}, function(err){
				console.log(err)
			})
		})

	}

})();