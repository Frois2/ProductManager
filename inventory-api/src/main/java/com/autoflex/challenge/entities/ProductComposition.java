package com.autoflex.challenge.entities;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
public class ProductComposition extends PanacheEntity {
    @ManyToOne
    @JoinColumn(name = "product_id", nullable = false)
    public Product product;

    @ManyToOne
    @JoinColumn(name = "raw_material_id", nullable = false)
    public RawMaterial rawMaterial;

    public Double quantityRequired;
}