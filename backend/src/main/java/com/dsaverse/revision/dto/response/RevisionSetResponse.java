package com.dsaverse.revision.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RevisionSetResponse {

    private int dueQuestionsCount;
    private int dueCardsCount;
    private List<DueQuestionInfo> dueQuestions;
    private List<DueCardInfo> dueCards;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DueQuestionInfo {
        private Long id;
        private String title;
        private String slug;
        private String difficulty;
        private int repetitions;
        private int intervalDays;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DueCardInfo {
        private Long id;
        private Long deckId;
        private String front;
        private String back;
        private int repetitions;
        private int intervalDays;
    }
}
