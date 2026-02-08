import { useState, FormEvent } from 'react';
import { Product } from '@/types';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Info } from 'lucide-react';

interface ProductFormProps {
  initialData?: Product;
  onSubmit: (data: Omit<Product, 'id'>) => Promise<void>;
  onCancel: () => void;
}

export const ProductForm = ({ initialData, onSubmit, onCancel }: ProductFormProps) => {
  const [formData, setFormData] = useState({ name: initialData?.name || '', price: initialData?.price || 0 });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Product name is required';
    if (formData.price <= 0) newErrors.price = 'Sale price must be greater than zero';
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
      <div className="bg-blue-50 border border-blue-100 rounded-md p-3 flex gap-3 items-start">
        <Info className="text-blue-600 mt-0.5 shrink-0" size={16} />
        <p className="text-xs text-blue-700">{initialData ? 'Price changes may impact future production planning.' : 'Fill in the basic information to register a new item in the catalog.'}</p>
      </div>

      <div className="space-y-4">
        <Input label="Product Description" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="Ex: Ergonomic Office Chair" error={errors.name} required />
        <div className="w-1/2 pr-2">
          <Input label="Sale Price (USD)" type="number" step="0.01" value={formData.price} onChange={e => setFormData({ ...formData, price: parseFloat(e.target.value) })} placeholder="0.00" error={errors.price} required />
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-6 border-t border-gray-100 mt-6">
        <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
        <Button type="submit" isLoading={isSubmitting}>{initialData ? 'Save Changes' : 'Create Product'}</Button>
      </div>
    </form>
  );
};
