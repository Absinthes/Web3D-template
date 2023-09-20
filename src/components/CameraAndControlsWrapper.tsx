import { Flatten } from "@/types";
import { useThree } from "@react-three/fiber";
import { Vector3Tuple, Vector3 } from "three";
import { OrbitControls } from "three-stdlib";

type CameraWrapperProps = {
  cameraPosition: Flatten<Vector3Tuple>;
  target: Flatten<Vector3Tuple>;
};

type ControlsWrapperProps = {
  target: Flatten<Vector3Tuple>;
};

const t = new Vector3();

export const CameraWrapper = ({
  cameraPosition,
  target,
}: CameraWrapperProps) => {
  const { camera } = useThree((state) => ({
    camera: state.camera,
  }));
  camera.position.set(...cameraPosition);
  camera.lookAt(t.set(...target));
  return null;
};

export const ControlsWrapper = ({ target }: ControlsWrapperProps) => {
  const { controls } = useThree((state) => ({
    controls: state.controls as OrbitControls,
  }));

  if (controls) {
    controls.target.set(...target);
  }
  return null;
};
