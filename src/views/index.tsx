import { Canvas } from "@react-three/fiber";
import { Loader } from "@react-three/drei";
import Controls from "./Controls";
import Camera from "./Camera";
import { Suspense } from "react";
import Help from "./Help";
import { Env } from "./Env";
import { Scene } from "./Scene";

export default function Index() {
  return (
    <>
      <Canvas>
        <Help />
        <Controls />
        <Camera />
        <Env />
        <Suspense>
          <Scene />
        </Suspense>
      </Canvas>
      <Loader />
    </>
  );
}
