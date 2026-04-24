import { NetworkInfo } from '../components/NetworkInfo';
import { DeviceList } from '../components/DeviceList';

export function NetworkPage() {
  return (
    <div className="page">
      <NetworkInfo />
      <DeviceList />
    </div>
  );
}