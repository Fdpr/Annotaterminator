import { Heading, Button, Text } from "rsuite";
import { useSchema } from "../../providers/SchemaProvider";
import { useTable, useTableDispatch } from "../../providers/TableProvider";
import { useBeforeunload } from "react-beforeunload";
import { useEffect, useState } from "react";
import RowSelector from "./RowSelector";
import AutoAutoComplete from "../io/AutoAutoComplete";
import { downloadCSV } from "../../util/fileLoading";
import { useAlert } from "../../providers/AlertProvider";
import { useSettings } from "../../providers/SettingsProvider";
import { useFilter } from "../../providers/FilterProvider";
import { PanelGroup } from "react-resizable-panels";
import AnnotationRow from "./AnnotationRow";
import ResizePanel from "../io/ResizePanel";
import FilterPanel from "./FilterPanel";

const range = (a, b) => Array.from({ length: Math.max(0, b - a - 1) }, (_, i) => a + i + 1);

const rowsWithColumnsAsText = (rows, columns, table, sizes, props) =>
  rows.map((row, rowIndex) => (
    <AnnotationRow key={rowIndex} sizes={sizes} {...props}>
      {columns.map((column, colIndex) => (
        <Text className="mr-2" key={rowIndex + "-" + colIndex}>
          {column === "row" ? table.table[row].row + 1 : table.table[row][column]}
        </Text>
      ))}
    </AnnotationRow>
  ));

