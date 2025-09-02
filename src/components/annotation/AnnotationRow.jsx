import PropTypes from "prop-types";

const AnnotationRow = ({ sizes, children, ...props }) => {
  if (!sizes) return <div>Empty</div>;
  if (Array.isArray(sizes)) {
    return (
      <div {...props} tabIndex="-1" className={props.className ? "flex flex-row " + props.className : "flex flex-row"}>
        {children.map((child, index) => (
          <div
            key={index}
            style={{ width: `${sizes[index]}%`, overflow: "auto" }}
            className="flex flex-col border-l-2 border-transparent"
          >
            {child}
          </div>
        ))}
      </div>
    );
  } else {
    const childrenTop = children.slice(0, sizes.top.length);
    const childrenBottom = ["", ...children.slice(sizes.top.length)];
    return (
      <div {...props} tabIndex="-1" className={props.className ? "flex flex-col " + props.className : "flex flex-col"}>
        <div className="flex flex-row border-l-2 border-transparent">
          {childrenTop.map((child, index) => (
            <div
              key={index}
              style={{ width: `${sizes.top[index]}%`, overflow: "auto" }}
              className="flex flex-col border-b-2 border-transparent"
            >
              {child}
            </div>
          ))}
        </div>
        <div className="flex flex-row border-l-2 border-transparent">
          {childrenBottom.map((child, index) => (
            <div
              key={index}
              style={{ width: `${sizes.bottom[index]}%`, overflow: "auto" }}
              className="flex flex-col border-b-2 border-transparent"
            >
              {child}
            </div>
          ))}
        </div>
      </div>
    );
  }
};

AnnotationRow.propTypes = {
  sizes: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.number),
    PropTypes.shape({
      top: PropTypes.arrayOf(PropTypes.number),
      bottom: PropTypes.arrayOf(PropTypes.number),
    }),
  ]),
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export default AnnotationRow;
