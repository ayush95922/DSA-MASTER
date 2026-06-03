package com.dsaverse.company.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CompanyResponse {
    private Long id;
    private String name;
    private String slug;
    private String logo;
    private String description;
    private String tier;
    private int readinessPercentage;
    private String difficulty;
    private int questionsCount;
    private java.util.List<String> mostAskedTopics;
}
