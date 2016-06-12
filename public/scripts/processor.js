(function (ct) {

    function findStepValue(HTML) {
        var startReg = /<span class="title">(.*?)<\/span>/gi;
        var steps = [];
        var match;
        while (( match = startReg.exec(HTML) ) != null) {
            steps.push(match[1]);
        }

        return {
            startValue: steps[0].replace('&amp;', '&'),
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

    function findStoryDetail(HTMLEle){
        var stream = $(HTMLEle).find('#enumeratedpropertydefinition_101_panel input').val();
        var size = $(HTMLEle).find('#enumeratedpropertydefinition_6_panel input').val();
        var own1 = $(HTMLEle).find('#userpropertydefinition_104_panel .property-value-widget').text();
        var own2 = $(HTMLEle).find('#userpropertydefinition_105_panel .property-value-widget').text();
        var completedDate = $(HTMLEle).find('#datepropertydefinition_121_panel input').val();
        return {
            stream: stream,
            size: size,
            own1: own1.trim(),
            own2: own2.trim(),
            completedDate: completedDate
        };
    };

    ct.analyzeDetail = function (details) {
        return $.map(details, function(detail){
            var HTMLElement = $.parseHTML(detail.html);
            var info = findStoryDetail(HTMLElement);

            return {
                id: detail.id,
                stream: info.stream,
                size: info.size,
                own1: info.own1,
                own2: info.own2,
                completedDate: info.completedDate
            };
        });
    };

    ct.mergeDetail = function(data, details){
        function getDetailByNumber(number){
            return $.grep(details, function(e){
               return e.id === number;
            })
        };

        var storiesWithDetail = $.map(data.stories, function (story) {
            var detail = getDetailByNumber(story.number);
            story.detail = detail;
            return story;
        });

        data.stories = storiesWithDetail;
        return data;
    };

})(window.ct = window.ct || {})