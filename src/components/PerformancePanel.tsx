import { useThree } from "@react-three/fiber";
import { useControls } from "leva";
import { useEffect } from "react";
import { PerspectiveCamera } from "three";
import { OrbitControls } from "three-stdlib";

export function PerformancePanel() {
  const { gl, camera, controls } = useThree((state) => ({
    gl: state.gl,
    camera: state.camera as PerspectiveCamera,
    controls: state.controls as OrbitControls,
  }));

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
        rotation: [0, 0, 0],
        fov: 0,
        near: 0,
        far: 0,
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

  function updateParams() {
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
      rotation: [camera.rotation.x, camera.rotation.y, camera.rotation.z],
      fov: camera.fov,
      near: camera.near,
      far: camera.far,
    });

    if (!controls) return;

    const controlsTarget = controls.target;

    setControlsInfo({
      target: [controlsTarget.x, controlsTarget.y, controlsTarget.z],
      position: [
        controls.position0.x,
        controls.position0.y,
        controls.position0.z,
      ],
      polarAngle: controls.getPolarAngle(),
      azimuthalAngle: controls.getAzimuthalAngle(),
    });
  }

  useEffect(() => {
    controls?.addEventListener("end", updateParams);
    return () => {
      controls?.removeEventListener("end", updateParams);
    };
  }, [controls]);

  return <></>;
}
