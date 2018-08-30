import React from 'react';
import Loader from '../components/Loader';

export default class ConfirmRegister extends React.Component {

    state = {
        loadingText: 'Memverifikasi token..'
    }

    componentDidMount()  {
        
    }

    render() {
        let { loadingText } = this.state;
        return (
            <Loader text={loadingText}/>
        );
    }

}