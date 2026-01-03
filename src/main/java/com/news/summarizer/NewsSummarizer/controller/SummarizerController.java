package com.news.summarizer.NewsSummarizer.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.news.summarizer.NewsSummarizer.model.SummaryResponse;
import com.news.summarizer.NewsSummarizer.model.UrlRequest;
import com.news.summarizer.NewsSummarizer.service.SummarizerService;

@RestController
@RequestMapping("/api/summarize")
public class SummarizerController {

    @Autowired
    private SummarizerService summarizerService;

    @PostMapping("/url")
    public ResponseEntity<SummaryResponse> summarizeFromUrl(@RequestBody UrlRequest urlRequest) {
        SummaryResponse resp = summarizerService.summarizeFromUrl(urlRequest);
        return ResponseEntity.ok(resp);
    }
}
