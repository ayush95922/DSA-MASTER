package com.dsaverse.ai.controller;

import com.dsaverse.ai.service.AIService;
import com.dsaverse.auth.entity.User;
import com.dsaverse.auth.repository.UserRepository;
import com.dsaverse.common.dto.ApiResponse;
import com.dsaverse.common.security.CurrentUser;
import com.dsaverse.common.security.UserPrincipal;
import com.dsaverse.revision.entity.Flashcard;
import com.dsaverse.revision.entity.FlashcardDeck;
import com.dsaverse.revision.repository.FlashcardDeckRepository;
import com.dsaverse.revision.repository.FlashcardRepository;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
@Tag(name = "AI Co-pilot", description = "Endpoints for AI coaching, quizzes, and spaced revision help")
public class AIController {

    private final AIService aiService;
    private final FlashcardDeckRepository deckRepository;
    private final FlashcardRepository cardRepository;
    private final UserRepository userRepository;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @GetMapping("/tutor/health")
    @Operation(summary = "Check AI service configuration health status")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getAIHealth() {
        boolean configured = aiService.isAIConfigured();
        Map<String, Object> health = Map.of(
            "status", configured ? "ONLINE" : "OFFLINE",
            "message", configured ? "AI Service is Online and active." : "GEMINI_API_KEY environment variable or configuration is missing. Please configure it to enable the AI Tutor."
        );
        return ResponseEntity.ok(ApiResponse.success(health, "AI Service health checked"));
    }

    @PostMapping("/tutor/chat")
    @Operation(summary = "Ask the AI Placement Coach a DSA question")
    public ResponseEntity<ApiResponse<String>> askTutor(@RequestBody com.dsaverse.ai.dto.ChatRequest request) {
        try {
            String message = request.getMessage();
            if (message == null || message.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(ApiResponse.error("BAD_REQUEST", "Prompt message cannot be empty."));
            }

            String currentTopic = request.getCurrentTopic();
            String currentRoadmapNode = request.getCurrentRoadmapNode();
            String currentQuestion = request.getCurrentQuestion();
            String difficultyLevel = request.getDifficultyLevel();
            String mode = request.getMode();

            StringBuilder contextBuilder = new StringBuilder();
            contextBuilder.append("You are an expert DSA Tutor.\n");
            contextBuilder.append("Goals:\n");
            contextBuilder.append("- Teach concepts clearly.\n");
            contextBuilder.append("- Adapt to student level.\n");
            contextBuilder.append("- Give examples.\n");
            contextBuilder.append("- Explain intuition.\n");
            contextBuilder.append("- Explain time complexity.\n");
            contextBuilder.append("- Explain space complexity.\n");
            contextBuilder.append("- Provide interview insights.\n");
            contextBuilder.append("- Provide optimized solutions.\n");
            contextBuilder.append("- Encourage learning instead of just giving answers.\n\n");
            
            contextBuilder.append("Response Format:\n");
            contextBuilder.append("1. Concept Explanation\n");
            contextBuilder.append("2. Real-world Analogy\n");
            contextBuilder.append("3. Step-by-Step Approach\n");
            contextBuilder.append("4. Complexity Analysis\n");
            contextBuilder.append("5. Java Solution\n");
            contextBuilder.append("6. Common Interview Questions\n");
            contextBuilder.append("7. Practice Problems\n\n");
            
            contextBuilder.append("Never repeat identical responses. Always answer according to user question.\n\n");
            
            contextBuilder.append("Specialized support for: Arrays, Strings, Linked Lists, Stacks, Queues, Trees, BST, Heaps, Graphs, Recursion, Backtracking, Dynamic Programming, Greedy Algorithms, Tries, Segment Trees, Bit Manipulation, System Design.\n\n");

            if (mode != null && !mode.trim().isEmpty()) {
                contextBuilder.append("MODE: ").append(mode).append("\n");
            }

            // Append active context fields
            if (currentTopic != null && !currentTopic.trim().isEmpty()) {
                contextBuilder.append("Student's Active DSA Topic: ").append(currentTopic).append(".\n");
            }
            if (currentRoadmapNode != null && !currentRoadmapNode.trim().isEmpty()) {
                contextBuilder.append("Student's Active Roadmap Node: ").append(currentRoadmapNode).append(".\n");
            }
            if (currentQuestion != null && !currentQuestion.trim().isEmpty()) {
                contextBuilder.append("Student's Active Question Context: ").append(currentQuestion).append(".\n");
            }
            if (difficultyLevel != null && !difficultyLevel.trim().isEmpty()) {
                contextBuilder.append("Difficulty level of the current problem/concept: ").append(difficultyLevel).append(".\n");
            }

            String reply = aiService.getChatResponse(message, contextBuilder.toString(), request.getHistory());
            return ResponseEntity.ok(ApiResponse.success(reply, "Tutor response retrieved"));
        } catch (IllegalStateException e) {
            log.warn("AI configuration error: {}", e.getMessage());
            return ResponseEntity.badRequest().body(ApiResponse.error("AI_CONFIG_ERROR", e.getMessage()));
        } catch (org.springframework.web.client.HttpClientErrorException e) {
            log.error("Gemini API Error: {} - {}", e.getStatusCode(), e.getResponseBodyAsString());
            return ResponseEntity.status(e.getStatusCode()).body(ApiResponse.error("GEMINI_API_ERROR", "AI Service encountered an error: " + e.getStatusCode()));
        } catch (Exception e) {
            log.error("Failed to generate AI tutor response", e);
            return ResponseEntity.internalServerError().body(ApiResponse.error("AI_TUTOR_FAILED", e.getMessage()));
        }
    }

