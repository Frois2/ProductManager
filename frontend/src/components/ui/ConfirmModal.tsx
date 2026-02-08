import { Modal } from './Modal';
import { Button } from './Button';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  isLoading?: boolean;
}

export const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  isLoading,
}: ConfirmModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <div className="space-y-4 pt-1">
        <p className="text-sm text-gray-600">
          {description}
        </p>

        <div className="flex justify-end gap-2 pt-2">
          <Button size="sm" variant="secondary" onClick={onClose} disabled={isLoading} className="bg-white border-gray-300 text-gray-700 hover:bg-gray-50" >
            Cancel
          </Button>
          
          <Button size="sm" variant="danger" onClick={onConfirm} isLoading={isLoading}>
            Delete
          </Button>
        </div>
      </div>
    </Modal>
  );
};
