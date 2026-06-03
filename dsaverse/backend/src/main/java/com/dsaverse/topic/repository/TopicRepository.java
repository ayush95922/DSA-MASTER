package com.dsaverse.topic.repository;

import com.dsaverse.topic.entity.Topic;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TopicRepository extends JpaRepository<Topic, Long> {
    
    @Query("SELECT t FROM Topic t LEFT JOIN FETCH t.theoryContent tc LEFT JOIN FETCH tc.sections s WHERE t.slug = :slug ORDER BY s.sectionOrder ASC")
    Optional<Topic> findBySlugWithTheoryAndSections(@Param("slug") String slug);

    Optional<Topic> findBySlug(String slug);
}
