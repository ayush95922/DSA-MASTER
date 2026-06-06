package com.dsaverse.question.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EditorialResponse {

    private String overview;
    private List<ApproachInfo> approaches;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ApproachInfo {
        private String title;
        private String type; // OPTIMAL, BETTER, BRUTE_FORCE
        private String description;
        private String timeComplexity;
        private String spaceComplexity;
        private String javaCode;
        private String pythonCode;
        private String cppCode;
    }
}
