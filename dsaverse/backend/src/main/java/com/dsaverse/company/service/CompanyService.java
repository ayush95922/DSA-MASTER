package com.dsaverse.company.service;

import com.dsaverse.company.dto.response.CompanyDetailResponse;
import com.dsaverse.company.dto.response.CompanyResponse;

import java.util.List;

public interface CompanyService {

    /**
     * Retrieves all company targets with preparation readiness metrics for the given user.
     */
    List<CompanyResponse> getAllCompanies(Long userId);

    /**
     * Retrieves detailed company targets by slug.
     */
    CompanyDetailResponse getCompanyBySlug(String slug, Long userId);
}
