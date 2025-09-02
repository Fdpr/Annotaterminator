import { Panel, PanelResizeHandle } from "react-resizable-panels";
import PropTypes from "prop-types";


const ResizePanel = ({ showHandle, children }) => {
    // return <><Panel className="border-none rounded-lg mr-2 -translate-x-1">
    return <><Panel minSize={5} className="rounded-lg">
        {children}
    </Panel>
        {showHandle && <PanelResizeHandle className="border-l-2 border-slate-500"/>}
        {/*showHandle && <PanelResizeHandle className="rounded-lg border-2 -translate-x-1.5"/>*/}
    </>
}

ResizePanel.propTypes = {
    showHandle: PropTypes.bool,
    children: PropTypes.node.isRequired,

}
export default ResizePanel;