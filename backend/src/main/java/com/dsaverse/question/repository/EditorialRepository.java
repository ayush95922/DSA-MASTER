package com.dsaverse.question.repository;

import com.dsaverse.question.entity.Editorial;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EditorialRepository extends JpaRepository<Editorial, Long> {
    
    @Query("SELECT e FROM Editorial e LEFT JOIN FETCH e.approaches a WHERE e.question.id = :questionId ORDER BY a.displayOrder ASC")
    Optional<Editorial> findByQuestionIdWithApproaches(@Param("questionId") Long questionId);
}
