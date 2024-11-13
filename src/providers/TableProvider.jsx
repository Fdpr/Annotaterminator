import { useImmerReducer } from "use-immer";
import { useContext, createContext } from "react";

const TableContext = createContext(null);
const TableDispatchContext = createContext(null);

export default function TableProvider({ children }) {
    const [table, dispatch] = useImmerReducer(
        tableReducer,
        null
    );

    return (
        <TableContext.Provider value={table}>
            <TableDispatchContext.Provider value={dispatch}>
                {children}
            </TableDispatchContext.Provider>
        </TableContext.Provider>
    );
}

function tableReducer(draft, action) {
    switch (action.type) {
        case 'load table': {
            const table = action.table.map((column, index) => ({ row: index, ...column }));
            return { table: table, title: action.title }
        }
        case 'set row': {
            draft.table[action.row] = action.payload;
            break;
        }
        default: {
            throw Error('Unknown action: ' + action.type);
        }
    }
}

export function useTable() {
    return useContext(TableContext);
}

export function useTableDispatch() {
    return useContext(TableDispatchContext);
}