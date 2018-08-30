import React from 'react';
import swal from 'sweetalert';
import { Link } from 'react-router-dom';
import Loader from '../components/Loader';
import { Public } from '../services/requests';
import { inspect } from '../services/utilities';

export default class Contrib extends React.Component {

    state = {
        mode: 'login',
        loading: true,
        error: null
    }

    componentDidMount() {
        let { history } = this.props;
        Public.check().then((body) => {
            if(body.status) {
                history.push('/panel');
            } else {
                this.setLoading(false);
            }
        });
    }

    setLoading(loading) {
        this.setState({ loading });
    }

    _onSwitch() {
        this.setState({
            mode: this.state.mode === 'login' ? 'register' : 'login'
        });
    }

    _onLogin(e) {
        let { history } = this.props;
        let data = inspect(e.target);
        this.setLoading(true);
        Public.login(data).then((body) => {
            if (body.status) {
                let { token, refreshToken } = body.data;
                localStorage.setItem('accessToken', token);
                localStorage.setItem('refreshToken', refreshToken);
                history.push('/panel');
            } else {
                this.setState({ error: body.message });
                this.setLoading(false);
            }
        });
        e.preventDefault();
        return false;
    }

    _onRegister(e) {
        let data = inspect(e.target);
        let { history } = this.props;
        this.setLoading(true);
        Public.register(data).then((body) => {
            if (body.status) {
                swal("Pendaftaran berhasil!", "Cek inbox email anda untuk verifikasi akun", "success");
            } else {
                this.setState({ error: body.message });
            }
            this.setLoading(false);
        });
        e.preventDefault();
        return false;
    }

    render() {
        let { loading, error } = this.state;
        return (
            (loading) ?
                <Loader text="Menghubungi server.." /> :
                <div className="ct-container">
                    <div className="ui middle aligned center aligned grid">
                        <div className="column">
                            <h2 className="ui image header">
                                <img src={require('../assets/images/logo.png')} className="image" />
                                <div className="content">
                                    Kontribusi di Mikroline
                            </div>
                            </h2>
                            {(this.state.mode === 'login') ? (
                                <form onSubmit={this._onLogin.bind(this)} className="ui large form" method="post">
                                    <div className="ui stacked segment">
                                        <div className="field">
                                            <div className="ui left icon input">
                                                <i className="user icon"></i>
                                                <input ref={(e) => e && e.focus()} type="email" name="email" placeholder="E-mail" required={true}/>
                                            </div>
                                        </div>
                                        <div className="field">
                                            <div className="ui left icon input">
                                                <i className="lock icon"></i>
                                                <input type="password" name="password" placeholder="Password" required={true}/>
                                            </div>
                                        </div>
                                        <button type="submit" className="ui fluid large blue submit button">Masuk</button>
                                        {(error) ? (
                                            <div className="ui negative message transition">
                                                <i className="close icon" onClick={() => this.setState({ error: null })}></i>
                                                <div className="header">
                                                    Login Gagal
                                                </div>
                                                <p>{error}</p>
                                            </div>
                                        ) : null}
                                    </div>
                                </form>
                            ) : (
                                    <form onSubmit={this._onRegister.bind(this)} className="ui large form" method="post">
                                        <div className="ui stacked segment">
                                            <div className="field">
                                                <div className="ui left icon input">
                                                    <i className="address card icon"></i>
                                                    <input type="text" name="name" placeholder="Nama" required={true}/>
                                                </div>
                                            </div>
                                            <div className="field">
                                                <div className="ui left icon input">
                                                    <i className="address card alternate icon"></i>
                                                    <input type="text" name="username" placeholder="Username" required={true}/>
                                                </div>
                                            </div>
                                            <div className="field">
                                                <div className="ui left icon input">
                                                    <i className="user icon"></i>
                                                    <input type="email" name="email" placeholder="E-mail" required={true}/>
                                                </div>
                                            </div>
                                            <div className="field">
                                                <div className="ui left icon input">
                                                    <i className="lock icon"></i>
                                                    <input type="password" name="password" placeholder="Password" required={true}/>
                                                </div>
                                            </div>
                                            <div className="field">
                                                <div className="ui left icon input">
                                                    <i className="lock icon"></i>
                                                    <input type="password" name="rpassword" placeholder="Ketik ulang password" required={true}/>
                                                </div>
                                            </div>
                                            <button type="submit" className="ui fluid large blue submit button">Daftar</button>
                                            {(error) ? (
                                                <div className="ui negative message transition">
                                                    <i className="close icon" onClick={() => this.setState({ error: null })}></i>
                                                    <div className="header">
                                                        Register Gagal
                                                </div>
                                                    <p>{error}</p>
                                                </div>
                                            ) : null}
                                        </div>
                                        <div className="ui error message"></div>
                                    </form>
                                )}
                            <div className="ui message">
                                {(this.state.mode === 'login') ? (
                                    <span>
                                        Belum punya akun? <a onClick={this._onSwitch.bind(this)} href="javascript:void(0)">Mendaftar</a><br />
                                    </span>
                                ) : (
                                        <span>
                                            Sudah punya akun? <a onClick={this._onSwitch.bind(this)} href="javascript:void(0)">Login</a><br />
                                        </span>
                                    )}
                                <Link to="/">Beranda</Link>
                            </div>
                        </div>
                    </div>
                </div>
        );
    }

}