import { PropsWithChildren, useEffect, useRef } from "react";
import { Group } from "three";
import { worldOctree } from ".";

export default function Collisions(props: PropsWithChildren) {
  const groupRef = useRef<Group>(null);

  useEffect(() => {
    if (!groupRef.current) return;
    worldOctree.fromGraphNode(groupRef.current);
  }, []);

  return <group ref={groupRef}>{props.children}</group>;
}
