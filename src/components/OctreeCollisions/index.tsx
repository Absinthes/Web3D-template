import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { Clock, Mesh, Vector3 } from "three";
import { Capsule, Octree, OrbitControls } from "three-stdlib";
import { OctreeHelper } from "three/examples/jsm/helpers/OctreeHelper.js";

export const worldOctree = new Octree();
const clock = new Clock();
const playerVelocity = new Vector3();
const playerDirection = new Vector3();

const STEPS_PER_FRAME = 5;

export type OctreeCollisionsProps = {
  radius?: number;
  height?: number;
  helperVisible?: boolean;
  gravity?: number;
};

export default function OctreeCollisions(props: OctreeCollisionsProps) {
  const {
    radius = 0.35,
    height = 1,
    helperVisible = false,
    gravity: GRAVITY = 30,
  } = props;
  const { controls, camera, scene } = useThree((state) => ({
    controls: state.controls as OrbitControls,
    camera: state.camera,
    scene: state.scene,
  }));

  const capsuleMesh = useRef<Mesh>(null);

  const helper = useRef(new OctreeHelper(worldOctree));

  const playerCollider = useRef(
    new Capsule(new Vector3(0, radius, 0), new Vector3(0, height, 0), radius)
  );

  const playerOnFloor = useRef(false);

  const keyStates = useRef<Record<string, boolean>>({});

  function playerCollisions() {
    const result = worldOctree.capsuleIntersect(playerCollider.current);

    playerOnFloor.current = false;

    if (result) {
      playerOnFloor.current = result.normal.y > 0;

      if (!playerOnFloor) {
        playerVelocity.addScaledVector(
          result.normal,
          -result.normal.dot(playerVelocity)
        );
      }

      playerCollider.current.translate(
        result.normal.multiplyScalar(result.depth)
      );
    }
  }

  function updatePlayer(deltaTime: number) {
    let damping = Math.exp(-4 * deltaTime) - 1;

    if (!playerOnFloor.current) {
      playerVelocity.y -= GRAVITY * deltaTime;

      // small air resistance
      damping *= 0.1;
    }

    playerVelocity.addScaledVector(playerVelocity, damping);

    const deltaPosition = playerVelocity.clone().multiplyScalar(deltaTime);
    playerCollider.current.translate(deltaPosition);

    playerCollisions();

    syncCapsule();

    camera.position.sub(controls.target);
    controls?.target.copy(playerCollider.current.end);
    camera.position.add(playerCollider.current.end);
  }

  function syncCapsule() {
    const end = playerCollider.current.end.clone();
    end.y -= radius;
    capsuleMesh.current?.position.copy(end);
  }

  function getForwardVector() {
    camera.getWorldDirection(playerDirection);
    playerDirection.y = 0;
    playerDirection.normalize();

    return playerDirection;
  }

  function getSideVector() {
    camera.getWorldDirection(playerDirection);
    playerDirection.y = 0;
    playerDirection.normalize();
    playerDirection.cross(camera.up);

    return playerDirection;
  }

  function controlsUpdate(deltaTime: number) {
    // gives a bit of air control
    const speedDelta = deltaTime * (playerOnFloor ? 25 : 8);

    if (keyStates.current["KeyW"]) {
      playerVelocity.add(getForwardVector().multiplyScalar(speedDelta));
    }

    if (keyStates.current["KeyS"]) {
      playerVelocity.add(getForwardVector().multiplyScalar(-speedDelta));
    }

    if (keyStates.current["KeyA"]) {
      playerVelocity.add(getSideVector().multiplyScalar(-speedDelta));
    }

    if (keyStates.current["KeyD"]) {
      playerVelocity.add(getSideVector().multiplyScalar(speedDelta));
    }

    if (playerOnFloor) {
      if (keyStates.current["Space"]) {
        playerVelocity.y = 5;
      }
    }
  }

  useEffect(() => {
    const keyDownEvent = (e: KeyboardEvent) => {
      keyStates.current[e.code] = true;
    };
    const keyUpEvent = (e: KeyboardEvent) => {
      keyStates.current[e.code] = false;
    };

    document.addEventListener("keydown", keyDownEvent);
    document.addEventListener("keyup", keyUpEvent);

    scene.add(helper.current);

    if (!controls) return;
    controls.maxPolarAngle = Math.PI;
    controls.minDistance = 1e-4;
    controls.maxDistance = 1e-4;

    return () => {
      document.removeEventListener("keydown", keyDownEvent);
      document.removeEventListener("keyup", keyUpEvent);
    };
  });

  useEffect(() => {
    helper.current.visible = helperVisible;
  }, [helperVisible]);

  useFrame(() => {
    const deltaTime = Math.min(0.05, clock.getDelta()) / STEPS_PER_FRAME;

    for (let i = 0; i < STEPS_PER_FRAME; i++) {
      controlsUpdate(deltaTime);

      updatePlayer(deltaTime);

      // teleportPlayerIfOob();
    }
  });

  return (
    <mesh ref={capsuleMesh} visible={false}>
      <capsuleGeometry args={[radius, height]} />
      <meshNormalMaterial />
    </mesh>
  );
}
