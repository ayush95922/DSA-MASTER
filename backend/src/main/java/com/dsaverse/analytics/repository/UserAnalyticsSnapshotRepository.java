package com.dsaverse.analytics.repository;

import com.dsaverse.analytics.entity.UserAnalyticsSnapshot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface UserAnalyticsSnapshotRepository extends JpaRepository<UserAnalyticsSnapshot, Long> {

    @Query("SELECT uas FROM UserAnalyticsSnapshot uas WHERE uas.user.id = :userId AND uas.snapshotDate >= :startDate ORDER BY uas.snapshotDate ASC")
    List<UserAnalyticsSnapshot> findAllRecentSnapshots(
            @Param("userId") Long userId,
            @Param("startDate") LocalDate startDate
    );
}
