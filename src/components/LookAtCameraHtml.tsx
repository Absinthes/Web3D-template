import { Html } from "@react-three/drei";
import { HtmlProps } from "@react-three/drei/web/Html";
import { useFrame, useThree } from "@react-three/fiber";
import { PropsWithChildren, createRef, useEffect, useRef } from "react";
import { Group } from "three";

export type LookAtCameraHtmlProps = {
  final?: boolean;
} & HtmlProps;

export function LookAtCameraHtml({
  children,
  position,
  final = false,
  ...config
}: PropsWithChildren<LookAtCameraHtmlProps>) {
  const { camera } = useThree();
  const htmlRef = createRef<Group>();

  function lookAtCamera() {
    const target = htmlRef.current as Group;
    target.lookAt(camera.position);
  }

  useEffect(() => {
    lookAtCamera();
  });

  useFrame(() => {
    if (!final) return;
    lookAtCamera();
  });

  return (
    <group ref={htmlRef} position={position}>
      <Html {...config} transform>
        {children}
      </Html>
    </group>
  );
}
