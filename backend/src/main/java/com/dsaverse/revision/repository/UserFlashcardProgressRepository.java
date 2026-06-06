package com.dsaverse.revision.repository;

import com.dsaverse.revision.entity.UserFlashcardProgress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserFlashcardProgressRepository extends JpaRepository<UserFlashcardProgress, Long> {

    @Query("SELECT ufp FROM UserFlashcardProgress ufp JOIN FETCH ufp.flashcard WHERE ufp.user.id = :userId AND ufp.nextReviewDate <= :now")
    List<UserFlashcardProgress> findAllDueForUser(@Param("userId") Long userId, @Param("now") LocalDateTime now);

    Optional<UserFlashcardProgress> findByUserIdAndFlashcardId(Long userId, Long flashcardId);
}
