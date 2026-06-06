package com.dsaverse.revision.repository;

import com.dsaverse.revision.entity.FlashcardDeck;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FlashcardDeckRepository extends JpaRepository<FlashcardDeck, Long> {

    @Query("SELECT fd FROM FlashcardDeck fd WHERE fd.user.id IS NULL OR fd.user.id = :userId")
    List<FlashcardDeck> findAllSystemAndUserDecks(@Param("userId") Long userId);
}
