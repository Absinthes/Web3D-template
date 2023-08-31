import { PerspectiveCamera } from "@react-three/drei";
import { createRef, useEffect } from "react";
import { Camera as CameraImpl } from "three";

export let globalCamera: CameraImpl;

export default function Camera() {
  const cameraRef = createRef<CameraImpl>();

  useEffect(() => {
    globalCamera = cameraRef.current!;
  });

  return (
    <PerspectiveCamera
      ref={cameraRef}
    />
  );
}
