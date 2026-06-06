package com.dsaverse.admin.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

import java.util.List;

@Data
public class BulkImportRequest {

    @NotBlank(message = "File name cannot be blank")
    private String fileName;

    @NotEmpty(message = "Questions list cannot be empty")
    private List<QuestionImportInfo> questions;

    @Data
    public static class QuestionImportInfo {
        @NotBlank(message = "Title cannot be blank")
        private String title;
        @NotBlank(message = "Slug cannot be blank")
        private String slug;
        @NotBlank(message = "Difficulty cannot be blank")
        private String difficulty; // EASY, MEDIUM, HARD
        @NotBlank(message = "Description cannot be blank")
        private String description;
        private String constraints;
        private String inputFormat;
        private String outputFormat;
    }
}
