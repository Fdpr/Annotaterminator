import { AutoComplete, Heading, Button, Text } from "rsuite";
import { useSchema } from "../../providers/SchemaProvider";
import { useTable, useTableDispatch } from "../../providers/TableProvider";
import { useBeforeunload } from 'react-beforeunload';
import { useEffect, useState } from "react";
import RowSelector from "./RowSelector";
import FocusedInputPicker from "../io/FocusedInputPicker";
import { downloadCSV } from "../../util/fileLoading";
import { useAlert } from "../../providers/AlertProvider";
import { useSettings } from "../../providers/SettingsProvider";
import { PanelGroup } from "react-resizable-panels";
import AnnotationRow from "./AnnotationRow";
import ResizePanel from "../io/ResizePanel";
import FilterPanel from "./FilterPanel";

const range = (a, b) => Array.from({ length: Math.max(0, b - a - 1) }, (_, i) => a + i + 1);

const rowsWithColumnsAsText = (rows, columns, table, sizes, props) =>
    rows.map((row, rowIndex) =>
        <AnnotationRow key={rowIndex} sizes={sizes} {...props} >
            {(columns.map((column, colIndex) =>
                <Text className="mr-2" key={rowIndex + "-" + colIndex}>{column === "row" ? table.table[row].row + 1 : table.table[row][column]}</Text>)
            )}
        </AnnotationRow>
    )

const Annotator = () => {
    useBeforeunload(() => "You currently have a table loaded. Are you sure you want to close Annotaterminator? Any unsaved progress will be lost.")
    const { setAlert } = useAlert();
    const table = useTable();
    const dispatch = useTableDispatch();
    const schema = useSchema();
    const settings = useSettings();
    const [displayRow, setRow] = useState(1);
    const row = displayRow - 1;
    const preRows = range(Math.max(-1, row - settings.preRows - 1), row);
    const postRows = range(row, Math.min(table.table.length - 1, row + Number.parseInt(settings.postRows) + 1));
    const [currentValues, setCurrentValues] = useState([])
    const [sizes, setSizes] = useState(null);

    const handleRow = (newRow) => {
        const updatedRow = {
            ...table.table[row],
            row: row
        }
        for (let i = 0; i < schema.columns.length; i++) {
            updatedRow[schema.columns[i].name] = currentValues[i];
        }
        dispatch({
            type: "set row",
            row: row,
            payload: updatedRow
        })
        setRow(newRow);

    }

    const keyListener = (e) => {
        if (e.key === "ArrowUp" && row > 0) {
            console.log("fire")
            e.preventDefault();
            handleRow(row);
        }
        else if (e.key === "ArrowDown" && row < table.table.length - 2) {
            console.log("bire")
            e.preventDefault();
            handleRow(row + 2);
        }
    }

    useEffect(() => {
        if (!sizes || sizes.length !== schema.columns.length)
            setSizes(Array.from({ length: schema.columns.length + 1 }, _ => (1 / (schema.columns.length + 1) * 100)))
    }, [schema])

    useEffect(() => {
        if (table && schema) setCurrentValues(schema.columns.map((column) => table.table[displayRow - 1].hasOwnProperty(column.name) ? table.table[displayRow - 1][column.name] : ""))
    }, [table, schema, displayRow])

    const header = [{ name: "Row" }, ...schema.columns].map((column, index) => <ResizePanel key={column.name} showHandle={index < schema.columns.length}><Heading className="pl-1" level={5}>{column.displayName ? column.displayName : column.name}</Heading></ResizePanel>)
    const pres = rowsWithColumnsAsText(preRows, ["row", ...schema.columns.map(column => column.name)], table, sizes);
    const post = rowsWithColumnsAsText(postRows, ["row", ...schema.columns.map(column => column.name)], table, sizes);
    const editRow = [<RowSelector key="rows-select" max={table.table.length} value={displayRow} handleChange={handleRow} />, ...schema.columns.map((column, index) => {
        if (column.editable && column.force) {
            return <FocusedInputPicker
                className="mr-2"
                key={index}
                data={column.allowedChoices.map(item => ({ label: item, value: item }))}
                placeholder={column.displayName ? column.displayName : column.name}
                value={currentValues[index]}
                onChange={(value) => {
                    const newValues = [...currentValues]
                    newValues[index] = value;
                    setCurrentValues(newValues);
                }}
            />
        }
        else if (column.editable)
            return <AutoComplete
                className="mr-2"
                key={index}
                data={column.allowedChoices}
                placeholder={column.displayName ? column.displayName : column.name}
                value={currentValues[index]}
                onChange={(value) => {
                    const newValues = [...currentValues]
                    newValues[index] = value;
                    setCurrentValues(newValues);
                }}
            />
        else return <Text
            className="mr-2"
            key={index}>
            {currentValues[index]}
        </Text>
    })];

    return <>
        <Heading level={3} className="border-b-2 ">{table.title} <Button className="pb-2" onClick={() => {
            const newTable = [...table.table];
            newTable[0] = {...newTable[0]};
            for (let column of schema.columns) if (!newTable[0].hasOwnProperty(column.name)) newTable[0][column.name] = "";
            downloadCSV({table: newTable, title: table.title}, setAlert)
        }
        }>Download table</Button></Heading>
        {sizes && <>
            {settings.break ?
                <Text>Break</Text>
                :
                <>
                    <PanelGroup className="mt-4 mb-2" direction="horizontal" onLayout={setSizes}>
                        {header}
                    </PanelGroup>
                    {pres}
                    <AnnotationRow className="rounded outline outline-offset-2 outline-1 outline-slate-300" key="edit-row" onKeyDown={keyListener} sizes={sizes}>{editRow}</AnnotationRow>
                    {post}
                </>
            }
            <FilterPanel columns={schema.columns} />
        </>
        }

    </>
}

export default Annotator;