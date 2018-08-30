import React, { Component } from 'react';
import ReactMapboxGl, { Layer, Feature, GeoJSONLayer } from 'react-mapbox-gl';
import { Link } from 'react-router-dom';
import axios from 'axios';
import _ from 'lodash';

const Map = ReactMapboxGl({
	accessToken: 'pk.eyJ1IjoiZWRnYXJqZXJlbXkiLCJhIjoiY2psM25nenhmMjMwYzN2cWs1NDdpeXZyMCJ9.T-PUQmpNdO3cMRGeMtfzQQ'
});

const req = axios.create({
	baseURL: 'http://172.10.10.253:8081/api'
});

class Home extends Component {

	state = {
		from: {},
		to: {},
		select_mode: null,
		route_geojson: null,
		route_list: [],
		map_center: [124.8392031, 1.4832755],
		map_zoom: 13,
		map_pitch: 30,
		done: false
	}

	_onChoose(mode) {
		const { select_mode } = this.state;
		let new_mode = null;
		if (select_mode !== mode) {
			new_mode = mode;
		}
		this.setState({ select_mode: new_mode });
	}

	_onMapClick(map, e) {
		if (this.state.select_mode !== null) {
			this.setState({
				[this.state.select_mode]: {
					lat: e.lngLat.lat,
					lng: e.lngLat.lng
				}
			});
		}
	}

	_onLineClick(e) {
		console.log(e.features);
		e.features[0].layer.paint['line-opacity'] = 1;
	}

	mapLoad(map) {
		this.map = map;
	}

	loadRoute() {
		let { lat: from_lat, lng: from_lng } = this.state.from;
		let { lat: to_lat, lng: to_lng } = this.state.to;

		req.get(`/tracks?from_latitude=${from_lat}&from_longitude=${from_lng}&to_latitude=${to_lat}&to_longitude=${to_lng}`)
			.then((res) => res.data)
			.then((data) => {
				this.setState({
					route_geojson: data.data.geojson,
					route_list: data.data.route,
					done: true
				});
			});
	}

	mapUpdate(map, e) {
		let center = map.getCenter();
		let zoom = map.getZoom();
		let pitch = map.getPitch();
		this.setState({
			map_center: [center.lng, center.lat],
			map_zoom: zoom,
			map_pitch: pitch
		});
	}

	onConfirm() {
		this.setState({
			select_mode: null
		}, () => {
			if (!_.isEmpty(this.state.from) && !_.isEmpty(this.state.to)) {
				this.loadRoute();
			}
		});
	}

	render() {
		return (
			<div className="main-app">
				<div className="left-sided">
					<div className="left-header">
						<div className="ui stacked segment">
							<div>
								<img className="logo" src={require('../assets/images/logo.png')} />
							</div>
							<div>
								<h2>Mikroline</h2>
								<p>Pencarian jalur mikrolet kota Manado</p>
							</div>
						</div>
					</div>
					<div className="left-content">
						<div className={`left-overlay ${this.state.select_mode !== null ? 'show' : 'hide'}`}></div>
						<h4 className="ui horizontal divider header">
							<i className="search icon"></i>
							Cari Data
						</h4>
						<div className="ui icon input fluid">
							<input type="text" placeholder="Cari trayek..." />
							<i className="circular search link icon"></i>
						</div>
						<h4 className="ui horizontal divider header">
							<i className="location arrow icon"></i>
							Set rute
						</h4>
						<div className={`ui right labeled left icon input fluid ${this.state.select_mode === 'from' ? 'raise' : ''}`}>
							<i className="map marker icon"></i>
							<input readOnly={true} value={(!_.isEmpty(this.state.from) ? `${this.state.from.lng}, ${this.state.from.lat}` : '')} type="text" placeholder="Titik awal" />
							<a className={`ui tag label ${this.state.select_mode === 'from' ? 'blue' : ''}`} onClick={() => this._onChoose('from')}>
								PILIH
							</a>
						</div>
						<hr className="ui divider" style={{ margin: '5px 0' }} />
						<div className={`ui right labeled left icon input fluid ${this.state.select_mode === 'to' ? 'raise' : ''}`}>
							<i className="map marker icon"></i>
							<input readOnly={true} value={(!_.isEmpty(this.state.to) ? `${this.state.to.lng}, ${this.state.to.lat}` : '')} type="text" placeholder="Tujuan" />
							<a className={`ui tag label ${this.state.select_mode === 'to' ? 'blue' : ''}`} onClick={() => this._onChoose('to')}>
								PILIH
							</a>
						</div>
						<h4 className="ui horizontal divider header">
							<i className="align center icon"></i>
							Detail rute
						</h4>
						{((!this.state.done) ?
							<div className="ui icon message">
								<i className="blind icon"></i>
								<div className="content">
									<div className="header">
										Rute belum ditentukan
									</div>
									<p>Pilih titik awal dan tujuan</p>
								</div>
							</div> :
							<div className="list-routes">
								<div className="ui middle aligned divided list">
									{(this.state.route_list.length > 0) ? (
										<div>
											{this.state.route_list.map((route, i) => (
												<div className="item" key={i}>
													<div className="right floated content">
														<div className="ui button">Rute</div>
													</div>
													<div className="content">
														<h4 className="header">{route.name}</h4>
														<div className="description">
															<a className="ui label black"><i className="ui money bill icon"></i> Rp.4000</a>
														</div>
													</div>
												</div>
											))}
										</div>)
										:
										(<div className="ui icon message">
											<i className="blind icon"></i>
											<div className="content">
												<div className="header">
													Rute tidak ditemukan
												</div>
												<p>Jalur mikrolet tidak ditemukan berdasarkan titik pilihan</p>
											</div>
										</div>)
									}
								</div>
							</div>
						)}
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
						{this.state.select_mode === 'from' ?
							<div className="hint">
								<h2><i className="map marker icon"></i> Pilih titik awal</h2>
								<p>Klik area pada map untuk memilih titik awal</p>
							</div>
							: (this.state.select_mode == 'to' ?
								<div className="hint">
									<h2><i className="map marker icon"></i> Pilih titik tujuan</h2>
									<p>Klik area pada map untuk memilih titik tujuan</p>
								</div> : null)}

						{this.state.select_mode !== null ?
							<div className="confirm-container">
								<button className="ui button green" onClick={this.onConfirm.bind(this)} disabled={_.isEmpty(this.state[this.state.select_mode])}>Konfirmasi</button>
							</div> : null}

						<div className="menu-container">
							<Link to="/contrib" className="ui inverted primary button"><i className="handshake icon"></i> Kontribusi</Link>
						</div>

						<Map
							style="mapbox://styles/edgarjeremy/cjl437z2s57vh2ql8zpw6r2vw"
							center={this.state.map_center}
							zoom={[this.state.map_zoom]}
							pitch={[this.state.map_pitch]}
							onClick={this._onMapClick.bind(this)}
							onStyleLoad={this.mapLoad.bind(this)}
							onMove={this.mapUpdate.bind(this)}
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

export default Home;
