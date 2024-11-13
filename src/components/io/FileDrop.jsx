import { useDropzone } from "react-dropzone";
import React, { useCallback } from 'react';
import { Heading } from "rsuite";
import { useTable, useTableDispatch } from "../../providers/TableProvider";
import { useAlert } from "../../providers/AlertProvider";
import { uploadCSV } from "../../util/fileLoading";

const overlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "radial-gradient(circle, rgba(73, 102, 245,0.6) 37%, rgba(252,70,107,0.85) 100%)", // Your radial gradient
    opacity: 0, // Start invisible
    transition: 'opacity 0.6s ease-in-out', // Smooth fade in and out
    pointerEvents: 'none', // Ensures overlay doesn't interfere with Dropzone functionality,
    zIndex: 1000,

    display: "flex",
    alignItems: "center",
    justifyContent: "center"
};

const focusedOverlayStyle = {
    opacity: 1, // Fully visible on focus
};

function FileDrop(props) {
    const dispatch = useTableDispatch();
    const table = useTable();
    const { setAlert } = useAlert();

    const onDrop = useCallback(files => {
        if (files && files[0]) {
            uploadCSV(files[0], dispatch, table, setAlert)
        }
    })


    const {
        getRootProps,
        getInputProps,
        isDragAccept,
    } = useDropzone({ accept: { 'text/csv': [".csv"] }, noClick: true, onDrop: onDrop });

    return (
        <div className="container">
            <div {...getRootProps()}>
                <input {...getInputProps()} />
                <div style={{ ...overlayStyle, ...(isDragAccept ? focusedOverlayStyle : {}) }}>
                    <Heading level={1}>Drop file here to load</Heading>
                </div>
                {props.children}
            </div>
        </div>
    );
}

<FileDrop />

export default FileDrop;