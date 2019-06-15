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
        .controller('WaitCtrl', WaitCtrl);
    WaitCtrl.$inject = ['$scope', 'httpService', 'toastr', '$stateParams', '$state'];

    function WaitCtrl($scope, httpService, toastr, $stateParams, $state) {
        var vm = $scope
        vm.header = {name:'8'};
        vm.page1 = 1
        vm.page2 = 1
        vm.types = {"1": '资讯', "3": '政府', "2": '教育'}
        vm.channels = {"1": '网站', "3": '微信', "2": '微博'}
        vm.wordTypes = [{value: 20, label: '行业基础词-机构名称'},
            {value: 10, label: '行业基础词-产品名称'},
            {value: 18, label: '行业基础词-企业名称-景区'},
            {value: 5, label: '行业基础词-企业名称-旅行社'},
            {value: 11, label: '行业基础词-企业名称-星级酒店'},
            {value: 19, label: '行业基础词-企业名称-旅店'},
            {value: 17, label: '行业基础词-企业名称-餐饮'},
            {value: 12, label: '行业基础词-领导姓名'},
            {value: 13, label: '行业基础词-会议会奖'},
            {value: 14, label: '行业基础词-其他'},
            {value: 2, label: '正面词'},
            {value: 1, label: '负面词-敏感'},
            {value: 15, label: '负面词-高危词'},
            {value: 3, label: '特殊关键词'}]

        function fetchData1(){
            var p = {}
            var data = {page: vm.page1, size: 10}
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

        function fetchData2(){
            var data = {page: vm.page2, size: 10}
            httpService.adviceListByUserId(data,function(result){
                console.log(result)
                vm.advices = result
            }, function(e){
                console.log(e)
            })

            httpService.adviceCountByUserId(function(r){
                vm.bigTotalItems2 = r.count
                vm.bigCurrentPage2 = vm.page2
            }, function(e){
                console.log(e)
            })
        }

        vm.pageChanged1 = function(){
            vm.page1 = vm.bigCurrentPage1
            fetchData1()
        }

        vm.pageChanged2 = function(){
            vm.page2 = vm.bigCurrentPage2
            fetchData2()
        }

        vm.dataSourcePass = function(item){
            httpService.updateDataSourceRequestById({id: item.id, status: 'pass'}, function(r){
                toastr.success('通过成功')
                fetchData1()
            }, function(err){
                toastr.error('通过失败')
            })
        }

        vm.dataSourceRefuse = function(item){
            httpService.updateDataSourceRequestById({id: item.id, status: 'refuse'}, function(r){
                toastr.success('拒绝成功')
                fetchData1()
            }, function(err){
                toastr.error('拒绝失败')
            })
        }

        vm.confirmWord = function(){
            httpService.confirmWord(function(r){
                toastr.success('确认添加成功')
            }, function(err){
                toastr.error('确认失败')
            })
        }

        vm.app.ready(function(){
            fetchData1()
            fetchData2()
            httpService.getKeyRequest({status: 'waiting'}, function(result){
                vm.requestkeyWords = result
                for(var i=0; i<vm.requestkeyWords.length; i++){
                    var v = vm.wordTypes.filter(function(item){
                        return item.value = vm.requestkeyWords[i].type
                    })
                    if(v && v.length > 0){
                        vm.requestkeyWords[i].tp = v[0].label
                    }
                }
            }, function(e){
                console.log(e)
            })
        })

    }

})();