    @PostMapping("/quiz/generate")
    @Operation(summary = "Generate 5 multiple-choice questions dynamically")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getQuiz(
            @RequestParam String topic,
            @RequestParam String difficulty) {
        try {
            String json = aiService.generateQuiz(topic, difficulty);
            List<Map<String, Object>> quizQuestions = objectMapper.readValue(json, new TypeReference<List<Map<String, Object>>>() {});
            return ResponseEntity.ok(ApiResponse.success(quizQuestions, "Quiz generated successfully"));
        } catch (Exception e) {
            log.error("Failed to parse quiz JSON", e);
            return ResponseEntity.internalServerError().body(ApiResponse.error("QUIZ_GENERATION_FAILED", "Failed to generate quiz due to parsing limits"));
        }
    }

    @PostMapping("/revision/generate")
    @Operation(summary = "Generate and persist flashcards for a specific weak topic")
    public ResponseEntity<ApiResponse<List<Flashcard>>> generateCards(
            @RequestParam String topic,
            @CurrentUser UserPrincipal currentUser) {
        try {
            String json = aiService.generateFlashcards(topic);
            List<Map<String, String>> cardList = objectMapper.readValue(json, new TypeReference<List<Map<String, String>>>() {});
            
            // Find or create AI Deck for this user
            User user = userRepository.findById(currentUser.getId())
                    .orElseThrow(() -> new RuntimeException("User not found"));
            
            FlashcardDeck deck = deckRepository.findAll().stream()
                    .filter(d -> d.getUser() != null && d.getUser().getId().equals(user.getId()) && d.getTitle().contains("AI Personal"))
                    .findFirst()
                    .orElseGet(() -> {
                        FlashcardDeck newDeck = FlashcardDeck.builder()
                                .user(user)
                                .title("AI Personal Tutor: " + topic)
                                .description("Dynamically generated revision flashcards mapping weak algorithmic boundaries.")
                                .build();
                        return deckRepository.save(newDeck);
                    });

            List<Flashcard> savedCards = new ArrayList<>();
            for (Map<String, String> cMap : cardList) {
                Flashcard card = Flashcard.builder()
                        .deck(deck)
                        .front(cMap.get("front"))
                        .back(cMap.get("back"))
                        .build();
                savedCards.add(cardRepository.save(card));
            }

            return ResponseEntity.ok(ApiResponse.success(savedCards, "Dynamic flashcards successfully generated and persisted"));
        } catch (Exception e) {
            log.error("Failed to parse flashcard JSON", e);
            return ResponseEntity.internalServerError().body(ApiResponse.error("FLASHCARD_GENERATION_FAILED", "Failed to parse and save AI cards"));
        }
    }
}
