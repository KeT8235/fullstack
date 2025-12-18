package com.springsecurity.example2.repository;

import com.springsecurity.example2.entity.Article;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ArticleRepository extends JpaRepository<Article, Long> {
}
