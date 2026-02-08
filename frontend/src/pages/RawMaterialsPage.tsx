import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { fetchRawMaterials, createRawMaterial, updateRawMaterial, deleteRawMaterial } from '@/store/slices/rawMaterialSlice';
import { RawMaterial } from '@/types';
import { RawMaterialList } from '@/components/rawMaterials/RawMaterialList';
import { RawMaterialForm } from '@/components/rawMaterials/RawMaterialForm';
import { RawMaterialViewModal } from '@/components/rawMaterials/RawMaterialViewModal'; // Import new modal
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Loading } from '@/components/ui/Loading';
import { Plus, Box } from 'lucide-react';
import toast from 'react-hot-toast';

export const RawMaterialsPage = () => {
  const dispatch = useAppDispatch();
  const { items: materials, loading } = useAppSelector((state) => state.rawMaterials);

  const [showFormModal, setShowFormModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false); // New state
  
  const [editingMaterial, setEditingMaterial] = useState<RawMaterial | null>(null);
  const [viewingMaterial, setViewingMaterial] = useState<RawMaterial | null>(null); // New state

  useEffect(() => {
    dispatch(fetchRawMaterials());
  }, [dispatch]);

  const handleCreate = () => {
    setEditingMaterial(null);
    setShowFormModal(true);
  };

  const handleEdit = (material: RawMaterial) => {
    setEditingMaterial(material);
    setShowFormModal(true);
  };

  const handleView = (material: RawMaterial) => { // New handler
    setViewingMaterial(material);
    setShowViewModal(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await dispatch(deleteRawMaterial(id)).unwrap();
      toast.success('Material deleted successfully');
    } catch (error) {
      toast.error('Failed to delete material');
    }
  };

  const handleSubmitForm = async (data: Omit<RawMaterial, 'id'>) => {
    try {
      if (editingMaterial?.id) {
        await dispatch(updateRawMaterial({ id: editingMaterial.id, data })).unwrap();
        toast.success('Material updated successfully');
      } else {
        await dispatch(createRawMaterial(data)).unwrap();
        toast.success('Material created successfully');
      }
      setShowFormModal(false);
      setEditingMaterial(null);
    } catch (error) {
      toast.error('Failed to save material');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 b-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
            <Box className="text-gray-700" size={20} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Raw Materials</h1>
            <p className="text-sm text-gray-500">Manage your inventory stock</p>
          </div>
        </div>

        <Button onClick={handleCreate} leftIcon={<Plus size={18} />}>
          New Material
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loading />
        </div>
      ) : (
        <RawMaterialList materials={materials} onView={handleView} onEdit={handleEdit} onDelete={handleDelete}/>)}

      <Modal isOpen={showFormModal} onClose={() => setShowFormModal(false)} title={editingMaterial ? 'Edit Material' : 'New Material'}>
        <RawMaterialForm initialData={editingMaterial || undefined} onSubmit={handleSubmitForm} onCancel={() => setShowFormModal(false)}/>
      </Modal>

      <RawMaterialViewModal isOpen={showViewModal} onClose={() => setShowViewModal(false)}material={viewingMaterial}/>
    </div>
  );
};