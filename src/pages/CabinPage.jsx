import { CabinControl } from '../components/CabinControl';
import { ActuatorStatus } from '../components/ActuatorStatus';

export function CabinPage() {
  return (
    <div className="page">
      <CabinControl />
      <ActuatorStatus />
    </div>
  );
}