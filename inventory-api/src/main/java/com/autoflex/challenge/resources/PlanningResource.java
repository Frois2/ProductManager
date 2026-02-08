package com.autoflex.challenge.resources;

import com.autoflex.challenge.dtos.ProductionPlanDTO;
import com.autoflex.challenge.services.ProductionPlanningService;
import jakarta.inject.Inject;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import java.util.List;

@Path("/planning")
public class PlanningResource {

    @Inject 
    ProductionPlanningService service;

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public List<ProductionPlanDTO> getPlan() {
        return service.calculateProductionPlan();
    }
}