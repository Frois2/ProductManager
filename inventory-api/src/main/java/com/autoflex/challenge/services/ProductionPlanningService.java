package com.autoflex.challenge.services;

import com.autoflex.challenge.dtos.ProductionPlanDTO;
import com.autoflex.challenge.entities.Product;
import com.autoflex.challenge.entities.ProductComposition;
import com.autoflex.challenge.entities.RawMaterial;
import jakarta.enterprise.context.ApplicationScoped;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@ApplicationScoped 
public class ProductionPlanningService {

    public List<ProductionPlanDTO> calculateProductionPlan() {
        List<ProductionPlanDTO> plan = new ArrayList<>();

        List<Product> products = Product.find("ORDER BY price DESC").list();
        Map<Long, Double> tempStock = new HashMap<>();
        List<RawMaterial> materials = RawMaterial.listAll();
        
        for (RawMaterial rm : materials) {
            tempStock.put(rm.id, (double) rm.stockQuantity); 
        }

        for (Product product : products) {
            
            List<ProductComposition> recipe = ProductComposition.list("product", product);

            if (recipe.isEmpty()) continue; 

            int maxPossible = Integer.MAX_VALUE;

            for (ProductComposition item : recipe) {
                Double stockAvailable = tempStock.getOrDefault(item.rawMaterial.id, 0.0);
                
                Double needed = item.quantityRequired;

                if (needed > 0) {
                    int possibleWithThisItem = (int) (stockAvailable / needed);
                    
                    if (possibleWithThisItem < maxPossible) {
                        maxPossible = possibleWithThisItem;
                    }
                }
            }

            if (maxPossible > 0 && maxPossible != Integer.MAX_VALUE) {
                
                for (ProductComposition item : recipe) {
                    Double currentStock = tempStock.get(item.rawMaterial.id);
                    Double totalNeeded = maxPossible * item.quantityRequired;
                    tempStock.put(item.rawMaterial.id, currentStock - totalNeeded);
                }

                BigDecimal totalValue = product.price.multiply(new BigDecimal(maxPossible));

                plan.add(new ProductionPlanDTO(product.name, maxPossible, totalValue));
            }
        }

        return plan;
    }
}