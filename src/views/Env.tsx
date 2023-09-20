import { useControls } from "leva";
import { a, config, useSpring } from "@react-spring/three";

export function Env() {
  const { background, ambientLightIntensity } = useControls("Env", {
    background: "#000",
    ambientLightIntensity: 1,
  });

  const s = useSpring({
    from: {
      intensity: 1,
    },
    config: config.slow,
  });

  s.intensity.start({
    to: ambientLightIntensity,
  });

  return (
    <>
      <a.ambientLight name="ambientLight" intensity={s.intensity} />
      <color attach="background" args={[background]} />
      {/* <Environment preset="sunset" /> */}
    </>
  );
}
