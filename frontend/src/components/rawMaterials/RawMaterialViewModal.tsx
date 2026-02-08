import { RawMaterial } from '@/types';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';

interface RawMaterialViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  material: RawMaterial | null;
}

export const RawMaterialViewModal = ({ isOpen, onClose, material }: RawMaterialViewModalProps) => {
  if (!material) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Material Details">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-500 uppercase tracking-wider">Material Name</label>
          <div className="mt-1 text-lg font-medium text-gray-900">{material.name}</div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-500 uppercase tracking-wider">Stock Quantity</label>
          <div className="mt-1 text-lg font-medium text-blue-600">
            {material.stockQuantity?.toFixed(2) || '0.00'} units
          </div>
        </div>

        <div className="pt-4 border-t border-gray-100 flex justify-end">
          <Button onClick={onClose} variant="secondary">Close</Button>
        </div>
      </div>
    </Modal>
  );
};