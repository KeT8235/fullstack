package com.springsecurity.example2.repository;

import com.springsecurity.example2.entity.Document;
import com.springsecurity.example2.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DocumentRepository extends JpaRepository<Document, Long> {
    List<Document> findByAuthor(User author);
}
