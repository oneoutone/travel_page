(function() {
    'use strict';
    angular
        .module('app')
        .controller('ConsoleCtrl', ConsoleCtrl);
    ConsoleCtrl.$inject = ['$scope', 'httpService'];

    function ConsoleCtrl($scope, httpService) {
        $scope.data = {name:'6'};
        var vm = $scope
        vm.request = {}
        var now = new Date();
        var end = moment(now).startOf('hour').format('YYYY-MM-DD HH:mm:ss')
        var start = moment(now).startOf('hour').subtract(12, 'hours').format('YYYY-MM-DD HH:mm:ss')

        function euroFormatter(v, axis) {
            if(v >= 0){
                return v
            }
            return -v
        }

        httpService.emotion_date({start: start, end: end}, function(result){
            console.log(result)
            var d = result.data
            var ticket = []
            var positive = []
            var middle = []
            var negative = []
            var line = []
            for(var i=0; i<d.length; i++){
                ticket.push([i+1, d[i].result.endtime.substr(11, 5)])
                positive.push([i+1, 0-d[i].result.positive_num])
                negative.push([i+1, d[i].result.negative_num])
                line.push([i+1, 50])
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
                    }
                ], {
                    colors: ['#1b9af9', '#d94b4b', '#CD2626'],
                    series: {shadowSize: 3},
                    legend: {backgroundColor: 'transparent'},
                    xaxis: {show: true, font: {color: '#ccc'}, position: 'bottom', ticks: ticket},
                    yaxis: {show: true, font: {color: '#ccc'} , tickFormatter: euroFormatter},
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
            }
        }, function(err){
            console.log(err)
        });

        httpService.getNotificationList(function(r){
            vm.notifications = r
            console.log(r)
        }, function(err){
            console.log(err)
        })
    }

})();