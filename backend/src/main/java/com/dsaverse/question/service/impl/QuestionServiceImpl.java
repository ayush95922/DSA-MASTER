package com.dsaverse.question.service.impl;

import com.dsaverse.common.exception.ResourceNotFoundException;
import com.dsaverse.progress.entity.UserQuestionAttempt;
import com.dsaverse.progress.repository.UserQuestionAttemptRepository;
import com.dsaverse.question.dto.response.EditorialResponse;
import com.dsaverse.question.dto.response.QuestionDetailResponse;
import com.dsaverse.question.dto.response.QuestionListResponse;
import com.dsaverse.question.entity.Editorial;
import com.dsaverse.question.entity.Hint;
import com.dsaverse.question.entity.Question;
import com.dsaverse.question.repository.EditorialRepository;
import com.dsaverse.question.repository.HintRepository;
import com.dsaverse.question.repository.QuestionRepository;
import com.dsaverse.question.service.QuestionService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class QuestionServiceImpl implements QuestionService {

    private final QuestionRepository questionRepository;
    private final HintRepository hintRepository;
    private final EditorialRepository editorialRepository;
    private final UserQuestionAttemptRepository attemptRepository;

    @Override
    public List<QuestionListResponse> getAllQuestions(Long userId) {
        List<Question> questions = questionRepository.findAll();
        List<UserQuestionAttempt> attempts = attemptRepository.findRecentAttemptsByUserId(userId);

        // Group attempts by question ID to find best status (SOLVED > ATTEMPTED/FAILED)
        Map<Long, String> questionStatusMap = attempts.stream()
                .collect(Collectors.toMap(
                        att -> att.getQuestion().getId(),
                        UserQuestionAttempt::getStatus,
                        (existing, newStatus) -> "SOLVED".equals(existing) ? "SOLVED" : newStatus
                ));

        return questions.stream().map(q -> {
            String status = questionStatusMap.getOrDefault(q.getId(), "UNATTEMPTED");
            if ("FAILED".equals(status)) {
                status = "ATTEMPTED"; // display as attempted on frontend
            }

            return QuestionListResponse.builder()
                    .id(q.getId())
                    .title(q.getTitle())
                    .slug(q.getSlug())
                    .difficulty(q.getDifficulty())
                    .premium(q.isPremium())
                    .points(q.getPoints())
                    .status(status)
                    .build();
        }).collect(Collectors.toList());
    }

    @Override
    public QuestionDetailResponse getQuestionBySlug(String slug, Long userId) {
        Question question = questionRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Question", "slug", slug));

        List<Hint> hints = hintRepository.findByQuestionIdOrderByHintNumberAsc(question.getId());

        List<UserQuestionAttempt> attempts = attemptRepository.findRecentAttemptsByUserId(userId);
        
        String status = attempts.stream()
                .filter(att -> att.getQuestion().getId().equals(question.getId()))
                .map(UserQuestionAttempt::getStatus)
                .findFirst()
                .orElse("UNATTEMPTED");
        
        if ("FAILED".equals(status)) {
            status = "ATTEMPTED";
        }

        List<QuestionDetailResponse.HintInfo> hintInfos = hints.stream()
                .map(h -> QuestionDetailResponse.HintInfo.builder()
                        .number(h.getHintNumber())
                        .content(h.getContent())
                        .build())
                .collect(Collectors.toList());

        return QuestionDetailResponse.builder()
                .id(question.getId())
                .title(question.getTitle())
                .slug(question.getSlug())
                .difficulty(question.getDifficulty())
                .description(question.getDescription())
                .inputFormat(question.getInputFormat())
                .outputFormat(question.getOutputFormat())
                .constraints(question.getConstraints())
                .premium(question.isPremium())
                .points(question.getPoints())
                .status(status)
                .hints(hintInfos)
                .build();
    }

    @Override
    public EditorialResponse getEditorialByQuestionSlug(String slug) {
        Question question = questionRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Question", "slug", slug));

        Editorial editorial = editorialRepository.findByQuestionIdWithApproaches(question.getId())
                .orElse(null);

        if (editorial == null) {
            return null; // No editorial solution added yet
        }

        List<EditorialResponse.ApproachInfo> approachInfos = editorial.getApproaches().stream()
                .map(app -> EditorialResponse.ApproachInfo.builder()
                        .title(app.getTitle())
                        .type(app.getType())
                        .description(app.getDescription())
                        .timeComplexity(app.getComplexityTime())
                        .spaceComplexity(app.getComplexitySpace())
                        .javaCode(app.getJavaCode())
                        .pythonCode(app.getPythonCode())
                        .cppCode(app.getCppCode())
                        .build())
                .collect(Collectors.toList());

        return EditorialResponse.builder()
                .overview(editorial.getSolutionOverview())
                .approaches(approachInfos)
                .build();
    }
}
