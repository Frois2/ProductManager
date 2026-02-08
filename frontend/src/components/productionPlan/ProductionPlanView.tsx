import { useEffect, useState } from 'react';
import { ProductService } from '@/services/productService'; 
import { RawMaterialService } from '@/services/rawMaterialService';
import { CompositionService } from '@/services/compositionService';
import { Button } from '@/components/ui/Button';
import { Loading } from '@/components/ui/Loading';
import { RefreshCw, AlertCircle, Ban } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

interface CalculatedPlanItem {
  id: number;
  productName: string;
  quantityToProduce: number;
  totalValue: number;
  price: number;
}

export const ProductionPlanView = () => {
  const [plan, setPlan] = useState<CalculatedPlanItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const MotionTr = motion.tr as any;

  useEffect(() => {
    calculatePlan();
  }, []);

  const calculatePlan = async () => {
    setLoading(true);
    try {
      const [products, materials, allCompositions] = await Promise.all([
        ProductService.getAll(),
        RawMaterialService.getAll(),
        CompositionService.getAll()
      ]);
      const tempStock: Record<number, number> = {};
      materials.forEach(m => {
        if (m.id !== undefined) tempStock[m.id] = m.stockQuantity;
      });

      const sortedProducts = [...products].sort((a, b) => b.price - a.price);

      const calculatedResults: CalculatedPlanItem[] = [];

      for (const product of sortedProducts) {
        if (!product.id) continue;

        const productRecipe = allCompositions.filter(
          (c: any) => (c.product?.id === product.id) || (c.productId === product.id)
        );

        if (productRecipe.length === 0) {
          calculatedResults.push({ 
            id: product.id, 
            productName: product.name, 
            quantityToProduce: 0, 
            totalValue: 0, 
            price: product.price 
          });
          continue;
        }

        let maxPossible = Infinity;

        for (const item of productRecipe) {
          const materialId = item.rawMaterial?.id;
          const required = item.quantityRequired ?? 0;

          if (materialId === undefined || required <= 0) {
            maxPossible = 0;
            break;
          }

          const available = tempStock[materialId] ?? 0;
          const possibleUnits = Math.floor(available / required);

          if (possibleUnits < maxPossible) maxPossible = possibleUnits;
        }

        if (maxPossible === Infinity) maxPossible = 0;

        if (maxPossible > 0) {
          for (const item of productRecipe) {
            const materialId = item.rawMaterial?.id;
            const required = item.quantityRequired ?? 0;
            if (materialId !== undefined) {
              tempStock[materialId] -= required * maxPossible;
              if (tempStock[materialId] < 0) tempStock[materialId] = 0; // evita números negativos
            }
          }
        }

        calculatedResults.push({
          id: product.id,
          productName: product.name,
          quantityToProduce: maxPossible,
          totalValue: maxPossible * product.price,
          price: product.price
        });
      }

      setPlan(calculatedResults);

    } catch (error) {
      console.error(error);
      toast.error('Error calculating production plan.');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await calculatePlan();
    setRefreshing(false);
    toast.success('Plan recalculated.');
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
  };

  const totalValue = plan.reduce((sum, item) => sum + item.totalValue, 0);
  const totalUnits = plan.reduce((sum, item) => sum + item.quantityToProduce, 0);

  if (loading) return <Loading />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4  pb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Production Plan</h1>
          <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
            <AlertCircle size={14} /> Prioritized by Highest Product Value (Greedy Algorithm)
          </p>
        </div>
        <Button onClick={handleRefresh} leftIcon={<RefreshCw size={16} />} isLoading={refreshing} variant="secondary">
          Recalculate
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase">Product (Price)</th>
                  <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase text-right">Qty to Produce</th>
                  <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase text-right">Potential Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {plan.map((item, index) => {
                  const isViable = item.quantityToProduce > 0;
                  return (
                    <MotionTr key={item.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: index * 0.05 }}  className={isViable ? 'bg-white' : 'bg-gray-50'}>
                      <td className="py-4 px-6">
                        <div className={`font-medium ${isViable ? 'text-gray-900' : 'text-gray-400'}`}>{item.productName}</div>
                        <div className="text-xs text-gray-400">{formatCurrency(item.price)} / unit</div>
                      </td>
                      <td className="py-4 px-6 text-right">
                        {isViable ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {item.quantityToProduce} units
                          </span>
                        ) : (
                          <span className="text-gray-400 text-xs flex justify-end gap-1 items-center">
                            <Ban size={12}/> No Stock
                          </span>
                        )}
                      </td>
                      <td className={`py-4 px-6 text-right font-medium ${isViable ? 'text-green-700' : 'text-gray-400'}`}>
                        {formatCurrency(item.totalValue)}
                      </td>
                    </MotionTr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 h-fit">
            <h3 className="text-sm font-semibold text-gray-500 uppercase mb-4">Summary</h3>
            <div className="flex justify-between items-center mb-4">
                <span className="text-gray-600">Total Revenue</span>
                <span className="text-2xl font-bold text-green-600">{formatCurrency(totalValue)}</span>
            </div>
            <div className="flex justify-between items-center border-t pt-4">
                <span className="text-gray-600">Total Units</span>
                <span className="text-lg font-semibold">{totalUnits}</span>
            </div>
        </div>
      </div>
    </div>
  );
};

