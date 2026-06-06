package com.dsaverse.common.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

/**
 * General application configuration.
 * Provides shared beans used across the application.
 */
@Configuration
public class AppConfig {

    /**
     * RestTemplate bean for making outgoing HTTP calls (e.g., Gemini AI API).
     */
    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }

    /**
     * ObjectMapper bean — shared, Spring-configured Jackson mapper.
     * Uses the auto-configured settings from spring.jackson.* properties.
     * AIService and AIController inject this instead of creating their own instances.
     */
    @Bean
    public ObjectMapper objectMapper() {
        return new ObjectMapper()
                .findAndRegisterModules(); // registers JavaTimeModule, etc.
    }
}
