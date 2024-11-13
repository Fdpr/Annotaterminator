import { createContext, useState, useContext } from 'react';

const initialState = {
    text: '',
    type: '',
    header: '',
    modal: {}
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

    const setAlert = (text, type, header, modal) => {
        setText(text);
        setType(type);
        setHeader(header);
        setModal(modal);
    }

    return (
        <AlertContext.Provider
            value={{
                text,
                type,
                header,
                modal,
                setAlert,
            }}
        >
            {children}
        </AlertContext.Provider>
    );
};

export default AlertProvider;