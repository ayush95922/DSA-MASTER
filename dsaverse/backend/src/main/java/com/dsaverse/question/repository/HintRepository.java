package com.dsaverse.question.repository;

import com.dsaverse.question.entity.Hint;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HintRepository extends JpaRepository<Hint, Long> {
    List<Hint> findByQuestionIdOrderByHintNumberAsc(Long questionId);
}
