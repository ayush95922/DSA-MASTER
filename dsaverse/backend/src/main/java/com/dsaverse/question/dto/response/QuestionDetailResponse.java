package com.dsaverse.question.dto.response;

import com.dsaverse.question.enums.Difficulty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class QuestionDetailResponse {

    private Long id;
    private String title;
    private String slug;
    private Difficulty difficulty;
    private String description;
    private String inputFormat;
    private String outputFormat;
    private String constraints;
    private boolean premium;
    private Integer points;
    private String status;
    private List<HintInfo> hints;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class HintInfo {
        private Integer number;
        private String content;
    }
}
