import { useThree } from "@react-three/fiber";
import { a, config, useSpring } from "@react-spring/three";
import { memo, useMemo } from "react";
import { Vector3Tuple } from "three";
import { OrbitControls } from "three-stdlib";
import { CameraWrapper, ControlsWrapper } from "./CameraAndControlsWrapper";
import { EventEmitter } from "@/utils";

export const levelEmitter = new EventEmitter();
export enum LevelEmitterEnum {
  AnimateEnd = "AnimateEnd",
  AnimateStart = "AnimateStart",
}

type AnimateEyeToTargetType = {
  position: Vector3Tuple;
  target: Vector3Tuple;
};

const defaultPos: AnimateEyeToTargetType = {
  position: [0, 0, 0],
  target: [0, 0, 0],
};

export const AnimateEyeToTarget = memo(
  ({ position, target }: AnimateEyeToTargetType) => {
    const get = useThree((state) => state.get);
    const camera = get().camera;
    const controls = get().controls as OrbitControls;

    const s = useSpring({
      from: defaultPos,
      config: {
        ...config.slow,
      },
      onStart: () => {
        if (!controls) return;
        controls.enabled = false;
        levelEmitter.trigger(LevelEmitterEnum.AnimateStart);
      },
      onRest: () => {
        if (!controls) return;
        controls.enabled = true;
        levelEmitter.trigger(LevelEmitterEnum.AnimateEnd);
      },
    });

    const AnimatedNavigation = useMemo(() => a(CameraWrapper), []);
    const AnimateControls = useMemo(() => a(ControlsWrapper), []);

    if (!camera || !controls) return null;

    s.position.start({
      from: camera.position.toArray(),
      to: position,
      config: config.slow,
    });
    s.target.start({
      from: controls ? controls.target.toArray() : defaultPos.target,
      to: target,
      config: config.slow,
    });

    return (
      <>
        <AnimatedNavigation
          cameraPosition={s.position as unknown as Vector3Tuple}
          target={s.target as unknown as Vector3Tuple}
        />
        <AnimateControls target={s.target as unknown as Vector3Tuple} />
      </>
    );
  }
);
