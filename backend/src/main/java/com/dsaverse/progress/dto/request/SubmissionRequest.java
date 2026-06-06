package com.dsaverse.progress.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SubmissionRequest {
    @NotBlank(message = "Submitted code cannot be empty")
    private String submittedCode;

    @Builder.Default
    private String language = "JAVA";

    @Builder.Default
    private String status = "SOLVED"; // SOLVED, ATTEMPTED, FAILED

    private Integer executionTime; // in milliseconds
    private Integer memoryUsed; // in kilobytes
}
