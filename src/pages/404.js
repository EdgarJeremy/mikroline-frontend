import React from 'react';
import { Link } from 'react-router-dom';

export default class P404 extends React.Component {

    render() {
        return (
            <div className="nf-container">
                <div className="nf-box">
                    <h1><i className="blind icon"></i> Tersesat?</h1>
                    <p>Tenang, itu hal yang biasa. Yang penting apakah bisa kembali ke jalan yang benar atau tidak :)</p>
                    <Link to="/" className="ui button blue"><i className="home icon"></i> Kembali ke jalan yang benar</Link>
                    <button className="ui button red"><i className="eye icon"></i> Tetap di jalan setan</button>
                </div>
            </div>
        );
    }

}