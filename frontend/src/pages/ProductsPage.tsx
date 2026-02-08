import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { fetchProducts, createProduct, updateProduct, deleteProduct } from '@/store/slices/productSlice';
import { fetchRawMaterials } from '@/store/slices/rawMaterialSlice';
import { Product } from '@/types';
import { ProductList } from '@/components/products/ProductList';
import { ProductForm } from '@/components/products/ProductForm';
import { CompositionManager } from '@/components/compositions/CompositionManager';
import { ProductViewModal } from '@/components/products/ProductViewModal'; // Certifique-se que o arquivo existe
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Loading } from '@/components/ui/Loading';
import { Plus, Package } from 'lucide-react';
import toast from 'react-hot-toast';

export const ProductsPage = () => {
  const dispatch = useAppDispatch();
  const { items: products, loading } = useAppSelector((state) => state.products);
  const { items: rawMaterials } = useAppSelector((state) => state.rawMaterials);

  const [showFormModal, setShowFormModal] = useState(false);
  const [showCompositionModal, setShowCompositionModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [compositionProduct, setCompositionProduct] = useState<Product | null>(null);
  const [viewingProduct, setViewingProduct] = useState<Product | null>(null);

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchRawMaterials());
  }, [dispatch]);

  const handleCreate = () => {
    setEditingProduct(null);
    setShowFormModal(true);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setShowFormModal(true);
  };

  const handleView = (product: Product) => {
    setViewingProduct(product);
    setShowViewModal(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await dispatch(deleteProduct(id)).unwrap();
      toast.success('Product deleted successfully');
    } catch (error) {
      toast.error('Failed to delete product');
    }
  };

  const handleSubmitForm = async (data: Omit<Product, 'id'>) => {
    try {
      if (editingProduct?.id) {
        await dispatch(updateProduct({ id: editingProduct.id, data })).unwrap();
        toast.success('Product updated successfully');
      } else {
        await dispatch(createProduct(data)).unwrap();
        toast.success('Product created successfully');
      }
      setShowFormModal(false);
      setEditingProduct(null);
    } catch (error) {
      toast.error('Failed to save product');
    }
  };

  const handleManageComposition = (product: Product) => {
    setCompositionProduct(product);
    setShowCompositionModal(true);
  };

  const handleCloseComposition = () => {
    setShowCompositionModal(false);
    setCompositionProduct(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4pb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
            <Package className="text-gray-700" size={20} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Products</h1>
            <p className="text-sm text-gray-500">Manage your product catalog</p>
          </div>
        </div>

        <Button onClick={handleCreate} leftIcon={<Plus size={18} />}>
          New Product
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loading />
        </div>
      ) : (
        <ProductList products={products} onView={handleView} onEdit={handleEdit} onDelete={handleDelete} onManageComposition={handleManageComposition} />)}

      <Modal isOpen={showFormModal} onClose={() => setShowFormModal(false)} title={editingProduct ? 'Edit Product' : 'New Product'} >
        <ProductForm initialData={editingProduct || undefined} onSubmit={handleSubmitForm} onCancel={() => setShowFormModal(false)}/>
      </Modal>

      {compositionProduct && (
        <Modal isOpen={showCompositionModal} onClose={handleCloseComposition} title="Manage Composition" size="lg">
          <CompositionManager product={compositionProduct} availableMaterials={rawMaterials} onClose={handleCloseComposition}/>
        </Modal>
      )}

      <ProductViewModal isOpen={showViewModal} onClose={() => setShowViewModal(false)} product={viewingProduct}/>
    </div>
  );
};