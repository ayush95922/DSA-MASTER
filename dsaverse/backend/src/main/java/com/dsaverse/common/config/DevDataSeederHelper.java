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
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import jakarta.persistence.EntityManager;

import java.io.InputStream;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import com.dsaverse.progress.repository.UserBookmarkRepository;
import com.dsaverse.progress.repository.UserNoteRepository;
import com.dsaverse.progress.repository.UserQuestionAttemptRepository;
import com.dsaverse.company.repository.UserCompanyReadinessRepository;
import com.dsaverse.roadmap.repository.UserRoadmapNodeProgressRepository;
import com.dsaverse.roadmap.repository.UserRoadmapEnrollmentRepository;

@Slf4j
@Component
@RequiredArgsConstructor
@SuppressWarnings({"unchecked", "null"})
public class DevDataSeederHelper {

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final CategoryRepository categoryRepository;
    private final TopicRepository topicRepository;
    private final QuestionRepository questionRepository;
    private final CompanyRepository companyRepository;
    private final RoadmapRepository roadmapRepository;
    private final RoadmapNodeRepository roadmapNodeRepository;
    private final HintRepository hintRepository;
    private final EditorialRepository editorialRepository;
    
    private final UserBookmarkRepository bookmarkRepository;
    private final UserNoteRepository noteRepository;
    private final UserQuestionAttemptRepository attemptRepository;
    private final UserCompanyReadinessRepository readinessRepository;
    private final UserRoadmapNodeProgressRepository roadmapNodeProgressRepository;
    private final UserRoadmapEnrollmentRepository roadmapEnrollmentRepository;
    private final EntityManager entityManager;

