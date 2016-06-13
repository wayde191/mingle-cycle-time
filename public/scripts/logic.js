/** --content
 *    --menu
 *    --tool
 *      --actions
 *      --
 */
var Report = React.createClass({
    render: function() {
        var stories = '';
        var totalSize = 0, totalDuration = 0, averagePointSpent = 0;
        var cycleTime = '', averageCT = 0.00;
        var streams = '', streamArr = [];

        function findStreamByName(name){
            return $.grep(streamArr, function(e){
                return e.name === name;
            });
        };

        function countStream(name, size){
            var theTypeEle = findStreamByName(name);
            if(theTypeEle !== undefined && theTypeEle.length > 0){
                theTypeEle[0].size += size;
            } else {
                streamArr.push({name: name, size: size});
            }
        };

        if (this.props.data.constructor != Array) {
            stories = this.props.data.stories.map(function(story) {
                story.detail = story.detail || [{size: 0, stream: 'empty'}];

                return (
                    <tr>
                        <td><a href={story.link} target='_blank'>{story.number}</a></td>
                        <td>{story.detail[0].size}</td>
                        <td>{story.duration} days</td>
                        <td>{story.detail[0].stream}</td>
                    </tr>
                );
            });

            $.each(this.props.data.stories, function(index, story){
                story.detail = story.detail || [{size: 0, stream: 'empty'}];
                countStream(story.detail[0].stream, parseInt(story.detail[0].size));

                totalDuration += parseFloat(story.duration);
                totalSize += parseInt(story.detail[0].size);
                if(totalSize > 0) {
                    averagePointSpent = totalDuration / totalSize;
                }
            });

            streams = streamArr.map(function(stream) {
                return (
                    <tr>
                        <th>{stream.name}</th>
                        <td>{stream.size}</td>
                    </tr>
                );
            });

            cycleTime = this.props.data.summary.stage.map(function(stage){
                averageCT += parseFloat(stage.value);
                return (
                    <tr>
                        <th>{stage.name}</th>
                        <td>{stage.value}</td>
                    </tr>
                );
            });
            averageCT = averageCT.toFixed(2);
        }

        return (
            <div className="report">
                <h3>Report: {this.props.data.name}</h3>
                <span>*Name: </span><input id="name" type='text'/>
                <span>  </span>
                <span>*Dev Pair: </span><input id="pair" type='text'/>
                <div>
                    <table id="report-table">
                        <tr>
                            <th>Story</th>
                            <th>Size</th>
                            <th>Actual</th>
                            <th>Stream</th>
                        </tr>
                        {stories}
                    </table>
                    <table id="report-table">
                        <tr>
                            <th>Stream</th>
                            <th>Total Size</th>
                        </tr>
                        {streams}
                    </table>

                    <table id="report-table">
                        <tr>
                            <th>完成点数</th>
                            <th>总耗费时间</th>
                            <th>平均点耗</th>
                        </tr>
                        <tr>
                            <td>{totalSize}</td>
                            <td>{totalDuration} 天</td>
                            <td>{averagePointSpent}</td>
                        </tr>
                    </table>
                    <table id="report-table">
                        {cycleTime}
                        <tr>
                            <th>总CT</th>
                            <td>{averageCT}</td>
                        </tr>
                    </table>
                </div>
            </div>
        );
    }
});

var Summary = React.createClass({
    render: function() {
        var startValue = '', endValue = '', total = '', nodes = [];
        if (this.props.data.constructor != Array) {
            startValue = this.props.data.steps.startValue;
            endValue = this.props.data.steps.endValue;
            total = this.props.data.summary.total;

            nodes = this.props.data.summary.stage.map(function(stage) {
                return (
                    <li>
                        {stage.name + ' : ' + stage.value}
                    </li>
                );
            });
        }

        return (
            <div className="Summary">
                <span>from: </span>
                <strong>{startValue}</strong>
                <span> to: </span>
                <strong>{endValue}</strong>
                <p>Total: {total}</p>
                <ul>
                    {nodes}
                </ul>
            </div>
        );
    }
});

