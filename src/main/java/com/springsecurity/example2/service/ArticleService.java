package com.springsecurity.example2.service;

import com.springsecurity.example2.dto.ArticleCreateRequestDTO;
import com.springsecurity.example2.dto.ArticleUpdateRequestDTO;
import com.springsecurity.example2.entity.Article;
import com.springsecurity.example2.entity.User;
import com.springsecurity.example2.repository.ArticleRepository;
import com.springsecurity.example2.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ArticleService {

    private final ArticleRepository articleRepository;
    private final UserRepository userRepository;

    public List<Article> findAll() {
        return articleRepository.findAll();
    }

    public Article findById(Long id) {
        return articleRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Article not found with id: " + id));
    }

    @Transactional
    public Article save(ArticleCreateRequestDTO requestDTO, String loginId) {
        User user = userRepository.findByLoginId(loginId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with loginId: " + loginId));

        Article article = Article.builder()
                .title(requestDTO.getTitle())
                .content(requestDTO.getContent())
                .author(user)
                .build();
        return articleRepository.save(article);
    }

    @Transactional
    public Article update(Long id, ArticleUpdateRequestDTO requestDTO, String loginId) {
        Article article = articleRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Article not found with id: " + id));

        User currentUser = userRepository.findByLoginId(loginId)
            .orElseThrow(() -> new IllegalArgumentException("User not found with loginId: " + loginId));

        boolean isAuthor = article.getAuthor().getLoginId().equals(loginId);
        boolean isAdmin = currentUser.getRole() == com.springsecurity.example2.entity.UserRole.ADMIN;

        if (!isAuthor && !isAdmin) {
            throw new IllegalStateException("You are not authorized to update this article.");
        }

        article.update(requestDTO.getTitle(), requestDTO.getContent());
        return article;
    }

    @Transactional
    public void delete(Long id, String loginId) {
        User currentUser = userRepository.findByLoginId(loginId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with loginId: " + loginId));

        Article article = articleRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Article not found with id: " + id));

        // 현재 사용자가 관리자도 아니고, 게시글 작성자도 아닌 경우에만 예외 발생
        boolean isAdmin = currentUser.getRole().equals(com.springsecurity.example2.entity.UserRole.ADMIN);
        boolean isAuthor = article.getAuthor().getLoginId().equals(loginId);

        if (!isAdmin && !isAuthor) {
            throw new IllegalStateException("You are not authorized to delete this article.");
        }

        articleRepository.delete(article);
    }
}
