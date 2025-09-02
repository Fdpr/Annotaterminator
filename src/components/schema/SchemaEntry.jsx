import { InputPicker, Input, Checkbox, Button, TagInput } from "rsuite"
import { useTable } from "../../providers/TableProvider";
import { useSchema, useSchemaDispatch } from "../../providers/SchemaProvider";
import { useEffect, useState } from "react";
import PropTypes from "prop-types";


const SchemaEntry = ({ id }) => {
    const schema = useSchema();
    const data = schema.columns[id];
    const dispatch = useSchemaDispatch();
    const update = (key, value) => dispatch({
        type: "update column",
        index: id,
        payload: {
            key: key,
            value: value
        }
    })
    const table = useTable();
    const [autofill, setAutofill] = useState(null);

    useEffect(() => {
        if (table && table.table && table.table[0]) {
            const fill = autofill || [];
            const tableRows = Object.keys(table.table[0]).map(item => ({ label: item, value: item }))
            const currentValue = data.name ? [{ label: data.name, value: data.name }] : []
            setAutofill([...tableRows, ...fill, ...currentValue])
        }
    }, [table])

    return <div>
        {autofill ?
            <InputPicker
                defaultValue={data.name}
                creatable
                data={autofill}
                onCreate={(value) => { setAutofill([...autofill, { label: value, value: value }]), update("name", value) }}
                onChange={(value) => { update("name", value) }}
                placeholder="Column name" />
            :
            <Input defaultValue={data.name} onChange={(value) => { update("name", value) }} placeholder="Column name" />
        }
        <Input defaultValue={data.displayName} placeholder="display name" onChange={(value) => { update("displayName", value) }} />
        <Checkbox defaultChecked={data.editable} onChange={(value, checked) => { update("editable", checked) }}>Is editable</Checkbox>
        {data.editable && <>
            <Checkbox defaultChecked={data.validate} onChange={(value, checked) => { update("validate", checked) }}>Validate input</Checkbox>
            {data.validate && <>
                <Checkbox defaultChecked={data.force} onChange={(value, checked) => { update("force", checked) }}>Force valid input</Checkbox>
                <br />
                <TagInput style={{ minWidth: "300px" }} trigger={["Enter", "Comma"]} placeholder="Allowed Choices (comma-separated)" defaultValue={data.allowedChoices} onChange={(value) => { update("allowedChoices", value) }} />
            </>
            }
        </>
        }
        <br></br>
        <Button onClick={() => {
            dispatch({
                type: "move column",
                payload: "up",
                index: id
            })
        }}>Move up</Button>
        <Button onClick={() => {
            dispatch({
                type: "move column",
                payload: "down",
                index: id
            })
        }}>Move down</Button>
        <Button appearance="ghost" onClick={() => {
            dispatch({
                type: "remove column",
                index: id
            })
        }}>Remove</Button>
    </div>
}

SchemaEntry.propTypes = {
    id: PropTypes.number.isRequired,
}

export default SchemaEntry