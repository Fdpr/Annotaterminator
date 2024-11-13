import { Panel, Heading, Text, TagInput } from "rsuite";

const FilterPanel = ({ columns }) => {
    return <Panel collapsible header="Filters" >
        <div className="flex flex-row">
            <div className="flex flex-col mr-4 justify-between">
                {columns.map((item) =>
                    <Text className="text-lg" key={item.name}>{item.displayName ? item.displayName : item.name}</Text>
                )}
            </div>
            <div className="flex flex-col">

                {columns.map((item) =>
                    <TagInput key={item.name} trigger={["Comma", "Enter"]} style={{ minWidth: "300px" }}></TagInput>
                )}
            </div>
        </div>
    </Panel>
}

export default FilterPanel