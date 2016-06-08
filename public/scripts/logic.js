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

var Tool = React.createClass({
    componentDidMount: function () {
        $('#analyse-button').click(function(){
            var htmlSourceStr = $('#editor textarea:first').val();
            var result = ct.analyze(htmlSourceStr);
        });
    },
    render: function () {
        return (
            <div id="tool">
                <h2>Tool</h2>
                <button id="analyse-button">analyse</button>
                <button id="save-button">save</button>

                <div id="editor">
                    <textarea name="textarea" rows="10" cols="50" defaultValue="Input static mingle cycle time HTML source here"></textarea>
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