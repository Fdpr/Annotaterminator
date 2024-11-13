import { useState } from 'react'
import { CustomProvider, Nav } from 'rsuite';
import AnnotatorPanel from './components/annotation/AnnotatorPanel';
import FileDrop from './components/io/FileDrop';
import AlertPopup from './components/io/AlertPopup';
import WelcomeScreen from './components/WelcomeScreen';
import { useSettings } from './providers/SettingsProvider';
import Settings from './components/SettingsPanel';
import SchemaPanel from './components/schema/SchemaPanel';



function App() {
  const settings = useSettings();
  // active tab
  const [activeKey, setActiveKey] = useState('annotate');



  return (
    <CustomProvider theme={settings.theme}>
      {/*<WelcomeScreen />*/}
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
