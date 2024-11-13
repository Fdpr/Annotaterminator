

const AnnotationRow = ({ sizes, children, ...props }) => {
    return <div {...props} className={props.className ? "flex flex-row " + props.className : "flex flex-row"}>
        {children.map((child, index) => 
            <div key={index} style={{width: `${sizes[index]}%`, overflow: "scroll"}} className="flex flex-col justify-center">
            {child}
        </div>
        )}
    </div>
}

export default AnnotationRow;