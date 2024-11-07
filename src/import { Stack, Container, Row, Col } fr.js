import { Stack, Container, Row, Col } from 'rsuite';

const AlignedContainers = ({ 
  data, 
  itemsPerRow = 0,
  containerClassName 
}) => {
  const isOneRow = itemsPerRow <= 0;

  return (
    <Container className={containerClassName}>
      {data.map((items, index) => (
        <Stack 
          key={index} 
          direction="column" 
          spacing={20} // similar to gap-4 in Tailwind
          className={containerClassName}
        >
          {isOneRow ? (
            // Display all items in a single row
            <Row gutter={16} wrap="true">
              {items.map((item, itemIndex) => (
                <Col key={itemIndex} className="flex-1" xs={24} sm={12} md={6}>
                  {item}
                </Col>
              ))}
            </Row>
          ) : (
            // Split items between top and bottom rows
            <>
              {/* Top row */}
              <Row gutter={16} justify="center" wrap="true">
                {items.slice(0, itemsPerRow).map((item, itemIndex) => (
                  <Col key={itemIndex} xs={24} sm={12} md={6}>
                    {item}
                  </Col>
                ))}
              </Row>

              {/* Bottom row */}
              <Row gutter={16} justify="center" wrap="true">
                {items.slice(itemsPerRow).map((item, itemIndex) => (
                  <Col key={itemIndex} xs={24} sm={12} md={6}>
                    {item}
                  </Col>
                ))}
              </Row>
            </>
          )}
        </Stack>
      ))}
    </Container>
  );
};

export default AlignedContainers;
