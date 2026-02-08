package com.autoflex.challenge.resources;

import com.autoflex.challenge.entities.Product;
import com.autoflex.challenge.entities.ProductComposition;
import com.autoflex.challenge.entities.RawMaterial;

import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.util.List;

@Path("/compositions")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class ProductCompositionResource {
    public static class CompositionRequest {
        public Long productId;
        public Long rawMaterialId;
        public int quantity;
    }

    @GET
    public List<ProductComposition> listAll() {
        return ProductComposition.listAll();
    }
    @GET
    @Path("/product/{productId}")
    public List<ProductComposition> listByProduct(@PathParam("productId") Long productId) {
        Product product = Product.findById(productId);
        if (product == null) {
            throw new WebApplicationException("Product not found", 404);
        }
        return ProductComposition.list("product", product);
    }

    @POST
    @Transactional
    public Response addIngredient(CompositionRequest request) {
        Product product = Product.findById(request.productId);
        RawMaterial rawMaterial = RawMaterial.findById(request.rawMaterialId);

        if (product == null || rawMaterial == null) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity("Produto ou Matéria-prima não encontrados").build();
        }

        ProductComposition composition = new ProductComposition();
        composition.product = product;
        composition.rawMaterial = rawMaterial;
        composition.quantityRequired = (double) request.quantity;

        composition.persist();

        return Response.status(Response.Status.CREATED).entity(composition).build();
    }

    @DELETE
    @Path("/{id}")
    @Transactional
    public Response removeIngredient(@PathParam("id") Long id) {
        boolean deleted = ProductComposition.deleteById(id);
        if (!deleted) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        return Response.noContent().build();
    }
}