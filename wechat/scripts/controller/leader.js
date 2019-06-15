(function() {
    angular
        .module('app')
        .controller('LeaderCtrl', LeaderCtrl);

    LeaderCtrl.$inject = ['$scope', 'httpService'];

    function LeaderCtrl ($scope, httpService) {

        var vm = $scope

        console.log($(document).height())
        console.log($(window).height())
        var css = {height: $(window).height()*0.8 +'px'}
        $('#emotion').css(css)
        $('#loadingToast').fadeIn(100)

        var now = new Date();
        var end = moment(now).startOf('hour').format('YYYY-MM-DD HH:mm:ss')
        var start = moment(now).startOf('hour').subtract(12, 'hours').format('YYYY-MM-DD HH:mm:ss')
        var eDate = moment(now).startOf('hour').subtract(12, 'hours').toDate()
        var sDate = moment(now).startOf('hour').toDate()
        httpService.leader_date({start: start, end: end}, function(result){
            console.log(result)
            $('#loadingToast').fadeOut(100)
            var posData = result.positive
            var negData = result.negative
            var ticket = []
            var positive = []
            var negative = []
            var line = []
            var line1 = []
            var line2 = []
            var maxP = 0
            var maxN = 0
            for(var s = eDate; s<sDate; s=moment(s).add(1, 'hours').toDate()) {
                var dString = moment(s).format('YYYY-MM-DD HH:mm:ss')
                ticket.push([ticket.length + 1, dString])
                line.push([ticket.length + 1, 50])
                line1.push([ticket.length + 1, 90])
                line2.push([ticket.length + 1, -90])
                var p0 = posData.filter(function (item) {
                    return item.time == dString
                })
                if (p0 && p0.length > 0) {
                    positive.push([ticket.length + 1, p0[0].count > 99 ? -99 : 0 - p0[0].count])
                    if (maxP < p0[0].count ) {
                        maxP = p0[0].count
                    }
                } else {
                    positive.push([ticket.length + 1, 0])
                }

                var n0 = negData.filter(function (item) {
                    return item.time == dString
                })
                if (n0 && n0.length > 0) {
                    negative.push([ticket.length + 1, n0[0].count > 99 ? 99 : n0[0].count])
                    if (maxN < n0[0].count) {
                        maxN = n0[0].count
                    }
                } else {
                    negative.push([ticket.length + 1, 0])
                }

            }
            if(maxP > 99){
                maxP =99
            }
            if(maxN > 99){
                maxN = 99
            }

            var bks = []
            var bks1 = []
            var bks2 = []
            for(var i=100; i>0; i--){
                if(maxN < i){
                    bks.push('rgba(255,0,0,0)')
                }else{
                    bks.push('rgba(255,0,0,'+i*0.01+')')
                }

                if(maxN < i){
                    bks2.push('rgba(255,0,0,'+i*0.01+')')
                }else{
                    bks2.push('rgba(255,0,0,0)')
                }
            }
            bks.push('rgba(255,255,255,0)')
            for(var i=1; i<=100; i++){
                if(maxP < i){
                    bks.push('rgba(0,139,0,0)')
                }else{
                    bks.push('rgba(0,139,0,'+i*0.01+')')
                }

                if(maxP < i){
                    bks1.push('rgba(0,139,0,'+i*0.01+')')
                }else{
                    bks1.push('rgba(0,139,0,0)')
                }

            }
            console.log(maxP)
            console.log(maxN)
            console.log(bks)
            console.log(positive)
            console.log(negative)

            function euroFormatter(v, axis) {
                if(v >= 0){
                    return v
                }
                return -v
            }
            $.plot("#emotion", [
                {
                    data: positive,
                    points: {show: false, radius: 2},
                    splines: {show: true, tension: 0.1, lineWidth: 1, fill: 0}
                },
                {
                    data: negative,
                    points: {show: false, radius: 2},
                    splines: {show: true, tension: 0.1, lineWidth: 1, fill: 0}
                },
                {
                    data: line,
                    points: {show: false, radius: 2},
                    splines: {show: true, tension: 0.1, lineWidth: 1, fill: 0}
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
                { data: [[1,100], [2,0], [3,0], [4,0], [5,0], [6,0], [7,0],[8,0], [9,0],[10,0],[11,0],[12,0]],
                    bars: { show: true, barWidth: 1, lineWidth: 0, fillColor: { colors: bks2 } }
                },
                { data: [[1,-100], [2,0], [3,0], [4,0], [5,0], [6,0], [7,0],[8,0], [9,0],[10,0],[11,0],[12,0]],
                    bars: { show: true, barWidth: 1, lineWidth: 0, fillColor: { colors: bks1 }}
                }

            ], {
                colors: ['#1b9af9', '#d94b4b', '#d94b4b', 'rgba(255,255,255,0)', 'rgba(255,255,255,0)'],
                series: {shadowSize: 3},
                legend: {backgroundColor: 'transparent'},
                xaxis: {show: true, font: {color: '#ccc'}, position: 'bottom', ticks: ticket},
                yaxis: {show: true, font: {color: '#ccc'}, position: 'left', lineWidth: 1, min: -100, max: 100, tickFormatter: euroFormatter},
                grid: {
                    aboveData:false,
                    backgroundColor: { colors: bks },
                    hoverable: true,
                    clickable: true,
                    borderWidth: {top: 0, bottom: 1, left: 1, right: 0},
                    borderColor: 'rgba(0,0,0,0.5)',
                    color: 'rgba(120,120,120,0.5)'
                },
                tooltip: true,
                tooltipOpts: {content: '%y.2', defaultTheme: false, shifts: {x: 0, y: -40}}
            }).draw();
        }, function(err){
            console.log(err)
            $('#loadingToast').fadeOut(100)
        })


    }
})();
