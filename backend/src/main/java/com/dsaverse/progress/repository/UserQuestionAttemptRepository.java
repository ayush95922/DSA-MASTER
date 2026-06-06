package com.dsaverse.progress.repository;

import com.dsaverse.progress.entity.UserQuestionAttempt;
import com.dsaverse.question.enums.Difficulty;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserQuestionAttemptRepository extends JpaRepository<UserQuestionAttempt, Long> {

    @Query("SELECT COUNT(DISTINCT uqa.question.id) FROM UserQuestionAttempt uqa WHERE uqa.user.id = :userId AND uqa.status = 'SOLVED'")
    long countSolvedQuestionsByUserId(@Param("userId") Long userId);

    @Query("SELECT COUNT(DISTINCT uqa.question.id) FROM UserQuestionAttempt uqa WHERE uqa.user.id = :userId AND uqa.question.difficulty = :difficulty AND uqa.status = 'SOLVED'")
    long countSolvedQuestionsByUserIdAndDifficulty(
            @Param("userId") Long userId,
            @Param("difficulty") Difficulty difficulty
    );

    @Query("SELECT uqa FROM UserQuestionAttempt uqa WHERE uqa.user.id = :userId ORDER BY uqa.attemptedAt DESC")
    List<UserQuestionAttempt> findRecentAttemptsByUserId(@Param("userId") Long userId);

    List<UserQuestionAttempt> findAllByUserIdAndStatus(Long userId, String status);
}
