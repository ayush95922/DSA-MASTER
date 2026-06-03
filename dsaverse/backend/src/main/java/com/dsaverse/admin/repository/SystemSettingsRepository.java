package com.dsaverse.admin.repository;

import com.dsaverse.admin.entity.SystemSettings;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SystemSettingsRepository extends JpaRepository<SystemSettings, Integer> {
    Optional<SystemSettings> findBySettingKey(String key);
}
