package com.dsaverse.common.config;

import com.dsaverse.auth.entity.Role;
import com.dsaverse.auth.entity.User;
import com.dsaverse.auth.entity.UserProfile;
import com.dsaverse.auth.entity.UserSettings;
import com.dsaverse.auth.entity.UserRole;
import com.dsaverse.auth.repository.RoleRepository;
import com.dsaverse.auth.repository.UserRepository;
import com.dsaverse.topic.entity.Category;
import com.dsaverse.topic.entity.Topic;
import com.dsaverse.topic.entity.TheoryContent;
import com.dsaverse.topic.entity.TheorySection;
import com.dsaverse.topic.entity.Subtopic;
import com.dsaverse.topic.repository.CategoryRepository;
import com.dsaverse.topic.repository.TopicRepository;
import com.dsaverse.question.entity.Question;
import com.dsaverse.question.entity.ExternalLink;
import com.dsaverse.question.entity.Hint;
import com.dsaverse.question.entity.Editorial;
import com.dsaverse.question.entity.Approach;
import com.dsaverse.question.repository.QuestionRepository;
import com.dsaverse.question.repository.HintRepository;
import com.dsaverse.question.repository.EditorialRepository;
import com.dsaverse.question.enums.Difficulty;
import com.dsaverse.company.entity.Company;
import com.dsaverse.company.repository.CompanyRepository;
import com.dsaverse.roadmap.entity.Roadmap;
import com.dsaverse.roadmap.entity.RoadmapNode;
import com.dsaverse.roadmap.repository.RoadmapRepository;
import com.dsaverse.roadmap.repository.RoadmapNodeRepository;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.io.InputStream;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * Seeds initial data for the dev profile.
 * Populates roles, categories, topics, questions, companies, and roadmaps
 * when using the H2 database.
 */
@Slf4j
@Configuration
@Profile({"dev", "seed"})
@RequiredArgsConstructor
public class DevDataSeeder {

    @Bean
    CommandLineRunner seedData(DevDataSeederHelper devDataSeederHelper) {
        return args -> {
            devDataSeederHelper.seed();
        };
    }
}
