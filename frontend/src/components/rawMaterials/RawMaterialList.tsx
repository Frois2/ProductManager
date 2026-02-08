import { useState, useMemo } from 'react';
import { RawMaterial } from '@/types';
import { ConfirmModal } from '@/components/ui/ConfirmModal'; 
import { Edit, Trash2, AlertTriangle, CheckCircle, XCircle, Eye, Search } from 'lucide-react';
import { motion } from 'framer-motion';

interface RawMaterialListProps {
  materials: RawMaterial[];
  onView: (material: RawMaterial) => void;
  onEdit: (material: RawMaterial) => void;
  onDelete: (id: number) => Promise<void>;
}

const LOW_STOCK_LIMIT = 10;
const MotionTr = motion.tr as any;

export const RawMaterialList = ({ materials, onView, onEdit, onDelete }: RawMaterialListProps) => {
  const [materialToDelete, setMaterialToDelete] = useState<RawMaterial | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [searchTerm, setSearchTerm] = useState(''); // Estado da busca

  const confirmDelete = async () => {
    if (!materialToDelete?.id) return;
    setIsDeleting(true);
    try {
      await onDelete(materialToDelete.id);
      setMaterialToDelete(null);
    } finally {
      setIsDeleting(false);
    }
  };

  const getStockStatus = (quantity: number) => {
    if (quantity === 0) return { label: 'Out of Stock', color: 'bg-red-50 text-red-700 border-red-200', icon: XCircle };
    if (quantity < LOW_STOCK_LIMIT) return { label: 'Low Stock', color: 'bg-yellow-50 text-yellow-700 border-yellow-200', icon: AlertTriangle };
    return { label: 'OK', color: 'bg-green-50 text-green-700 border-green-200', icon: CheckCircle };
  };

  const filteredMaterials = useMemo(() => {
    return materials
        .filter(m => m.name.toLowerCase().includes(searchTerm.toLowerCase()))
        .sort((a, b) => (a.stockQuantity ?? 0) - (b.stockQuantity ?? 0));
  }, [materials, searchTerm]);

  return (
    <>
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-200 bg-gray-50 flex items-center gap-2">
            <div className="relative w-full max-w-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search size={18} className="text-gray-400" />
                </div>
                <input type="text" placeholder="Search materials..." className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-150 ease-in-out" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase w-1/2">Material Name</th>
                <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase">Status / Qty</th>
                <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredMaterials.length > 0 ? (
                filteredMaterials.map((material, index) => {
                    const status = getStockStatus(material.stockQuantity ?? 0);
                    const StatusIcon = status.icon;
                    return (
                    <MotionTr key={material.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: index * 0.04 }} className="hover:bg-gray-50">
                        <td className="py-4 px-6 font-medium text-gray-900">{material.name}</td>
                        <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${status.color}`}>
                            <StatusIcon size={12} /> {status.label}
                            </span>
                            <span className="text-sm text-gray-600 font-mono">{(material.stockQuantity ?? 0).toFixed(2)}</span>
                        </div>
                        </td>
                        <td className="py-4 px-6">
                        <div className="flex justify-end gap-1">
                            
                            <button onClick={() => onView(material)} className="p-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors" title="View Details">
                                <Eye size={18} />
                            </button>

                            <button onClick={() => onEdit(material)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors" title="Edit">
                                <Edit size={18} />
                            </button>
                            
                            <button onClick={() => setMaterialToDelete(material)} className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors" title="Delete">
                                <Trash2 size={18} />
                            </button>
                        </div>
                        </td>
                    </MotionTr>
                    );
                })
              ) : (
                <tr>
                    <td colSpan={3} className="py-8 text-center text-gray-500">
                        No materials found matching "{searchTerm}"
                    </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <ConfirmModal isOpen={!!materialToDelete} onClose={() => setMaterialToDelete(null)} onConfirm={confirmDelete} title="Delete Material?" description={`Are you sure you want to delete "${materialToDelete?.name}"?`} isLoading={isDeleting} />
    </>
  );
};