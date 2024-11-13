import { Text, Panel } from "rsuite"
import { useTable } from "../../providers/TableProvider";
import TableLoader from "../io/TableLoader";
import SchemaLoader from "../io/SchemaLoader";
import { useSchema } from "../../providers/SchemaProvider";
import Annotator from "./Annotator";

function AnnotatorPanel({ hide }) {
    const table = useTable();
    const schema = useSchema();

    return <Panel style={{display: hide ? "none" : ""}} bordered header="Annotator">
        {table ?
            (schema ? <Annotator /> : <>
                <Text>No schema loaded at the moment. You can upload a JSON config file to load a schema or select a schema saved on the server.</Text>
                <SchemaLoader />
            </>) : <>
                <Text>No table loaded at the moment. Drag and drop a CSV file into this panel or use the upload button to load one in.</Text>
                <TableLoader />
            </>
        }
    </Panel>
}



export default AnnotatorPanel