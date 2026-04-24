import { ServiceChecker } from '../components/ServiceChecker';
import { OTAControl } from '../components/OTAControl';

export function SystemPage() {
  return (
    <div className="page">
      <ServiceChecker />
      <OTAControl />
    </div>
  );
}