var Cycles = React.createClass({
    render: function() {
        function getStages(stages){
            return stages.map(function(stage) {
                return (
                    <li>
                        {stage.name + ' : ' + stage.value}
                    </li>
                );
            });
        };

        function getCycles(cycles){
            return cycles.map(function(cycle) {
                var nodes = getStages(cycle.stage);
                var detail = {};
                if (cycle.detail && cycle.detail.length > 0){
                    detail = cycle.detail[0];
                }

                return (
                    <div>
                        <a href={cycle.link} target='_blank'>{cycle.number}</a>
                        <span>:   <strong>{cycle.duration}</strong> days:  </span>
                        <span>{cycle.name}</span>

                        <div>
                            <span><strong>Stream</strong>: {detail.stream}</span>
                            <span>  </span>
                            <span><strong>Size</strong>: {detail.size}</span>
                            <span>  </span>
                            <span><strong>Own1</strong>: {detail.own1}</span>
                            <span>  </span>
                            <span><strong>Own2</strong>: {detail.own2}</span>
                            <span>  </span>
                            <span><strong>Completed Date</strong>: {detail.completedDate}</span>
                            <span>  </span>
                        </div>

                        <ul>{nodes}</ul>

                        <div id="detail-editor">
                            <textarea id={cycle.number} name="textarea" rows="10" cols="50" defaultValue="2: Input static story HTML source here"></textarea>
                        </div>
                    </div>
                );
            });
        };

        var cycles = '';
        if (this.props.data.constructor != Array) {
            cycles = getCycles(this.props.data.stories);
        }

        return (
            <div className="Cycles">
                {cycles}
            </div>
        );
    }
});

var Tool = React.createClass({
    getInitialState: function() {
        return {data: []};
    },
    componentDidMount: function () {
        $('#analyse-detail-button').click(function () {
            var detailTextArea = $('#detail-editor textarea');
            var details = $.map(detailTextArea, function(textarea) {
                var key = $(textarea).attr('id');
                var value = $(textarea).val();
                return {
                    id: key,
                    html: value
                };
            });
            var storyDetail = ct.analyzeDetail(details);
            var mergedData = ct.mergeDetail(this.state.data, storyDetail);

            this.setState({data: mergedData}, null);
            this.props.onReportUpdate(mergedData);
        }.bind(this));

        $('#analyse-button').click(function(){
            var htmlSourceStr = $('#editor textarea:first').val();
            var result = ct.analyze(htmlSourceStr);

            this.setState({data: result}, null);
            this.props.onReportUpdate(result);
        }.bind(this));

        $('#save-button').click(function(){
            var paras = {data: this.state.data};
            var reportName = $('input#name').val();
            var pairNumber = $('input#pair').val();
            if(!reportName || !pairNumber){
                alert('Report Name and Dev Pair are required.');
                return;
            }

            paras.reportName = reportName;
            paras.pairNumber = pairNumber;
            this.props.onReportSubmit(paras);
        }.bind(this));
    },
    render: function () {
        return (
            <div id="tool">
                <h2>Tool</h2>
                <button id="analyse-button">1: Analyse</button>
                <button id="analyse-detail-button">2: Analyse Detail</button>
                <button id="save-button">3: Save Report</button>

                <div id="editor">
                    <textarea name="textarea" rows="10" cols="50" defaultValue="1: Input static mingle cycle time HTML source here"></textarea>
                </div>
                <div id="result">
                    <h3>Analyse Result:</h3>
                    <Summary data={this.state.data} />
                    <Cycles data={this.state.data} />
                </div>

            </div>
        );
    }
});

var Menu = React.createClass({
    handleClick: function(report){
        this.props.onMenuItemClicked(report);
    },
    render: function () {
        var reports = ct.sortById(this.props.data).map(function(report) {
            return (
                <li>
                    <a id={report.id} href='#'
                       onClick={this.handleClick.bind(this, report)}>
                        {report.name} - {report.pair}
                    </a>
                </li>
            );
        }.bind(this));

        return (
            <div id="menu">
                <h2>Menu</h2>
                <ul>{reports}</ul>
            </div>
        );
    }
});

var CTBox = React.createClass({
    handleReportSubmit: function (report) {
        ct.saveReport(report, function(data){
            this.setState({menu: data}, null);
        }.bind(this));
    },
    handleReportUpdate: function (report) {
        this.setState({data:report}, null);
    },
    handleMenuItemClicked: function (report) {
        var reportData = JSON.parse(report.data);
        reportData.name = report.name;
        reportData.id = report.id;
        reportData.pair = report.pair;
        this.setState({data:reportData}, null);
    },
    getInitialState: function () {
        return {data: [], menu: []};
    },
    componentDidMount: function () {
        ct.getReport(function(data){
            this.setState({menu: data}, null);
        }.bind(this));
    },
    render: function () {
        return (
            <div className="CTBox">
                <h1>Sales Funnel Cycle Time</h1>
                <div id="report">
                    <Report data={this.state.data} />
                </div>
                <Menu data={this.state.menu}
                      onMenuItemClicked={this.handleMenuItemClicked}/>
                <Tool onReportSubmit={this.handleReportSubmit}
                      onReportUpdate={this.handleReportUpdate}/>
            </div>
        );
    }
});

ReactDOM.render(
    <CTBox />,
    document.getElementById('content')
);