package com.dsaverse.company.controller;

import com.dsaverse.common.dto.ApiResponse;
import com.dsaverse.common.security.CurrentUser;
import com.dsaverse.common.security.UserPrincipal;
import com.dsaverse.company.dto.response.CompanyDetailResponse;
import com.dsaverse.company.dto.response.CompanyResponse;
import com.dsaverse.company.service.CompanyService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/companies")
@RequiredArgsConstructor
@Tag(name = "Company", description = "Endpoints for company-specific interview prep")
public class CompanyController {

    private final CompanyService companyService;

    @GetMapping
    @Operation(summary = "Get all target companies with user readiness percentage")
    public ResponseEntity<ApiResponse<List<CompanyResponse>>> getAllCompanies(
            @CurrentUser UserPrincipal currentUser) {
        List<CompanyResponse> response = companyService.getAllCompanies(currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success(response, "Companies retrieved successfully"));
    }

    @GetMapping("/{slug}")
    @Operation(summary = "Get detailed company timelines and round focuses")
    public ResponseEntity<ApiResponse<CompanyDetailResponse>> getCompanyBySlug(
            @PathVariable String slug,
            @CurrentUser UserPrincipal currentUser) {
        CompanyDetailResponse response = companyService.getCompanyBySlug(slug, currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success(response, "Company details retrieved successfully"));
    }
}
