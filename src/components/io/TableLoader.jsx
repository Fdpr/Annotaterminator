import { Uploader, Button } from "rsuite"
import { useTable, useTableDispatch } from "../../providers/TableProvider"
import { useAlert } from "../../providers/AlertProvider";
import { uploadCSV } from "../../util/fileLoading";

const TableLoader = () => {
    const dispatch = useTableDispatch();
    const table = useTable();
    const { setAlert } = useAlert();

    return <Uploader fileList={[]} shouldUpload={() => false} action="" accept="text/csv" onChange={(files) => {
        if (files && files[0] && files[0].blobFile) {
            uploadCSV(files[0].blobFile, dispatch, table, setAlert)
        }
    }}><Button>Load table from file</Button></Uploader>
}

export default TableLoader;