    @Transactional
    public void seed() {
        log.info("Purging legacy development database tables for a fresh seeding cycle...");
        
        // Disable referential integrity check in H2 for this session/transaction
        entityManager.createNativeQuery("SET REFERENTIAL_INTEGRITY FALSE").executeUpdate();
        
        roadmapNodeProgressRepository.deleteAllInBatch();
        roadmapEnrollmentRepository.deleteAllInBatch();
        readinessRepository.deleteAllInBatch();
        bookmarkRepository.deleteAllInBatch();
        noteRepository.deleteAllInBatch();
        attemptRepository.deleteAllInBatch();
        
        roadmapNodeRepository.deleteAllInBatch();
        roadmapRepository.deleteAllInBatch();
        companyRepository.deleteAllInBatch();
        hintRepository.deleteAllInBatch();
        editorialRepository.deleteAllInBatch();
        questionRepository.deleteAllInBatch();
        
        // Truncate non-repository dependent/join tables
        entityManager.createNativeQuery("TRUNCATE TABLE approaches").executeUpdate();
        entityManager.createNativeQuery("TRUNCATE TABLE external_links").executeUpdate();
        entityManager.createNativeQuery("TRUNCATE TABLE question_topic_tags").executeUpdate();
        entityManager.createNativeQuery("TRUNCATE TABLE roadmap_node_dependencies").executeUpdate();
        entityManager.createNativeQuery("TRUNCATE TABLE subtopics").executeUpdate();
        entityManager.createNativeQuery("TRUNCATE TABLE theory_sections").executeUpdate();
        entityManager.createNativeQuery("TRUNCATE TABLE theory_contents").executeUpdate();
        
        topicRepository.deleteAllInBatch();
        categoryRepository.deleteAllInBatch();
        
        // Re-enable referential integrity check in H2
        entityManager.createNativeQuery("SET REFERENTIAL_INTEGRITY TRUE").executeUpdate();

        // 1. Seed Roles
        if (roleRepository.count() == 0) {
            log.info("Seeding initial roles...");
            List<Role> roles = List.of(
                    Role.builder().name("USER").description("Standard user").build(),
                    Role.builder().name("PRO_USER").description("Pro subscription user").build(),
                    Role.builder().name("ADMIN").description("Admin user").build(),
                    Role.builder().name("SUPER_ADMIN").description("Super admin user").build()
            );
            roleRepository.saveAll(roles);
            log.info("Seeded {} roles", roles.size());
        }

        // 1.5. Seed Default User (ayush)
        if (userRepository.count() == 0) {
            log.info("Seeding initial user ayush...");
            Role userRole = roleRepository.findByName("USER")
                    .orElseThrow(() -> new RuntimeException("Role USER not found"));

            User user = User.builder()
                    .email("ayushshrivastava2468@gmail.com")
                    .username("ayush")
                    .passwordHash(passwordEncoder.encode("password123"))
                    .status("ACTIVE")
                    .emailVerifiedAt(Instant.now())
                    .build();

            user = userRepository.save(user);

            UserRole uRole = UserRole.builder()
                    .user(user)
                    .role(userRole)
                    .build();
            user.getUserRoles().add(uRole);
            user = userRepository.save(user);

            UserProfile profile = UserProfile.builder()
                    .user(user)
                    .fullName("ayush")
                    .bio("Mastering DSA with DSAverse!")
                    .college("Engineering College")
                    .graduationYear(2026)
                    .level("BEGINNER")
                    .onboardingCompleted(true)
                    .build();
            user.setProfile(profile);

            UserSettings settings = UserSettings.builder()
                    .user(user)
                    .theme("DARK")
                    .emailNotifications(true)
                    .revisionReminders(true)
                    .dailyGoalQuestions(5)
                    .preferredLanguage("JAVA")
                    .build();
            user.setSettings(settings);

            userRepository.save(user);
            log.info("Seeded user ayush successfully.");
        }

        // 1.6. Seed Additional Demo Users dynamically if not exist
        if (!userRepository.existsByUsername("student")) {
            log.info("Seeding demo student account...");
            Role userRole = roleRepository.findByName("USER")
                    .orElseThrow(() -> new RuntimeException("Role USER not found"));
            User student = User.builder()
                    .email("student@dsaverse.com")
                    .username("student")
                    .passwordHash(passwordEncoder.encode("password123"))
                    .status("ACTIVE")
                    .emailVerifiedAt(Instant.now())
                    .build();
            student = userRepository.save(student);
            UserRole uRole = UserRole.builder().user(student).role(userRole).build();
            student.getUserRoles().add(uRole);
            student = userRepository.save(student);
            UserProfile profile = UserProfile.builder()
                    .user(student)
                    .fullName("Demo Student")
                    .bio("Mastering DSA on the Placement Track!")
                    .college("University of Tech")
                    .graduationYear(2026)
                    .level("INTERMEDIATE")
                    .onboardingCompleted(true)
                    .build();
            student.setProfile(profile);
            UserSettings settings = UserSettings.builder()
                    .user(student)
                    .theme("DARK")
                    .emailNotifications(true)
                    .revisionReminders(true)
                    .dailyGoalQuestions(5)
                    .preferredLanguage("JAVA")
                    .build();
            student.setSettings(settings);
            userRepository.save(student);
            log.info("Seeded user student successfully.");
        }

        if (!userRepository.existsByUsername("admin")) {
            log.info("Seeding demo admin account...");
            Role adminRole = roleRepository.findByName("ADMIN")
                    .orElseThrow(() -> new RuntimeException("Role ADMIN not found"));
            User admin = User.builder()
                    .email("admin@dsaverse.com")
                    .username("admin")
                    .passwordHash(passwordEncoder.encode("password123"))
                    .status("ACTIVE")
                    .emailVerifiedAt(Instant.now())
                    .build();
            admin = userRepository.save(admin);
            UserRole uRole = UserRole.builder().user(admin).role(adminRole).build();
            admin.getUserRoles().add(uRole);
            admin = userRepository.save(admin);
            UserProfile profile = UserProfile.builder()
                    .user(admin)
                    .fullName("Demo Admin")
                    .bio("DSAverse Administrator Account")
                    .college("DSAverse HQ")
                    .graduationYear(2026)
                    .level("EXPERT")
                    .onboardingCompleted(true)
                    .build();
            admin.setProfile(profile);
            UserSettings settings = UserSettings.builder()
                    .user(admin)
                    .theme("DARK")
                    .emailNotifications(true)
                    .revisionReminders(true)
                    .dailyGoalQuestions(10)
                    .preferredLanguage("JAVA")
                    .build();
            admin.setSettings(settings);
            userRepository.save(admin);
            log.info("Seeded user admin successfully.");
        }

        // 2. Seed Categories and Topics
        if (categoryRepository.count() == 0) {
            log.info("Seeding categories and topics from JSON...");
            try {
                ObjectMapper mapper = new ObjectMapper();
                InputStream inputStream = getClass().getResourceAsStream("/data/topics.json");
                if (inputStream == null) {
                    log.error("Could not find /data/topics.json in classpath!");
                } else {
                    List<Map<String, Object>> categoriesJson = mapper.readValue(inputStream, new TypeReference<List<Map<String, Object>>>() {});
                    log.info("Loaded {} categories from JSON file", categoriesJson.size());

                    int catDisplayOrder = 1;
                    for (Map<String, Object> catMap : categoriesJson) {
                        String catName = (String) catMap.get("name");
                        String catSlug = (String) catMap.get("slug");
                        String catDesc = (String) catMap.get("description");

                        Category category = Category.builder()
                                .name(catName)
                                .slug(catSlug)
                                .description(catDesc)
                                .displayOrder(catDisplayOrder++)
                                .build();
                        category = categoryRepository.save(category);

                        List<Map<String, Object>> topicsJson = (List<Map<String, Object>>) catMap.get("topics");
                        if (topicsJson != null) {
                            int topicDisplayOrder = 1;
                            for (Map<String, Object> topicMap : topicsJson) {
                                String topicName = (String) topicMap.get("name");
                                String topicSlug = (String) topicMap.get("slug");
                                String topicDesc = (String) topicMap.get("description");

                                Topic topic = Topic.builder()
                                        .category(category)
                                        .name(topicName)
                                        .slug(topicSlug)
                                        .description(topicDesc)
                                        .displayOrder(topicDisplayOrder++)
                                        .build();

                                // Handle Theory Content
                                Map<String, Object> theoryMap = (Map<String, Object>) topicMap.get("theory");
                                if (theoryMap != null) {
                                    String overview = (String) theoryMap.get("overview");
                                    String complexityAnalysis = (String) theoryMap.get("complexityAnalysis");

                                    TheoryContent theoryContent = TheoryContent.builder()
                                            .topic(topic)
                                            .overview(overview)
                                            .complexityAnalysis(complexityAnalysis)
                                            .build();

                                    List<Map<String, Object>> sectionsJson = (List<Map<String, Object>>) theoryMap.get("sections");
                                    if (sectionsJson != null) {
                                        List<TheorySection> sections = new ArrayList<>();
                                        for (Map<String, Object> secMap : sectionsJson) {
                                            String title = (String) secMap.get("title");
                                            String content = (String) secMap.get("content");
                                            Integer order = (Integer) secMap.get("order");

                                            sections.add(TheorySection.builder()
                                                    .theory(theoryContent)
                                                    .title(title)
                                                    .content(content)
                                                    .sectionOrder(order != null ? order : 0)
                                                    .build());
                                        }
                                        theoryContent.setSections(sections);
                                    }
                                    topic.setTheoryContent(theoryContent);
                                }

                                // Handle Subtopics
                                List<Map<String, Object>> subtopicsJson = (List<Map<String, Object>>) topicMap.get("subtopics");
                                if (subtopicsJson != null) {
                                    List<Subtopic> subtopics = new ArrayList<>();
                                    int subOrder = 1;
                                    for (Map<String, Object> subMap : subtopicsJson) {
                                        String subName = (String) subMap.get("name");
                                        String subSlug = (String) subMap.get("slug");
                                        String subDesc = (String) subMap.get("description");

                                        subtopics.add(Subtopic.builder()
                                                .topic(topic)
                                                .name(subName)
                                                .slug(subSlug)
                                                .description(subDesc)
                                                .displayOrder(subOrder++)
                                                .build());
                                    }
                                    topic.setSubtopics(subtopics);
                                }

                                topicRepository.save(topic);
                            }
                        }
                    }
                    log.info("Seeded categories and topics successfully from JSON.");
                }
            } catch (Exception e) {
                log.error("Failed to seed categories and topics", e);
            }
        }

        // 3. Seed Questions
        if (questionRepository.count() == 0) {
            log.info("Seeding questions from JSON...");
            try {
                ObjectMapper mapper = new ObjectMapper();
                InputStream inputStream = getClass().getResourceAsStream("/data/questions.json");
                if (inputStream == null) {
                    log.error("Could not find /data/questions.json in classpath!");
                } else {
                    List<Map<String, Object>> questionsJson = mapper.readValue(inputStream, new TypeReference<List<Map<String, Object>>>() {});
                    log.info("Loaded {} questions from JSON file", questionsJson.size());

                    // Query all topics first and put them in a map to avoid N+2 query performance issue
                    List<Topic> allTopics = topicRepository.findAll();
                    java.util.Map<String, Topic> topicMapBySlug = new java.util.HashMap<>();
                    for (Topic t : allTopics) {
                        topicMapBySlug.put(t.getSlug(), t);
                    }

                    for (Map<String, Object> qMap : questionsJson) {
                        String title = (String) qMap.get("title");
                        String slug = (String) qMap.get("slug");
                        String diffStr = (String) qMap.get("difficulty");
                        Difficulty difficulty = Difficulty.valueOf(diffStr.toUpperCase());
                        String description = (String) qMap.get("description");
                        String inputFormat = (String) qMap.get("inputFormat");
                        String outputFormat = (String) qMap.get("outputFormat");
                        String constraints = (String) qMap.get("constraints");
                        Integer points = (Integer) qMap.get("points");
                        Boolean premium = (Boolean) qMap.get("premium");

                        List<String> tags = (List<String>) qMap.get("companyTags");
                        String joinedTags = "";
                        if (tags != null && !tags.isEmpty()) {
                            joinedTags = String.join(",", tags);
                        }

                        Question question = Question.builder()
                                .title(title)
                                .slug(slug)
                                .difficulty(difficulty)
                                .description(description)
                                .inputFormat(inputFormat)
                                .outputFormat(outputFormat)
                                .constraints(constraints)
                                .points(points != null ? points : 10)
                                .premium(premium != null ? premium : false)
                                .companyTags(joinedTags)
                                .build();

                        // External links mapping
                        List<ExternalLink> links = new ArrayList<>();
                        String leetcode = (String) qMap.get("leetcodeUrl");
                        if (leetcode != null && !leetcode.isEmpty()) {
                            links.add(ExternalLink.builder().question(question).platformName("LEETCODE").url(leetcode).build());
                        }
                        String gfg = (String) qMap.get("geeksforgeeksUrl");
                        if (gfg != null && !gfg.isEmpty()) {
                            links.add(ExternalLink.builder().question(question).platformName("GEEKSFORGEEKS").url(gfg).build());
                        }
                        String hackerrank = (String) qMap.get("hackerrankUrl");
                        if (hackerrank != null && !hackerrank.isEmpty()) {
                            links.add(ExternalLink.builder().question(question).platformName("HACKERRANK").url(hackerrank).build());
                        }
                        String youtube = (String) qMap.get("youtubeUrl");
                        if (youtube != null && !youtube.isEmpty()) {
                            links.add(ExternalLink.builder().question(question).platformName("YOUTUBE").url(youtube).build());
                        }
                        question.setExternalLinks(links);

                        Question savedQuestion = questionRepository.save(question);

                        // Map topic slug in-memory
                        String topicSlug = (String) qMap.get("topicSlug");
                        if (topicSlug != null) {
                            Topic topic = topicMapBySlug.get(topicSlug);
                            if (topic != null) {
                                topic.getQuestions().add(savedQuestion);
                                savedQuestion.getTopics().add(topic);
                            }
                        }

                        // Hints mapping
                        List<String> hintsList = (List<String>) qMap.get("hints");
                        if (hintsList != null) {
                            List<Hint> hints = new ArrayList<>();
                            int hintNum = 1;
                            for (String hintStr : hintsList) {
                                hints.add(Hint.builder()
                                        .question(savedQuestion)
                                        .hintNumber(hintNum++)
                                        .content(hintStr)
                                        .build());
                            }
                            hintRepository.saveAll(hints);
                        }

                        // Editorial mapping
                        Map<String, Object> editMap = (Map<String, Object>) qMap.get("editorial");
                        if (editMap != null) {
                            String overview = (String) editMap.get("solutionOverview");
                            Editorial editorial = Editorial.builder()
                                    .question(savedQuestion)
                                    .solutionOverview(overview)
                                    .build();

                            List<Map<String, Object>> approachesJson = (List<Map<String, Object>>) editMap.get("approaches");
                            if (approachesJson != null) {
                                List<Approach> approaches = new ArrayList<>();
                                int appOrder = 1;
                                for (Map<String, Object> appMap : approachesJson) {
                                    String appTitle = (String) appMap.get("title");
                                    String appType = (String) appMap.get("type");
                                    String appDesc = (String) appMap.get("description");
                                    String timeComp = (String) appMap.get("timeComplexity");
                                    String spaceComp = (String) appMap.get("spaceComplexity");
                                    String javaCode = (String) appMap.get("javaCode");
                                    String pythonCode = (String) appMap.get("pythonCode");
                                    String cppCode = (String) appMap.get("cppCode");

                                    approaches.add(Approach.builder()
                                            .editorial(editorial)
                                            .title(appTitle)
                                            .type(appType != null ? appType : "OPTIMAL")
                                            .description(appDesc)
                                            .complexityTime(timeComp)
                                            .complexitySpace(spaceComp)
                                            .javaCode(javaCode)
                                            .pythonCode(pythonCode)
                                            .cppCode(cppCode)
                                            .displayOrder(appOrder++)
                                            .build());
                                }
                                editorial.setApproaches(approaches);
                            }
                            editorialRepository.save(editorial);
                        }
                    }
                    log.info("Saving topic-question mappings...");
                    topicRepository.saveAll(topicMapBySlug.values());
                    log.info("Seeded questions and linked them to topics successfully.");
                }
            } catch (Exception e) {
                log.error("Failed to seed questions", e);
            }
        }

        // 4. Seed Companies
        if (companyRepository.count() < 13) {
            log.info("Checking and seeding missing companies from JSON...");
            try {
                ObjectMapper mapper = new ObjectMapper();
                InputStream inputStream = getClass().getResourceAsStream("/data/companies.json");
                if (inputStream == null) {
                    log.error("Could not find /data/companies.json in classpath!");
                } else {
                    List<Map<String, Object>> companiesJson = mapper.readValue(inputStream, new TypeReference<List<Map<String, Object>>>() {});
                    log.info("Loaded {} companies from JSON file", companiesJson.size());

                    for (Map<String, Object> cMap : companiesJson) {
                        String slug = (String) cMap.get("slug");
                        if (companyRepository.findBySlug(slug).isPresent()) {
                            continue; // Skip if already seeded
                        }
                        String name = (String) cMap.get("name");
                        String logo = (String) cMap.get("logo");
                        String description = (String) cMap.get("description");
                        String tier = (String) cMap.get("tier");
                        String prepTimeline = (String) cMap.get("preparationTimeline");
                        String interviewProc = (String) cMap.get("interviewProcess");
                        List<String> mostAskedTopics = (List<String>) cMap.get("mostAskedTopics");
                        List<String> mostAskedQuestions = (List<String>) cMap.get("mostAskedQuestions");

                        Map<String, Object> diffMap = (Map<String, Object>) cMap.get("difficultyBreakdown");
                        Company.DifficultyBreakdown difficultyBreakdown = null;
                        if (diffMap != null) {
                            difficultyBreakdown = Company.DifficultyBreakdown.builder()
                                    .easy(diffMap.get("easy") != null ? (Integer) diffMap.get("easy") : 0)
                                    .medium(diffMap.get("medium") != null ? (Integer) diffMap.get("medium") : 0)
                                    .hard(diffMap.get("hard") != null ? (Integer) diffMap.get("hard") : 0)
                                    .build();
                        }

                        // Map faqs
                        List<Map<String, Object>> faqsJson = (List<Map<String, Object>>) cMap.get("faqs");
                        List<Company.FaqInfo> faqs = null;
                        if (faqsJson != null) {
                            faqs = mapper.convertValue(faqsJson, new TypeReference<List<Company.FaqInfo>>() {});
                        }

                        // Map interviewExperiences
                        List<Map<String, Object>> experiencesJson = (List<Map<String, Object>>) cMap.get("interviewExperiences");
                        List<Company.InterviewExperienceInfo> interviewExperiences = null;
                        if (experiencesJson != null) {
                            interviewExperiences = mapper.convertValue(experiencesJson, new TypeReference<List<Company.InterviewExperienceInfo>>() {});
                        }

                        // Map topicWeightages
                        Map<String, Integer> topicWeightages = (Map<String, Integer>) cMap.get("topicWeightages");

                        // Map companyRoadmap
                        List<Map<String, Object>> roadmapJson = (List<Map<String, Object>>) cMap.get("companyRoadmap");
                        List<Company.CompanyRoadmapWeek> companyRoadmap = null;
                        if (roadmapJson != null) {
                            companyRoadmap = mapper.convertValue(roadmapJson, new TypeReference<List<Company.CompanyRoadmapWeek>>() {});
                        }

                        Company company = Company.builder()
                                .name(name)
                                .slug(slug)
                                .logo(logo)
                                .description(description)
                                .tier(tier != null ? tier : "TIER_3")
                                .preparationTimeline(prepTimeline)
                                .interviewProcess(interviewProc)
                                .mostAskedTopics(mostAskedTopics)
                                .mostAskedQuestions(mostAskedQuestions)
                                .difficultyBreakdown(difficultyBreakdown)
                                .faqs(faqs)
                                .interviewExperiences(interviewExperiences)
                                .topicWeightages(topicWeightages)
                                .companyRoadmap(companyRoadmap)
                                .build();

                        companyRepository.save(company);
                    }
                    log.info("Seeded companies successfully.");
                }
            } catch (Exception e) {
                log.error("Failed to seed companies", e);
            }
        }
// 5. Seed Roadmaps
        if (roadmapRepository.count() == 0) {
            log.info("Seeding initial roadmaps...");
            try {
                // ONE MASTER ROADMAP: Placement DSA Roadmap
                Roadmap begRm = Roadmap.builder()
                        .title("Placement DSA Roadmap")
                        .slug("placement-dsa-roadmap")
                        .description("Master path designed to take you from absolute coding foundations to placement-ready professional.")
                        .type("PLACEMENT")
                        .difficulty("MEDIUM")
                        .estimatedDuration("12 Weeks")
                        .prerequisites("None. Open for all coding enthusiasts.")
                        .learningOutcomes(List.of("Master fundamental linear and non-linear data structures", "Optimize algorithmic solutions for space and time", "Build high-frequency placement readiness"))
                        .completionCriteria("Complete all milestone nodes and their respective practice questions.")
                        .build();

                final Roadmap roadmap = roadmapRepository.save(begRm);

                List<RoadmapNode> prodNodes = List.of(
                        createNode(roadmap, "Programming Basics", "Variables, conditionals, iterations, and functions.", "programming-basics", 400, 50, 1),
                        createNode(roadmap, "Arrays", "Contiguous memories, multi-dimensional grids, and scans.", "arrays", 400, 170, 2),
                        createNode(roadmap, "Strings", "Text sequences, palindromes, and pattern matching.", "strings", 200, 290, 3),
                        createNode(roadmap, "Hashing", "Key-value hashes, chain resolutions, and hash table designs.", "hashing", 600, 290, 4),
                        createNode(roadmap, "Two Pointers", "Optimizing array sweeps using multiple reference indices.", "arrays", 200, 410, 5),
                        createNode(roadmap, "Sliding Window", "Dynamic subarray sweeps for optimal subarray tracking.", "arrays", 200, 530, 6),
                        createNode(roadmap, "Binary Search", "Dividing search space log-wise on sorted boundaries.", "searching", 600, 410, 7),
                        createNode(roadmap, "Linked List", "Dynamic nodes, dummy head pointers, and cycle markers.", "linked-list", 400, 650, 8),
                        createNode(roadmap, "Stack", "Last-in-First-out structures, monotonic stack buffers.", "stack", 200, 770, 9),
                        createNode(roadmap, "Queue", "First-in-First-out rings, deques, and buffer streams.", "queue", 600, 770, 10),
                        createNode(roadmap, "Trees", "Binary hierarchies, traversals, and lowest common ancestors.", "tree", 400, 890, 11),
                        createNode(roadmap, "BST", "Binary search tree invariants, successors, and tree rotations.", "bst", 200, 1010, 12),
                        createNode(roadmap, "Heap", "Priority complete trees, array allocations, heapify algorithm.", "heap", 600, 1010, 13),
                        createNode(roadmap, "Trie", "Prefix matches, autocomplete sweeps, and word indexing.", "trie", 400, 1130, 14),
                        createNode(roadmap, "Graph", "Vertices connectivity, DFS traversals, and BFS queues.", "graph", 400, 1250, 15),
                        createNode(roadmap, "Greedy", "Local optimal choices, interval scheduling, sorting.", "greedy", 200, 1370, 16),
                        createNode(roadmap, "Backtracking", "State recursion search, decision trees, unchoosing.", "backtracking", 600, 1370, 17),
                        createNode(roadmap, "Dynamic Programming", "Memoization buffers, tabulation transitions, matrices.", "dynamic-programming", 400, 1490, 18),
                        createNode(roadmap, "Advanced Graphs", "Weighted graphs, Dijkstra algorithms, and Kruskal MSTs.", "advanced-graphs", 400, 1610, 19)
                );

                linkGraphDependencies(roadmapNodeRepository.saveAll(prodNodes));
                log.info("Seeded Placement DSA Roadmap successfully.");
            } catch (Exception e) {
                log.error("Failed to seed roadmaps", e);
            }
        }
    }

