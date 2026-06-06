package com.dsaverse.roadmap.repository;

import com.dsaverse.roadmap.entity.UserRoadmapEnrollment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRoadmapEnrollmentRepository extends JpaRepository<UserRoadmapEnrollment, Long> {
    Optional<UserRoadmapEnrollment> findByUserIdAndRoadmapId(Long userId, Long roadmapId);
    List<UserRoadmapEnrollment> findAllByUserId(Long userId);
}
