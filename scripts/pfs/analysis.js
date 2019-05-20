(function() {
    'use strict';
    angular
        .module('app')
        .controller('AnalysisCtrl', AnalysisCtrl);
    AnalysisCtrl.$inject = ['$scope', 'httpService'];

    function AnalysisCtrl($scope, httpService) {

        var vm = $scope
        vm.value2 = 1
       vm.check1 = function(){
            httpService.analysis({content: vm.content1}, function(r){
                console.log(r)
                var rs = r.data.split('key_words:')
                console.log(rs)
                vm.value1 = rs[1]
            }, function(e){
                console.log(e)
           })
       }

        vm.check2 = function(){
            httpService.analysis({content: vm.content2}, function(r){
                console.log(r)
                var rs = r.data.split('key_words:')
                console.log(rs)
                vm.value2 = parseFloat(rs[2].replace(',', ''))
                console.log(vm.value2)
            }, function(e){
                console.log(e)
            })
        }

        httpService.history_data(function(result){
            console.log(result)
            vm.all = result.history_website_num +result.history_wechat_num + result.history_weibo_num +4000000
            httpService.words({type: '0'}, function(r){
                vm.wordNumber = r.allnum+4000000
                vm.parseNum = vm.all + r.allnum+153
            }, function(e){
                console.log(e)
            })
        }, function(err){
            console.log(err)
        })



        $('#input1').prop("disabled",false).css("backgroundColor","white");
        $('#input2').prop("disabled",false).css("backgroundColor","white");
        $('#input3').prop("disabled",false).css("backgroundColor","white");
        $('#input4').prop("disabled",false).css("backgroundColor","white");
        $('#input5').prop("disabled",false).css("backgroundColor","white");
    }

})();