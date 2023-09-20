import { PerspectiveCamera } from "@react-three/drei";
import { useEffect, useRef } from "react";
import { Camera as CameraImpl } from "three";

export let globalCamera: CameraImpl;

export default function Camera() {
  const cameraRef = useRef<CameraImpl>(null);

  useEffect(() => {
    globalCamera = cameraRef.current!;
  });

  return <PerspectiveCamera ref={cameraRef} />;
}
