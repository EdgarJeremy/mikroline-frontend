import React from 'react';

export default class Loader extends React.Component {

    render() {
        let { text } = this.props;
        return (
            <div className="ld-container">
                <div className="ui active dimmer">
                    <div className="ui large text loader">{text}</div>
                </div>
            </div>
        );
    }

}