    private RoadmapNode createNode(Roadmap roadmap, String title, String description, String topicSlug, int x, int y, int order) {
        List<RoadmapNode.PracticeQuestionInfo> practice = new java.util.ArrayList<>();
        try {
            Optional<Topic> topicOpt = topicRepository.findBySlug(topicSlug);
            if (topicOpt.isPresent()) {
                Topic topic = topicOpt.get();
                List<Question> questions = topic.getQuestions();
                if (questions != null) {
                    for (Question q : questions) {
                        String leetcodeUrl = "";
                        String gfgUrl = "";
                        String hackerrankUrl = "";
                        String youtubeUrl = "";
                        if (q.getExternalLinks() != null) {
                            for (ExternalLink link : q.getExternalLinks()) {
                                if ("LEETCODE".equalsIgnoreCase(link.getPlatformName())) {
                                    leetcodeUrl = link.getUrl();
                                } else if ("GEEKSFORGEEKS".equalsIgnoreCase(link.getPlatformName())) {
                                    gfgUrl = link.getUrl();
                                } else if ("HACKERRANK".equalsIgnoreCase(link.getPlatformName())) {
                                    hackerrankUrl = link.getUrl();
                                } else if ("YOUTUBE".equalsIgnoreCase(link.getPlatformName())) {
                                    youtubeUrl = link.getUrl();
                                }
                            }
                        }
                        practice.add(RoadmapNode.PracticeQuestionInfo.builder()
                                .title(q.getTitle())
                                .slug(q.getSlug())
                                .difficulty(q.getDifficulty().name())
                                .topic(topic.getName())
                                .leetcodeUrl(leetcodeUrl)
                                .gfgUrl(gfgUrl)
                                .hackerrankUrl(hackerrankUrl)
                                .youtubeUrl(youtubeUrl)
                                .build());
                    }
                }
            }
        } catch (Exception e) {
            log.error("Failed to load dynamic practice questions for topic slug: " + topicSlug, e);
        }

        if (practice.isEmpty()) {
            practice = List.of(
                RoadmapNode.PracticeQuestionInfo.builder()
                    .title("Two Sum")
                    .slug("two-sum")
                    .difficulty("EASY")
                    .topic(title)
                    .leetcodeUrl("https://leetcode.com/problems/two-sum/")
                    .gfgUrl("https://geeksforgeeks.org/problems/two-sum/")
                    .youtubeUrl("https://youtube.com/watch?v=KLlXCFG5Tk0")
                    .build(),
                RoadmapNode.PracticeQuestionInfo.builder()
                    .title("Contains Duplicate")
                    .slug("contains-duplicate")
                    .difficulty("EASY")
                    .topic(title)
                    .leetcodeUrl("https://leetcode.com/problems/contains-duplicate/")
                    .gfgUrl("https://geeksforgeeks.org/problems/contains-duplicate/")
                    .youtubeUrl("https://youtube.com/watch?v=3OamzN90kQg")
                    .build()
            );
        }

        List<RoadmapNode.FlashcardInfo> flashcards = List.of(
            RoadmapNode.FlashcardInfo.builder().front("What is the time complexity of lookup in a HashMap?").back("Average O(1), Worst Case O(N).").build(),
            RoadmapNode.FlashcardInfo.builder().front("What is the space complexity of an in-place array swap?").back("O(1) auxiliary space.").build()
        );

        List<RoadmapNode.ResourceLink> youtube = List.of(
            RoadmapNode.ResourceLink.builder().title("NeetCode: " + title + " Tutorial").url("https://youtube.com/watch?v=KLlXCFG5Tk0").build()
        );

        List<RoadmapNode.ResourceLink> leetcode = List.of(
            RoadmapNode.ResourceLink.builder().title("LeetCode Practice List").url("https://leetcode.com/tag/" + topicSlug + "/").build()
        );

        List<RoadmapNode.ResourceLink> gfg = List.of(
            RoadmapNode.ResourceLink.builder().title("GeeksforGeeks Article").url("https://geeksforgeeks.org/" + topicSlug + "/").build()
        );

        return RoadmapNode.builder()
                .roadmap(roadmap)
                .title(title)
                .description(description)
                .topicSlug(topicSlug)
                .xCoordinate(x)
                .yCoordinate(y)
                .nodeOrder(order)
                .theoryPage("### Comprehensive Study Guide: " + title + "\n\n" + description + "\n\n" +
                            "#### Key Core Concepts\n" +
                            "- **Contiguous Memory Storage:** elements reside next to each other in memory, supporting O(1) index access.\n" +
                            "- **Dynamic Resizing:** ArrayLists allocate double capacity when full to provide O(1) amortized appends.\n\n" +
                            "#### Real-World Analogy\n" +
                            "Imagine a row of numbered lockboxes. If you know the index, you walk straight to it in O(1) time.")
                .revisionNotes("### Quick Revision Notes: " + title + "\n\n" +
                               "- Primitives allocate memory on the stack.\n" +
                               "- Reference pointers map variables directly to heap-allocated objects.\n" +
                               "- Always ask if the array is sorted before scanning (allows Binary Search).")
                .cheatSheet("### Cheat Sheet: " + title + "\n\n" +
                            "| Operation | Average | Worst |\n" +
                            "| --- | --- | --- |\n" +
                            "| Access | O(1) | O(1) |\n" +
                            "| Search | O(N) | O(N) |\n" +
                            "| Insertion | O(N) | O(N) |\n" +
                            "| Deletion | O(N) | O(N) |")
                .flashcards(flashcards)
                .youtubeResources(youtube)
                .leetcodeProblems(leetcode)
                .geeksforgeeksLinks(gfg)
                .practiceQuestions(practice)
                .build();
    }

