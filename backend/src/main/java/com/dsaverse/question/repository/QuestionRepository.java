package com.dsaverse.question.repository;

import com.dsaverse.question.entity.Question;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface QuestionRepository extends JpaRepository<Question, Long> {
    Optional<Question> findBySlug(String slug);
    List<Question> findBySlugIn(List<String> slugs);

    @Query("SELECT q FROM Question q ORDER BY FUNCTION('RANDOM')")
    List<Question> findRandomRecommendations(Pageable pageable);
}
