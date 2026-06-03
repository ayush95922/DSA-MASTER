package com.dsaverse.revision.repository;

import com.dsaverse.revision.entity.RevisionSchedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface RevisionScheduleRepository extends JpaRepository<RevisionSchedule, Long> {

    @Query("SELECT rs FROM RevisionSchedule rs JOIN FETCH rs.question WHERE rs.user.id = :userId AND rs.nextReviewDate <= :now")
    List<RevisionSchedule> findAllDueForUser(@Param("userId") Long userId, @Param("now") LocalDateTime now);

    Optional<RevisionSchedule> findByUserIdAndQuestionId(Long userId, Long questionId);
}
