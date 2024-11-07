import { StrictMode, useState, useEffect } from 'react'
import { CustomProvider, Button, Text, Input, Container, Heading } from 'rsuite';
import AlignedContainers from './components/AlignedContainers'

function App() {
  // Sample data
  const data = [
    [
      // One row, all items
      [<Text> Item 1 </Text>, <Input placeholder="text here!" />, <Button>Click me!</Button>, <Text> Item 4 </Text>]
    ],
    [
      // Split into top and bottom containers
      [<Text> Top 1 </Text>, <Input placeholder="text here!" />, <Text> Top 3 </Text>, <Button>Click me!</Button>],
      [<Button>Click me!</Button>, <Text> Bottom 2 </Text>, <Input placeholder="text here!" />, <Button>Click me!</Button>]
    ],
    [
      // Another set of items spanning multiple rows
      [<Text> Row 1 Item 1 </Text>, <Input placeholder="text here!" />, <Button>Click me!</Button>, <Text> Row 1 Item 4 </Text>, <Input placeholder="text here!" />, <Button>Click me!</Button>,],
      [<Text> Row 2 Item 1 </Text>, <Input placeholder="text here!" />, <Button>Click me!</Button>, <Text> Row 2 Item 4 </Text>, <Input placeholder="text here!" />, <Button>Click me!</Button>,],
      [<Text> Row 3 Item 1 </Text>, <Input placeholder="text here!" />, <Button>Click me!</Button>, <Text> Row 3 Item 4 </Text>, <Input placeholder="text here!" />, <Button>Click me!</Button>,]
    ],
    [
      // Single row with custom styles
      [<Text> Single row </Text>, <Input placeholder="text here!" />, <Button>Click me!</Button>, <Text> Last item </Text>]
    ]
  ];

  // Load theme from localStorage or default to 'light'
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  // Update localStorage whenever the theme changes
  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };


  return (
    <StrictMode>
      <CustomProvider theme={theme}>
        <div style={{ padding: '20px' }}>
          <Heading level={1}>{theme === 'light' ? 'Light Theme' : 'Dark Theme'}</Heading>
          <Button onClick={toggleTheme}>
            Switch to {theme === 'light' ? 'Dark' : 'Light'} Theme
          </Button>
        </div>
        <Heading level={2}>One Row</Heading>
        <AlignedContainers
          data={data[0]}
        />

        <Heading level={2}>Split into Top and Bottom</Heading>
        <AlignedContainers
          data={data[1]}
          itemsPerRow={1}
          containerClassName=""
        />

        <Heading level={2}>Another row spanning multiple lines</Heading>
        <AlignedContainers
          data={data[2]}
          itemsPerRow={2}
        />

        <h2 className="text-2xl font-bold mb-4">Single Row with Custom Styles</h2>
        <AlignedContainers
          data={data[3]}
          containerClassName="rounded-lg shadow-md"
        />
      </CustomProvider>
    </StrictMode>
  )
}

export default App
