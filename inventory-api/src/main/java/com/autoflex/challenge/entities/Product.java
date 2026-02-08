package com.autoflex.challenge.entities;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.Entity;
import java.math.BigDecimal;

@Entity 
public class Product extends PanacheEntity {
    
    public String name;    
    public BigDecimal price; 
    
    //GETTERS E SETTERS CRIADO PARA TERSTE UNITARIOS APENAS
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }
}

