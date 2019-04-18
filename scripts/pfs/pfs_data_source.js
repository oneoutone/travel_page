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
		.controller('pfsDataSourceCtrl', pfsDataSourceCtrl);
	pfsDataSourceCtrl.$inject = ['$scope', 'httpService', 'toastr', '$stateParams', '$state'];

	function pfsDataSourceCtrl($scope, httpService, toastr, $stateParams, $state) {
		var vm = $scope;
		vm.data = {name:'5'};
		vm.default = true;
		vm.request = {type: 'news', channel: 'website'}
		vm.types = {"1": '咨询', "3": '政府', "2": '教育'}
		vm.channels = {"1": '网站', "3": '微信', "2": '微博'}
		vm.type1 = 'all'
		vm.channel1 = 'all'
		vm.type2 = 'all'
		vm.channel2 = 'all'
		vm.sourceChanged = function(){
			httpService.updateSpecifySource({specifySource: !vm.custom}, function(){
				toastr.success('更新成功')
			}, function(e){
				console.log(e)
			})

		}

		if($stateParams.page){
			vm.page = $stateParams.page
		}else{
			vm.page = 1
		}

		if($stateParams.page1){
			vm.page1 = $stateParams.page1
		}else{
			vm.page1 = 1
		}
		if($stateParams.page2){
			vm.page2 = $stateParams.page2
		}else{
			vm.page2 = 1
		}

		vm.fetchSource = function(){
			httpService.sources({website_url: vm.filter2, pagenum: vm.page2, type: vm.type2, channel:vm.channel2}, function(r){
				vm.urls = r.data
				vm.urls.forEach(function(t){
					var e = vm.sources.filter(function(v){
						return v.sourceUrl == t.result.website_url
					})
					if(e && e.length > 0){
						console.log('sfdasfgsafeafasf')
						t.result.checked = true
						t.result.sourceId = e[0].id
					}
				})
				vm.bigTotalItems2 = r.size
				vm.bigCurrentPage2 = vm.page2
			}, function(e){
				console.log(e)
			})
		}

		vm.pageChanged2 = function(){
			vm.page2 = vm.bigCurrentPage2
			vm.fetchSource()
		}

		function fetchData(){
			var data = {page: 1, size: 10000}
			httpService.getDataSourceList(data,function(result){
				console.log(result)
				vm.sources = result
				vm.fetchSource()
			}, function(e){
				console.log(e)
			})

		}

		vm.dateSourceClicked = function(item){
			if(!item.checked){
				httpService.deleteDataSourceSet({id: item.sourceId}, function(r){
					toastr.success('取消数据源成功')
					delete item.sourceId
				}, function(e){
					item.checked = true
					toastr.error('取消数据源失败')
				})
			}else{
				httpService.addDataSource({
					type: item.website_type,
					channel: item.sourcetype,
					sourceName: item.website,
					sourceUrl: item.website_url
				}, function(r){
					toastr.success('添加数据源请求成功')
					item.sourceId = r.id
				}, function(e){
					item.checked = false
					toastr.error(e.message)
					console.log(e)
				})
			}
		}

		function fetchData1(){
			var p = {channel: vm.channel1, type: vm.type1, filter: vm.filter1}
			var data = {page: vm.page1, size: 10, channel: vm.channel1, type: vm.type1, filter: vm.filter1}
			httpService.getDataSourceRequestList(data,function(result){
				console.log(result)
				vm.dataSourceRequest = result
			}, function(e){
				console.log(e)
			})

			httpService.getDataSourceRequestCount(p,function(r){
				vm.bigTotalItems1 = r.count
				vm.bigCurrentPage1 = vm.page1
			}, function(e){
				console.log(e)
			})
		}

		vm.doFilter1 = function(){
			fetchData1()
		}

		vm.dpFilter2 = function(){
			vm.fetchSource()
		}

		vm.addSourceRequest = function(item){
			if(!vm.request.sourceName){
				toastr.error('请输入数据源名称')
				return
			}
			if(!vm.request.sourceUrl){
				toastr.error('请输入数据源地址')
				return
			}
			httpService.addDataSourceRequest({
				type: item.website_type,
				channel: item.sourcetype,
				sourceName: item.website,
				sourceUrl: item.website_url
		}, function(r){
				toastr.success('添加数据源请求成功')
				$('#myModal').modal('hide')
				fetchData1()
			}, function(e){
				toastr.error(e.message)
				console.log(e)
			})
		}

		vm.showMyModel = function(){
			vm.request = {type: '1', channel: '1'}
			$('#myModal').modal('show')
		}

		vm.addSource = function(item){
			httpService.addDataSource({sourceId: item.result.websiteId, sourceName: item.result.website, sourceUrl: item.result.website_url}, function(r){
				toastr.success('添加数据源成功')
				fetchData()
			}, function(e){
				toastr.error(e.message)
				console.log(e)
			})
		}

		vm.showDeleteModal = function(item){
			vm.deleteItem = item
			$('#delete').modal('show')
		}

		vm.deleteDataSource = function(){
			httpService.deleteDataSourceSet({id: vm.deleteItem.id}, function(r){
				toastr.success('删除数据源成功')
				$('#delete').modal('hide')
				fetchData()
			}, function(e){
				toastr.error('删除数据源失败')
			})
		}

		vm.pageChanged1 = function(){
			vm.page1 = vm.bigCurrentPage1
			fetchData1()
		}

		vm.app.ready(function(){
			fetchData()
			fetchData1()
			httpService.getProfile(function(user){
				vm.custom = user.specifySource
			}, function(e){
				console.log(e)
			})
		})
	}

})();