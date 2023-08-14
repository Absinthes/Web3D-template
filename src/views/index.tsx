import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls, Stats } from "@react-three/drei";
import { PerformancePlane } from "@/components/PerformancePlane";
import { Leva } from "leva";

export default function Index() {
  return (
    <>
      <Canvas>
        <Help />
        <Environment preset="sunset" />
        <color attach="background" args={["#c3c3cc"]} />
        <OrbitControls makeDefault />
        <Scene />
      </Canvas>
    </>
  );
}

function Help() {
  if(import.meta.env.MODE == 'production'){
    Leva({hidden: false})
    return <></>
  }
  return (
    <>
      <Stats  />
      <PerformancePlane />
      <axesHelper />
    </>
  );
}

function Scene() {
  return <></>;
}
