import { InputPicker } from "rsuite";
import { useRef } from "react";

`const _FocusedInputPicker = forwardRef(function MyInput(props, ref) {
  return (
    <InputPicker ref={ref} {...props}>
    </InputPicker>
  );
});`;

const FocusedInputPicker = (props) => {
  const ref = useRef();

  return (
    <div ref={ref} onFocus={() => {
        if (ref.current) {
            const input = ref.current.querySelector(".rs-picker");
            if (input) input.click();
        }
    }}>
      <InputPicker {...props} />
    </div>
  );
};

export default FocusedInputPicker;
