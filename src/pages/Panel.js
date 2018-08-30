import React from 'react';
import ReactMapboxGl, { Layer, Feature, GeoJSONLayer } from 'react-mapbox-gl';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import Map from '../components/Map';
import { Public } from '../services/requests';
import Loader from '../components/Loader';

export default class Panel extends React.Component {

    state = {
        result: null,
        loading: true,
        map_center: [124.8392031, 1.4832755],
        map_zoom: 13,
        map_pitch: 30
    }

    setLoading(loading) {
        this.setState({ loading });
    }

    componentDidMount() {
        let { history } = this.props;
        Public.check().then((body) => {
            if (!body.status) {
                history.push('/contrib');
            } else {
                this.setLoading(false);
            }
        });
    }

    _onLogout() {
        let { history } = this.props;
        Public.logout().then((body) => {
            localStorage.setItem('accessToken', null);
            localStorage.setItem('refreshToken', null);
            history.push('/contrib');
        });
    }

    render() {
        let { loading } = this.state;
        return (
            (loading) ?
                <Loader text="Menghubungi server.." /> :
                <div className="pl-container">
                    <div className="left-sided">
                        <div className="left-header">
                            <div className="ui stacked segment">
                                <div>
                                    <img className="logo" src={require('../assets/images/logo.png')} />
                                </div>
                                <div>
                                    <h2>Mikroline Panel</h2>
                                    <p>Panel kontribusi data Mikroline</p>
                                </div>
                            </div>
                        </div>
                        <div className="left-content">
                        </div>
                        <div className="left-bottom">
                            <div className="ui divider"></div>
                            <p>Copyright &copy; {(new Date()).getFullYear()}, all rights reserved <br />
                                Tagconn Development Team</p>
                            <div className="ui divider"></div>
                        </div>
                    </div>
                    <div className="right-sided">
                        <div className="contain">
                            <div className="menu-container">
                                <a onClick={this._onLogout.bind(this)} className="ui inverted red button"><i className="logout icon"></i> Logout</a>
                            </div>
                            <Map
                                style="mapbox://styles/edgarjeremy/cjl437z2s57vh2ql8zpw6r2vw"
                                center={this.state.map_center}
                                zoom={[this.state.map_zoom]}
                                pitch={[this.state.map_pitch]}
                                // onClick={this._onMapClick.bind(this)}
                                // onStyleLoad={this.mapLoad.bind(this)}
                                // onMove={this.mapUpdate.bind(this)}
                                className="map-container">
                                {(!_.isEmpty(this.state.from) &&
                                    <Layer
                                        type="symbol"
                                        id="marker_from"
                                        layout={{ 'icon-image': 'marker-15' }}>
                                        <Feature
                                            coordinates={[this.state.from.lng, this.state.from.lat]} />
                                    </Layer>)}
                                {(!_.isEmpty(this.state.to) &&
                                    <Layer
                                        type="symbol"
                                        id="marker_to"
                                        layout={{ 'icon-image': 'marker-15' }}>
                                        <Feature
                                            coordinates={[this.state.to.lng, this.state.to.lat]} />
                                    </Layer>)}
                                {(!_.isEmpty(this.state.route_geojson) &&
                                    <GeoJSONLayer
                                        lineOnClick={this._onLineClick.bind(this)}
                                        data={this.state.route_geojson}
                                        lineLayout={{
                                            'line-cap': 'round'
                                        }}
                                        linePaint={{
                                            'line-color': ['get', 'color'],
                                            'line-width': 10,
                                            "line-opacity": 0.6
                                        }} />)}
                            </Map>
                        </div>
                    </div>
                </div>
        );
    }

}