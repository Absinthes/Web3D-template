import { useFrame } from "@react-three/fiber";
import { useControls } from "leva";
import { OrbitControls } from "three-stdlib";

export function PerformancePlane() {
  const [_, setPerformance] = useControls(
    "Performance",
    () => {
      return {
        geometries: 0,
        textures: 0,
        frame: 0,
        calls: 0,
        triangles: { value: 0 },
        points: 0,
        lines: 0,
      };
    },
    { collapsed: true, order: -1 }
  );

  const [__, setCameraInfo] = useControls(
    "camera",
    () => {
      return {
        position: [0, 0, 0],
      };
    },
    { collapsed: true, order: -1 }
  );

  const [___, setControlsInfo] = useControls(
    "controls",
    () => {
      return {
        target: [0, 0, 0],
        position: [0, 0, 0],
        polarAngle: 0,
        azimuthalAngle: 0,
      };
    },
    { collapsed: true, order: -1 }
  );

  useFrame(({ gl, camera, controls: c }) => {
    const {
      memory: { geometries, textures },
      render: { frame, calls, triangles, points, lines },
    } = gl.info;
    setPerformance({
      geometries,
      textures,
      frame,
      calls,
      triangles,
      points,
      lines,
    });

    setCameraInfo({
      position: [camera.position.x, camera.position.y, camera.position.z],
    });

    const controls = c as OrbitControls;
    const controlsTarget = controls.position0;

    setControlsInfo({
      position: [controlsTarget.x, controlsTarget.y, controlsTarget.z],
      target: [
        controls.position0.x,
        controls.position0.y,
        controls.position0.z,
      ],
      polarAngle: controls.getPolarAngle(),
      azimuthalAngle: controls.getAzimuthalAngle(),
    });
  });
  return <></>;
}
