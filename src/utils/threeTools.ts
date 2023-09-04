import { Vector3, Object3D, Mesh, Group } from "three";

export const originVec3 = new Vector3();

export function isMesh(value: Object3D): value is Mesh {
  return value instanceof Mesh;
}

export function isGroup(value: Object3D): value is Group {
  return value instanceof Group;
}