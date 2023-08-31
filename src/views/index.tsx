import { Canvas } from "@react-three/fiber";
import { Environment, Loader, Stats } from "@react-three/drei";
import { PerformancePlane } from "@/components/PerformancePanel";
import { Leva } from "leva";
import Controls from "./Controls";
import Camera from "./Camera";
import { Suspense } from "react";

export default function Index() {
  return (
    <>
      <Canvas>
        <Help />
        <Controls />
        <Camera />
        <Environment preset="sunset" />
        <color attach="background" args={["#c3c3cc"]} />
        <Suspense>
          <Scene />
        </Suspense>
      </Canvas>
      <Loader />
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
