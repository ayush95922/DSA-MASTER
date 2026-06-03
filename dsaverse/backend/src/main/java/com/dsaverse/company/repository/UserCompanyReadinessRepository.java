package com.dsaverse.company.repository;

import com.dsaverse.company.entity.UserCompanyReadiness;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserCompanyReadinessRepository extends JpaRepository<UserCompanyReadiness, Long> {
    Optional<UserCompanyReadiness> findByUserIdAndCompanyId(Long userId, Long companyId);
    List<UserCompanyReadiness> findAllByUserId(Long userId);
}
