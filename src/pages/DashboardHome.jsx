import { useState } from 'react';
import ModalDetail from '../components/ModalDetail';
import { NetworkInfo } from '../components/NetworkInfo';
import { DeviceList } from '../components/DeviceList';
import { CabinControl } from '../components/CabinControl';
import { ActuatorStatus } from '../components/ActuatorStatus';
import { ServiceChecker } from '../components/ServiceChecker';
import { OTAControl } from '../components/OTAControl';

export default function DashboardHome() {
  const [selectedModal, setSelectedModal] = useState(null);

  const widgets = [
    { id: 'network', title: 'Información de Red', component: NetworkInfo },
    { id: 'devices', title: 'Dispositivos en Red', component: DeviceList },
    { id: 'cabin', title: 'Control de Cabina', component: CabinControl },
    { id: 'actuators', title: 'Estado de Actuadores', component: ActuatorStatus },
    { id: 'services', title: 'Estado de Servicios', component: ServiceChecker },
    { id: 'ota', title: 'Sistema OTA', component: OTAControl },
  ];

  return (
    <div className="dashboard-container">
      <div className="dashboard-grid">
        {widgets.map((widget) => {
          const Component = widget.component;
          return (
            <div
              key={widget.id}
              className="dashboard-item"
              onClick={() => setSelectedModal(widget.id)}
            >
              <Component isMinimized={true} />
            </div>
          );
        })}
      </div>

      {/* Renderizar modal para el widget seleccionado */}
      {selectedModal && (
        <ModalDetail
          title={widgets.find(w => w.id === selectedModal).title}
          isOpen={true}
          onClose={() => setSelectedModal(null)}
        >
          {(() => {
            const Component = widgets.find(w => w.id === selectedModal)?.component;
            return Component ? <Component isMinimized={false} /> : null;
          })()}
        </ModalDetail>
      )}
    </div>
  );
}
