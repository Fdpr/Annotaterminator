import { useEffect, useState } from 'react'
import { CustomProvider, Nav } from 'rsuite';
import AnnotatorPanel from './components/annotation/AnnotatorPanel';
import FileDrop from './components/io/FileDrop';
import AlertPopup from './components/io/AlertPopup';
import WelcomeScreen from './components/WelcomeScreen';
import { useSettings } from './providers/SettingsProvider';
import Settings from './components/SettingsPanel';
import SchemaPanel from './components/schema/SchemaPanel';
import { useSchemaDispatch } from './providers/SchemaProvider';
import { useTableDispatch } from './providers/TableProvider';
import { useAlert } from './providers/AlertProvider';


function App() {
  const settings = useSettings();
  const dispatchSchema = useSchemaDispatch();
  const dispatchTable = useTableDispatch();
  const { setAlert } = useAlert();

  // active tab
  const [activeKey, setActiveKey] = useState('annotate');
  // Set Welcome Screen
  const [isWelcome, setIsWelcome] = useState(true);
  // Check for local storage
  useEffect(() => {
    if (import.meta.env.MODE === "development") {
      dispatchSchema({
        type: "load",
        payload: JSON.parse(localStorage.getItem("schema"))
      });
      dispatchTable({
        type: "reload",
        payload: JSON.parse(localStorage.getItem("table"))
      });
      return;
    }
    if (!isWelcome) {

      const tableModal = () => {
        setTimeout(() => {
          if (localStorage.getItem("table") === null) return;
          setAlert("You have a table saved from a previous session. Do you want to load this table? Otherwise, it will be erased.", "modal", "Load last table?", {
            yes: "Load saved table",
            no: "Cancel and delete",
            yesCallback: () => {
              dispatchTable({
                type: "reload",
                payload: JSON.parse(localStorage.getItem("table"))
              })
            }
          })
        }, 600)
      }

      if (localStorage.getItem("schema") === null) {
        console.log("This is a test")
        tableModal();
        return;
      }

      setAlert("You have a schema saved from a previous session. Do you want to schema this table? Otherwise, it will be erased.", "modal", "Load last schema?", {
        yes: "Load saved schema",
        no: "Cancel and delete",
        yesCallback: () => {
          dispatchSchema({
            type: "load",
            payload: JSON.parse(localStorage.getItem("schema"))
          }
          );
          tableModal();
        },
        noCallback: tableModal
      })

    }
  }, [isWelcome])


  return (
    <CustomProvider theme={settings.theme}>
      {isWelcome && import.meta.env.MODE !== "development" && <WelcomeScreen handleSetInvisibility={() => setIsWelcome(false)} />}
      <FileDrop >
        <div className='h-full flex flex-col'>

          <Nav appearance="tabs" activeKey={activeKey} onSelect={(eventKey) => { setActiveKey(eventKey) }}>
            <Nav.Item eventKey="annotate">Annotator</Nav.Item>
            <Nav.Item eventKey="schema">Schema Editor</Nav.Item>
          </Nav>
          <div className="flex flex-col justify-between flex-grow">
            <AnnotatorPanel hide={activeKey !== 'annotate'}></AnnotatorPanel>
            <SchemaPanel hide={activeKey !== 'schema'} />
            <Settings />
          </div>
          <AlertPopup />
        </div>
      </FileDrop>
    </CustomProvider>
  )
}

export default App
