package com.autoflex.challenge;

import com.autoflex.challenge.entities.Product;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;
import java.math.BigDecimal;

class ProductTest {

    @Test
    void testCreateProduct() {
        Product product = new Product();
        try {
            product.setName("Coca Cola");
            product.setPrice(new BigDecimal("10.50"));
            assertNotNull(product);
            assertEquals("Coca Cola", product.getName()); 

        } catch (Exception e) {
            fail("Erro ao criar produto: " + e.getMessage());
        }
    }
}