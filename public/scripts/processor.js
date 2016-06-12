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

    function getStagesDetail(ele){
        var stages = $(ele).find('.stage-bar');
        var stagesDetail = [];
        $.each(stages, function(index, value){
            var stageName = $(value).find('title').text();
            var stageValue = $(value).find('text:last').text().replace(' days', '');
            stagesDetail.push({name: stageName, value: stageValue});
        });
        return stagesDetail;
    };

    function findSummary(HTMLEle) {
        var summaryTable = $(HTMLEle).find('.summary');
        var completedStories = $(summaryTable).find('.number-big').text();

        return {total: completedStories, stage: getStagesDetail($(summaryTable))};
    };

    function getCardDetailInfoByLink(link){
        $.ajax({
            url: link,
            success: function (result) {
                if (result.isOk == false) {
                    console.log(result.message);
                };
            },
            async: false
        });
    };

    function findStories(HTMLEle){
        var storiesTable = $(HTMLEle).find('.stories');
        var stories = $(storiesTable).find('.cycle');

        var cycles = [];
        $.each(stories, function(index, value){
            var link = $(value).find('.card-number a').attr('href');
            //var detail = getCardDetailInfoByLink(link);
            var number = $(value).find('.card-number a').text();
            var name = $(value).find('.card-name').text();
            var duration = $(value).find('.duration').text().replace(' days', '');
            var stage = getStagesDetail($(value).find('.breakdown'));

            cycles.push({
                link: link,
                number: number,
                name: name,
                duration: duration,
                stage: stage
            });
        });

        return cycles;
    };

    ct.analyze = function (HTML) {
        var steps = findStepValue(HTML);

        var HTMLElement = $.parseHTML(HTML);
        var summary = findSummary(HTMLElement);
        var stories = findStories(HTMLElement);

        return {
            steps: steps,
            summary: summary,
            stories: stories
        };

    };
})(window.ct = window.ct || {})