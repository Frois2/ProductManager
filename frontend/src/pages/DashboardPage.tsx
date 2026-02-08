import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { fetchProducts } from '@/store/slices/productSlice';
import { fetchRawMaterials } from '@/store/slices/rawMaterialSlice';
import { Button } from '@/components/ui/Button';
import { ArrowRight, AlertTriangle, CheckCircle, Package, Layers, Box } from 'lucide-react';
import { motion } from 'framer-motion';

export const DashboardPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { items: products } = useAppSelector((state) => state.products);
  const { items: materials } = useAppSelector((state) => state.rawMaterials);

  const MotionDiv = motion.div as any;

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchRawMaterials());
  }, [dispatch]);

  const lowStockItems = materials.filter((m) => m.stockQuantity > 0 && m.stockQuantity < 10);

  const outOfStockItems = materials.filter((m) => m.stockQuantity === 0);
  const hasAlerts = lowStockItems.length > 0 || outOfStockItems.length > 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500">Operational view for {new Date().toLocaleDateString('en-US')}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => navigate('/products')}>
            Catalog
          </Button>
          <Button onClick={() => navigate('/production-plan')}>
            Production Plan
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <MotionDiv initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden" >
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                {hasAlerts ? (
                  <>
                    <AlertTriangle size={18} className="text-amber-600" />
                    <span>Attention Required</span>
                  </>
                ) : (
                  <>
                    <CheckCircle size={18} className="text-green-600" />
                    <span>Stock Healthy</span>
                  </>
                )}
              </h3>
              {hasAlerts && (
                <span className="text-xs font-medium bg-amber-100 text-amber-800 px-2 py-1 rounded-full">
                  {lowStockItems.length + outOfStockItems.length} critical items
                </span>
              )}
            </div>

            {hasAlerts ? (
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-gray-500 font-medium">
                  <tr>
                    <th className="px-6 py-3">Material</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3 text-right">Current Stock</th>
                    <th className="px-6 py-3"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {[...outOfStockItems, ...lowStockItems].slice(0, 5).map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-3 font-medium text-gray-900">{item.name}</td>
                      <td className="px-6 py-3">
                        {item.stockQuantity === 0 ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                            Out of Stock
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                            Low
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-3 text-right font-mono text-gray-600">
                        {item.stockQuantity}
                      </td>
                      <td className="px-6 py-3 text-right">
                        <button onClick={() => navigate('/raw-materials')} className="text-blue-600 hover:text-blue-800 text-xs font-medium flex items-center justify-end gap-1 ml-auto">
                          Replenish <ArrowRight size={12} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-8 text-center text-gray-500">
                <p>All stock levels are operational.</p>
              </div>
            )}
            
            {hasAlerts && (
              <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 text-right">
                <button onClick={() => navigate('/raw-materials')} className="text-sm text-gray-600 hover:text-gray-900 font-medium">
                  View full stock
                </button>
              </div>
            )}
          </MotionDiv>

          <MotionDiv initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white border border-gray-200 rounded-lg shadow-sm" >
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <h3 className="font-semibold text-gray-900">Active Catalog</h3>
              <span className="text-xs text-gray-500">{products.length} products registered</span>
            </div>
            <div className="divide-y divide-gray-100">
              {products.slice(0, 3).map((prod) => (
                <div key={prod.id} className="px-6 py-3 flex justify-between items-center hover:bg-gray-50">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center text-gray-400">
                      <Package size={16} />
                    </div>
                    <span className="text-sm font-medium text-gray-900">{prod.name}</span>
                  </div>
                  <span className="text-sm text-gray-600 font-mono">
                    {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(prod.price)}
                  </span>
                </div>
              ))}
              {products.length === 0 && (
                <div className="p-6 text-center text-sm text-gray-500">
                  No products registered.
                </div>
              )}
            </div>
          </MotionDiv>
        </div>

        <div className="space-y-6">
          <MotionDiv initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="bg-white border border-gray-200 rounded-lg shadow-sm p-6" >
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
              General Summary
            </h3>
            
            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-end mb-1">
                  <span className="text-3xl font-bold text-gray-900">{materials.length}</span>
                  <Box size={20} className="text-gray-400 mb-1" />
                </div>
                <div className="text-sm text-gray-600">Types of Raw Materials</div>
                <div className="w-full bg-gray-100 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: '100%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-end mb-1">
                  <span className="text-3xl font-bold text-gray-900">
                    {materials.reduce((acc, m) => acc + m.stockQuantity, 0).toFixed(0)}
                  </span>
                  <Layers size={20} className="text-gray-400 mb-1" />
                </div>
                <div className="text-sm text-gray-600">Units in Stock</div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-100">
              <button onClick={() => navigate('/production-plan')} className="w-full py-2 px-4 bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium rounded-md transition-colors flex items-center justify-center gap-2">
                Generate Production Plan
              </button>
            </div>
          </MotionDiv>
        </div>
      </div>
    </div>
  );
};
