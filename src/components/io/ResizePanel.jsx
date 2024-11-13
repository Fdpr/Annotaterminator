import { Panel, PanelResizeHandle } from "react-resizable-panels";

const ResizePanel = ({ showHandle, children }) => {
    return <><Panel className="border-none rounded-lg mr-2 -translate-x-1">
        {children}
    </Panel>
        {showHandle && <PanelResizeHandle className="rounded-lg border-2 -translate-x-1.5"/>}
    </>
}

export default ResizePanel;