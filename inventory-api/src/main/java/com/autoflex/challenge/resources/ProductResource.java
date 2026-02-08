package com.autoflex.challenge.resources;

import com.autoflex.challenge.entities.Product;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.util.List;

@Path("/products")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class ProductResource {
    @GET
    public List<Product> list() {
        return Product.listAll();
    }

    @GET
    @Path("/{id}")
    public Response get(@PathParam("id") Long id) {
        Product product = Product.findById(id);
        if (product == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        return Response.ok(product).build();
    }

    @POST
    @Transactional
    public Response create(Product product) {
        product.persist();
        return Response.status(Response.Status.CREATED).entity(product).build();
    }

    @PUT
    @Path("/{id}")
    @Transactional
    public Response update(@PathParam("id") Long id, Product productData) {
        Product entity = Product.findById(id);
        
        if (entity == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }

        entity.name = productData.name;
        entity.price = productData.price;
        
        return Response.ok(entity).build();
    }

    @DELETE
    @Path("/{id}")
    @Transactional
    public Response delete(@PathParam("id") Long id) {
        boolean deleted = Product.deleteById(id);
        
        if (!deleted) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        
        return Response.noContent().build(); 
    }
}