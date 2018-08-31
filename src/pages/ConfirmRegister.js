import React from 'react';
import Loader from '../components/Loader';
import swal from 'sweetalert';
import { Public } from '../services/requests';

export default class ConfirmRegister extends React.Component {

    state = {
        loadingText: 'Loading..'
    }

    componentDidMount() {
        let { token } = this.props.match.params;
        setTimeout(() => this.confirm(token), 2000);
    }

    confirm(token) {
        this.setState({ loadingText: 'Memverifikasi token...' });
        Public.confirm_register(token).then((data) => {
            swal('Verifikasi Berhasil', 'Akun anda sudah diverifikasi. Login sekarang untuk memulai', 'success');
            setTimeout(() => this.done(), 2000);
        });
    }

    done() {
        let { history } = this.props;
        this.setState({ loadingText: 'Token berhasil diverifikasi' });
        history.push('/contrib');
    }

    render() {
        let { loadingText } = this.state;
        return (
            <Loader text={loadingText} />
        );
    }

}