import { PerformancePanel } from "@/components/PerformancePanel";
import { Stats, StatsGl } from "@react-three/drei";

export default function Help() {
  if (import.meta.env.MODE == "production") {
    return <></>;
  }
  return (
    <>
      <Stats showPanel={2} className="ml-270px" />
      <StatsGl />
      <PerformancePanel />
      <axesHelper />
    </>
  );
}
