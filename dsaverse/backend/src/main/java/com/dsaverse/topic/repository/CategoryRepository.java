package com.dsaverse.topic.repository;

import com.dsaverse.topic.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    Optional<Category> findBySlug(String slug);

    @Query("SELECT DISTINCT c FROM Category c LEFT JOIN FETCH c.topics t ORDER BY c.displayOrder ASC, t.displayOrder ASC")
    List<Category> findAllOrderByDisplayOrderWithTopics();
}