    private void linkGraphDependencies(List<RoadmapNode> nodes) {
        java.util.Map<String, RoadmapNode> nodeByTitle = new java.util.HashMap<>();
        for (RoadmapNode node : nodes) {
            nodeByTitle.put(node.getTitle(), node);
        }

        // Set dependencies manually for branching graph
        addDep(nodeByTitle, "Arrays", "Programming Basics");
        
        addDep(nodeByTitle, "Strings", "Arrays");
        addDep(nodeByTitle, "Hashing", "Arrays");
        
        addDep(nodeByTitle, "Two Pointers", "Strings");
        addDep(nodeByTitle, "Sliding Window", "Two Pointers");
        
        addDep(nodeByTitle, "Binary Search", "Hashing");
        
        addDep(nodeByTitle, "Linked List", "Sliding Window");
        addDep(nodeByTitle, "Linked List", "Binary Search");
        
        addDep(nodeByTitle, "Stack", "Linked List");
        addDep(nodeByTitle, "Queue", "Linked List");
        
        addDep(nodeByTitle, "Trees", "Stack");
        addDep(nodeByTitle, "Trees", "Queue");
        
        addDep(nodeByTitle, "BST", "Trees");
        addDep(nodeByTitle, "Heap", "Trees");
        
        addDep(nodeByTitle, "Trie", "BST");
        addDep(nodeByTitle, "Trie", "Heap");
        
        addDep(nodeByTitle, "Graph", "Trie");
        
        addDep(nodeByTitle, "Greedy", "Graph");
        addDep(nodeByTitle, "Backtracking", "Graph");
        
        addDep(nodeByTitle, "Dynamic Programming", "Greedy");
        addDep(nodeByTitle, "Dynamic Programming", "Backtracking");
        
        addDep(nodeByTitle, "Advanced Graphs", "Graph");

        roadmapNodeRepository.saveAll(nodes);
    }

    private void addDep(java.util.Map<String, RoadmapNode> nodeByTitle, String childTitle, String parentTitle) {
        RoadmapNode child = nodeByTitle.get(childTitle);
        RoadmapNode parent = nodeByTitle.get(parentTitle);
        if (child != null && parent != null) {
            child.getDependencies().add(parent);
        }
    }
}
