import { Uploader, Button, InputPicker } from "rsuite"
import { loadSchema } from "../../util/fileLoading";
import { useSchema, useSchemaDispatch } from "../../providers/SchemaProvider";
import { validateJSONSchema } from "../../providers/SchemaProvider";
import { useAlert } from "../../providers/AlertProvider";
import { useCallback, useEffect, useState } from "react";

const SchemaLoader = () => {
    const schema = useSchema();
    const dispatch = useSchemaDispatch();
    const { setAlert } = useAlert();


    return <>

        <Uploader fileList={[]} shouldUpload={() => false} action="" accept="application/json" onChange={(files) => {
            if (files && files[0] && files[0].blobFile) {
                try {
                    const reader = new FileReader();
                    reader.readAsText(files[0].blobFile);
                    reader.addEventListener("loadend", () => {
                        try {
                            const config = JSON.parse(reader.result)
                            const result = validateJSONSchema(config);
                            if (!result.isValid) throw new Error(result.error)
                            else loadSchema(schema, () => dispatch({type: "load", payload: config}), setAlert)
                        } catch (error) {
                            setAlert(error.message, "error", "Error loading schema")
                        }
                    })
                } catch (error) {
                    setAlert(error.message, "error", "Error loading schema")
                }
            }
        }} ><Button>Load schema from file</Button></Uploader >
        <InputPicker data={[]} placeholder="Load schema from server" />
    </>
}

export default SchemaLoader