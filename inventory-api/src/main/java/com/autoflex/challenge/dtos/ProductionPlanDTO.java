package com.autoflex.challenge.dtos;

import java.math.BigDecimal;

public class ProductionPlanDTO {
    public String productName;
    public int quantityToProduce; 
    public BigDecimal totalValue; 

    public ProductionPlanDTO(String productName, int quantityToProduce, BigDecimal totalValue) {
        this.productName = productName;
        this.quantityToProduce = quantityToProduce;
        this.totalValue = totalValue;
    }
}