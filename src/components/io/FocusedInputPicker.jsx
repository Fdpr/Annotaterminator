import { InputPicker, Input } from "rsuite";
import { forwardRef, useEffect, useRef } from "react";

const _FocusedInputPicker = forwardRef(function MyInput(props, ref) {
    return (
        <InputPicker ref={ref} {...props}>
            <Input ></Input>
        </InputPicker>
    );
});


const FocusedInputPicker = (props) => {
    const ref = useRef();

    useEffect(() => {
        if (ref && ref.current && ref.current.target) {
            const target = ref.current.target;
            const input = target.querySelector("input")
            if (input) {
                const focusHandler = (e) => { e.preventDefault(); console.log("Focus fired"); input.focus() };
                ref.current.target.onFocus = focusHandler;
                return (() => { target.onFocus = null })
            }
        }
    })

    return <_FocusedInputPicker ref={ref} {...props} />
}

export default FocusedInputPicker;