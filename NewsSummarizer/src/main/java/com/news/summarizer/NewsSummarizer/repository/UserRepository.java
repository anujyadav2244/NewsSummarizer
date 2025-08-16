package com.news.summarizer.NewsSummarizer.repository;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.news.summarizer.NewsSummarizer.model.User;

public interface UserRepository extends MongoRepository<User, String> {
    Optional<User> findByEmail(String email);
}
