import { Panel, Text, TagInput, Checkbox } from "rsuite";
import PropTypes from "prop-types";
import { useFilter, useFilterDispatch } from "../../providers/FilterProvider";

const FilterPanel = ({ columns }) => {
    const filter = useFilter();
    const dispatch = useFilterDispatch();
    // Failsafe if filter is not initialized (should never happen, but who knows)
    let safeFilter = filter;
    if (safeFilter.length !== columns.length) {
        safeFilter = columns.map(col => ({ column: col.name, keys: [], empty: false, nonEmpty: false }));
        // Better not dispatch here. Let's wait for somewhere else to do it.
        // dispatch({ type: 'init', payload: columns.map(col => col.name) });
    }
    return <Panel collapsible header="Filters" >
        <div className="flex flex-row">
            <div className="flex flex-col mr-4 justify-between">
                {columns.map((item) =>
                    <Text className="text-lg" key={item.name}>{item.displayName ? item.displayName : item.name}</Text>
                )}
            </div>
            <div className="flex flex-col">

                {columns.map((item) =>
                    <TagInput key={item.name} trigger={["Comma", "Enter"]} style={{ minWidth: "300px" }} onChange={val => dispatch({type: "set", payload: {...safeFilter.find(e => e.column === item.name), terms: val}})}></TagInput>
                )}
            </div>
            <div className="flex flex-col">
                {columns.map((item) => 
                <div key={item.name}className="flex flex-row">
                    <Checkbox className="ml-4" onChange={(_, checked) => dispatch({type: "set", payload: {...safeFilter.find(e => e.column === item.name), empty: checked}})}>Empty</Checkbox>
                    <Checkbox className="ml-4" onChange={(_, checked) => dispatch({type: "set", payload: {...safeFilter.find(e => e.column === item.name), nonEmpty: checked}})}>Non-Empty</Checkbox>
                </div>
                )}
            </div>
        </div>
    </Panel>
}

FilterPanel.propTypes = {
    columns: PropTypes.arrayOf(PropTypes.shape({
        name: PropTypes.string.isRequired,
        displayName: PropTypes.string,
    })).isRequired,
}

export default FilterPanel