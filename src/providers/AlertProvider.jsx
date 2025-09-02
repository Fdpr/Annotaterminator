import { createContext, useState, useContext } from 'react';
import PropTypes from 'prop-types';

const initialState = {
    text: '',
    type: '',
    header: '',
    modal: {},
    dismiss: 0
};

export const AlertContext = createContext({
    ...initialState,
    setAlert: () => {},
});

export const useAlert = () => useContext(AlertContext);

const AlertProvider = ({ children }) => {
    const [text, setText] = useState('');
    const [type, setType] = useState('');
    const [header, setHeader] = useState('');
    const [modal, setModal] = useState({});
    const [dismiss, setDismiss] = useState(0);

    const setAlert = (text, type, header, modal, dismiss) => {
        setText(text);
        setType(type);
        setHeader(header);
        setModal(modal);
        setDismiss(dismiss);
    }

    return (
        <AlertContext.Provider
            value={{
                text,
                type,
                header,
                modal,
                dismiss,
                setAlert,
            }}
        >
            {children}
        </AlertContext.Provider>
    );
};

AlertProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export default AlertProvider;