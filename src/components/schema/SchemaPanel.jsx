import { Panel, InputNumber, Button, Input, Heading, Divider } from "rsuite";
import { useSchema, useSchemaDispatch } from "../../providers/SchemaProvider";
import SchemaEntry from "./SchemaEntry";
import { useAlert } from "../../providers/AlertProvider";
import { useFilterDispatch } from "../../providers/FilterProvider";
import SchemaLoader from "../io/SchemaLoader";
import { loadSchema, downloadSchema } from "../../util/fileLoading";
import PropTypes from "prop-types";
import { useEffect } from "react";

const SchemaPanel = ({ hide }) => {
  const schema = useSchema();
  const dispatch = useSchemaDispatch();
  const { setAlert } = useAlert();
  const dispatchFilter = useFilterDispatch();

  useEffect(() => {
    if (schema) dispatchFilter({ type: "init", payload:  schema.columns.map(c => c.name) });
    else dispatchFilter({ type: "clear" });
  }, [schema]);

  return (
    <Panel style={{ display: hide ? "none" : "" }} bordered header="Schema Editor">
      <Button
        appearance="primary"
        onClick={() => {
          loadSchema(
            schema,
            () => {
              dispatch({ type: "new" });
            },
            setAlert
          );
        }}
      >
        Create new schema
      </Button>
      <SchemaLoader />
      {schema && (
        <>
          <Button
            onClick={() => {
              setAlert(
                "Do you want to clear the current schema? Unsaved progress will be erased.",
                "modal",
                "Clearing schema",
                {
                  yes: "Continue",
                  yesCallback: () => dispatch({ type: "clear" }),
                  no: "Cancel",
                }
              );
            }}
          >
            Clear schema
          </Button>
          <Heading>Columns</Heading>
          {schema.columns.map((column, index) => (
            <div key={column.id}>
              <Heading level={4}>Column {index + 1}</Heading>
              <SchemaEntry id={index} />
              <Divider />
            </div>
          ))}
          <Button onClick={() => dispatch({ type: "add column" })}>Add column</Button>
          <Heading>General</Heading>
          <Input
            placeholder="Schema name"
            onChange={(value) => dispatch({ type: "name", payload: value })}
            value={schema.name}
          />
          <InputNumber
            prefix="Break rows after column"
            defaultValue={schema.break}
            min={0}
            max={schema.columns.length - 1}
            onChange={(value) =>
              dispatch({
                type: "break",
                payload: Number.parseInt(value),
              })
            }
          />
          <Button disabled appearance="primary">
            Save schema to server
          </Button>
          <Button
            appearance="primary"
            onClick={() => {
              downloadSchema(schema, setAlert);
            }}
          >
            Download schema
          </Button>
        </>
      )}
    </Panel>
  );
};

SchemaPanel.propTypes = {
  hide: PropTypes.bool,
};

export default SchemaPanel;
