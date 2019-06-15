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
		.controller('newsListCtrl', newsListCtrl);
	newsListCtrl.$inject = ['$scope', 'httpService', 'toastr', '$stateParams', '$state'];

	function newsListCtrl($scope, httpService, toastr, $stateParams, $state) {
		var vm = $scope
		vm.header = {name:'2'};
		if($stateParams.channel){
			vm.channel = $stateParams.channel
		}else{
			vm.channel = 'all'
		}

		if($stateParams.type){
			vm.type = $stateParams.type
		}else{
			vm.type = 'negtive'
		}

		if($stateParams.page){
			vm.page = $stateParams.page
		}else{
			vm.page = 1
		}

		vm.setChannel = function(channel){
			vm.channel = channel
			fetchData()
		}

		vm.setType = function(type){
			vm.type = type
			fetchData()
		}

		function fetchData(){
			var data = {page: vm.page, size: 10}
			data.article_type = 4
			if(vm.channel == 'website'){
				data.article_type = 0
			}
			if(vm.channel == 'weibo'){
				data.article_type = 8
			}
			if(vm.channel == 'wechat'){
				data.article_type = 9
			}
			if(vm.channel == 'forum'){
				data.article_type = 7
			}
			data.sentiment = 4

			if(vm.type == 'active'){
				data.sentiment = 1
			}
			if(vm.type == 'negtive'){
				data.sentiment = 3
			}
			if(vm.type == 'middle'){
				data.sentiment = 2
			}
			httpService.data_count(data,function(result){
				console.log(result)
				vm.bigTotalItems = result.size
				vm.bigCurrentPage = vm.page
			}, function(e){
				console.log(e)
			})

			httpService.data(data,function(result){
				console.log(result)
				vm.data = result.data
				for(var i=0; i<vm.data.length; i++){
					if(vm.data[i].result.content.length > 100){
						vm.data[i].result.desc = vm.data[i].result.content.substr(0, 100)+'...'
					}
					if(!vm.data[i].result.content && vm.data[i].result.title){
						vm.data[i].result.desc = vm.data[i].result.title
					}
					console.log(vm.data[i].result.articletype)
					if(vm.data[i].result.articletype == 7 || vm.data[i].result.articletype == 8){
						getTrend(vm.data[i].result)
						getFollow(vm.data[i].result)
					}
				}
			}, function(e){
				console.log(e)
			})

		}

		function getFollow(d){
			httpService.followFindByArticleId({articleId: d.article_id}, function(r){
				if(r.result == true){
					d.followed = true
				}else{
					d.followed = false
				}
			}, function(err){
				console.log(err)
			})
		}

		function getTrend(d){
			httpService.trend({articleId: d.article_id}, function(r){
				console.log(r)
				if(!r || r.length == 0){
					d.showTrend = false
				}else{
					d.showTrend = true
				}
				if(r.length == 1){
					d.readTrend = '升'
					d.shareTrend = '升'
					d.supportTrend = '升'
				}
				if(r.length == 2){
					if(r[r.length-1].contentnum - r[r.length-2].contentnum - r[r.length-2].contentnum > 0){
						d.readTrend = '升'
					}else{
						d.readTrend = '降'
					}
					if(r[r.length-1].speadnum - r[r.length-2].speadnum - r[r.length-2].speadnum > 0){
						d.shareTrend = '升'
					}else{
						d.shareTrend = '降'
					}
					if(r[r.length-1].supportnum - r[r.length-2].supportnum - r[r.length-2].supportnum > 0){
						d.supportTrend = '升'
					}else{
						d.supportTrend = '降'
					}
				}
				if(r.length > 2){
					if(r[r.length-1].contentnum - r[r.length-2].contentnum - r[r.length-2].contentnum +r[r.length-3].contentnum >0){
						d.readTrend = '升'
					}else{
						d.readTrend = '降'
					}
					if(r[r.length-1].speadnum - r[r.length-2].speadnum - r[r.length-2].speadnum + r[r.length-3].speadnum> 0){
						d.shareTrend = '升'
					}else{
						d.shareTrend = '降'
					}
					if(r[r.length-1].supportnum - r[r.length-2].supportnum - r[r.length-2].supportnum + r[r.length-3].supportnum> 0){
						d.supportTrend = '升'
					}else{
						d.supportTrend = '降'
					}
				}
			}, function(err){
				console.log(err)
			})
		}

		vm.addFollow = function(item){
			if(!item.followed){
				httpService.createFollow({
					articleId: item.article_id,
					title: item.title ? item.title : item.content.length > 100 ? item.content.substr(0, 100) : item.content,
					content: item.content.length > 100 ? item.content.substr(0, 100) : item.content,
					postive: item.postive,
					publish_time: item.publish_time,
					source_name: item.source_name
				}, function(r){
					toastr.success('添加成功')
					item .followed = true
				}, function(e){
					toastr.error('添加失败，请稍后再试')
				})
			}else{
				httpService.deleteFollowById({articleId: item.article_id}, function(r){
					toastr.success('取消成功')
					item.followed = false
				}, function(e){
					toastr.error('取消失败，请稍后再试')
				})
			}

		}
		vm.pageChanged = function(){
			if(vm.bigCurrentPage == vm.page){
				return
			}
			$state.go('app.news_list', {page: vm.bigCurrentPage, channel: vm.channel, type: vm.type})
		}

		vm.app.ready(function(){
			fetchData()
		})

	}

})();