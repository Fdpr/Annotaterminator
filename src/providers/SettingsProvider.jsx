import { useImmerReducer } from "use-immer";
import { useContext, createContext, useEffect } from "react";
import PropTypes from "prop-types";

const initialState = JSON.parse(localStorage.getItem('settings')) || {
    theme: "light",
    preRows: 0,
    postRows: 0,
    break: false
};

const SettingsContext = createContext(null);
const SettingsDispatchContext = createContext(null);

export default function SettingsProvider({ children }) {
    const [settings, dispatch] = useImmerReducer(
        settingsReducer,
        initialState
    );

    useEffect(() => {
        localStorage.setItem("settings", JSON.stringify(settings))
    }, [settings])

    return (
        <SettingsContext.Provider value={settings}>
            <SettingsDispatchContext.Provider value={dispatch}>
                {children}
            </SettingsDispatchContext.Provider>
        </SettingsContext.Provider>
    );
}

SettingsProvider.propTypes = {
    children: PropTypes.node,
};

function settingsReducer(draft, action) {
    switch (action.type) {
        case 'theme': {
            draft.theme = action.payload
            break
        }
        case 'preRows': {
            draft.preRows = Number.parseInt(action.payload)
            break
        }
        case 'postRows': {
            draft.postRows = Number.parseInt(action.payload)
            break
        }
        case "break": {
            draft.break = action.payload
            break;
        }
        default: {
            throw Error('Unknown action: ' + action.type);
        }
    }
}

export function useSettings() {
    return useContext(SettingsContext);
}

export function useSettingsDispatch() {
    return useContext(SettingsDispatchContext);
}