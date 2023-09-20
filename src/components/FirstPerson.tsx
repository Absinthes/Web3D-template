import { useRef, useEffect, forwardRef } from "react";
import { Mesh, Vector3, Vector3Tuple } from "three";
import { useThree, useFrame, MeshProps } from "@react-three/fiber";
import { OrbitControls as OrbitControlsRaw } from "three/examples/jsm/controls/OrbitControls.js";

const tempVector = new Vector3();
const upVector = new Vector3(0, 1, 0);

export const Player = forwardRef<Mesh, MeshProps>((props, ref) => {
  return (
    <mesh ref={ref} {...props} visible={false}>
      <capsuleGeometry args={[0.2, 0.5, 20, 40]} />
      <meshStandardMaterial color={"#fff"} opacity={0} />
    </mesh>
  );
});

export type FirstPersonControlsProps = {
  enabled?: boolean;
  position?: Vector3Tuple;
  rotation?: Vector3Tuple;
};

const FirstPersonControls = (props: FirstPersonControlsProps) => {
  const { enabled = true, position = [0, 0, 0], rotation = [0, 0, 0] } = props;
  const { controls, camera } = useThree((state) => ({
    controls: state.controls as OrbitControlsRaw,
    camera: state.camera,
  }));

  const playerRef = useRef<Mesh>(null);

  let fwdPressed = false;
  let bkdPressed = false;
  let lftPressed = false;
  let rgtPressed = false;
  let upPressed = false;
  let downPressed = false;
  let shiftPressed = false;

  useEffect(() => {
    const keyDownEvent = (e: KeyboardEvent) => {
      switch (e.code) {
        case "KeyW":
          fwdPressed = true;
          break;
        case "KeyS":
          bkdPressed = true;
          break;
        case "KeyD":
          rgtPressed = true;
          break;
        case "KeyA":
          lftPressed = true;
          break;
        case "KeyQ":
          upPressed = true;
          break;
        case "KeyE":
          downPressed = true;
          break;
        case "ShiftLeft":
          shiftPressed = true;
          break;
      }
    };

    const keyUpEvent = (e: KeyboardEvent) => {
      switch (e.code) {
        case "KeyW":
          fwdPressed = false;
          break;
        case "KeyS":
          bkdPressed = false;
          break;
        case "KeyD":
          rgtPressed = false;
          break;
        case "KeyA":
          lftPressed = false;
          break;
        case "KeyQ":
          upPressed = false;
          break;
        case "KeyE":
          downPressed = false;
          break;
        case "ShiftLeft":
          shiftPressed = false;
          break;
      }
    };

    window.addEventListener("keydown", keyDownEvent);

    window.addEventListener("keyup", keyUpEvent);

    return () => {
      window.removeEventListener("keydown", keyDownEvent);
      window.removeEventListener("keyup", keyUpEvent);
    };
  });

  useEffect(() => {
    if (!controls) return;
    if (enabled) {
      controls.maxPolarAngle = Math.PI;
      controls.minDistance = 1e-4;
      controls.maxDistance = 1e-4;
    } else {
      controls.maxPolarAngle = Math.PI;
      controls.minDistance = 1;
      controls.maxDistance = Infinity;
    }
  }, [enabled]);

  function updatePlayer(delta: number) {
    // 修复漂移问题
    const angle = controls.getAzimuthalAngle();

    if (fwdPressed) {
      tempVector.set(0, 0, -1).applyAxisAngle(upVector, angle);
      playerRef.current?.position.addScaledVector(
        tempVector,
        10 * delta * (shiftPressed ? 5 : 1)
      );
    }

    if (bkdPressed) {
      tempVector.set(0, 0, 1).applyAxisAngle(upVector, angle);
      playerRef.current?.position.addScaledVector(
        tempVector,
        10 * delta * (shiftPressed ? 5 : 1)
      );
    }

    if (lftPressed) {
      tempVector.set(-1, 0, 0).applyAxisAngle(upVector, angle);
      playerRef.current?.position.addScaledVector(
        tempVector,
        10 * delta * (shiftPressed ? 5 : 1)
      );
    }

    if (rgtPressed) {
      tempVector.set(1, 0, 0).applyAxisAngle(upVector, angle);
      playerRef.current?.position.addScaledVector(
        tempVector,
        10 * delta * (shiftPressed ? 5 : 1)
      );
    }

    if (upPressed) {
      tempVector.set(0, 1, 0).applyAxisAngle(upVector, angle);
      playerRef.current?.position.addScaledVector(
        tempVector,
        10 * delta * (shiftPressed ? 5 : 1)
      );
    }

    if (downPressed) {
      tempVector.set(0, -1, 0).applyAxisAngle(upVector, angle);
      playerRef.current?.position.addScaledVector(
        tempVector,
        10 * delta * (shiftPressed ? 5 : 1)
      );
    }

    playerRef.current?.updateMatrixWorld();

    camera.position.sub(controls.target);
    controls.target.copy(playerRef.current!.position);
    camera.position.add(playerRef.current!.position);
  }

  useFrame((_, _delta) => {
    const delta = Math.min(_delta, 0.1);
    if (!enabled) return;

    for (let i = 0; i < 5; i++) {
      controls && playerRef.current && updatePlayer(delta / 5 / 2);
    }
  });

  return <Player ref={playerRef} position={position} rotation={rotation} />;
};

export default FirstPersonControls;
