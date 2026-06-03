package com.dsaverse.revision.service.impl;

import com.dsaverse.auth.entity.User;
import com.dsaverse.auth.repository.UserRepository;
import com.dsaverse.common.exception.ResourceNotFoundException;
import com.dsaverse.question.entity.Question;
import com.dsaverse.question.repository.QuestionRepository;
import com.dsaverse.revision.dto.response.FlashcardDeckResponse;
import com.dsaverse.revision.dto.response.FlashcardResponse;
import com.dsaverse.revision.dto.response.RevisionSetResponse;
import com.dsaverse.revision.entity.*;
import com.dsaverse.revision.repository.*;
import com.dsaverse.revision.service.RevisionService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class RevisionServiceImpl implements RevisionService {

    private final UserRepository userRepository;
    private final QuestionRepository questionRepository;
    private final RevisionScheduleRepository scheduleRepository;
    private final FlashcardDeckRepository deckRepository;
    private final FlashcardRepository flashcardRepository;
    private final UserFlashcardProgressRepository flashcardProgressRepository;
    private final RevisionSessionRepository sessionRepository;

    @Override
    @Transactional(readOnly = true)
    public RevisionSetResponse getDueReviews(Long userId) {
        LocalDateTime now = LocalDateTime.now();
        List<RevisionSchedule> dueQuestions = scheduleRepository.findAllDueForUser(userId, now);
        List<UserFlashcardProgress> dueCards = flashcardProgressRepository.findAllDueForUser(userId, now);

        List<RevisionSetResponse.DueQuestionInfo> questionsInfo = dueQuestions.stream()
                .map(q -> RevisionSetResponse.DueQuestionInfo.builder()
                        .id(q.getQuestion().getId())
                        .title(q.getQuestion().getTitle())
                        .slug(q.getQuestion().getSlug())
                        .difficulty(q.getQuestion().getDifficulty().name())
                        .repetitions(q.getRepetitions())
                        .intervalDays(q.getIntervalDays())
                        .build())
                .collect(Collectors.toList());

        List<RevisionSetResponse.DueCardInfo> cardsInfo = dueCards.stream()
                .map(c -> RevisionSetResponse.DueCardInfo.builder()
                        .id(c.getFlashcard().getId())
                        .deckId(c.getFlashcard().getDeck().getId())
                        .front(c.getFlashcard().getFront())
                        .back(c.getFlashcard().getBack())
                        .repetitions(c.getRepetitions())
                        .intervalDays(c.getIntervalDays())
                        .build())
                .collect(Collectors.toList());

        return RevisionSetResponse.builder()
                .dueQuestionsCount(questionsInfo.size())
                .dueCardsCount(cardsInfo.size())
                .dueQuestions(questionsInfo)
                .dueCards(cardsInfo)
                .build();
    }

    @Override
    public void scheduleQuestionReview(Long userId, Long questionId) {
        if (scheduleRepository.findByUserIdAndQuestionId(userId, questionId).isPresent()) {
            return;
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
        Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> new ResourceNotFoundException("Question", "id", questionId));

        RevisionSchedule schedule = RevisionSchedule.builder()
                .user(user)
                .question(question)
                .repetitions(0)
                .intervalDays(1)
                .easeFactor(2.5)
                .nextReviewDate(LocalDateTime.now())
                .build();

        scheduleRepository.save(schedule);
    }

    @Override
    public void submitQuestionReview(Long userId, Long questionId, int rating) {
        RevisionSchedule schedule = scheduleRepository.findByUserIdAndQuestionId(userId, questionId)
                .orElseGet(() -> {
                    User user = userRepository.findById(userId)
                            .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
                    Question question = questionRepository.findById(questionId)
                            .orElseThrow(() -> new ResourceNotFoundException("Question", "id", questionId));
                    return RevisionSchedule.builder()
                            .user(user)
                            .question(question)
                            .repetitions(0)
                            .intervalDays(1)
                            .easeFactor(2.5)
                            .nextReviewDate(LocalDateTime.now())
                            .build();
                });

        double easeFactor = schedule.getEaseFactor();
        int repetitions = schedule.getRepetitions();
        int intervalDays = schedule.getIntervalDays();

        // SM-2 Spaced Repetition Logic
        if (rating >= 3) {
            if (repetitions == 0) {
                intervalDays = 1;
            } else if (repetitions == 1) {
                intervalDays = 6;
            } else {
                intervalDays = (int) Math.round(intervalDays * easeFactor);
            }
            repetitions++;
            easeFactor = easeFactor + (0.1 - (5 - rating) * (0.08 + (5 - rating) * 0.02));
        } else {
            repetitions = 0;
            intervalDays = 1;
            easeFactor = Math.max(1.3, easeFactor - 0.2);
        }

        schedule.setRepetitions(repetitions);
        schedule.setIntervalDays(intervalDays);
        schedule.setEaseFactor(easeFactor);
        schedule.setNextReviewDate(LocalDateTime.now().plusDays(intervalDays));

        scheduleRepository.save(schedule);
    }

    @Override
    public List<FlashcardDeckResponse> getFlashcardDecks(Long userId) {
        List<FlashcardDeck> decks = deckRepository.findAllSystemAndUserDecks(userId);

        if (decks.isEmpty()) {
            // Seed a high-fidelity system deck to look gorgeous out of the box
            FlashcardDeck systemDeck = FlashcardDeck.builder()
                    .title("Algorithm Complexity (Big-O)")
                    .description("Core asymptotic runtimes and spatial complexity cheat cards for interviews.")
                    .build();
            systemDeck = deckRepository.save(systemDeck);

            // Add standard cards to the seeded deck
            flashcardRepository.save(Flashcard.builder()
                    .deck(systemDeck)
                    .front("What is the average and worst-case time complexity of Quick Sort?")
                    .back("Average: O(N log N) when pivots split arrays evenly.\nWorst: O(N²) if elements are sorted and index-0 is picked as pivot.")
                    .build());
            flashcardRepository.save(Flashcard.builder()
                    .deck(systemDeck)
                    .front("Explain the Space Complexity of a Recursive Depth First Search (DFS) on a binary tree.")
                    .back("O(H) where H is the height of the tree. This space is utilized by the call stack recursion frames.")
                    .build());
            flashcardRepository.save(Flashcard.builder()
                    .deck(systemDeck)
                    .front("What is the time complexity of searching a value in a Balanced Binary Search Tree (BST)?")
                    .back("O(log N) as each comparison eliminates half the remaining search space.")
                    .build());

            decks = new ArrayList<>();
            decks.add(systemDeck);
        }

        return decks.stream()
                .map(d -> {
                    List<Flashcard> cards = flashcardRepository.findByDeckId(d.getId());
                    return FlashcardDeckResponse.builder()
                            .id(d.getId())
                            .title(d.getTitle())
                            .description(d.getDescription())
                            .cardCount(cards.size())
                            .build();
                })
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<FlashcardResponse> getFlashcardsByDeck(Long deckId) {
        List<Flashcard> cards = flashcardRepository.findByDeckId(deckId);
        return cards.stream()
                .map(c -> FlashcardResponse.builder()
                        .id(c.getId())
                        .deckId(c.getDeck().getId())
                        .front(c.getFront())
                        .back(c.getBack())
                        .build())
                .collect(Collectors.toList());
    }

    @Override
    public void submitFlashcardReview(Long userId, Long flashcardId, int rating) {
        UserFlashcardProgress progress = flashcardProgressRepository.findByUserIdAndFlashcardId(userId, flashcardId)
                .orElseGet(() -> {
                    User user = userRepository.findById(userId)
                            .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
                    Flashcard flashcard = flashcardRepository.findById(flashcardId)
                            .orElseThrow(() -> new ResourceNotFoundException("Flashcard", "id", flashcardId));
                    return UserFlashcardProgress.builder()
                            .user(user)
                            .flashcard(flashcard)
                            .repetitions(0)
                            .intervalDays(1)
                            .easeFactor(2.5)
                            .nextReviewDate(LocalDateTime.now())
                            .build();
                });

        double easeFactor = progress.getEaseFactor();
        int repetitions = progress.getRepetitions();
        int intervalDays = progress.getIntervalDays();

        // SM-2 Spaced Repetition Logic
        if (rating >= 3) {
            if (repetitions == 0) {
                intervalDays = 1;
            } else if (repetitions == 1) {
                intervalDays = 6;
            } else {
                intervalDays = (int) Math.round(intervalDays * easeFactor);
            }
            repetitions++;
            easeFactor = easeFactor + (0.1 - (5 - rating) * (0.08 + (5 - rating) * 0.02));
        } else {
            repetitions = 0;
            intervalDays = 1;
            easeFactor = Math.max(1.3, easeFactor - 0.2);
        }

        progress.setRepetitions(repetitions);
        progress.setIntervalDays(intervalDays);
        progress.setEaseFactor(easeFactor);
        progress.setNextReviewDate(LocalDateTime.now().plusDays(intervalDays));

        flashcardProgressRepository.save(progress);
    }

    @Override
    public void triggerSessionSync(Long userId, int cardsReviewed, int questionsReviewed) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        RevisionSession session = RevisionSession.builder()
                .user(user)
                .startedAt(LocalDateTime.now().minusMinutes(20))
                .completedAt(LocalDateTime.now())
                .cardsReviewed(cardsReviewed)
                .questionsReviewed(questionsReviewed)
                .build();

        sessionRepository.save(session);
    }
}
