package com.dsaverse.revision.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FlashcardDeckResponse {
    private Long id;
    private String title;
    private String description;
    private int cardCount;
}
