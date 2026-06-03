package com.dsaverse.progress.repository;

import com.dsaverse.progress.entity.UserBookmark;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserBookmarkRepository extends JpaRepository<UserBookmark, Long> {
    List<UserBookmark> findAllByUserId(Long userId);
    Optional<UserBookmark> findByUserIdAndQuestionId(Long userId, Long questionId);
    boolean existsByUserIdAndQuestionId(Long userId, Long questionId);
}
