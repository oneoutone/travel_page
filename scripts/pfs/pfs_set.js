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
		.controller('pfsSetCtrl', pfsSetCtrl);
	pfsSetCtrl.$inject = ['$scope', 'httpService', 'toastr', '$stateParams', '$state'];

	function pfsSetCtrl($scope, httpService, toastr, $stateParams, $state) {
		var vm = $scope
		vm.default = {}
		vm.tab = 1
		vm.header = {name:'5'};
		vm.set ={}

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

		vm.setTab = function(v){
			if(v == 1){
				vm.f2 = vm.filter
				vm.filter = vm.f1
			}else{
				vm.f1 = vm.filter
				vm.filter = vm.f2
			}
			vm.tab = v

		}

		function fetchDataSource(){
			var data = {page: vm.page1, size: 10, filter: vm.filter}
			httpService.getDataSourceList(data,function(result){
				console.log(result)
				vm.sources = result
				vm.sources.forEach(function(t){
					var e = vm.sets.filter(function(v){
						return v.sourceUrl == t.sourceUrl
					})
					if(e && e.length > 0){
						t.checked = true
						t.setId = e[0].id
					}
				})
			}, function(e){
				console.log(e)
			})

			httpService.getDataSourceCount({filter: vm.filter},function(r){
				vm.bigTotalItems1 = r.count
				vm.bigCurrentPage1 = vm.page1
			}, function(e){
				console.log(e)
			})
		}

		vm.pageChanged1 = function(){
			vm.page1 = vm.bigCurrentPage1
			fetchDataSource()
		}

		vm.doFilter1 = function(){
			if(vm.tab == 1){

				vm.page1  = 1
				fetchDataSource()
			}else{

				vm.page2  = 1
				fetchWarnings()
			}

		}

		vm.sourceClicked = function(item){
			if(!item.checked){
				httpService.deleteWarningSet({id: item.setId}, function(r){
					toastr.success('删除报警数据源成功')
					fetchWarnings()
					delete item.setId
				}, function(e){
					item.checked = true
					toastr.error('删除报警数据源失败')
				})
			}else{
				var data = {
					sourceName: item.sourceName,
					sourceUrl: item.sourceUrl,
					type: 'specify',
				}
				httpService.upsertWarningSet(data, function(r){
					toastr.success('添加报警条件成功')
					fetchWarnings()
					item.setId = r.id
				}, function(e){
					console.log(e)
					toastr.error('添加报警条件失败')
				})
			}
		}


		function fetchData(){
			httpService.getWarningSetList({page:1, size: 1000},function(result){
				console.log(result)
				vm.sets = result
				var def = vm.sets.filter(function(item){
					return item.type == 'default'
				})
				if(def && def.length > 0){
					vm.default = def[0]
				}
				fetchDataSource()
			}, function(e){
				console.log(e)
			})
		}

		function fetchWarnings(){
			var data = {page: vm.page2, size: 10, filter: vm.filter, type: 'specify',}
			httpService.getWarningSetList(data,function(result){
				vm.settings = result
			}, function(e){
				console.log(e)
			})

			httpService.getWarningSetCount({type: 'specify', filter: vm.filter},function(r){
				vm.bigTotalItems2 = r.count
				vm.bigCurrentPage2 = vm.page2
			}, function(e){
				console.log(e)
			})
		}

		vm.addWarningSet = function(){
			if(vm.set.id){
				httpService.updateWarningSet(vm.set, function(r){
					toastr.success('更新报警条件成功')
					toastr.success('添加报警条件成功')
					$('#myModal').modal('hide')
					fetchData()
				}, function(e){
					toastr.error('更新报警条件失败')
				})
			}else{
				vm.set.sourceId = vm.set.url.result.seed_id+''
				vm.set.sourceName = vm.set.url.result.website
				vm.set.sourceUrl = vm.set.url.result.website_url
				vm.set.url = undefined
				httpService.addWarningSet(vm.set, function(r){
					toastr.success('添加报警条件成功')
					$('#myModal').modal('hide')
					fetchData()
				}, function(e){
					console.log(e)
					toastr.error('添加报警条件失败')
				})
			}

		}


		vm.deleteWarningSet = function(item){
			httpService.deleteWarningSet({id: item.id}, function(r){
				toastr.success('删除报警条件成功')
				fetchData()
				fetchWarnings()
			}, function(e){
				toastr.error('删除报警条件失败')
			})
		}

		vm.doFilter = function(){
			$state.go('app.pfs_keyword', {page: 1, filter: vm.filter})
		}

		vm.showDeleteModal = function(item){
			$('#delete').modal('show')
			vm.deleteItem = item
		}

		vm.saveAll = function(){
			var reg = /^[0-9]*$/
			if(vm.readNum1 && !reg.test(vm.readNum1)){
				toastr.error('阅读量阈值只能是整数')
				return
			}
			if(vm.discussNum1 && !reg.test(vm.discussNum1)){
				toastr.error('评论数阈值只能是整数')
				return
			}
			if(vm.shareNum1 && !reg.test(vm.shareNum1)){
				toastr.error('转发数阈值只能是整数')
				return
			}
			if(vm.negValue1 && (vm.negValue1 > 1 || vm.negValue1 <0)){
				toastr.error('负面情绪阈值只能在0到1之间')
				return
			}
			httpService.updatetWarningSetAll({
				readNum: vm.readNum1,
				discussNum: vm.discussNum1,
				shareNum: vm.shareNum1,
				negValue: vm.negValue1
			}, function(r){
				toastr.success('设置报警条件成功')
				fetchWarnings()
			}, function(e){
				toastr.error('设置报警条件失败')
			})
		}

		$scope.pageChanged = function() {
			if(vm.bigCurrentPage == vm.page){
				return
			}
			$state.go('app.pfs_set', {page: vm.bigCurrentPage})
		};

		vm.pageChanged2 = function(){
			vm.page2 = vm.bigCurrentPage2
			fetchWarnings()
		}

		vm.showAdd = function(item){
			vm.set = {}
			if(item){
				vm.set = item
			}
			$('#myModal').modal('show')
		}

		vm.showDelete = function(item){
			vm.deleteItem = item
			$('#delete').modal('show')
		}

		vm.updateUserWarn = function(){
			console.log('changed')
			httpService.updateUserWarn({message_warn: vm.message_warn, email_warn: vm.email_warn, wechat_warn: vm.wechat_warn, app_warn: vm.app_warn}, function(r){
				toastr.success('更新报警渠道成功')
			}, function(e){
				toastr.error('更新报警渠道失败')
			})
		}

		vm.updateDefault = function(){
			var reg = /^[0-9]*$/
			if(vm.default.readNum && !reg.test(vm.default.readNum)){
				toastr.error('阅读量阈值只能是整数')
				return
			}
			if(vm.default.discussNum && !reg.test(vm.default.discussNum)){
				toastr.error('评论数阈值只能是整数')
				return
			}
			if(vm.default.shareNum && !reg.test(vm.default.shareNum)){
				toastr.error('转发数阈值只能是整数')
				return
			}
			if(vm.default.negValue && (vm.default.negValue > 1 || vm.default.negValue <0)){
				toastr.error('负面情绪阈值只能在0到1之间')
				return
			}
			vm.default.type = 'default'
			httpService.upsertWarningSet(vm.default, function(r){
				if(r.id){
					vm.default.id = r.id
				}
				toastr.success('更新默认报警设置成功')
			}, function(e){
				toastr.error('更新默认报警设置失败')
			})
		}

		vm.updteSpecify = function(item){
			var reg = /^[0-9]*$/
			if(item.readNum && !reg.test(item.readNum)){
				toastr.error('阅读量阈值只能是整数')
				return
			}
			if(item.discussNum && !reg.test(item.discussNum)){
				toastr.error('评论数阈值只能是整数')
				return
			}
			if(item.shareNum && !reg.test(item.shareNum)){
				toastr.error('转发数阈值只能是整数')
				return
			}
			if(item.negValue && (vm.default.negValue > 1 || item.negValue <0)){
				toastr.error('负面情绪阈值只能在0到1之间')
				return
			}
			vm.default.type = 'specify'
			httpService.upsertWarningSet(item, function(r){
				if(r.id){
					vm.default.id = r.id
				}
				toastr.success('更新报警设置成功')
			}, function(e){
				toastr.error('更新报警设置失败')
			})
		}

		vm.updateSpecify = function(){
			httpService.updateSpecifyWarning({specifyWarning: vm.defaultValue ? false : true }, function(r){
				toastr.success('更新报报警默认设置成功')
			}, function(err){
				toastr.error('更新报警默认设置失败')
			})
		}

		vm.updateWarnInfo = function(){
			var reg1 = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/
			var reg2 = /^\d{11}$/
			var emails = ""
			var phones = ""
			if(vm.email1){
				if(!reg1.test(vm.email1)){
					toastr.error('第1个邮箱无效')
					return
				}
				emails +=vm.email1
			}
			if(vm.email2){
				if(!reg1.test(vm.email2)){
					toastr.error('第2个邮箱无效')
					return
				}
				emails +=','+vm.email2
			}
			if(vm.email3){
				if(!reg1.test(vm.email3)){
					toastr.error('第3个邮箱无效')
					return
				}
				emails +=','+vm.email3
			}

			if(vm.phone1){
				if(!reg2.test(vm.phone1)){
				toastr.error('第1个手机号无效')
				return
			}
				phones += vm.phone1
			}
			if(vm.phone2){
				if(!reg2.test(vm.phone2)){
					toastr.error('第2个手机号无效')
					return
				}
				phones +=','+vm.phone2
			}
			if(vm.phone3){
				if(!reg2.test(vm.phone3)){
					toastr.error('第3个手机号无效')
					return
				}
				phones +=','+vm.phone3
			}
			httpService.updateWarnInfo({
				warn_phones: phones,
				warn_emails: emails
			}, function(r){
				toastr.success('更新报设置成功')
			}, function(e){
				toastr.error('更新报设置失败')
			})
		}
		vm.set = {}
		vm.showModal = function(item){
			if(item == 'all'){
				vm.update = 'all'
				vm.set.sourceName = '批量设置'
			}else{
				vm.set.sourceName = item.sourceName
				httpService.getWarningSetDetail({id: item.setId}, function(r){
					vm.set.readNum = r.readNum
					vm.set.discussNum = r.discussNum
					vm.set.shareNum = r.shareNum
					vm.set.negValue = r.negValue
					vm.update = r.id
				}, function(e){
					console.log(e)
				})
			}
			$('#myModal').modal('show')
		}

		vm.updateSet = function(){
			var reg = /^[0-9]*$/
			if(vm.set.readNum && !reg.test(vm.set.readNum)){
				toastr.error('阅读量阈值只能是整数')
				return
			}
			if(vm.set.discussNum && !reg.test(vm.set.discussNum)){
				toastr.error('评论数阈值只能是整数')
				return
			}
			if(vm.set.shareNum && !reg.test(vm.set.shareNum)){
				toastr.error('转发数阈值只能是整数')
				return
			}
			if(vm.set.negValue && (vm.set.negValue > 1 || vm.set.negValue <0)){
				toastr.error('负面情绪阈值只能在0到1之间')
				return
			}

			if(vm.update == 'all'){
				httpService.updatetWarningSetAll(vm.set, function(r){
					toastr.success('设置报警条件成功')
					$('#myModal').modal('hide')
				}, function(e){
					toastr.error('设置报警条件失败')
				})
			}else{
				vm.set.id = vm.update
				httpService.upsertWarningSet(vm.set, function(r){
					toastr.success('更新报警设置成功')
					$('#myModal').modal('hide')
				}, function(e){
					toastr.error('更新报警设置失败')
				})
			}
		}



		vm.app.ready(function(){
			fetchData()
			//vm.fetchSource()
			//fetchDataSource()
			fetchWarnings()
			httpService.getProfile(function(user){
				vm.defaultValue = !user.specify_warn_setting
				vm.message_warn = user.message_warn ? user.message_warn : false
				vm.wechat_warn = user.wechat_warn ? user.wechat_warn : false
				vm.email_warn = user.email_warn ? user.email_warn : false
				vm.app_warn = user.app_warn ? user.app_warn : false
				if(user.warn_phones){
					var phones = user.warn_phones.split(',')
					for(var i=0; i<phones.length; i++){
						if(i==0){
							vm.phone1 = phones[0]
						}
						if(i==1){
							vm.phone2 = phones[1]
						}
						if(i==2){
							vm.phone3 = phones[2]
						}
					}
					if(user.warn_emails) {
						var emails = user.warn_emails.split(',')
						for (var i = 0; i < emails.length; i++) {
							if (i == 0) {
								vm.email1 = emails[0]
							}
							if (i == 1) {
								vm.email2 = emails[1]
							}
							if (i == 2) {
								vm.email3 = emails[2]
							}
						}
					}
				}
			}, function(e){
				console.log(e)
			})
		})

	}

})();