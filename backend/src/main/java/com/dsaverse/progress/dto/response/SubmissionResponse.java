package com.dsaverse.progress.dto.response;

import lombok.*;

import java.time.Instant;

/**
 * Safe DTO for returning submission attempt data without exposing raw entity references.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SubmissionResponse {
    private Long id;
    private Long questionId;
    private String questionSlug;
    private String status;
    private String language;
    private String submittedCode;
    private Integer executionTime;
    private Integer memoryUsed;
    private Instant attemptedAt;
}
