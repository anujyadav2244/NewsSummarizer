package com.news.summarizer.NewsSummarizer.service;

import java.net.SocketTimeoutException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.concurrent.TimeUnit;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.news.summarizer.NewsSummarizer.model.SummaryResponse;
import com.news.summarizer.NewsSummarizer.model.UrlRequest;

import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;

@Service
public class SummarizerServiceImpl implements SummarizerService {

    @Value("${rapidapi.key}")
    private String rapidApiKey;

    @Value("${rapidapi.host}")
    private String rapidApiHost;

    @Value("${rapidapi.url}")
    private String rapidApiUrl;

    // ✅ OkHttp client with proper timeouts (VERY IMPORTANT)
    private final OkHttpClient client = new OkHttpClient.Builder()
            .connectTimeout(30, TimeUnit.SECONDS)
            .readTimeout(30, TimeUnit.SECONDS)
            .writeTimeout(30, TimeUnit.SECONDS)
            .build();

    @Override
    public SummaryResponse summarizeFromUrl(UrlRequest urlRequest) {

        try {
            // ✅ Validate API key
            if (rapidApiKey == null || rapidApiKey.isBlank()) {
                return new SummaryResponse(null, "RapidAPI key is not configured.");
            }

            // ✅ Encode URL safely
            String encodedUrl = URLEncoder.encode(
                    urlRequest.getUrl(),
                    StandardCharsets.UTF_8
            );

            String requestUrl = rapidApiUrl + "?url=" + encodedUrl + "&length=3";

            // ✅ Build request
            Request request = new Request.Builder()
                    .url(requestUrl)
                    .get()
                    .addHeader("X-RapidAPI-Key", rapidApiKey)
                    .addHeader("X-RapidAPI-Host", rapidApiHost)
                    .build();

            // ✅ Execute request
            try (Response response = client.newCall(request).execute()) {

                String responseBody = (response.body() != null)
                        ? response.body().string()
                        : "";

                // ❌ Access denied / invalid subscription
                if (response.code() == 403) {
                    return new SummaryResponse(
                            null,
                            "Access denied: Invalid API key or subscription required."
                    );
                }

                // ❌ Any other RapidAPI error
                if (!response.isSuccessful()) {
                    return new SummaryResponse(
                            null,
                            "RapidAPI error (" + response.code() + "): " + responseBody
                    );
                }

                // ✅ Parse JSON response
                JSONObject jsonResponse = new JSONObject(responseBody);

                String summary = jsonResponse.optString("summary");

                if (summary.isBlank() && jsonResponse.has("result")) {
                    summary = jsonResponse.optString("result");
                }

                if (summary.isBlank() && jsonResponse.has("sm_api_content")) {
                    summary = jsonResponse.optString("sm_api_content");
                }

                if (summary.isBlank()) {
                    return new SummaryResponse(
                            null,
                            "RapidAPI returned no summary content."
                    );
                }

                // ✅ Clean summary text
                String cleanedSummary = summary
                        .replaceAll("^\"|\"$", "")
                        .replace("\\n", "\n")
                        .replaceAll("\\s+", " ")
                        .trim();

                return new SummaryResponse(null, cleanedSummary);
            }

        }
        // ⏱️ Timeout handling (VERY IMPORTANT)
        catch (SocketTimeoutException e) {
            return new SummaryResponse(
                    null,
                    "AI service is taking too long to respond. Please try again later."
            );
        }
        // ❌ Any unexpected server error
        catch (Exception e) {
            e.printStackTrace();
            return new SummaryResponse(
                    null,
                    "Unexpected server error. Please try again later."
            );
        }
    }
}