const Annotator = () => {
  const { setAlert } = useAlert();
  const table = useTable();
  const dispatch = useTableDispatch();
  const schema = useSchema();

  useBeforeunload(() => {
    localStorage.setItem("schema", JSON.stringify(schema));
    localStorage.setItem("table", JSON.stringify(table));

    if (import.meta.env.MODE !== "development")
      return "You currently have a table loaded. Are you sure you want to close Annotaterminator? Any unsaved progress will be lost.";
  });

  const settings = useSettings();
  const [displayRow, setRow] = useState(1);
  const row = displayRow - 1;
  const [preRows, setPreRows] = useState(null);
  const [postRows, setPostRows] = useState(null);
  const [currentValues, setCurrentValues] = useState([]);
  const [invalids, setInvalids] = useState([]);
  const [sizes, setSizes] = useState(null);
  const filter = useFilter();

  const validate = () => {
    let hasInvalids = false;
    const newInvalids = currentValues.map(() => false);
    schema.columns.map((column, index) => {
      if (column.force) {
        if (
          !(
            column.allowedChoices.includes(currentValues[index]) || currentValues[schema.columns.indexOf(column)] === ""
          )
        ) {
          setAlert(
            `The value ${currentValues[schema.columns.indexOf(column)]} for column ${
              column.name
            } is not allowed. Please select a valid value.`,
            "error",
            "Invalid value",
            false,
            3000
          );
          newInvalids[index] = true;
          hasInvalids = true;
        }
      }
    });
    if (hasInvalids) {
      setInvalids(newInvalids);
      return false;
    }
    return true;
  };

  const handleRowChange = (newRow, copyRow) => {
    if (!validate()) return;
    const updatedRow = {
      ...table.table[row],
      row: row,
    };
    for (let i = 0; i < schema.columns.length; i++) {
      updatedRow[schema.columns[i].name] = currentValues[i];
    }
    setRow(newRow);
    const newValues = schema.columns.map((column, index) =>
      Object.prototype.hasOwnProperty.call(table.table[newRow - 1], column.name)
        ? column.editable && copyRow
          ? currentValues[index]
          : table.table[newRow - 1][column.name]
        : ""
    );
    dispatch({
      type: "set row",
      row: row,
      payload: updatedRow,
    });
    const inputs = document.querySelector(".edit-row").querySelectorAll("input");
    if (inputs.length > 1) inputs[1].focus();
    setInvalids(currentValues.map(() => false));
    if (copyRow) {
      const updatedNewRow = {
        ...table.table[newRow - 1],
        row: newRow,
      };
      for (let i = 0; i < schema.columns.length; i++) {
        updatedNewRow[schema.columns[i].name] = newValues[i];
      }
      dispatch({
        type: "set row",
        row: newRow - 1,
        payload: updatedNewRow,
      });
      setCurrentValues(newValues);
    }
  };

  const keyListener = (e) => {
    if (e.key === "Delete") {
      setCurrentValues(schema.columns.map((column, index) => (column.editable ? "" : currentValues[index])));
    }
    if (
      (e.key === "ArrowUp" || e.key === "ArrowDown") &&
      (document.querySelector(".rs-picker-select-menu") || e.shiftKey)
    )
      return;
    if (e.key === "ArrowUp" && row > 0) {
      e.preventDefault();
      handleRowChange(preRows ? preRows[preRows.length - 1] + 3: row + 1, e.metaKey);
    } else if (
      e.key === "ArrowDown" &&
      row < table.table.length - 2 &&
      !document.querySelector(".rs-picker-select-menu")
    ) {
      e.preventDefault();
      handleRowChange(postRows ? postRows[0] + 1: row + 1, e.metaKey);
    }
  };

  // init column scaling

  useEffect(() => {
    console.log("Resizing panels due to schema or settings change");
    if (!settings.break && (!Array.isArray(sizes) || sizes.length !== schema.columns.length))
      setSizes(Array.from({ length: schema.columns.length + 1 }, () => (1 / (schema.columns.length + 1)) * 100));
    else if (settings.break && (Array.isArray(sizes) || !sizes)) {
      console.log("Changing from single to double panel");
      setSizes({
        top: Array.from({ length: schema.break + 1 }, () => (1 / (schema.break + 1)) * 100),
        bottom: Array.from(
          { length: schema.columns.length - schema.break + 1 },
          () => (1 / (schema.columns.length - schema.break + 1)) * 100
        ),
      });
    }
  }, [schema, settings]);

  // Update values upon row change

  useEffect(() => {
    if (table && schema)
      setCurrentValues(
        schema.columns.map((column) =>
          Object.prototype.hasOwnProperty.call(table.table[displayRow - 1], column.name)
            ? table.table[displayRow - 1][column.name]
            : ""
        )
      );
  }, [table, schema, displayRow]);

  // Update filtered rows upon filter or table change

  useEffect(() => {
    const filterRow = (tableRow) => {
      return filter.some((f) => {
        if (Array.isArray(f.terms) && f.terms.length > 0 && !f.terms.some((term) => tableRow[f.column].includes(term))) {return true;};
        if (f.empty && !(!tableRow[f.column] || tableRow[f.column] === "")) return true;
        if (f.nonEmpty && !(tableRow[f.column] || tableRow[f.column] !== "")) return true;
        return false;
      });
    };
    const pre = [];
    const post = [];
    for (let i = displayRow - 2; i >= 0; i--) {
        if (pre.length >= settings.preRows) break;
        if (!filterRow(table.table[i])) pre.push(i);
    }
    for (let i = displayRow; i < table.table.length; i++) {
        if (post.length >= settings.postRows) break;
        if (!filterRow(table.table[i])) post.push(i);
    }
    setPreRows(pre);
    setPostRows(post);
  }, [filter, schema, settings, displayRow, table]);


  // Make header

  let header;
  if (settings.break) {
    header = {
      top: [{ name: "Row" }, ...schema.columns.slice(0, schema.break)].map((column, index) => (
        <ResizePanel key={column.name + "-top"} showHandle={index < schema.break}>
          <Heading className="pl-1" level={5}>
            {column.displayName ? column.displayName : column.name}
          </Heading>
        </ResizePanel>
      )),
      bottom: [{ name: "" }, ...schema.columns.slice(schema.break)].map((column, index) => (
        <ResizePanel key={column.name + "-bottom"} showHandle={index < schema.columns.length - schema.break}>
          <Heading className="pl-1" level={5}>
            {column.displayName ? column.displayName : column.name}
          </Heading>
        </ResizePanel>
      )),
    };
  } else {
    header = [{ name: "Row" }, ...schema.columns].map((column, index) => (
      <ResizePanel key={column.name} showHandle={index < schema.columns.length}>
        <Heading className="pl-1" level={5}>
          {column.displayName ? column.displayName : column.name}
        </Heading>
      </ResizePanel>
    ));
  }

  let pres = preRows ? preRows : range(Math.max(-1, row - settings.preRows - 1), row);
  let post = postRows
    ? postRows
    : range(row, Math.min(table.table.length - 1, row + Number.parseInt(settings.postRows) + 1));

  pres = rowsWithColumnsAsText(pres, ["row", ...schema.columns.map((column) => column.name)], table, sizes);
  post = rowsWithColumnsAsText(post, ["row", ...schema.columns.map((column) => column.name)], table, sizes);

  //   Construct the annotation area

  const editRow = [
    <RowSelector key="rows-select" max={table.table.length} value={displayRow} handleChange={handleRowChange} />,
    ...schema.columns.map((column, index) => {
      if (column.editable)
        return (
          <AutoAutoComplete
            className="mr-2"
            classPrefix={invalids[index] ? "auto-complete-invalid" : ""}
            key={index}
            data={column.allowedChoices}
            placeholder={column.displayName ? column.displayName : column.name}
            value={currentValues[index]}
            onChange={(value) => {
              const newValues = [...currentValues];
              newValues[index] = value;
              setCurrentValues(newValues);
              const newInvalids = [...invalids];
              newInvalids[index] = false;
              setInvalids(newInvalids);
            }}
          />
        );
      else
        return (
          <Text className="mr-2" key={index}>
            {currentValues[index]}
          </Text>
        );
    }),
  ];

  // Render

  return (
    // Header with title and download button
    <>
      <Heading level={3} className="border-b-2 ">
        {table.title}{" "}
        <Button
          className="pb-2"
          onClick={() => {
            const newTable = [...table.table];
            newTable[0] = { ...newTable[0] };
            for (let column of schema.columns)
              if (!Object.prototype.hasOwnProperty.call(newTable[0], column.name)) newTable[0][column.name] = "";
            downloadCSV({ table: newTable, title: table.title }, setAlert);
          }}
        >
          Download table
        </Button>
      </Heading>

      {/* Actual panel with table */}

      {sizes && (
        <div className="annotator-panel">
          {settings.break ? (
            <div>
              <PanelGroup
                className="mt-4 mb-2"
                direction="horizontal"
                onLayout={(layout) =>
                  setSizes((oldSizes) => {
                    return { ...oldSizes, top: layout };
                  })
                }
                autoSaveId={schema.name + "-top"}
              >
                {header.top}
              </PanelGroup>
              <PanelGroup
                className="mt-4 mb-2"
                direction="horizontal"
                onLayout={(layout) =>
                  setSizes((oldSizes) => {
                    return { ...oldSizes, bottom: layout };
                  })
                }
                autoSaveId={schema.name + "-bottom"}
              >
                {header.bottom}
              </PanelGroup>
              <div>{pres}</div>
              <AnnotationRow
                className="rounded border border-offset-2 border-1 border-slate-300 edit-row"
                onKeyDown={keyListener}
                sizes={sizes}
              >
                {editRow}
              </AnnotationRow>
              <div>{post}</div>
            </div>
          ) : (
            <>
              <PanelGroup className="mt-4 mb-2" direction="horizontal" onLayout={setSizes} autoSaveId={schema.name}>
                {header}
              </PanelGroup>
              <div>{pres}</div>
              <AnnotationRow
                className="rounded border border-offset-2 border-1 border-slate-300 edit-row"
                onKeyDown={keyListener}
                sizes={sizes}
              >
                {editRow}
              </AnnotationRow>
              <div>{post}</div>
            </>
          )}
          <FilterPanel columns={schema.columns} />
        </div>
      )}
    </>
  );
};

export default Annotator;
