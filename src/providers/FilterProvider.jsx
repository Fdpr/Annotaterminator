import { useImmerReducer } from "use-immer";
import { useContext, createContext } from "react";
import PropTypes from "prop-types";

const FilterContext = createContext(null);
const FilterDispatchContext = createContext(null);

export default function FilterProvider({ children }) {
    const [filter, dispatch] = useImmerReducer(
        filterReducer,
        []
    );

    return (
        <FilterContext.Provider value={filter}>
            <FilterDispatchContext.Provider value={dispatch}>
                {children}
            </FilterDispatchContext.Provider>
        </FilterContext.Provider>
    );
}

FilterProvider.propTypes = {
    children: PropTypes.node,
};

function filterReducer(draft, action) {
    switch (action.type) {
        case 'init': {
            return action.payload.map(col => ({ column: col, terms: [], empty: false, nonEmpty: false }));
        }
        case 'set': {
            const entry = draft.find(e => e.column === action.payload.column);
            if (entry) {
                entry.terms = action.payload.terms;
                entry.empty = action.payload.empty;
                entry.nonEmpty = action.payload.nonEmpty;
            }
            break;
        }
        case "clear": {
            return [];
        }
        default: {
            throw Error('Unknown action: ' + action.type);
        }
    }
}

export function useFilter() {
    return useContext(FilterContext);
}

export function useFilterDispatch() {
    return useContext(FilterDispatchContext);
}