package com.dsaverse.roadmap.repository;

import com.dsaverse.roadmap.entity.RoadmapNode;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RoadmapNodeRepository extends JpaRepository<RoadmapNode, Long> {

    @Query("SELECT rn FROM RoadmapNode rn LEFT JOIN FETCH rn.dependencies WHERE rn.roadmap.id = :roadmapId ORDER BY rn.nodeOrder ASC")
    List<RoadmapNode> findByRoadmapIdWithDependencies(@Param("roadmapId") Long roadmapId);
}
