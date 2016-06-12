/** --content
 *    --menu
 *    --tool
 *      --actions
 *      --
 */

var Menu = React.createClass({
    render: function () {
        return (
            <div id="menu">
                <h2>Menu</h2>
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
                return (
                    <div>
                        <a href={cycle.link} target='_blank'>{cycle.number}</a>
                        <span>:   <strong>{cycle.duration}</strong> days:  </span>
                        <span>{cycle.name}</span>
                        <ul>{nodes}</ul>

                        <div id="detail-editor">
                            <textarea index={cycle.number} name="textarea" rows="10" cols="50" defaultValue="Input static story HTML source here"></textarea>
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
        $('#initial').click(function () {
        });
        
        $('#analyse-button').click(function(){
            var htmlSourceStr = $('#editor textarea:first').val();
            var result = ct.analyze(htmlSourceStr);
            this.setState({data: result}, null);
        }.bind(this));
    },
    render: function () {
        return (
            <div id="tool">
                <h2>Tool</h2>
                <button id="analyse-button">analyse</button>
                <button id="initial">initial</button>
                <button id="save-button">save</button>

                <div id="editor">
                    <textarea name="textarea" rows="10" cols="50" defaultValue="Input static mingle cycle time HTML source here"></textarea>
                </div>
                <div id="result">
                    <h3>Result:</h3>
                    <Summary data={this.state.data} />
                    <Cycles data={this.state.data} />
                </div>

            </div>
        );
    }
});

var CTBox = React.createClass({
    loadCommentsFromServer: function () {
    },
    handleCommentSubmit: function (comment) {
    },
    getInitialState: function () {
        return {data: []};
    },
    componentDidMount: function () {
    },
    render: function () {
        return (
            <div className="CTBox">
                <h1>Sales Funnel Cycle Time</h1>
                <Menu data={this.state.data}/>
                <Tool onCommentSubmit={this.handleCommentSubmit}/>
            </div>
        );
    }
});

ReactDOM.render(
    <CTBox />,
    document.getElementById('content')
);