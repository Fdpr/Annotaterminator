import Papa from "papaparse";

export function uploadCSV(csv, tableDispatch, table, setAlert) {
    const parse = () => {
        Papa.parse(csv, {
            header: true,
            complete: (result, file) => {
                tableDispatch({ type: 'load table', table: result.data, title: file.name });
                setAlert("Succesfully loaded the table! Make sure to select the appropriate schema for your selected file.", "success", `Loaded ${file.name}`, {})
            },
            error: (error) => {
                console.log(error)
                setAlert(`Encountered error in line ${error.row}: ${error.message}`, "error", error.code, {})
            },
        })
    }

    if (table) {
        setAlert("You currently have an active table loaded. Loading a new table replaces your current table and erases all unsaved progress. Do you want to continue?",
            "modal",
            "Replace active table",
            {
                yes: "Continue",
                yesCallback: () => parse(),
                no: "Cancel"

            })
    } else parse();
}

export function downloadCSV(table, setAlert) {
    const unparsedTable = Papa.unparse(table.table.map(({row, ...rest}) =>  rest), {
        header: true,
        delimiter: ";"
    })
    const blob = new Blob([unparsedTable], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${table.title}`;
    link.click();
    URL.revokeObjectURL(link.href);
    setAlert(`Successfully downloaded ${table.title}. You can now safely close Annotaterminator.`, "success", "table downloaded")

}

export function loadSchema(schema, dispatch, setAlert) {
    if (schema) {
        setAlert(
            "You currently have a schema loaded. Performing this action will override the current schema. Are you sure you want to continue?",
            "modal",
            "Override current schema",
            {
                yes: "Continue",
                no: "Cancel",
                yesCallback: dispatch,
            }

        )
    } else dispatch();
}

export function downloadSchema(schema, setAlert) {
    const jsonString = JSON.stringify(schema, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${schema.name}.json`;
    link.click();
    URL.revokeObjectURL(link.href);
    setAlert(`Successfully downloaded ${schema.name}.json. You can now import that configuration or edit it externally.`, "success", "configuration downloaded")
}
