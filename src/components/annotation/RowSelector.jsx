import { InputNumber } from "rsuite";
import PropTypes from "prop-types";

const RowSelector = ({value, max, handleChange}) => {
    return <InputNumber style={{width: "70px"}}step={1} value={value} onChange={(number, event) => {
        if (event.type === "keydown") return;
        else if (event.type === "click") {
            let newVal = value-(number-value)
            newVal = Math.min(max-1, Math.max(1, newVal))
            handleChange(newVal);
        }
        else handleChange(Math.min(max-1, Math.max(1, number)));
    }} min={0} max={max}></InputNumber>
}

RowSelector.propTypes = {
    value: PropTypes.number.isRequired,
    max: PropTypes.number.isRequired,
    handleChange: PropTypes.func.isRequired,
}

export default RowSelector;