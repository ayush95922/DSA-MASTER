package com.dsaverse.roadmap.service.impl;

import com.dsaverse.auth.entity.User;
import com.dsaverse.auth.repository.UserRepository;
import com.dsaverse.common.exception.ResourceNotFoundException;
import com.dsaverse.roadmap.dto.response.RoadmapDetailResponse;
import com.dsaverse.roadmap.dto.response.RoadmapResponse;
import com.dsaverse.roadmap.entity.Roadmap;
import com.dsaverse.roadmap.entity.RoadmapNode;
import com.dsaverse.roadmap.entity.UserRoadmapEnrollment;
import com.dsaverse.roadmap.entity.UserRoadmapNodeProgress;
import com.dsaverse.roadmap.repository.RoadmapNodeRepository;
import com.dsaverse.roadmap.repository.RoadmapRepository;
import com.dsaverse.roadmap.repository.UserRoadmapEnrollmentRepository;
import com.dsaverse.roadmap.repository.UserRoadmapNodeProgressRepository;
import com.dsaverse.roadmap.service.RoadmapService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class RoadmapServiceImpl implements RoadmapService {

    private final UserRepository userRepository;
    private final RoadmapRepository roadmapRepository;
    private final RoadmapNodeRepository roadmapNodeRepository;
    private final UserRoadmapEnrollmentRepository enrollmentRepository;
    private final UserRoadmapNodeProgressRepository progressRepository;

    @Override
    public List<RoadmapResponse> getAllRoadmaps(Long userId) {
        List<Roadmap> roadmaps = roadmapRepository.findAll();
        List<UserRoadmapEnrollment> enrollments = enrollmentRepository.findAllByUserId(userId);

        Map<Long, UserRoadmapEnrollment> enrollmentMap = enrollments.stream()
                .collect(Collectors.toMap(e -> e.getRoadmap().getId(), e -> e));

        return roadmaps.stream().map(roadmap -> {
            UserRoadmapEnrollment enrollment = enrollmentMap.get(roadmap.getId());
            boolean enrolled = enrollment != null;
            String status = enrolled ? enrollment.getStatus() : null;

            int totalNodes = roadmap.getNodes().size();
            int completedNodes = 0;

            if (enrolled) {
                List<UserRoadmapNodeProgress> progressList = progressRepository
                        .findAllProgressByUserIdAndRoadmapId(userId, roadmap.getId());
                completedNodes = (int) progressList.stream()
                        .filter(UserRoadmapNodeProgress::isCompleted)
                        .count();
            }

            int percent = totalNodes > 0 ? (completedNodes * 100) / totalNodes : 0;

            return RoadmapResponse.builder()
                    .id(roadmap.getId())
                    .title(roadmap.getTitle())
                    .slug(roadmap.getSlug())
                    .description(roadmap.getDescription())
                    .type(roadmap.getType())
                    .enrolled(enrolled)
                    .enrollmentStatus(status)
                    .progressPercentage(percent)
                    .totalNodes(totalNodes)
                    .completedNodes(completedNodes)
                    .difficulty(roadmap.getDifficulty())
                    .estimatedDuration(roadmap.getEstimatedDuration())
                    .prerequisites(roadmap.getPrerequisites())
                    .learningOutcomes(roadmap.getLearningOutcomes())
                    .completionCriteria(roadmap.getCompletionCriteria())
                    .build();
        }).collect(Collectors.toList());
    }

    @Override
    public RoadmapDetailResponse getRoadmapBySlug(String slug, Long userId) {
        Roadmap roadmap = roadmapRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Roadmap", "slug", slug));

        List<RoadmapNode> nodes = roadmapNodeRepository.findByRoadmapIdWithDependencies(roadmap.getId());
        Optional<UserRoadmapEnrollment> enrollmentOpt = enrollmentRepository.findByUserIdAndRoadmapId(userId, roadmap.getId());

        boolean enrolled = enrollmentOpt.isPresent();
        String enrollmentStatus = enrolled ? enrollmentOpt.get().getStatus() : null;

        List<UserRoadmapNodeProgress> progressList = progressRepository
                .findAllProgressByUserIdAndRoadmapId(userId, roadmap.getId());
        
        Set<Long> completedNodeIds = progressList.stream()
                .filter(UserRoadmapNodeProgress::isCompleted)
                .map(p -> p.getNode().getId())
                .collect(Collectors.toSet());

        List<RoadmapDetailResponse.NodeInfo> nodeInfos = nodes.stream().map(node -> {
            List<Long> dependencyIds = node.getDependencies().stream()
                    .map(RoadmapNode::getId)
                    .collect(Collectors.toList());

            return RoadmapDetailResponse.NodeInfo.builder()
                    .id(node.getId())
                    .title(node.getTitle())
                    .description(node.getDescription())
                    .topicSlug(node.getTopicSlug())
                    .xCoordinate(node.getXCoordinate())
                    .yCoordinate(node.getYCoordinate())
                    .nodeOrder(node.getNodeOrder())
                    .completed(completedNodeIds.contains(node.getId()))
                    .dependencyIds(dependencyIds)
                    .theoryPage(node.getTheoryPage())
                    .revisionNotes(node.getRevisionNotes())
                    .cheatSheet(node.getCheatSheet())
                    .flashcards(node.getFlashcards() != null ? node.getFlashcards().stream().map(f -> 
                        RoadmapDetailResponse.FlashcardInfo.builder().front(f.getFront()).back(f.getBack()).build()
                    ).collect(Collectors.toList()) : null)
                    .youtubeResources(node.getYoutubeResources() != null ? node.getYoutubeResources().stream().map(r ->
                        RoadmapDetailResponse.ResourceLink.builder().title(r.getTitle()).url(r.getUrl()).build()
                    ).collect(Collectors.toList()) : null)
                    .leetcodeProblems(node.getLeetcodeProblems() != null ? node.getLeetcodeProblems().stream().map(r ->
                        RoadmapDetailResponse.ResourceLink.builder().title(r.getTitle()).url(r.getUrl()).build()
                    ).collect(Collectors.toList()) : null)
                    .geeksforgeeksLinks(node.getGeeksforgeeksLinks() != null ? node.getGeeksforgeeksLinks().stream().map(r ->
                        RoadmapDetailResponse.ResourceLink.builder().title(r.getTitle()).url(r.getUrl()).build()
                    ).collect(Collectors.toList()) : null)
                    .practiceQuestions(node.getPracticeQuestions() != null ? node.getPracticeQuestions().stream().map(q ->
                        RoadmapDetailResponse.PracticeQuestionInfo.builder()
                                .title(q.getTitle())
                                .slug(q.getSlug())
                                .difficulty(q.getDifficulty())
                                .topic(q.getTopic())
                                .leetcodeUrl(q.getLeetcodeUrl())
                                .gfgUrl(q.getGfgUrl())
                                .hackerrankUrl(q.getHackerrankUrl())
                                .youtubeUrl(q.getYoutubeUrl())
                                .build()
                    ).collect(Collectors.toList()) : null)
                    .build();
        }).collect(Collectors.toList());

        int totalNodes = nodes.size();
        int completedNodes = completedNodeIds.size();
        int progressPercentage = totalNodes > 0 ? (completedNodes * 100) / totalNodes : 0;

        return RoadmapDetailResponse.builder()
                .id(roadmap.getId())
                .title(roadmap.getTitle())
                .slug(roadmap.getSlug())
                .description(roadmap.getDescription())
                .type(roadmap.getType())
                .enrolled(enrolled)
                .enrollmentStatus(enrollmentStatus)
                .progressPercentage(progressPercentage)
                .difficulty(roadmap.getDifficulty())
                .estimatedDuration(roadmap.getEstimatedDuration())
                .prerequisites(roadmap.getPrerequisites())
                .learningOutcomes(roadmap.getLearningOutcomes())
                .completionCriteria(roadmap.getCompletionCriteria())
                .nodes(nodeInfos)
                .build();
    }

    @Override
    @Transactional
    public void enrollInRoadmap(String slug, Long userId) {
        Roadmap roadmap = roadmapRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Roadmap", "slug", slug));

        Optional<UserRoadmapEnrollment> existing = enrollmentRepository.findByUserIdAndRoadmapId(userId, roadmap.getId());
        if (existing.isPresent()) {
            return; // Already enrolled
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        UserRoadmapEnrollment enrollment = UserRoadmapEnrollment.builder()
                .user(user)
                .roadmap(roadmap)
                .status("ENROLLED")
                .build();

        enrollmentRepository.save(enrollment);

        // Pre-create progress records for each node as false
        List<RoadmapNode> nodes = roadmap.getNodes();
        List<UserRoadmapNodeProgress> progressRecords = nodes.stream().map(node ->
                UserRoadmapNodeProgress.builder()
                        .user(user)
                        .node(node)
                        .completed(false)
                        .build()
        ).collect(Collectors.toList());

        progressRepository.saveAll(progressRecords);
    }

    @Override
    @Transactional
    public void completeRoadmapNode(Long nodeId, Long userId) {
        RoadmapNode node = roadmapNodeRepository.findById(nodeId)
                .orElseThrow(() -> new ResourceNotFoundException("RoadmapNode", "id", nodeId));

        UserRoadmapNodeProgress progress = progressRepository.findByUserIdAndNodeId(userId, nodeId)
                .orElseGet(() -> {
                    User user = userRepository.findById(userId)
                            .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
                    return UserRoadmapNodeProgress.builder()
                            .user(user)
                            .node(node)
                            .build();
                });

        if (progress.isCompleted()) {
            return; // Already completed
        }

        progress.setCompleted(true);
        progress.setCompletedAt(Instant.now());
        progressRepository.save(progress);

        // Check if overall roadmap enrollment can be updated to completed
        Long roadmapId = node.getRoadmap().getId();
        Optional<UserRoadmapEnrollment> enrollmentOpt = enrollmentRepository.findByUserIdAndRoadmapId(userId, roadmapId);
        
        if (enrollmentOpt.isPresent()) {
            UserRoadmapEnrollment enrollment = enrollmentOpt.get();
            enrollment.setStatus("IN_PROGRESS");

            // Count total and completed
            List<RoadmapNode> roadmapNodes = node.getRoadmap().getNodes();
            List<UserRoadmapNodeProgress> progressList = progressRepository
                    .findAllProgressByUserIdAndRoadmapId(userId, roadmapId);

            long completedCount = progressList.stream()
                    .filter(UserRoadmapNodeProgress::isCompleted)
                    .count();

            if (completedCount == roadmapNodes.size()) {
                enrollment.setStatus("COMPLETED");
                enrollment.setCompletedAt(Instant.now());
            }

            enrollmentRepository.save(enrollment);
        }
    }
}
