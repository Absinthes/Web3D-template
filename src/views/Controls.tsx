import { OrbitControls } from "@react-three/drei";
import { createRef, useEffect } from "react";
import { OrbitControls as OrbitControlsImpl } from "three-stdlib";

export let globalOrbitControls: OrbitControlsImpl;

export default function Controls() {
  const orbitControlsRef = createRef<OrbitControlsImpl>();

  useEffect(() => {
    globalOrbitControls = orbitControlsRef.current!;
  });

  return (
    <>
      <OrbitControls
        ref={orbitControlsRef}
      />
    </>
  );
}
