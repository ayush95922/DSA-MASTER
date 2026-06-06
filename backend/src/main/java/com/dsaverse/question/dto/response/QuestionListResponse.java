package com.dsaverse.question.dto.response;

import com.dsaverse.question.enums.Difficulty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class QuestionListResponse {
    private Long id;
    private String title;
    private String slug;
    private Difficulty difficulty;
    private String status; // SOLVED, ATTEMPTED, UNATTEMPTED
    private boolean premium;
    private Integer points;
}
