import { PerspectiveCamera } from "@react-three/drei";
import { useRef } from "react";
import { Camera as CameraImpl } from "three";

export default function Camera() {
  const cameraRef = useRef<CameraImpl>(null);

  return <PerspectiveCamera makeDefault ref={cameraRef} />;
}
