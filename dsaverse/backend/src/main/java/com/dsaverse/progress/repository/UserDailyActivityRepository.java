package com.dsaverse.progress.repository;

import com.dsaverse.progress.entity.UserDailyActivity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserDailyActivityRepository extends JpaRepository<UserDailyActivity, Long> {
    
    Optional<UserDailyActivity> findByUserIdAndActivityDate(Long userId, LocalDate date);

    @Query("SELECT uda FROM UserDailyActivity uda WHERE uda.user.id = :userId AND uda.activityDate >= :startDate ORDER BY uda.activityDate ASC")
    List<UserDailyActivity> findAllRecentActivity(
            @Param("userId") Long userId,
            @Param("startDate") LocalDate startDate
    );
}
