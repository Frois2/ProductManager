import { useEffect, useState } from 'react';
import { Product } from '@/types';
import { CompositionService } from '@/services/compositionService'; // Importe seu service
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Loading } from '@/components/ui/Loading';
import { Package, Layers, DollarSign } from 'lucide-react';

interface ProductViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
}

export const ProductViewModal = ({ isOpen, onClose, product }: ProductViewModalProps) => {
  const [composition, setComposition] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (isOpen && product?.id) {
      loadComposition();
    } else {
      setComposition([]);
    }
  }, [isOpen, product]);

  const loadComposition = async () => {
    if (!product?.id) return;
    setLoading(true);
    try {
      const all = await CompositionService.getAll();
      const filtered = all.filter((c: any) => 
        String(c.product?.id || c.productId) === String(product.id)
      );
      setComposition(filtered);
    } catch (error) {
      console.error("Failed to load details");
    } finally {
      setLoading(false);
    }
  };

  if (!product) return null;

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Product Datasheet">
      <div className="space-y-6">
        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg border border-gray-100">
          <div className="w-12 h-12 bg-white border border-gray-200 rounded-lg flex items-center justify-center shadow-sm">
            <Package className="text-indigo-600" size={24} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">{product.name}</h3>
            <div className="flex items-center gap-1 text-green-600 font-medium mt-1">
              <DollarSign size={16} />
              <span>Sale Price: {formatCurrency(product.price)}</span>
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
            <Layers size={16} />
            Bill of Materials (Composition)
          </h4>
          
          {loading ? (
            <div className="py-4 flex justify-center"><Loading /></div>
          ) : composition.length > 0 ? (
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-gray-500 font-medium">
                  <tr>
                    <th className="px-4 py-2">Material</th>
                    <th className="px-4 py-2 text-right">Qty Required</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {composition.map((item, index) => (
                    <tr key={index} className="bg-white">
                      <td className="px-4 py-2 text-gray-900">
                        {item.rawMaterial?.name || 'Unknown Material'}
                      </td>
                      <td className="px-4 py-2 text-right font-mono text-blue-600">
                        {item.quantityRequired || item.quantity}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-6 bg-gray-50 rounded-lg border border-dashed border-gray-300">
              <p className="text-gray-500 text-sm">No raw materials associated with this product.</p>
            </div>
          )}
        </div>

        <div className="pt-4 border-t border-gray-100 flex justify-end">
          <Button onClick={onClose} variant="secondary">Close</Button>
        </div>
      </div>
    </Modal>
  );
};