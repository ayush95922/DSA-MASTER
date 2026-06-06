package com.dsaverse.ai.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import com.dsaverse.ai.dto.ChatMessage;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class AIService {

    @Value("${app.gemini.api-key:}")
    private String apiKey;

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    public boolean isAIConfigured() {
        String key = apiKey;
        if (key == null || key.isEmpty()) {
            key = System.getenv("GEMINI_API_KEY");
        }
        return key != null && !key.isEmpty();
    }

    @PostConstruct
    public void validateAIConfig() {
        if (!isAIConfigured()) {
            log.warn("========================================================================");
            log.warn("⚠️  DSAVERSE AI TUTOR CONFIGURATION WARNING");
            log.warn("------------------------------------------------------------------------");
            log.warn("GEMINI_API_KEY environment variable or configuration is missing!");
            log.warn("The AI Tutor and AI Quiz features will not be available until you set this key.");
            log.warn("Please add the GEMINI_API_KEY environment variable or configure the property");
            log.warn("'app.gemini.api-key' in your application configuration.");
            log.warn("========================================================================");
        } else {
            log.info("AI Placement Coach configuration validated successfully. Service is ONLINE.");
        }
    }

    /**
     * Sends a chat prompt to Gemini API or fallback generator.
     */
    public String getChatResponse(String userPrompt, String systemContext, List<ChatMessage> history) {
        if (apiKey == null || apiKey.isEmpty()) {
            apiKey = System.getenv("GEMINI_API_KEY");
        }
        if (apiKey == null || apiKey.isEmpty()) {
            throw new IllegalStateException("GEMINI_API_KEY environment variable or configuration is missing. Please configure it to enable the AI Tutor.");
        }
        try {
            return callGemini(userPrompt, systemContext, history);
        } catch (org.springframework.web.client.HttpClientErrorException e) {
            log.error("Gemini API Client Error", e);
            throw e;
        } catch (Exception e) {
            log.error("Gemini API call failed", e);
            throw new RuntimeException("Gemini API call failed: " + e.getMessage(), e);
        }
    }

    /**
     * Generates a 5-question multiple choice quiz on a given topic.
     */
    public String generateQuiz(String topic, String difficulty) {
        String prompt = "Generate a multiple-choice quiz on the topic of \"" + topic + "\" with \"" + difficulty + "\" difficulty.\n" +
                "You must return exactly a JSON array containing exactly 5 questions. Do not write any markdown blocks (like ```json), explanations, or surrounding text. The response must be raw valid JSON.\n" +
                "Each question in the JSON array must follow this exact format:\n" +
                "{\n" +
                "  \"questionText\": \"The question description here...\",\n" +
                "  \"options\": [\n" +
                "    \"Option A text\",\n" +
                "    \"Option B text\",\n" +
                "    \"Option C text\",\n" +
                "    \"Option D text\"\n" +
                "  ],\n" +
                "  \"correctOption\": \"A\", // MUST be exactly 'A', 'B', 'C', or 'D'\n" +
                "  \"explanation\": \"Detailed explanation of why this option is correct...\"\n" +
                "}";

        if (apiKey == null || apiKey.isEmpty()) {
            apiKey = System.getenv("GEMINI_API_KEY");
        }

        if (apiKey == null || apiKey.isEmpty()) {
            throw new IllegalStateException("GEMINI_API_KEY environment variable or configuration is missing. Please configure it to enable Quiz Generation.");
        }

        try {
            String response = callGemini(prompt, null, null);
            // Clean markdown response blocks if Gemini output contains them
            response = response.trim();
            if (response.startsWith("```json")) {
                response = response.substring(7);
            }
            if (response.endsWith("```")) {
                response = response.substring(0, response.length() - 3);
            }
            return response.trim();
        } catch (Exception e) {
            log.error("Gemini Quiz call failed", e);
            throw new RuntimeException("Gemini Quiz call failed: " + e.getMessage(), e);
        }
    }

    /**
     * Generates flashcards for a specific weak topic.
     */
    public String generateFlashcards(String weakTopic) {
        String prompt = "Create 3 high-quality spaced-repetition flashcards on the topic \"" + weakTopic + "\".\n" +
                "Return exactly a JSON array of flashcards. Do not include markdown blocks, explanations, or surrounding text.\n" +
                "Format:\n" +
                "[\n" +
                "  {\n" +
                "    \"front\": \"Define the space complexity of a recursion depth in " + weakTopic + "...\",\n" +
                "    \"back\": \"Standard explanation of the runtime limits...\"\n" +
                "  }\n" +
                "]";

        if (apiKey == null || apiKey.isEmpty()) {
            apiKey = System.getenv("GEMINI_API_KEY");
        }

        if (apiKey == null || apiKey.isEmpty()) {
            throw new IllegalStateException("GEMINI_API_KEY environment variable or configuration is missing. Please configure it to enable Flashcard Generation.");
        }

        try {
            String response = callGemini(prompt, null, null);
            response = response.trim();
            if (response.startsWith("```json")) {
                response = response.substring(7);
            }
            if (response.endsWith("```")) {
                response = response.substring(0, response.length() - 3);
            }
            return response.trim();
        } catch (Exception e) {
            log.error("Gemini Flashcard call failed", e);
            throw new RuntimeException("Gemini Flashcard call failed: " + e.getMessage(), e);
        }
    }

    private String callGemini(String prompt, String systemInstruction, List<ChatMessage> history) throws Exception {
        String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + apiKey;

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String, Object> body = new HashMap<>();

        // Add System Instruction
        if (systemInstruction != null && !systemInstruction.trim().isEmpty()) {
            Map<String, Object> sysPart = new HashMap<>();
            sysPart.put("text", systemInstruction);
            Map<String, Object> sysContent = new HashMap<>();
            sysContent.put("parts", List.of(sysPart));
            body.put("system_instruction", sysContent);
        }

        List<Map<String, Object>> contents = new ArrayList<>();

        // Add history
        if (history != null) {
            for (ChatMessage msg : history) {
                Map<String, Object> part = new HashMap<>();
                part.put("text", msg.getText());
                Map<String, Object> content = new HashMap<>();
                content.put("parts", List.of(part));
                content.put("role", msg.getRole()); // role should be "user" or "model"
                contents.add(content);
            }
        }

        // Add current prompt
        Map<String, Object> currentPart = new HashMap<>();
        currentPart.put("text", prompt);
        Map<String, Object> currentContent = new HashMap<>();
        currentContent.put("parts", List.of(currentPart));
        currentContent.put("role", "user");
        contents.add(currentContent);

        body.put("contents", contents);

        String requestJson = objectMapper.writeValueAsString(body);
        log.info("Incoming prompt: {}", prompt);
        log.info("Outgoing Gemini request payload generated with {} history messages.", history != null ? history.size() : 0);
        
        ResponseEntity<String> response = restTemplate.postForEntity(url, new HttpEntity<>(requestJson, headers), String.class);
        log.info("Gemini response status: {}", response.getStatusCode());

        Map<String, Object> responseMap = objectMapper.readValue(response.getBody(), Map.class);
        
        // Log token usage
        if (responseMap.containsKey("usageMetadata")) {
            Map<String, Object> usage = (Map<String, Object>) responseMap.get("usageMetadata");
            log.info("Gemini API Token Usage - Prompt: {}, Candidates: {}, Total: {}", 
                     usage.get("promptTokenCount"), usage.get("candidatesTokenCount"), usage.get("totalTokenCount"));
        }
        
        List<Map<String, Object>> candidates = (List<Map<String, Object>>) responseMap.get("candidates");
        Map<String, Object> candidate = candidates.get(0);
        Map<String, Object> candidateContent = (Map<String, Object>) candidate.get("content");
        List<Map<String, Object>> parts = (List<Map<String, Object>>) candidateContent.get("parts");
        return (String) parts.get(0).get("text");
    }
}
