import { OrbitControls } from "@react-three/drei";
import { useEffect, useRef } from "react";
import { OrbitControls as OrbitControlsImpl } from "three-stdlib";

export let globalOrbitControls: OrbitControlsImpl;

export default function Controls() {
  const orbitControlsRef = useRef<OrbitControlsImpl>(null);

  useEffect(() => {
    globalOrbitControls = orbitControlsRef.current!;
  });

  return (
    <>
      <OrbitControls ref={orbitControlsRef} />
    </>
  );
}
