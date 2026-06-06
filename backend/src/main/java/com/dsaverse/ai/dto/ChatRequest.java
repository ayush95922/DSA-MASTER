package com.dsaverse.ai.dto;

import lombok.Data;
import java.util.List;

@Data
public class ChatRequest {
    private String message;
    private String mode;
    private String currentTopic;
    private String currentRoadmapNode;
    private String currentQuestion;
    private String difficultyLevel;
    private List<ChatMessage> history;
}
