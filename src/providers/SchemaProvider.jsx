import { useImmerReducer } from "use-immer";
import { useContext, createContext } from "react";
import { v4 as uuid } from "uuid";
import PropTypes from "prop-types";

const SchemaContext = createContext(null);
const SchemaDispatchContext = createContext(null);

export default function SchemaProvider({ children }) {
    const [schema, dispatch] = useImmerReducer(schemaReducer, null);

    return (
        <SchemaContext.Provider value={schema}>
            <SchemaDispatchContext.Provider value={dispatch}>
                {children}
            </SchemaDispatchContext.Provider>
        </SchemaContext.Provider>
    );
}

SchemaProvider.propTypes = {
    children: PropTypes.node.isRequired,
};


function schemaReducer(draft, action) {
    switch (action.type) {
        case 'load': {
            return action.payload
        }
        case 'new': {
            return {
                name: "",
                columns: [],
                break: 0
            }
        }
        case "clear": {
            return null;
        }
        case "add column": {
            draft.columns.push({
                name: "",
                displayName: "",
                editable: false,
                validate: false,
                allowedChoices: [],
                force: false,
                id: uuid(),
            })
            break;
        }
        case "set column": {
            draft.columns[action.index] = action.payload;
            break;
        }
        case "update column": {
            draft.columns[action.index][action.payload.key] = action.payload.value;
            break;
        }
        case "remove column": {
            draft.columns = draft.columns.filter((item, index) => index !== action.index);
            break;
        }
        case "move column": {
            if ((action.payload === "up" && action.index === 0) || (action.payload === "down" && action.index === draft.columns.length - 1)) break;
            if (action.payload === "up") {
                const placeholder = draft.columns[action.index - 1];
                draft.columns[action.index - 1] = draft.columns[action.index];
                draft.columns[action.index] = placeholder;
                break;
            } else if (action.payload === "down") {
                const placeholder = draft.columns[action.index + 1];
                draft.columns[action.index + 1] = draft.columns[action.index];
                draft.columns[action.index] = placeholder;
                break;
            } else
                throw Error('Unknown column move direction: ' + action.payload);
        }
        case "name": {
            draft.name = action.payload;
            break;
        }
        case 'break': {
            draft.break = action.payload
            break
        }
        default: {
            throw Error('Unknown action: ' + action.type);
        }
    }
}

export function useSchema() {
    return useContext(SchemaContext);
}

export function useSchemaDispatch() {
    return useContext(SchemaDispatchContext);
}

export function validateJSONSchema(config) {
    // Define the main schema
    const schema = {
        "name": "string",
        "break": "number",
        "columns": "array" // Required key, type array (with objects inside)
    };

    // Define the schema for objects inside the 'columns' array
    const columnSchema = {
        "name": "string",
        "displayName": "string",
        "editable": "boolean",
        "validate": "boolean",
        "allowedChoices": "array", // Array of strings or empty
        "force": "boolean",
        "id": "string"
    };

    // Helper function to validate each key in the config object
    function validateKey(key, expectedType, value, path) {
        if (value === undefined) {
            throw new Error(`Validation error: Missing key "${path}"`);
        } else if (expectedType === "array" && !Array.isArray(value)) {
            throw new Error(`Validation error: Expected "${path}" to be an array`);
        } else if (typeof value !== expectedType && expectedType !== "array") {
            throw new Error(`Validation error: Expected "${path}" to be of type ${expectedType}`);
        }
    }

    // Special validation for allowedChoices array in columns
    function validateAllowedChoices(allowedChoices, path) {
        if (!Array.isArray(allowedChoices)) {
            throw new Error(`Validation error: Expected "${path}" to be an array of strings`);
        }
        for (let i = 0; i < allowedChoices.length; i++) {
            if (typeof allowedChoices[i] !== "string") {
                throw new Error(`Validation error: Expected "${path}[${i}]" to be a string`);
            }
        }
    }

    try {
        // Check each key in the root schema
        for (const key in schema) {
            validateKey(key, schema[key], config[key], key);
        }

        // Validate the 'columns' array if it exists
        if (Array.isArray(config.columns)) {
            config.columns.forEach((column, index) => {
                if (typeof column !== "object" || column === null) {
                    throw new Error(`Validation error: Expected columns[${index}] to be an object`);
                }

                // Validate each key in the columnSchema
                for (const key in columnSchema) {
                    validateKey(key, columnSchema[key], column[key], `columns[${index}].${key}`);

                    // Special validation for allowedChoices array within each column object
                    if (key === "allowedChoices" && column[key] !== undefined) {
                        validateAllowedChoices(column[key], `columns[${index}].allowedChoices`);
                    }
                }
            });
        }

        // If all validations pass, return success
        return { isValid: true };

    } catch (error) {
        // If any validation fails, return the error message and mark the config as invalid
        return { isValid: false, error: error.message };
    }
}