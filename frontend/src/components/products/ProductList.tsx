import { useState } from 'react';
import { Product } from '@/types';
import { Button } from '@/components/ui/Button';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { Edit, Trash2, Layers, Eye, Search } from 'lucide-react';
import { motion } from 'framer-motion';

interface ProductListProps {
  products: Product[];
  onView: (product: Product) => void;
  onEdit: (product: Product) => void;
  onDelete: (id: number) => Promise<void>;
  onManageComposition: (product: Product) => void;
}

export const ProductList = ({ products, onView, onEdit, onDelete, onManageComposition }: ProductListProps) => {
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [searchTerm, setSearchTerm] = useState(''); // Estado da busca

  const MotionTr = motion.tr as any;

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);

  const handleOpenDeleteModal = (product: Product) => setProductToDelete(product);

  const confirmDelete = async () => {
    if (!productToDelete?.id) return;
    setIsDeleting(true);
    try {
      await onDelete(productToDelete.id);
      setProductToDelete(null);
    } finally {
      setIsDeleting(false);
    }
  };
  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        
        <div className="p-4 border-b border-gray-200 bg-gray-50 flex items-center gap-2">
            <div className="relative w-full max-w-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search size={18} className="text-gray-400" />
                </div>
                <input type="text" placeholder="Search products..." className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-150 ease-in-out" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}/>
            </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider w-1/2">Product Name</th>
                <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Sale Price</th>
                <th className="py-4 px-6"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product, index) => (
                    <MotionTr key={product.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: index * 0.05 }} className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-6">
                        <div className="font-medium text-gray-900">{product.name}</div>
                    </td>

                    <td className="py-4 px-6">
                        <div className="font-medium text-gray-900">{formatCurrency(product.price)}</div>
                    </td>

                    <td className="py-4 px-6">
                        <div className="flex items-center justify-end gap-3">
                        <Button size="sm" variant="secondary" onClick={() => onManageComposition(product)} leftIcon={<Layers size={16} />} className="text-gray-700 bg-white border border-gray-300 hover:bg-gray-100">
                            Composition
                        </Button>

                        <div className="flex items-center gap-1 border-l border-gray-200 pl-3 ml-1">
                            <button onClick={() => onView(product)} className="p-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors" title="View Details">
                                <Eye size={18} />
                            </button>

                            <button onClick={() => onEdit(product)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors" title="Edit">
                                <Edit size={18} />
                            </button>

                            <button onClick={() => handleOpenDeleteModal(product)} className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors" title="Delete">
                                <Trash2 size={18} />
                            </button>
                        </div>
                        </div>
                    </td>
                    </MotionTr>
                ))
              ) : (
                <tr>
                    <td colSpan={3} className="py-8 text-center text-gray-500">
                        No products found matching "{searchTerm}"
                    </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmModal isOpen={!!productToDelete} onClose={() => setProductToDelete(null)} onConfirm={confirmDelete} title="Delete Product?" description={`Are you sure you want to remove "${productToDelete?.name}"? This action cannot be undone.`} isLoading={isDeleting}/>
    </>
  );
};