import { useSettings, useSettingsDispatch } from "../providers/SettingsProvider"
import { Panel, InputNumber, Toggle, Text, Checkbox } from "rsuite"
import SchemaLoader from "./io/SchemaLoader"
import TableLoader from "./io/TableLoader"

const panelStyle = {
    display: "flex",
    gap: "10px",
    flexDirection: "column",
}


const Settings = () => {
    const settings = useSettings();
    const dispatch = useSettingsDispatch();

    return (<Panel className="" bordered collapsible header="Settings">
        <div style={panelStyle}>
            <TableLoader />
            <SchemaLoader />
            <div>
                <Text>Amount of pre-rows</Text>
                <InputNumber
                    defaultValue={settings.preRows}
                    max={10}
                    min={0}
                    onChange={(value) => dispatch({
                        type: "preRows",
                        payload: value
                    })}
                />
            </div>


            <div>
                <Text>Amount of post-rows</Text>
                <InputNumber
                    defaultValue={settings.postRows}
                    max={10}
                    min={0}
                    onChange={(value) => dispatch({
                        type: "postRows",
                        payload: value
                    })}
                />
            </div>

            <Checkbox defaultChecked={settings.break} onChange={(value, checked) => dispatch({
                type: "break",
                payload: checked
            })}>break rows</Checkbox>

            <Toggle
                checkedChildren="dark"
                unCheckedChildren="light"
                onChange={(checked) => dispatch({
                    type: "theme",
                    payload: checked ? "dark" : "light"
                }
                )}
                defaultChecked={settings.theme === "dark"}
                children="Color Theme"
            />
        </div>
    </Panel>

    )
}

export default Settings