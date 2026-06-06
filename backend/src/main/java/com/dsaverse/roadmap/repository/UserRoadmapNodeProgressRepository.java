package com.dsaverse.roadmap.repository;

import com.dsaverse.roadmap.entity.UserRoadmapNodeProgress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRoadmapNodeProgressRepository extends JpaRepository<UserRoadmapNodeProgress, Long> {
    Optional<UserRoadmapNodeProgress> findByUserIdAndNodeId(Long userId, Long nodeId);

    @Query("SELECT urnp FROM UserRoadmapNodeProgress urnp WHERE urnp.user.id = :userId AND urnp.node.roadmap.id = :roadmapId")
    List<UserRoadmapNodeProgress> findAllProgressByUserIdAndRoadmapId(
            @Param("userId") Long userId,
            @Param("roadmapId") Long roadmapId
    );
}
