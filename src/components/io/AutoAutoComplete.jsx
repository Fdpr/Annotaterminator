import { AutoComplete } from "rsuite";
import PropTypes from "prop-types";

const AutoAutoComplete = ({ onChange, ...props }) => {
  return (
    <AutoComplete
      {...props}
      onChange={(value) => {
        setTimeout(() => {
          const items = document.querySelectorAll(".rs-auto-complete-item");
          if (items && items.length > 0) {
            items[0].classList.add("rs-auto-complete-item-focus");
          }
        }, 0);
        onChange(value);
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          const focused = document.querySelector(".rs-auto-complete-item-focus");
          if (focused) {
            focused.click();
            e.preventDefault();
          }
        }
      }}
    />
  );
};

AutoAutoComplete.propTypes = {
  onChange: PropTypes.func,
};

export default AutoAutoComplete;
