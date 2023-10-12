import { useEffect, useState } from "react";

import OBR from "@owlbear-rodeo/sdk";
import { TrackerHeader } from "./TrackerHeader";
import { Tracker } from "./Tracker";

export function App() {
  const [sceneReady, setSceneReady] = useState(false);
  useEffect(() => {
    OBR.scene.isReady().then(setSceneReady);
    return OBR.scene.onReadyChange(setSceneReady);
  }, []);

  if (sceneReady) {
    return <Tracker />;
  } else {
    // Show a basic header when the scene isn't ready
    return (
      <TrackerHeader subtitle="Open a scene to use this plugin" />
    );
  }
}
