import { useState, useEffect } from "react";
import {
  Product,
  RawMaterial,
  ProductComposition,
  CompositionRequest,
} from "@/types";
import { CompositionService } from "@/services/compositionService";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Plus, Trash2, Package, Edit2, Check, X } from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

interface CompositionManagerProps {
  product: Product;
  availableMaterials: RawMaterial[];
  onClose: () => void;
}

export const CompositionManager = ({
  product,
  availableMaterials,
  onClose,
}: CompositionManagerProps) => {
  const [compositions, setCompositions] = useState<ProductComposition[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedMaterialId, setSelectedMaterialId] = useState<number | "">("");
  const [quantity, setQuantity] = useState<number>(1);
  const [isAdding, setIsAdding] = useState(false);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editQuantity, setEditQuantity] = useState<number>(0);
  const [isSaving, setIsSaving] = useState(false);

  const MotionDiv = motion.div as any;

  useEffect(() => {
    loadCompositions();
  }, [product.id]);

  const loadCompositions = async () => {
    if (!product.id) return;
    setLoading(true);
    try {
      const data = await CompositionService.getByProduct(product.id);
      setCompositions(data);
    } catch {
      toast.error("Erro ao buscar composições");
    } finally {
      setLoading(false);
    }
  };

  const handleAddComposition = async () => {
    if (!selectedMaterialId || !product.id || quantity <= 0) {
      toast.error("Selecione o material e a quantidade");
      return;
    }

    if (compositions.some((c) => c.rawMaterial.id === selectedMaterialId)) {
      toast.error("Material já adicionado");
      return;
    }

    setIsAdding(true);
    try {
      const request: CompositionRequest = {
        productId: product.id,
        rawMaterialId: selectedMaterialId as number,
        quantity,
      };

      await CompositionService.create(request);
      toast.success("Adicionado com sucesso");
      setSelectedMaterialId("");
      setQuantity(1);
      await loadCompositions();
    } catch {
      toast.error("Erro ao adicionar");
    } finally {
      setIsAdding(false);
    }
  };

  const startEditing = (comp: ProductComposition) => {
    setEditingId(comp.id || null);
    setEditQuantity(comp.quantityRequired);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditQuantity(0);
  };

  const handleUpdateComposition = async (id: number) => {
    if (editQuantity <= 0) {
      toast.error("Quantidade inválida");
      return;
    }

    setIsSaving(true);
    try {
      await CompositionService.update(id, { quantity: editQuantity });
      setCompositions((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, quantityRequired: editQuantity } : item,
        ),
      );
      toast.success("Quantidade atualizada");
      setEditingId(null);
    } catch {
      toast.error("Erro ao atualizar quantidade");
    } finally {
      setIsSaving(false);
    }
  };

  const handleRemoveComposition = async (id: number) => {
    if (!confirm("Remover este material?")) return;
    try {
      await CompositionService.delete(id);
      toast.success("Removido");
      setCompositions((prev) => prev.filter((c) => c.id !== id));
    } catch {
      toast.error("Erro ao remover");
    }
  };

  const availableToAdd = availableMaterials.filter(
    (m) => !compositions.some((c) => c.rawMaterial.id === m.id),
  );

  return (
    <div className="space-y-6">
      <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 flex items-center gap-3">
        <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center shadow-sm">
          <Package className="text-white" size={20} />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">{product.name}</h3>
          <p className="text-xs text-gray-600">Ficha técnica do produto</p>
        </div>
      </div>

      <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
        <h4 className="text-sm font-medium text-gray-700 mb-3">
          Novo Componente
        </h4>
        <div className="flex gap-2 items-end">
          <div className="flex-1">
            <select className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white" value={selectedMaterialId} onChange={(e) => setSelectedMaterialId(Number(e.target.value) || "")}>
              <option value="">Selecione...</option>
              {availableToAdd.map((material) => (
                <option key={material.id} value={material.id}>
                  {material.name} (Disp: {material.stockQuantity})
                </option>
              ))}
            </select>
          </div>

          <div className="w-24">
            <Input type="number" step="0.01" min="0.01" value={quantity} onChange={(e) => setQuantity(parseFloat(e.target.value) || 0)} placeholder="Qtd" className="h-[38px]"/>
          </div>

          <Button onClick={handleAddComposition} isLoading={isAdding} disabled={!selectedMaterialId || quantity <= 0} className="h-[38px]">
            <Plus size={18} />
          </Button>
        </div>
      </div>

      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-3">
          Materiais na Composição ({compositions.length})
        </h4>

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600" />
          </div>
        ) : compositions.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-6 border-2 border-dashed border-gray-200 rounded-lg">
            Nenhum material vinculado.
          </p>
        ) : (
          <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
            {compositions.map((comp, index) => (
              <MotionDiv key={comp.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${ editingId === comp.id ? "bg-indigo-50 border-indigo-200" : "bg-white border-gray-200 hover:border-indigo-200" }`}>
                <div className="flex-1 min-w-0 mr-4">
                  <p className="font-medium text-sm text-gray-900 truncate">
                    {comp.rawMaterial.name}
                  </p>

                  {editingId === comp.id ? (
                    <div className="mt-1 flex items-center gap-2">
                      <span className="text-xs text-gray-500">Qtd:</span>
                      <input type="number" autoFocus step="0.01" className="w-20 px-2 py-1 text-sm border border-indigo-300 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500" value={editQuantity} onChange={(e) => setEditQuantity(parseFloat(e.target.value)) }/>
                    </div>
                  ) : (
                    <p className="text-xs text-gray-500">
                      Qtd Necessária:{" "}
                      <span className="font-medium text-gray-700">
                        {comp.quantityRequired}
                      </span>
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-1">
                  {editingId === comp.id ? (
                    <>
                      <button onClick={() => comp.id && handleUpdateComposition(comp.id)} disabled={isSaving} className="p-1.5 text-green-600 hover:bg-green-50 rounded-md">
                        <Check size={18} />
                      </button>
                      <button onClick={cancelEditing} disabled={isSaving} className="p-1.5 text-red-500 hover:bg-red-50 rounded-md" >
                        <X size={18} />
                      </button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => startEditing(comp)} className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md">
                        <Edit2 size={16} />
                      </button>
                      <button onClick={() =>comp.id && handleRemoveComposition(comp.id) } className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md" >
                        <Trash2 size={16} />
                      </button>
                    </>
                  )}
                </div>
              </MotionDiv>
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-end pt-4 border-t mt-4">
        <Button variant="secondary" onClick={onClose}>
          Fechar
        </Button>
      </div>
    </div>
  );
};
