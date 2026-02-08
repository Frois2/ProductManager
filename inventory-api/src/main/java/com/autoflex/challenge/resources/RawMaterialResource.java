package com.autoflex.challenge.resources;

import com.autoflex.challenge.entities.RawMaterial;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.util.List;

@Path("/raw-materials")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class RawMaterialResource {

    @GET
    public List<RawMaterial> list() {
        return RawMaterial.listAll();
    }

    @GET
    @Path("/{id}")
    public Response get(@PathParam("id") Long id) {
        RawMaterial rawMaterial = RawMaterial.findById(id);
        if (rawMaterial == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        return Response.ok(rawMaterial).build();
    }

    @POST
    @Transactional
    public Response create(RawMaterial rawMaterial) {
        rawMaterial.persist();
        return Response.status(Response.Status.CREATED).entity(rawMaterial).build();
    }

    @PUT
    @Path("/{id}")
    @Transactional
    public Response update(@PathParam("id") Long id, RawMaterial dto) {
        RawMaterial entity = RawMaterial.findById(id);
        if (entity == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }

        entity.name = dto.name;
        entity.stockQuantity = dto.stockQuantity;

        return Response.ok(entity).build();
    }

    @DELETE
    @Path("/{id}")
    @Transactional
    public Response delete(@PathParam("id") Long id) {
        boolean deleted = RawMaterial.deleteById(id);
        if (!deleted) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        return Response.noContent().build();
    }
}