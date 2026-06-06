package com.dsaverse.company.service.impl;

import com.dsaverse.common.exception.ResourceNotFoundException;
import com.dsaverse.company.dto.response.CompanyDetailResponse;
import com.dsaverse.company.dto.response.CompanyResponse;
import com.dsaverse.company.entity.Company;
import com.dsaverse.company.entity.UserCompanyReadiness;
import com.dsaverse.company.repository.CompanyRepository;
import com.dsaverse.company.repository.UserCompanyReadinessRepository;
import com.dsaverse.company.service.CompanyService;
import com.dsaverse.progress.entity.UserBookmark;
import com.dsaverse.progress.entity.UserNote;
import com.dsaverse.progress.entity.UserQuestionAttempt;
import com.dsaverse.progress.repository.UserBookmarkRepository;
import com.dsaverse.progress.repository.UserNoteRepository;
import com.dsaverse.progress.repository.UserQuestionAttemptRepository;
import com.dsaverse.question.entity.ExternalLink;
import com.dsaverse.question.entity.Question;
import com.dsaverse.question.repository.QuestionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CompanyServiceImpl implements CompanyService {

    private final CompanyRepository companyRepository;
    private final UserCompanyReadinessRepository readinessRepository;
    private final QuestionRepository questionRepository;
    private final UserQuestionAttemptRepository attemptRepository;
    private final UserBookmarkRepository bookmarkRepository;
    private final UserNoteRepository noteRepository;

    @Override
    public List<CompanyResponse> getAllCompanies(Long userId) {
        List<Company> companies = companyRepository.findAll();
        List<UserCompanyReadiness> readinessList = readinessRepository.findAllByUserId(userId);
        List<Question> allQuestions = questionRepository.findAll();

        Map<Long, Integer> readinessMap = readinessList.stream()
                .collect(Collectors.toMap(r -> r.getCompany().getId(), UserCompanyReadiness::getReadinessPercentage));

        return companies.stream().map(company -> {
            int readiness = readinessMap.getOrDefault(company.getId(), 0);
            String difficulty = "Easy";
            if ("TIER_1".equals(company.getTier())) {
                difficulty = "Hard";
            } else if ("TIER_2".equals(company.getTier())) {
                difficulty = "Medium";
            }

            // Calculate actual database question count matching this company
            List<Question> companyQuestions = allQuestions.stream()
                    .filter(q -> q.getCompanyTags() != null && 
                            q.getCompanyTags().toLowerCase().contains(company.getName().toLowerCase()))
                    .collect(Collectors.toList());
            int qCount = companyQuestions.size();

            // Set dynamic mostAskedTopics if not explicitly configured
            List<String> topics = company.getMostAskedTopics();
            if (topics == null || topics.isEmpty()) {
                Map<String, Long> topicCounts = companyQuestions.stream()
                    .collect(Collectors.groupingBy(q -> (q.getTopics() != null && !q.getTopics().isEmpty()) ? q.getTopics().get(0).getName() : "Arrays", Collectors.counting()));
                topics = topicCounts.entrySet().stream()
                    .sorted((e1, e2) -> Long.compare(e2.getValue(), e1.getValue()))
                    .map(Map.Entry::getKey)
                    .limit(3)
                    .collect(Collectors.toList());
            }

            return CompanyResponse.builder()
                    .id(company.getId())
                    .name(company.getName())
                    .slug(company.getSlug())
                    .logo(company.getLogo())
                    .description(company.getDescription())
                    .tier(company.getTier())
                    .readinessPercentage(readiness)
                    .difficulty(difficulty)
                    .questionsCount(qCount)
                    .mostAskedTopics(topics)
                    .build();
        }).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public CompanyDetailResponse getCompanyBySlug(String slug, Long userId) {
        Company company = companyRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Company", "slug", slug));

        // 1. Map rounds focus dynamically split on pipe character
        List<CompanyDetailResponse.InterviewRoundInfo> rounds = new ArrayList<>();
        if (company.getInterviewProcess() != null && !company.getInterviewProcess().isEmpty()) {
            String[] parts = company.getInterviewProcess().split("\\|");
            for (String part : parts) {
                part = part.trim();
                if (part.isEmpty()) continue;
                String name = part;
                String focus = "DSA & Core CS Fundamentals";
                String description = "";
                
                int colonIdx = part.indexOf(":");
                if (colonIdx != -1) {
                    name = part.substring(0, colonIdx).trim();
                    description = part.substring(colonIdx + 1).trim();
                }
                
                String nameLower = name.toLowerCase();
                if (nameLower.contains("cognitive") || nameLower.contains("aptitude") || nameLower.contains("game")) {
                    focus = "Aptitude & Core Logic";
                } else if (nameLower.contains("coding") || nameLower.contains("assessment") || nameLower.contains("oa")) {
                    focus = "DSA & Coding Speed";
                } else if (nameLower.contains("system design") || nameLower.contains("architecture")) {
                    focus = "Scalability & System Design";
                } else if (nameLower.contains("hr") || nameLower.contains("managerial") || nameLower.contains("behavioral") || nameLower.contains("leadership") || nameLower.contains("googleyness")) {
                    focus = "Behavioral & Cultural";
                } else if (nameLower.contains("machine coding") || nameLower.contains("lld")) {
                    focus = "LLD & Modular Coding";
                }
                
                rounds.add(CompanyDetailResponse.InterviewRoundInfo.builder()
                        .name(name)
                        .focus(focus)
                        .description(description)
                        .build());
            }
        } else {
            rounds.add(CompanyDetailResponse.InterviewRoundInfo.builder()
                    .name("Online Coding Assessment")
                    .focus("Data Structures, String parsing, Core Arrays")
                    .description("Usually consists of 2 questions on a platform like Hackerrank or Codesignal to clear initial filters.")
                    .build());
            rounds.add(CompanyDetailResponse.InterviewRoundInfo.builder()
                    .name("Technical Screen Interview")
                    .focus("Topological Sort, Graph Traversals, Sliding Window")
                    .description("A 45-minute live screen sharing session explaining and solving 1 medium to hard DSA puzzle.")
                    .build());
            rounds.add(CompanyDetailResponse.InterviewRoundInfo.builder()
                    .name("System Design & Architecture")
                    .focus("Scalability, Microservices, Caching structures")
                    .description("Evaluating your ability to design complex distributed backends under massive student loads.")
                    .build());
        }

        // 2. Map preparation timelines split on pipe character
        List<CompanyDetailResponse.PrepWeekInfo> timeline = new ArrayList<>();
        if (company.getPreparationTimeline() != null && !company.getPreparationTimeline().isEmpty()) {
            String[] parts = company.getPreparationTimeline().split("\\|");
            int seq = 1;
            for (String part : parts) {
                part = part.trim();
                if (part.isEmpty()) continue;
                String focus = part;
                String description = "";
                
                int colonIdx = part.indexOf(":");
                if (colonIdx != -1) {
                    focus = part.substring(0, colonIdx).trim();
                    description = part.substring(colonIdx + 1).trim();
                }
                
                timeline.add(CompanyDetailResponse.PrepWeekInfo.builder()
                        .weekNumber(seq++)
                        .focusArea(focus)
                        .description(description)
                        .build());
            }
        } else {
            timeline.add(CompanyDetailResponse.PrepWeekInfo.builder()
                    .weekNumber(1)
                    .focusArea("Core Structures & Operations")
                    .description("Solve 15 essential Array, Hashing, and Linked List challenges to strengthen basic traversal logic.")
                    .build());
            timeline.add(CompanyDetailResponse.PrepWeekInfo.builder()
                    .weekNumber(2)
                    .focusArea("Binary Trees & Recursive Mappings")
                    .description("Dive into Depth-First and Breadth-First tree traversals, solving 10 medium challenges.")
                    .build());
            timeline.add(CompanyDetailResponse.PrepWeekInfo.builder()
                    .weekNumber(3)
                    .focusArea("Advanced Dynamic Programming & Graphs")
                    .description("Tackle topological sorting, Dijkstra's paths, and multi-state dynamic programming equations.")
                    .build());
        }

        // 3. Map FAQs
        List<CompanyDetailResponse.FaqInfo> faqs = new ArrayList<>();
        if (company.getFaqs() != null && !company.getFaqs().isEmpty()) {
            for (Company.FaqInfo f : company.getFaqs()) {
                faqs.add(CompanyDetailResponse.FaqInfo.builder()
                        .question(f.getQuestion())
                        .answer(f.getAnswer())
                        .build());
            }
        } else {
            faqs.add(CompanyDetailResponse.FaqInfo.builder()
                    .question("What is the typical interview focus for " + company.getName() + "?")
                    .answer("The focus is primarily on core Data Structures & Algorithms, including Arrays, Strings, Searching, Sorting, and Dynamic Programming.")
                    .build());
            faqs.add(CompanyDetailResponse.FaqInfo.builder()
                    .question("How many coding questions are asked in the OA?")
                    .answer("Usually 2 questions of Easy to Medium difficulty, to be solved within 90 minutes.")
                    .build());
        }

        // 4. Map Experiences
        List<CompanyDetailResponse.InterviewExperienceInfo> experiences = new ArrayList<>();
        if (company.getInterviewExperiences() != null && !company.getInterviewExperiences().isEmpty()) {
            for (Company.InterviewExperienceInfo exp : company.getInterviewExperiences()) {
                experiences.add(CompanyDetailResponse.InterviewExperienceInfo.builder()
                        .title(exp.getTitle())
                        .rounds(exp.getRounds())
                        .questionsAsked(exp.getQuestionsAsked())
                        .difficulty(exp.getDifficulty())
                        .tips(exp.getTips())
                        .build());
            }
        } else {
            experiences.add(CompanyDetailResponse.InterviewExperienceInfo.builder()
                    .title("Software Engineer Candidate")
                    .rounds("Online Assessment + 2 Technical Rounds")
                    .questionsAsked(List.of("Two Sum", "Valid Parentheses"))
                    .difficulty("Medium")
                    .tips("Focus on dry running your code and explaining time/space complexities clearly.")
                    .build());
        }

        // 5. Fetch questions dynamically in real-time using case-insensitive tag match
        List<Question> companyQuestions = questionRepository.findAll().stream()
                .filter(q -> q.getCompanyTags() != null && 
                        q.getCompanyTags().toLowerCase().contains(company.getName().toLowerCase()))
                .collect(Collectors.toList());

        // Compute dynamic weightages in real-time from matching questions or use pre-configured ones
        Map<String, Integer> weightages = company.getTopicWeightages();
        if (weightages == null || weightages.isEmpty()) {
            weightages = new java.util.HashMap<>();
            if (!companyQuestions.isEmpty()) {
                Map<String, Long> topicCounts = companyQuestions.stream()
                    .collect(Collectors.groupingBy(q -> (q.getTopics() != null && !q.getTopics().isEmpty()) ? q.getTopics().get(0).getName() : "Arrays", Collectors.counting()));
                long maxCount = topicCounts.values().stream().max(java.util.Comparator.naturalOrder()).orElse(1L);
                for (Map.Entry<String, Long> entry : topicCounts.entrySet()) {
                    // scale so the most popular topic gets 95%, others relative to it
                    int percentage = (int) ((entry.getValue() * 95) / maxCount);
                    if (percentage < 30) percentage = 30; // give a nice visual baseline
                    weightages.put(entry.getKey(), percentage);
                }
            }
            if (weightages.isEmpty()) {
                weightages = Map.of(
                        "Arrays", 95,
                        "Strings", 90,
                        "Hashing", 85,
                        "Searching", 75,
                        "Dynamic Programming", 60
                );
            }
        }

        // 6. Map Roadmap
        List<CompanyDetailResponse.CompanyRoadmapWeek> compRoadmap = new ArrayList<>();
        if (company.getCompanyRoadmap() != null && !company.getCompanyRoadmap().isEmpty()) {
            for (Company.CompanyRoadmapWeek rw : company.getCompanyRoadmap()) {
                compRoadmap.add(CompanyDetailResponse.CompanyRoadmapWeek.builder()
                        .weekNumber(rw.getWeekNumber())
                        .topics(rw.getTopics())
                        .focus(rw.getFocus())
                        .build());
            }
        } else {
            compRoadmap.add(CompanyDetailResponse.CompanyRoadmapWeek.builder().weekNumber(1).topics("Arrays & Hashing").focus("Focus on linear traversals, prefix sums, and sliding window boundaries.").build());
            compRoadmap.add(CompanyDetailResponse.CompanyRoadmapWeek.builder().weekNumber(2).topics("Strings").focus("Solve anagrams, palindrome validations, and prefix manipulations.").build());
            compRoadmap.add(CompanyDetailResponse.CompanyRoadmapWeek.builder().weekNumber(3).topics("Searching & Sorting").focus("Master Binary Search boundary checks and efficient Quick/Merge sorting.").build());
            compRoadmap.add(CompanyDetailResponse.CompanyRoadmapWeek.builder().weekNumber(4).topics("Mock Assessment").focus("Complete high-frequency company-specific mock questionnaires.").build());
        }

        // 7. Curated Question Sheet mapping with user solved/bookmark/notes states
        List<CompanyDetailResponse.CompanyQuestionInfo> questionInfos = new ArrayList<>();
        
        List<UserQuestionAttempt> solvedAttempts = attemptRepository.findAllByUserIdAndStatus(userId, "SOLVED");
        Set<String> solvedSlugs = solvedAttempts.stream()
                .map(a -> a.getQuestion().getSlug())
                .collect(Collectors.toSet());
        
        List<UserBookmark> bookmarks = bookmarkRepository.findAllByUserId(userId);
        Set<String> bookmarkedSlugs = bookmarks.stream()
                .map(b -> b.getQuestion().getSlug())
                .collect(Collectors.toSet());
        
        List<UserNote> notesList = noteRepository.findAllByUserId(userId);
        Map<String, String> notesMap = notesList.stream()
                .collect(Collectors.toMap(n -> n.getQuestion().getSlug(), UserNote::getContent, (v1, v2) -> v1));

        for (Question q : companyQuestions) {
            String leetcode = "";
            String gfg = "";
            String hackerrank = "";
            String youtube = "";
            if (q.getExternalLinks() != null) {
                for (ExternalLink link : q.getExternalLinks()) {
                    if ("LEETCODE".equalsIgnoreCase(link.getPlatformName())) leetcode = link.getUrl();
                    else if ("GEEKSFORGEEKS".equalsIgnoreCase(link.getPlatformName())) gfg = link.getUrl();
                    else if ("HACKERRANK".equalsIgnoreCase(link.getPlatformName())) hackerrank = link.getUrl();
                    else if ("YOUTUBE".equalsIgnoreCase(link.getPlatformName())) youtube = link.getUrl();
                }
            }

            String topicName = "Arrays";
            if (q.getTopics() != null && !q.getTopics().isEmpty()) {
                topicName = q.getTopics().get(0).getName();
            }

            questionInfos.add(CompanyDetailResponse.CompanyQuestionInfo.builder()
                    .id(q.getId())
                    .title(q.getTitle())
                    .slug(q.getSlug())
                    .difficulty(q.getDifficulty().name())
                    .topic(topicName)
                    .pattern("Classic Pattern")
                    .frequency("HIGH")
                    .leetcodeUrl(leetcode)
                    .geeksforgeeksUrl(gfg)
                    .hackerrankUrl(hackerrank)
                    .youtubeUrl(youtube)
                    .solved(solvedSlugs.contains(q.getSlug()))
                    .bookmarked(bookmarkedSlugs.contains(q.getSlug()))
                    .notes(notesMap.getOrDefault(q.getSlug(), ""))
                    .build());
        }

        // Calculate dynamic readiness score
        int solvedCount = 0;
        int totalCompanyQuestions = questionInfos.size();
        for (CompanyDetailResponse.CompanyQuestionInfo cq : questionInfos) {
            if (cq.isSolved()) {
                solvedCount++;
            }
        }
        int calculatedReadiness = totalCompanyQuestions > 0 ? (solvedCount * 100) / totalCompanyQuestions : 0;
        
        // Save computed readiness back to user_company_readiness table
        UserCompanyReadiness ucr = readinessRepository.findByUserIdAndCompanyId(userId, company.getId())
                .orElseGet(() -> {
                    com.dsaverse.auth.entity.User u = new com.dsaverse.auth.entity.User();
                    u.setId(userId);
                    return UserCompanyReadiness.builder().user(u).company(company).build();
                });
        ucr.setReadinessPercentage(calculatedReadiness);
        readinessRepository.save(ucr);

        return CompanyDetailResponse.builder()
                .id(company.getId())
                .name(company.getName())
                .slug(company.getSlug())
                .logo(company.getLogo())
                .description(company.getDescription())
                .tier(company.getTier())
                .readinessPercentage(calculatedReadiness)
                .interviewRounds(rounds)
                .preparationTimeline(timeline)
                .faqs(faqs)
                .interviewExperiences(experiences)
                .topicWeightages(weightages)
                .companyRoadmap(compRoadmap)
                .questions(questionInfos)
                .build();
    }
}
