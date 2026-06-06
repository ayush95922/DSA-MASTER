package com.dsaverse.progress.repository;

import com.dsaverse.progress.entity.UserNote;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserNoteRepository extends JpaRepository<UserNote, Long> {
    List<UserNote> findAllByUserId(Long userId);
    Optional<UserNote> findByUserIdAndQuestionId(Long userId, Long questionId);
}
