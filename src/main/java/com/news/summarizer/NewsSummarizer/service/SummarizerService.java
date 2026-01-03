package com.news.summarizer.NewsSummarizer.service;

import com.news.summarizer.NewsSummarizer.model.SummaryResponse;
import com.news.summarizer.NewsSummarizer.model.UrlRequest;

public interface SummarizerService {
    SummaryResponse summarizeFromUrl(UrlRequest urlRequest);
}
