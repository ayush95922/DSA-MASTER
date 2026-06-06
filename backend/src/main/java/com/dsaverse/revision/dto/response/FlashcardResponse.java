package com.dsaverse.revision.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FlashcardResponse {
    private Long id;
    private Long deckId;
    private String front;
    private String back;
}
