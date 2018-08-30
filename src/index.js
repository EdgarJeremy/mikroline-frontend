import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter, Switch, Route } from 'react-router-dom';
import routes from './routes';
import registerServiceWorker from './registerServiceWorker';
import P404 from './pages/404';
import './assets/css/App.css';

const Routes = (
    <HashRouter>
        <Switch>
            {routes.map((route, i) => (
                <Route key={i} {...route} />
            ))}
            <Route component={P404} path="*" />
        </Switch>
    </HashRouter>
);

ReactDOM.render(Routes, document.getElementById('root'));
registerServiceWorker();
