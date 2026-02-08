import { useState, FormEvent } from 'react';
import { RawMaterial } from '@/types';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Save } from 'lucide-react';

interface RawMaterialFormProps {
  initialData?: RawMaterial;
  onSubmit: (data: Omit<RawMaterial, 'id'>) => Promise<void>;
  onCancel: () => void;
}

export const RawMaterialForm = ({ initialData, onSubmit, onCancel }: RawMaterialFormProps) => {
  const [formData, setFormData] = useState({ name: initialData?.name || '', stockQuantity: initialData?.stockQuantity || 0 });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Material description is required';
    if (formData.stockQuantity < 0) newErrors.stockQuantity = 'Quantity cannot be negative';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <Input label="Material Description" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="Ex: Cotton Fabric, M4 Screw, Wood..." error={errors.name} required />
        <div className="w-1/2 pr-2">
          <Input label="Stock Quantity" type="number" step="0.01" value={formData.stockQuantity} onChange={e => setFormData({ ...formData, stockQuantity: parseFloat(e.target.value) })} placeholder="0" error={errors.stockQuantity} required />
        </div>
      </div>
      <div className="flex justify-end gap-3 pt-6 border-t border-gray-100 mt-6">
        <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
        <Button type="submit" leftIcon={<Save size={18} />} isLoading={isSubmitting}>
          {initialData ? 'Save Changes' : 'Create Material'}
        </Button>
      </div>
    </form>
  );
};

export default RawMaterialForm;