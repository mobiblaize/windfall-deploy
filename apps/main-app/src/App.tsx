import { Button, Drawer } from "@mantine/core";

import { useState } from "react";

function App() {
  const [opened, setOpened] = useState(false);

  return (
    <div className={"text-red-500 p-5"}>
      <h1>Hello World React is great</h1>
      <Button
        variant="outline"
        onClick={() => {
          setOpened(true);
        }}
      >
        Click me
      </Button>

      <Drawer opened={opened} onClose={() => setOpened(false)}>
        <h2>This is a Drawer</h2>
      </Drawer>
    </div>
  );
}

export default App;
