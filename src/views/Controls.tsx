import { OrbitControls } from "@react-three/drei";
import { useRef } from "react";
import { OrbitControls as OrbitControlsImpl } from "three-stdlib";

export default function Controls() {
  const orbitControlsRef = useRef<OrbitControlsImpl>(null);

  return (
    <>
      <OrbitControls makeDefault ref={orbitControlsRef} />
    </>
  );
}
