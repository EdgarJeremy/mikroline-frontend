import Home from "./pages/Home";
import Contrib from "./pages/Contrib";
import ConfirmRegister from "./pages/ConfirmRegister";
import Panel from "./pages/Panel";

export default [
    { path: '/', exact: true, component: Home },
    { path: '/contrib', exact: true, component: Contrib },
    { path: '/confirm_register/:token', exact: true, component: ConfirmRegister },
    { path: '/panel', exact: true, component: Panel }
];