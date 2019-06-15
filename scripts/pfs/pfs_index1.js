(function() {
    'use strict';
    angular
        .module('app')
        .controller('Index1Ctrl', Index1Ctrl);
    Index1Ctrl.$inject = ['$scope', 'httpService'];

    function Index1Ctrl($scope, httpService) {
        var vm = $scope
        vm.header = {name:'1'};
        vm.request = {}
        var now = new Date();
        var end = moment(now).startOf('hour').format('YYYY-MM-DD HH:mm:ss')
        var start = moment(now).startOf('hour').subtract(12, 'hours').format('YYYY-MM-DD HH:mm:ss')

        function euroFormatter(v, axis) {
            if(v >= 0){
                if(v == 10){
                    return '一级'
                }
                if(v == 20){
                    return '二级'
                }
                if(v == 30){
                    return '三级'
                }
                if(v == 40){
                    return '四级'
                }
                if(v == 50){
                    return '五级'
                }
                return v
            }
            return -v
        }

        var sDate = moment(now).startOf('hour').toDate()
        var eDate = moment(now).startOf('hour').subtract(12, 'hours').toDate();
        var end = moment(now).startOf('hour').format('YYYY-MM-DD HH:mm:ss')
        var start = moment(now).startOf('hour').subtract(12, 'hours').format('YYYY-MM-DD HH:mm:ss')
        httpService.emotion_date({start: start, end: end}, function(result){
            console.log(result)
            var posData = result.positive
            var negData = result.negative
            var ticket = []
            var positive = []
            var negative = []
            var line = []
            var line1 = []
            var line2 = []
            for(var s = eDate; s<sDate; s=moment(s).add(1, 'hours').toDate()){
                var dString = moment(s).format('YYYY-MM-DD HH:mm:ss')
                ticket.push([ticket.length+1, dString])
                line.push([ticket.length+1, 50])
                line1.push([ticket.length+1, 90])
                line2.push([ticket.length+1, -90])
                var p0 = posData.filter(function(item){
                    return item.time == dString
                })
                if(p0 && p0.length > 0){
                    positive.push([ticket.length+1, 0-p0[0].count])
                }else{
                    positive.push([ticket.length+1, 0])
                }

                var n0 = negData.filter(function(item){
                    return item.time == dString
                })
                if(n0 && n0.length > 0){
                    negative.push([ticket.length+1, n0[0].count])
                }else{
                    negative.push([ticket.length+1, 0])
                }
            }
            $.plot("#emotion", [
                {
                    data: positive,
                    points: {show: true, radius: 2},
                    splines: {show: true, tension: 0.45, lineWidth: 2, fill: 0}
                },
                {
                    data: negative,
                    points: {show: true, radius: 2},
                    splines: {show: true, tension: 0.45, lineWidth: 2, fill: 0}
                },
                {
                    data: line,
                    points: {show: true, radius: 2},
                    splines: {show: true, tension: 0.45, lineWidth: 2, fill: 0}
                },
                {
                    data: line1,
                    points: {show: false, radius: 2},
                    splines: {show: true, tension: 0.1, lineWidth: 1, fill: 0}
                },
                {
                    data: line2,
                    points: {show: false, radius: 2},
                    splines: {show: true, tension: 0.1, lineWidth: 1, fill: 0}
                },
            ], {
                colors: ['#1b9af9', '#d94b4b', '#CD2626', 'rgba(255,255,255,0)', 'rgba(255,255,255,0)'],
                series: {shadowSize: 3},
                legend: {backgroundColor: 'transparent'},
                xaxis: {show: true, font: {color: '#ccc'}, position: 'bottom', ticks: ticket},
                yaxis: {show: true, font: {color: '#ccc'} ,ticks: [-100, -90, -80, -70, -60, -50, -40, -30, -20, -10, 0, 10, 20,30,40,50,60,70,80,90,100], tickSize: 10,tickFormatter: euroFormatter},
                grid: {
                    hoverable: true,
                    clickable: true,
                    borderWidth: 40,
                    borderColor: 'rgba(255,255,255,0.5)',
                    color: 'rgba(120,120,120,0.5)'
                },
                tooltip: true,
                tooltipOpts: {content: '%y.2', defaultTheme: false, shifts: {x: 0, y: -40}}
            }).draw();
        }, function(err){
            console.log(err)
        });

        httpService.getNotificationList(function(r){
            vm.notifications = r
            console.log(r)
        }, function(err){
            console.log(err)
        })

        httpService.getKeyRequest({status: 'waiting'}, function(result){
            vm.wordCount = result.length
        }, function(e){
            console.log(e)
        })

        httpService.getDataSourceRequestCount({},function(r){
            vm.sourceCount = r.count
        }, function(e){
            console.log(e)
        })
        httpService.adviceCountByUserId(function(r){
            vm.adviceCount = r.count
            console.log('kkksdss')
            console.log(r.count)
        }, function(e){
            console.log(e)
        })
    }

})();