(function (ct) {

    function findStepValue(HTML) {
        var startReg = /<span class="title">(.*?)<\/span>/gi;
        var steps = [];
        var match;
        while (( match = startReg.exec(HTML) ) != null) {
            steps.push(match[1]);
        }

        return {
            startValue: steps[0],
            endValue: steps[1]
        }
    };

    function findSummary(HTMLEle) {
        var summaryTable = $(HTMLEle).find('.summary');
        var completedStories = $(summaryTable).find('.number-big').text();
        var stages = $(summaryTable).find('.stage-bar');
        var stagesDetail = [];
        $.each(stages, function(index, value){
            var stageName = $(value).find('title').text();
            var stageValue = $(value).find('text:last').text();
            stagesDetail.push({name: stageName, value: stageValue});
        });
        console.log(stagesDetail);
    };

    ct.analyze = function (HTML) {
        var steps = findStepValue(HTML);

        var HTMLElement = $.parseHTML(HTML);
        var summary = findSummary(HTMLElement);
        console.log(steps);

    };
})(window.ct = window.ct || {})