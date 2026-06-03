package com.dsaverse.admin.repository;

import com.dsaverse.admin.entity.ContentImport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ContentImportRepository extends JpaRepository<ContentImport, Long> {
    List<ContentImport> findAllByOrderByCreatedAtDesc();
}
